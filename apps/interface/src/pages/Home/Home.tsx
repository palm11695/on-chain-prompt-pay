import { useMemo } from 'react'
import Button from '../../components/Button'
import Container from '../../components/Container'
import { ConnectWalletPage } from '../../components/OnBoarding/ConnectWalletPage'

import { useAccountContextState } from '../context/AccountContextProvider'

import Skeleton from 'react-loading-skeleton'
import { USD_THB } from '../../utils/constants'
import { middleEllipsis } from '../../utils/address'

export const Home = () => {
  const { account, assetBalances } = useAccountContextState()
  if (!account) return <ConnectWalletPage />
  // if (isAaNeeded) return <CreateSpendingWallet />

  const isValueReady = useMemo(() => {
    if (!assetBalances) return false

    return true
  }, [assetBalances])

  return (
    <Container>
      <div className="w-full rounded-xl bg-blue-600 p-4 text-white">
        <div className="text-sm text-blue-200">Usable balance</div>
        <div className="text-2xl font-medium">
          ฿
          {isValueReady && assetBalances ? (
            <>
              {(
                ((Number(assetBalances['ETH']) * 1750) / 1e18) *
                USD_THB
              ).toLocaleString('TH') ?? 0}
            </>
          ) : (
            <Skeleton />
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
      <div className="flex items-center justify-between">
        <div>
          <div>ETH</div>
          <div className="text-sm text-slate-400">Ethereum</div>
        </div>
        <div className="text-right">
          {isValueReady && assetBalances ? (
            <>
              <div>
                {(Number(assetBalances['ETH']) / 1e18).toLocaleString() ?? 0}{' '}
                ETH
              </div>
              <div className="text-sm text-slate-400">
                {(
                  ((Number(assetBalances['ETH']) * 1750) / 1e18) *
                  USD_THB
                ).toLocaleString('TH') ?? 0}
                ฿
              </div>
            </>
          ) : (
            <Skeleton />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button>Pay via QR</Button>
        <Button variant="secondary">Topup</Button>
      </div>
    </Container>
  )
}
