import { useMemo } from 'react'
import Button from '../../components/Button'
import {
  useAccountContextActions,
  useAccountContextState,
} from '../context/AccountContextProvider'
import { ITokenProfile } from '../../configs/tokens'
import { ContractKey, contracts } from '../../configs/contract'
import { usePrepareApprove } from '../../hooks/usePrepareWrite/usePrepareApprove'
import { Address, parseEther, zeroAddress } from 'viem'
import { useSignExchangeRate } from '../../hooks/useSignExchangeRate'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import { usePrepareCreateInitTransferRequest } from '../../hooks/usePrepareWrite/usePrepareCreateInitTransferRequest'
import { useNavigate } from 'react-router-dom'
import { desimplifyPromptPayAccount } from '../../utils/utils'
import { tokenPrices } from '../../configs/prices'
import { USD_THB } from '../../utils/constants'

interface ICreateInitTransferRequestCalldata {
  thbAmount: bigint
  asset: ITokenProfile
  promptPayId: string
}

export const defaultValidationButton = {
  label: 'Confirm and Pay',
  disabled: false,
  action: () => undefined,
}

export const CreateInitTransferRequestButton = ({
  thbAmount,
  asset,
  promptPayId,
}: ICreateInitTransferRequestCalldata) => {
  // contexts
  const { tokenAllowances, account, tokenBalances } = useAccountContextState()
  const { refetchTokenStates } = useAccountContextActions()
  const navigate = useNavigate()
  // hooks
  const exchangeRates = useExchangeRates()

  const tokenTransferAmount = useMemo(() => {
    return (
      (thbAmount * BigInt(1e6)) /
      (parseEther((tokenPrices[asset.displaySymbol] * USD_THB).toString()) /
        BigInt(1e12))
    )
  }, [thbAmount])

  // use prepare write approve
  const { write: approveToken, isLoading: isApproving } = usePrepareApprove({
    calldata: {
      asset,
      spender: contracts[ContractKey.PaymentHandler] as Address,
      amount: tokenTransferAmount,
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
        thbAmount: thbAmount,
        deadline: deadline,
        exchangeRate: exchangeRates[asset.displaySymbol],
        promptPayId: desimplifyPromptPayAccount(promptPayId),
        verifiedMessage: verifiedMessage,
      },
      onSuccess: () => {
        refetchTokenStates()
        setTimeout(() => navigate('/success'))
      },
    })

  const isApprovalNeeded: boolean | undefined = useMemo(() => {
    if (!tokenAllowances) return undefined

    return (
      tokenAllowances[asset.displaySymbol][ContractKey.PaymentHandler] <
      tokenTransferAmount
    )
  }, [tokenTransferAmount, tokenAllowances])

  // build label, disable, action
  const { label, disabled, action } = useMemo(() => {
    if (isApprovalNeeded === undefined || !tokenBalances)
      return { ...defaultValidationButton, disabled: true }

    if (Number(thbAmount) <= 0)
      return {
        ...defaultValidationButton,
        disabled: true,
      }

    if (tokenTransferAmount > tokenBalances[asset.displaySymbol])
      return {
        ...defaultValidationButton,
        label: 'Insufficient Balance',
        disabled: true,
      }

    // Approve
    if (isApprovalNeeded) {
      if (isApproving)
        return {
          ...defaultValidationButton,
          label: 'Approving',
          disabled: true,
        }

      return {
        ...defaultValidationButton,
        label: 'Approve',
        action: approveToken,
      }
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
    thbAmount,
    tokenTransferAmount,
    tokenBalances,
    isApprovalNeeded,
    verifiedMessage,
    isApproving,
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
