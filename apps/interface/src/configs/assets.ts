import { isMainnet } from './walletConfig'

const oneAssets = {
  ['ETH']: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
}

const goerliAssets = {
  ['ETH']: '0xBbCcDa8F9eb6DCb293c63C34055C17a12e3e71E2',
}

export const assets = isMainnet() ? oneAssets : goerliAssets
