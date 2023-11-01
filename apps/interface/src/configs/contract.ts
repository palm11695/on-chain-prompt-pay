import { IContractAddressMap } from '../types'

export enum ContractKey {
  PaymentHandler = 'PaymentHandler',
}

export const contracts: IContractAddressMap = {
  [ContractKey.PaymentHandler]: '0x9adc7af330889d5D072F271aEbb9247aa08d083c',
}

export const ContractKeys = (
  Object.keys(ContractKey) as (keyof typeof ContractKey)[]
).reduce((contractKeys, key) => {
  return [...contractKeys, ContractKey[key]]
}, [] as ContractKey[])
