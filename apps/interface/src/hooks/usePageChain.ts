import { arbitrum, arbitrumGoerli } from 'wagmi/chains'
import { isMainnet } from '../configs/walletConfig'

export function usePageChain() {
  return isMainnet() ? arbitrum : arbitrumGoerli
}
