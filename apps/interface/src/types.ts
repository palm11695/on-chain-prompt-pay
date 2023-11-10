import { Signature } from 'viem'
import { ContractKey } from './configs/contract'
import { TokenSymbol } from './configs/tokens'

export type ITokenBalanceMap = Record<string, bigint>

export type IContractBalanceMap = Record<ContractKey, bigint>
export type ITokenAllowanceMap = Record<
  TokenSymbol,
  Record<ContractKey, bigint>
>

export type IContractAddressMap = Record<ContractKey, string>

export type Bytes = `0x${string}`

export type ZEXInfo = {
  exchangeRate: bigint
  deadline: bigint
  signature: Signature
}
