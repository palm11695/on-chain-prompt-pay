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

interface ICreateInitTransferRequestCalldata {
  amount: bigint
  asset: ITokenProfile
  transferTo?: string
}

const defaultButtonValidation = {
  label: 'Confirm and Pay',
  disabled: false,
}

export const CreateInitTransferRequestButton = ({
  amount,
  asset,
}: ICreateInitTransferRequestCalldata) => {
  const { tokenAllowances } = useAccountContextState()
  const { refetchTokenAllowances } = useAccountContextActions()

  const isApprovalNeeded: boolean | undefined = useMemo(() => {
    if (!tokenAllowances) return undefined

    return !(
      amount <= tokenAllowances[asset.displaySymbol][ContractKey.PaymentHandler]
    )
  }, [amount, tokenAllowances])

  const { label, disabled } = useMemo(() => {
    if (isApprovalNeeded === undefined)
      return { ...defaultButtonValidation, disabled: true }

    if (isApprovalNeeded)
      return {
        ...defaultButtonValidation,
        label: 'Approve',
      }
    return { ...defaultButtonValidation }
  }, [isApprovalNeeded])

  // use prepare write approve
  const { write: approveToken, isLoading: isApproving } = usePrepareApprove({
    calldata: {
      asset,
      spender: contracts[ContractKey.PaymentHandler] as Address,
      amount,
    },
    onSuccess: () => refetchTokenAllowances(),
  })

  if (isApprovalNeeded)
    return (
      <Button
        onClick={() => {
          approveToken && approveToken()
        }}
      >
        {isApproving ? 'Approving...' : label}
      </Button>
    )

  return <Button disabled={disabled}>{label}</Button>
}
