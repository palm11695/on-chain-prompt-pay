export interface IAccountContextState {
  account: string | undefined
  // aaAccountData: string | undefined
  // aaAccountAddress: Address | undefined
  // isAaNeeded: boolean
  assetBalances: Record<string, bigint> | undefined
}
export interface IAccountContextAction {}
