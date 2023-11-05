import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { normalizefromE18Decimal } from '../../utils/utils'
import { useAccountContextState } from '../context/AccountContextProvider'
import LoadingPage from '../Loading/Loading'
import { AccountSection } from '../../components/AccountSection'
import { ITokenProfile, usdc } from '../../configs/tokens'
import { TransferInput } from '../../components/TransferInput'
import { ReceiverType } from '../Reader/QrCodeReader'
import { parseEther, zeroAddress } from 'viem'
import { CreateInitTransferRequestButton } from './CreateInitRequestButton'
import { ReviewTxSummary } from '../../components/ReviewTxSummary'

export enum ActionStatus {
  Transfer = 'Transfer',
  Review = 'Review',
  Success = 'Success',
}

const TransferPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { account, tokenBalances } = useAccountContextState()
  const [receiver, setReceiver] = useState<string | undefined>(undefined)
  const [amountIn, setAmountIn] = useState('0.00')
  const [receiverType, setReceiverType] = useState<ReceiverType | null>(null)
  const [status, setStatus] = useState<ActionStatus>(ActionStatus.Transfer)
  const navigate = useNavigate()

  // make component loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [status])

  // effect search params
  const { search } = useLocation()
  useEffect(() => {
    const receiverType = new URLSearchParams(search).get(
      'type',
    ) as ReceiverType | null
    const receiver = new URLSearchParams(search).get('receiver')
    const amount = new URLSearchParams(search).get('amount')

    setReceiverType(receiverType)
    setReceiver(receiver ?? undefined)
    setAmountIn(amount ? amount : '0.00')
  }, [search])

  const handleCancel = useCallback(() => {
    if (status === ActionStatus.Review) setStatus(ActionStatus.Transfer)
    if (status === ActionStatus.Transfer) navigate('/loading')
    setIsLoading(true)
  }, [status])

  const loadingLabel = useMemo(() => {
    return status === ActionStatus.Transfer ? 'Loading...' : 'Waiting for tx...'
  }, [status])

  return (
    <Container>
      {isLoading ? (
        <LoadingPage isComponent label={loadingLabel} />
      ) : status === ActionStatus.Transfer ? (
        <TransferContent
          status={status}
          label="Spending wallet"
          token={usdc}
          account={account ?? zeroAddress}
          balance={tokenBalances?.[usdc.displaySymbol]}
          receiver={receiver ?? ''}
          receiverType={receiverType ?? ReceiverType.PromptPay}
          showBalance
          amountIn={amountIn}
          onChange={setAmountIn}
          onClick={() => {
            setIsLoading(true)
            setStatus(ActionStatus.Success)
          }}
          onCancel={handleCancel}
        />
      ) : (
        <ReviewTxContent
          status={status}
          label="Spending wallet"
          token={usdc}
          account={account ?? zeroAddress}
          balance={tokenBalances?.[usdc.displaySymbol]}
          receiver={receiver ?? ''}
          receiverType={receiverType ?? ReceiverType.PromptPay}
          amountIn={amountIn}
          onChange={setAmountIn}
          onCancel={handleCancel}
        />
      )}
    </Container>
  )
}

export default TransferPage

interface ITransferContent {
  status: ActionStatus
  label?: string
  account: string
  amountIn: string
  receiver: string
  receiverType: ReceiverType
  balance: bigint | undefined
  token: ITokenProfile
  showBalance?: boolean
  onChange: React.Dispatch<React.SetStateAction<string>>
  onClick?: () => void
  onCancel: () => void
}

const TransferContent = ({
  status,
  account,
  amountIn,
  balance,
  receiver,
  receiverType,
  token,
  onChange,
  onClick,
  onCancel,
}: ITransferContent) => {
  return (
    <>
      <AccountSection
        status={status}
        label="Spending wallet"
        token={usdc}
        account={account ?? zeroAddress}
        balance={balance}
        receiver={receiver ?? ''}
        receiverType={receiverType ?? ReceiverType.PromptPay}
        showBalance
      />
      <TransferInput amountIn={amountIn} onChange={onChange} token={token} />
      <ValidationButton
        status={status}
        promptPayId={receiver}
        amountIn={amountIn}
        token={token}
        balance={balance !== undefined ? balance : 0n}
        onClick={() => onClick?.()}
        onCancel={onCancel}
      />
    </>
  )
}

const ReviewTxContent = ({
  status,
  account,
  amountIn,
  balance,
  receiver,
  receiverType,
  token,
  onCancel,
}: ITransferContent) => {
  return (
    <>
      <AccountSection
        status={status}
        label="Spending wallet"
        token={usdc}
        account={account ?? zeroAddress}
        balance={balance}
        receiver={receiver ?? ''}
        receiverType={receiverType ?? ReceiverType.PromptPay}
      />
      <ReviewTxSummary amount={amountIn} token={token} />
      <ValidationButton
        amountIn={amountIn}
        promptPayId={receiver}
        token={token}
        balance={balance !== undefined ? balance : 0n}
        status={status}
        onCancel={onCancel}
      />
    </>
  )
}

const ValidationButton = ({
  // status,
  promptPayId,
  amountIn,
  token,
  // balance,
  // onClick,
  onCancel,
}: {
  status: ActionStatus
  promptPayId: string
  amountIn: string
  token: ITokenProfile
  balance: bigint
  onClick?: React.Dispatch<React.SetStateAction<ActionStatus>>
  onCancel: () => void
}) => {
  return (
    <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-2 px-4 pb-4">
      {/* {status === ActionStatus.Review ? (
        <CreateInitTransferRequestButton
          promptPayId={promptPayId}
          amount={normalizefromE18Decimal(parseEther(amountIn), token.decimal)}
          asset={token}
        />
        ) : (
          <Button
          onClick={() => onClick?.(ActionStatus.Review)}
          disabled={disabled}
          >
          {label}
          </Button>
        )} */}
      <CreateInitTransferRequestButton
        promptPayId={promptPayId}
        thbAmount={normalizefromE18Decimal(parseEther(amountIn), token.decimal)}
        asset={token}
      />
      <Button variant="danger" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  )
}
