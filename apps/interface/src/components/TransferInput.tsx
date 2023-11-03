import { ITokenProfile } from '../configs/tokens'
import { tokenPrices } from '../configs/prices'
import { USD_THB } from '../utils/constants'

interface ITransferInput {
  amountIn: string
  token: ITokenProfile
  onChange: React.Dispatch<React.SetStateAction<string>>
}

export const TransferInput = ({
  amountIn,
  token,
  onChange,
}: ITransferInput) => {
  return (
    <>
      <div className="font-semibold">Amount</div>
      <div className="relative border-b border-slate-300 focus-within:border-blue-400">
        <input
          className="w-full bg-transparent pr-4 text-right text-lg outline-none"
          placeholder="0.00"
          type="number"
          value={amountIn}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5 text-lg">
          ฿
        </div>
      </div>
      <div className="h-1" />
      <div className="w-full text-right text-sm text-slate-400">
        ~{' '}
        {(
          Number(amountIn) /
          (tokenPrices[token.displaySymbol] * USD_THB)
        ).toLocaleString()}{' '}
        {token.displaySymbol}
      </div>
    </>
  )
}
