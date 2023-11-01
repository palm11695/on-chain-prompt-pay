import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { useEffect, useState } from 'react'
import { middleEllipsis, normalizefromE18Decimal } from '../../utils/utils'
import { useAccountContextState } from '../context/AccountContextProvider'

import { USDC_USD, USD_THB } from '../../utils/constants'
import { CreateInitTransferRequestButton } from './CreateInitRequestButton'
import { parseEther } from 'viem'
import { usdc } from '../../configs/tokens'

interface IReviewTransactionProps {
  spender?: string
  amount: string
  onCancel: () => void
}

const ReviewTransaction = ({
  spender,
  amount,
  onCancel,
}: IReviewTransactionProps) => {
  const [spenderType, setSpenserType] = useState<string | null>(null)
  const { account } = useAccountContextState()
  const navigate = useNavigate()

  // effect search params
  const { search } = useLocation()
  useEffect(() => {
    const spenderType = new URLSearchParams(search).get('type')
    setSpenserType(spenderType)
  }, [search])

  return (
    <Container>
      <div className="text-xl font-semibold">Review Transaction</div>

      <div className="h-6" />

      <div className="font-semibold">From</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>Spending wallet</div>
          <div className="text-sm text-slate-400">
            {account && middleEllipsis(account)}
          </div>
        </div>
      </div>

      <div className="h-6" />

      <div className="font-semibold">To</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>{spender}</div>
          <div className="text-sm text-slate-400">PromptPay</div>
        </div>
      </div>

      <div className="h-6" />
      <div className="relative border-b border-slate-300 focus-within:border-blue-400" />
      <div className="h-6" />

      <div className="flex justify-between">
        <div className="font-semibold">Amount</div>
        <div className="flex ">
          <div
            className="w-full bg-transparent pr-2 text-right text-lg outline-none"
            placeholder="0.00"
          >
            {amount}
          </div>
          <div className="text-lg">฿</div>
        </div>
      </div>

      <div className="h-0.5" />
      <div className="w-full text-right text-sm text-slate-400">
        {(Number(amount) / (USDC_USD * USD_THB)).toLocaleString()} USDC
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-2 px-4 pb-4">
        <CreateInitTransferRequestButton
          amount={normalizefromE18Decimal(parseEther(amount), usdc.decimal)}
          asset={usdc}
        />
        <Button
          variant="danger"
          onClick={() => {
            navigate(
              `/transfer?type=${spenderType}&transferTo=${spender}&amount=${Number(
                amount,
              )}`,
            ),
              onCancel()
          }}
        >
          Cancel
        </Button>
      </div>
    </Container>
  )
}

export default ReviewTransaction
