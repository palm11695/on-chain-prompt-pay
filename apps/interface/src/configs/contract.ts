import { IContractAddressMap } from '../types'

export enum ContractKey {
  PaymentHandler = 'PaymentHandler',
}

export const contracts: IContractAddressMap = {
  // Big deployed
  [ContractKey.PaymentHandler]: '0x1Ce1a9F7F440815502c0F6441b7a0b0F461dE1C5',
  // [ContractKey.PaymentHandler]: '0x9adc7af330889d5D072F271aEbb9247aa08d083c',
}

export const ContractKeys = (
  Object.keys(ContractKey) as (keyof typeof ContractKey)[]
).reduce((contractKeys, key) => {
  return [...contractKeys, ContractKey[key]]
}, [] as ContractKey[])
