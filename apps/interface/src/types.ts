import { ContractKey } from './configs/contract'
import { TokenSymbol } from './configs/tokens'

export type ITokenBalanceMap = Record<string, bigint>

export type IContractBalanceMap = Record<ContractKey, bigint>
export type ITokenAllowanceMap = Record<
  TokenSymbol,
  Record<ContractKey, bigint>
>

export type IContractAddressMap = Record<ContractKey, string>
