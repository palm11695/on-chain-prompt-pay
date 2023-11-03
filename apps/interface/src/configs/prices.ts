import { ETH_USD, USDC_USD } from '../utils/constants'
import { TokenSymbol } from './tokens'

// mock prices
export const tokenPrices: Record<TokenSymbol, number> = {
  [TokenSymbol.ETH]: ETH_USD,
  [TokenSymbol.USDC]: USDC_USD,
}
