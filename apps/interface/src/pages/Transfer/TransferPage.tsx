import { useLocation } from 'react-router-dom'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { useEffect, useState } from 'react'
import { middleEllipsis, simplifyPromptPayAccount } from '../../utils/address'
import { useAccountContextState } from '../context/AccountContextProvider'
import Skeleton from 'react-loading-skeleton'
import { ETH_USD, USD_THB } from '../../utils/constants'

const TransferPage = () => {
  const { account, assetBalances } = useAccountContextState()
  const [toWallet, setToWallet] = useState<string | undefined>(undefined)
  const [amountIn, setAmountIn] = useState('0.00')

  // effect search params
  const { search } = useLocation()
  useEffect(() => {
    const userType = new URLSearchParams(search).get('type')
    const value = new URLSearchParams(search).get('value')

    if (userType && value) {
      const simplifiedText = simplifyPromptPayAccount(value, userType)
      setToWallet(simplifiedText)
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
                  ((Number(assetBalances['ETH']) * 1750) / 1e18) *
                  USD_THB
                ).toLocaleString('TH') ?? 0}
                ฿
              </div>
              <div className="text-sm text-slate-400">
                {(Number(assetBalances['ETH']) / 1e18).toLocaleString() ?? 0}{' '}
                ETH
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
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5 text-lg">
          ฿
        </div>
      </div>
      <div className="h-1" />
      <div className="w-full text-right text-sm text-slate-400">
        ~{' '}
        {(Number(amountIn) / (ETH_USD * USD_THB)).toLocaleString('EN', {
          maximumSignificantDigits: 2,
        })}{' '}
        ETH
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button>Confirm and Pay</Button>
        <Button variant="danger">Cancel</Button>
      </div>
    </Container>
  )
}

export default TransferPage
