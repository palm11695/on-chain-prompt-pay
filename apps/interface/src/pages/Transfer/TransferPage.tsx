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
import { parseEther, zeroAddress } from 'viem'
import { CreateInitTransferRequestButton } from './CreateInitRequestButton'
import { ReviewTxSummary } from '../../components/ReviewTxSummary'
import { ActionStatus, ReceiverType } from '../../enums'

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
    setAmountIn(amount ?? '0.00')
  }, [search])

  const handleCancel = useCallback(() => {
    if (status === ActionStatus.Review) setStatus(ActionStatus.Transfer)
    if (status === ActionStatus.Transfer) navigate('/loading')
    setIsLoading(true)
  }, [navigate, status])

  const loadingLabel = useMemo(() => {
    return status === ActionStatus.Transfer ? 'Loading...' : 'Waiting for tx...'
  }, [status])

  if (isLoading) {
    return <LoadingPage isComponent label={loadingLabel} />
  }

  return (
    <Container>
      {status === ActionStatus.Transfer ? (
        <TransferContent
          status={status}
          token={usdc}
          account={account ?? zeroAddress}
          balance={tokenBalances?.[usdc.displaySymbol]}
          receiver={receiver ?? ''}
          receiverType={receiverType ?? ReceiverType.PromptPay}
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
  account: string
  amountIn: string
  receiver: string
  receiverType: ReceiverType
  balance: bigint | undefined
  token: ITokenProfile
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
        promptPayId={receiver}
        amountIn={amountIn}
        token={token}
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
        onCancel={onCancel}
      />
    </>
  )
}

const ValidationButton = ({
  promptPayId,
  amountIn,
  token,
  onCancel,
}: {
  promptPayId: string
  amountIn: string
  token: ITokenProfile
  onCancel: () => void
}) => {
  return (
    <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-2 px-4 pb-4">
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
