import { useMemo } from 'react'
import Button from '../../components/Button'
import {
  useAccountContextActions,
  useAccountContextState,
} from '../context/AccountContextProvider'
import { ITokenProfile } from '../../configs/tokens'
import { ContractKey, contracts } from '../../configs/contract'
import { usePrepareApprove } from '../../hooks/usePrepareWrite/usePrepareApprove'
import { Address } from 'viem'
import { useSignExchangeRate } from '../../hooks/useSignExchangeRate'
import { useExchangeRates } from '../../hooks/useExchangeRates'

interface ICreateInitTransferRequestCalldata {
  amount: bigint
  asset: ITokenProfile
  transferTo?: string
}

const defaultButtonValidation = {
  label: 'Confirm and Pay',
  disabled: false,
  action: () => undefined,
}

export const CreateInitTransferRequestButton = ({
  amount,
  asset,
}: ICreateInitTransferRequestCalldata) => {
  // contexts
  const { tokenAllowances } = useAccountContextState()
  const { refetchTokenAllowances } = useAccountContextActions()

  // hooks
  const exchangeRates = useExchangeRates()

  const isApprovalNeeded: boolean | undefined = useMemo(() => {
    if (!tokenAllowances) return undefined

    return (
      tokenAllowances[asset.displaySymbol][ContractKey.PaymentHandler] < amount
    )
  }, [amount, tokenAllowances])

  // use prepare write approve
  const { write: approveToken, isLoading: isApproving } = usePrepareApprove({
    calldata: {
      asset,
      spender: contracts[ContractKey.PaymentHandler] as Address,
      amount,
    },
    onSuccess: () => refetchTokenAllowances(),
  })

  const { handelSignExchangeRate, isSigning, verifiedMessage } =
    useSignExchangeRate({ exchangeRate: exchangeRates[asset.displaySymbol] })

  const { label, disabled, action } = useMemo(() => {
    if (isApprovalNeeded === undefined)
      return { ...defaultButtonValidation, disabled: true }

    // Approve
    if (isApprovalNeeded)
      return {
        ...defaultButtonValidation,
        label: 'Approve',
        action: approveToken,
      }
    if (isApproving)
      return {
        ...defaultButtonValidation,
        label: 'Approving',
        disabled: true,
      }

    // Sign Message
    if (!verifiedMessage) {
      if (isSigning)
        return {
          ...defaultButtonValidation,
          label: 'Signing...',
          disabled: true,
        }

      return {
        ...defaultButtonValidation,
        label: 'Sign Message',
        action: handelSignExchangeRate,
      }
    }

    return { ...defaultButtonValidation }
  }, [isApprovalNeeded, verifiedMessage, isSigning])

  return (
    <Button disabled={disabled} onClick={() => action && action()}>
      {label}
    </Button>
  )
}
