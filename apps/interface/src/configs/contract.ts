import { IContractAddressMap } from '../types'

export enum ContractKey {
  PaymentHandler = 'PaymentHandler',
}

export const contracts: IContractAddressMap = {
  [ContractKey.PaymentHandler]: '0xC2c42EDB20E827049c17235cBc53C9eE5160030a',
}

export const ContractKeys = (
  Object.keys(ContractKey) as (keyof typeof ContractKey)[]
).reduce((contractKeys, key) => {
  return [...contractKeys, ContractKey[key]]
}, [] as ContractKey[])
