import Skeleton from 'react-loading-skeleton'
import { etherDecimal, middleEllipsis } from '../utils/utils'
import { USD_THB } from '../utils/constants'
import { ITokenProfile } from '../configs/tokens'
import { tokenPrices } from '../configs/prices'
import { ActionStatus, ReceiverType } from '../enums'

interface IAccountSection {
  status: ActionStatus
  label: string
  account: string
  receiver: string
  receiverType: ReceiverType
  balance: bigint | undefined
  token: ITokenProfile
  showBalance?: boolean
}

export const AccountSection = ({
  status,
  label,
  account,
  balance,
  receiver,
  receiverType,
  token,
  showBalance,
}: IAccountSection) => {
  return (
    <>
      <div className="text-xl font-semibold">{status}</div>

      <div className="h-6" />

      <div className="font-semibold">From</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>{label}</div>
          <div className="text-sm text-slate-400">
            {account && middleEllipsis(account)}
          </div>
        </div>
        {showBalance && (
          <div className="text-right">
            {balance !== undefined && tokenPrices !== undefined ? (
              <>
                <div>
                  {(
                    ((Number(balance) * tokenPrices[token.displaySymbol]) /
                      etherDecimal(token.decimal)) *
                    USD_THB
                  ).toLocaleString('TH') ?? 0}
                  ฿
                </div>
                <div className="text-sm text-slate-400">
                  {(Number(balance) / 1e6).toLocaleString() ?? 0}{' '}
                  {token.displaySymbol}
                </div>
              </>
            ) : (
              <Skeleton className="w-32" />
            )}
          </div>
        )}
      </div>

      <div className="h-6" />

      <div className="font-semibold">To</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>{receiver}</div>
          <div className="text-sm text-slate-400">{receiverType}</div>
        </div>
      </div>

      <div className="h-6" />
    </>
  )
}
