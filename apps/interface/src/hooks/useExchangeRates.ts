import { TokenSymbol, tokens } from '../configs/tokens'
import { hardCodedZEXInfo } from '../utils/constants'

export const useExchangeRates = () => {
  const exchangeRatesMap = tokens.reduce(
    (acc, c) => {
      return { ...acc, [c.displaySymbol]: hardCodedZEXInfo.exchangeRate }
    },
    {} as Record<TokenSymbol, bigint>,
  )

  return exchangeRatesMap
}
