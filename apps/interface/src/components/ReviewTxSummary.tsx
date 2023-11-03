import { tokenPrices } from '../configs/prices'
import { ITokenProfile } from '../configs/tokens'
import { USD_THB } from '../utils/constants'

interface IReviewTxSummary {
  amount: string
  token: ITokenProfile
}

export const ReviewTxSummary = ({ amount, token }: IReviewTxSummary) => {
  return (
    <>
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
        {(
          Number(amount) /
          (tokenPrices[token.displaySymbol] * USD_THB)
        ).toLocaleString()}{' '}
        {token.displaySymbol}
      </div>
    </>
  )
}
