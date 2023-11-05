import { useMemo } from 'react'
import Button from '../../components/Button'
import {
  useAccountContextActions,
  useAccountContextState,
} from '../context/AccountContextProvider'
import { ITokenProfile } from '../../configs/tokens'
import { ContractKey, contracts } from '../../configs/contract'
import { usePrepareApprove } from '../../hooks/usePrepareWrite/usePrepareApprove'
import { Address, zeroAddress } from 'viem'
import { useSignExchangeRate } from '../../hooks/useSignExchangeRate'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import { usePrepareCreateInitTransferRequest } from '../../hooks/usePrepareWrite/usePrepareCreateInitTransferRequest'
import { useNavigate } from 'react-router-dom'

interface ICreateInitTransferRequestCalldata {
  amount: bigint
  asset: ITokenProfile
  transferTo?: string
}

export const defaultValidationButton = {
  label: 'Confirm and Pay',
  disabled: false,
  action: () => undefined,
}

export const CreateInitTransferRequestButton = ({
  amount,
  asset,
}: ICreateInitTransferRequestCalldata) => {
  // contexts
  const { tokenAllowances, account } = useAccountContextState()
  const { refetchTokenStates } = useAccountContextActions()
  const navigate = useNavigate()
  // hooks
  const exchangeRates = useExchangeRates()

  // use prepare write approve
  const { write: approveToken, isLoading: isApproving } = usePrepareApprove({
    calldata: {
      asset,
      spender: contracts[ContractKey.PaymentHandler] as Address,
      amount,
    },
    onSuccess: () => refetchTokenStates(),
  })

  // use sign exchange rate
  const { handleSignExchangeRate, isSigning, verifiedMessage, deadline } =
    useSignExchangeRate({
      exchangeRate: exchangeRates[asset.displaySymbol],
      account: (account as Address) ?? zeroAddress,
    })

  const { write: createInitTransferRequest, isLoading: isCreating } =
    usePrepareCreateInitTransferRequest({
      calldata: {
        thbAmount: amount,
        deadline: deadline,
        exchangeRate: exchangeRates[asset.displaySymbol],
        verifiedMessage: verifiedMessage,
      },
      onSuccess: () => {
        refetchTokenStates()
        setTimeout(() => navigate('/loading'))
      },
    })

  const isApprovalNeeded: boolean | undefined = useMemo(() => {
    if (!tokenAllowances) return undefined

    return (
      tokenAllowances[asset.displaySymbol][ContractKey.PaymentHandler] < amount
    )
  }, [amount, tokenAllowances])

  // build label, disable, action
  const { label, disabled, action } = useMemo(() => {
    if (isApprovalNeeded === undefined)
      return { ...defaultValidationButton, disabled: true }

    // Approve
    if (isApprovalNeeded)
      return {
        ...defaultValidationButton,
        label: 'Approve',
        action: approveToken,
      }
    if (isApproving)
      return {
        ...defaultValidationButton,
        label: 'Approving',
        disabled: true,
      }

    // Sign Message
    if (!verifiedMessage) {
      if (isSigning)
        return {
          ...defaultValidationButton,
          label: 'Signing...',
          disabled: true,
        }

      return {
        ...defaultValidationButton,
        label: 'Sign Message',
        action: handleSignExchangeRate,
      }
    }

    if (isCreating) {
      return {
        ...defaultValidationButton,
        label: 'Creating request...',
        disabled: true,
      }
    }

    return { ...defaultValidationButton, action: createInitTransferRequest }
  }, [
    isApprovalNeeded,
    verifiedMessage,
    isSigning,
    approveToken,
    handleSignExchangeRate,
    createInitTransferRequest,
  ])

  return (
    <Button disabled={disabled} onClick={() => action && action()}>
      {label}
    </Button>
  )
}
