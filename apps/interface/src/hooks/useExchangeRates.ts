import { TokenSymbol, tokens } from '../configs/tokens'

export const useExchangeRates = () => {
  const exchangeRatesMap = tokens.reduce(
    (acc, c) => {
      return { ...acc, [c.displaySymbol]: BigInt(280) }
    },
    {} as Record<TokenSymbol, bigint>,
  )

  return exchangeRatesMap
}
