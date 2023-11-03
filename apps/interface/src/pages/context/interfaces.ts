import { ITokenAllowanceMap, ITokenBalanceMap } from '../../types'

export interface IAccountContextState {
  account: string | undefined
  // aaAccountData: string | undefined
  // aaAccountAddress: Address | undefined
  // isAaNeeded: boolean
  tokenBalances: ITokenBalanceMap | undefined
  tokenAllowances: ITokenAllowanceMap | undefined
}
export interface IAccountContextAction {
  refetchTokenStates: () => void
}
