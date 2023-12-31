import { ZEXInfo } from '../types'

// TODO: use oracle and exchange rate from provider
export const ETH_USD = 1750
export const USD_THB = 35
export const USDC_USD = 1.0001

// Hardcoded for demo
export const hardCodedZEXInfo: ZEXInfo = {
  exchangeRate: BigInt(280),
  deadline: BigInt(1701568800),
  signature: {
    r: '0xc9ae79992ec21a8d3666e781035d2eded0795dfffc8a1edcafcc9e0fd6940a1d',
    s: '0x221078133b4847766ed885fc5eb725be4ff89eb0c138971a343f46f12d75191d',
    v: BigInt(28),
  },
}
