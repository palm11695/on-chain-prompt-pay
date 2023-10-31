import { isMainnet } from './walletConfig'

const oneAssets = {
  ETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  USDC: '',
}

const goerliAssets = {
  ETH: '0xBbCcDa8F9eb6DCb293c63C34055C17a12e3e71E2',
  USDC: '0x5e1cB7E1B395FB5e50Ed06B10961b88edA81e150',
}

export const assetsAddresses = isMainnet() ? oneAssets : goerliAssets

export interface ITokenProfile {
  name: string
  displaySymbol: string
  decimal: number
  address: string
  nonDisplay?: boolean
}

export const eth: ITokenProfile = {
  name: 'Ethereum',
  displaySymbol: 'ETH',
  decimal: 18,
  address: assetsAddresses.ETH,
  nonDisplay: true,
}

export const usdc: ITokenProfile = {
  name: 'USD Circle',
  displaySymbol: 'USDC',
  decimal: 6,
  address: assetsAddresses.USDC,
}

export const tokens: ITokenProfile[] = [eth, usdc]
export const onlyShowAssets = tokens.filter((c) => !c.nonDisplay)
