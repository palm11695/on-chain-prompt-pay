import Button from '../../components/Button'
import Container from '../../components/Container'
import { ConnectWalletPage } from '../../components/OnBoarding/ConnectWalletPage'

import { useAccountContextState } from '../context/AccountContextProvider'

import Skeleton from 'react-loading-skeleton'
import { USD_THB } from '../../utils/constants'
import { etherDecimal, middleEllipsis } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'
import { onlyShowAssets } from '../../configs/tokens'
import { tokenPrices } from '../../configs/prices'
import { useMemo } from 'react'

export const Home = () => {
  const { account, tokenBalances } = useAccountContextState()
  if (!account) return <ConnectWalletPage />
  // if (isAaNeeded) return <CreateSpendingWallet />
  const navigate = useNavigate()

  const { usableBalance: _, usableValue } = useMemo(() => {
    if (!tokenBalances) return { usableBalance: 0, usableValue: 0 }

    const { _usableBalance, _usableValue } = onlyShowAssets.reduce(
      (acc, asset) => {
        const _balances =
          acc._usableBalance +
          Number(tokenBalances[asset.displaySymbol]) /
            etherDecimal(asset.decimal)

        const _values =
          acc._usableValue +
          _balances * tokenPrices[asset.displaySymbol] * USD_THB

        return { ...acc, _usableBalance: _balances, _usableValue: _values }
      },
      { _usableBalance: 0, _usableValue: 0 } as {
        _usableBalance: number
        _usableValue: number
      },
    )

    return {
      usableBalance: _usableBalance,
      usableValue: _usableValue,
    }
  }, [tokenBalances])

  return (
    <Container>
      <div className="w-full rounded-xl bg-blue-600 p-4 text-white">
        <div className="text-sm text-blue-200">Usable balance</div>
        <div className="text-2xl font-medium">
          ฿{' '}
          {tokenBalances ? (
            <>{usableValue.toLocaleString('TH') ?? 0}</>
          ) : (
            <Skeleton className="w-32" />
          )}
        </div>

        <div className="h-8" />

        <div className="text-xs font-light text-blue-300">
          Spending wallet address
        </div>
        <div className="text-xs text-blue-200">{middleEllipsis(account)}</div>
      </div>

      <div className="h-8" />

      <div className="text-lg font-semibold">My Assets</div>
      <div className="h-4" />
      <div className="flex flex-col gap-2">
        {onlyShowAssets.map((asset) => {
          return (
            <div
              key={asset.displaySymbol}
              className="flex items-center justify-between"
            >
              <div>
                <div>{asset.displaySymbol}</div>
                <div className="text-sm text-slate-400">{asset.name}</div>
              </div>
              <div className="text-right">
                {tokenBalances ? (
                  <>
                    <div>
                      {(
                        Number(tokenBalances[asset.displaySymbol]) /
                        etherDecimal(asset.decimal)
                      ).toLocaleString() ?? 0}{' '}
                      {asset.displaySymbol}
                    </div>
                    <div className="text-sm text-slate-400">
                      {(
                        ((Number(tokenBalances[asset.displaySymbol]) *
                          tokenPrices[asset.displaySymbol]) /
                          etherDecimal(asset.decimal)) *
                        USD_THB
                      ).toLocaleString('TH') ?? 0}
                      ฿
                    </div>
                  </>
                ) : (
                  <Skeleton className="w-32" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button onClick={() => navigate('/qr-reader')}>Pay via QR</Button>
        <Button onClick={() => navigate('/topup-portal')} variant="secondary">
          Topup
        </Button>
      </div>
    </Container>
  )
}
