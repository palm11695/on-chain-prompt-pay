import { configureChains, createConfig } from 'wagmi'
import { arbitrum, arbitrumGoerli } from 'wagmi/chains'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'

import envConfig from './envConfig'
import { publicProvider } from 'wagmi/providers/public'

export const isMainnet = () => {
  return ['prod, stg'].includes(envConfig.customEnv)
}

const {
  chains: _chains,
  publicClient,
  webSocketPublicClient,
} = configureChains(
  [isMainnet() ? arbitrum : arbitrumGoerli],
  [publicProvider()],
)

export const chains = _chains

const { connectors } = getDefaultWallets({
  appName: 'zkPromptPay App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
