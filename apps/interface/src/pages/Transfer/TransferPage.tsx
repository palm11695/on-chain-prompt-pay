import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { useEffect, useState } from 'react'
import { middleEllipsis } from '../../utils/utils'
import { useAccountContextState } from '../context/AccountContextProvider'
import Skeleton from 'react-loading-skeleton'
import { USDC_USD, USD_THB } from '../../utils/constants'

const TransferPage = () => {
  const { account, assetBalances } = useAccountContextState()
  const [toWallet, setToWallet] = useState<string | undefined>(undefined)
  const [amountIn, setAmountIn] = useState('0.00')
  const navigate = useNavigate()

  // effect search params
  const { search } = useLocation()
  useEffect(() => {
    const transferTo = new URLSearchParams(search).get('transferTo')
    const amount = new URLSearchParams(search).get('amount')

    if (transferTo) {
      setToWallet(transferTo)
      if (amount) setAmountIn(amount)
    }
  }, [search])

  return (
    <Container>
      <div className="text-xl font-semibold">Transfer</div>

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
        <div className="text-right">
          {assetBalances ? (
            <>
              <div>
                {(
                  ((Number(assetBalances['USDC']) * USDC_USD) / 1e6) *
                  USD_THB
                ).toLocaleString('TH') ?? 0}
                ฿
              </div>
              <div className="text-sm text-slate-400">
                {(Number(assetBalances['USDC']) / 1e6).toLocaleString() ?? 0}{' '}
                USDC
              </div>
            </>
          ) : (
            <Skeleton className="w-32" />
          )}
        </div>
      </div>

      <div className="h-6" />

      <div className="font-semibold">To</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>{toWallet}</div>
          <div className="text-sm text-slate-400">PromptPay</div>
        </div>
      </div>

      <div className="h-6" />

      <div className="font-semibold">Amount</div>
      <div className="relative border-b border-slate-300 focus-within:border-blue-400">
        <input
          className="w-full bg-transparent pr-4 text-right text-lg outline-none"
          placeholder="0.00"
          type="number"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5 text-lg">
          ฿
        </div>
      </div>
      <div className="h-1" />
      <div className="w-full text-right text-sm text-slate-400">
        ~ {(Number(amountIn) / (USDC_USD * USD_THB)).toLocaleString()} USDC
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button>Confirm and Pay</Button>
        <Button variant="danger" onClick={() => navigate('/')}>
          Cancel
        </Button>
      </div>
    </Container>
  )
}

export default TransferPage
