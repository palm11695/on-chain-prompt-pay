import { useMemo } from 'react'
import Button from '../../components/Button'
import {
  useAccountContextActions,
  useAccountContextState,
} from '../context/AccountContextProvider'
import { ITokenProfile } from '../../configs/tokens'
import { ContractKey, contracts } from '../../configs/contract'
import { usePrepareApprove } from '../../hooks/usePrepareWrite/usePrepareApprove'
import { Address, parseEther } from 'viem'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import { usePrepareCreateInitTransferRequest } from '../../hooks/usePrepareWrite/usePrepareCreateInitTransferRequest'
import { useNavigate } from 'react-router-dom'
import { desimplifyPromptPayAccount } from '../../utils/utils'
import { tokenPrices } from '../../configs/prices'
import { USD_THB, hardCodedZEXInfo } from '../../utils/constants'

interface ICreateInitTransferRequestCalldata {
  thbAmount: bigint
  asset: ITokenProfile
  promptPayId: string
}

export const CreateInitTransferRequestButton = ({
  thbAmount,
  asset,
  promptPayId,
}: ICreateInitTransferRequestCalldata) => {
  // contexts
  const { tokenAllowances, tokenBalances } = useAccountContextState()
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
  }, [asset.displaySymbol, thbAmount])

  // use prepare write approve
  const { write: approveToken, isLoading: isApproving } = usePrepareApprove({
    calldata: {
      asset,
      spender: contracts[ContractKey.PaymentHandler] as Address,
      amount: tokenTransferAmount,
    },
    onSuccess: () => refetchTokenStates(),
  })

  const isApprovalNeeded: boolean | undefined = useMemo(() => {
    if (!tokenAllowances) return undefined

    return (
      tokenAllowances[asset.displaySymbol][ContractKey.PaymentHandler] <
      tokenTransferAmount
    )
  }, [tokenAllowances, asset.displaySymbol, tokenTransferAmount])

  const { write: createInitTransferRequest, isLoading: isCreating } =
    usePrepareCreateInitTransferRequest({
      calldata: {
        thbAmount: thbAmount,
        deadline: hardCodedZEXInfo.deadline,
        exchangeRate: exchangeRates[asset.displaySymbol],
        promptPayId: desimplifyPromptPayAccount(promptPayId),
        zexSignature: hardCodedZEXInfo.signature,
      },
      onSuccess: () => {
        refetchTokenStates()
        setTimeout(() => navigate('/success'))
      },
      enabled: !isApprovalNeeded,
    })

  // prevent re-render
  const defaultValidationButton = useMemo(() => {
    return {
      label: 'Confirm and Pay',
      disabled: false,
      action: () => undefined,
    }
  }, [])

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

    if (isCreating) {
      return {
        ...defaultValidationButton,
        label: 'Creating request...',
        disabled: true,
      }
    }

    return {
      ...defaultValidationButton,
      action: createInitTransferRequest,
    }
  }, [
    isApprovalNeeded,
    tokenBalances,
    defaultValidationButton,
    thbAmount,
    tokenTransferAmount,
    asset.displaySymbol,
    isCreating,
    createInitTransferRequest,
    isApproving,
    approveToken,
  ])

  return (
    <Button disabled={disabled} onClick={() => action && action()}>
      {label}
    </Button>
  )
}
