import { ITokenAllowanceMap, ITokenBalanceMap } from '../../types'

export interface IAccountContextState {
  account: string | undefined
  tokenBalances: ITokenBalanceMap | undefined
  tokenAllowances: ITokenAllowanceMap | undefined
}
export interface IAccountContextAction {
  refetchTokenStates: () => void
}
