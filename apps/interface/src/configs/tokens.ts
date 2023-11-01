import { isMainnet } from './walletConfig'

export enum TokenSymbol {
  ETH = 'ETH',
  USDC = 'USDC',
}

const oneAssets = {
  ETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
  USDC: '',
}

const goerliAssets = {
  ETH: '0xBbCcDa8F9eb6DCb293c63C34055C17a12e3e71E2',
  USDC: '0x38934bDf2462768388829194fD40a43eD9916B4C',
}

export const assetsAddresses = isMainnet() ? oneAssets : goerliAssets

export interface ITokenProfile {
  name: string
  displaySymbol: TokenSymbol
  decimal: number
  address: string
  nonDisplay?: boolean
}

export const eth: ITokenProfile = {
  name: 'Ethereum',
  displaySymbol: TokenSymbol.ETH,
  decimal: 18,
  address: assetsAddresses.ETH,
  nonDisplay: true,
}

export const usdc: ITokenProfile = {
  name: 'USD Circle',
  displaySymbol: TokenSymbol.USDC,
  decimal: 6,
  address: assetsAddresses.USDC,
}

export const tokens: ITokenProfile[] = [eth, usdc]
export const onlyShowAssets = tokens.filter((c) => !c.nonDisplay)
