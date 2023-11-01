import { Context, ReactNode, createContext, useContext } from 'react'

import { IAccountContextState, IAccountContextAction } from './interfaces'
import { useAccount } from 'wagmi'
import { tokens } from '../../configs/tokens'
import { useBundleTokenStates } from '../../hooks/useBundleTokenStates'
import { usePageChain } from '../../hooks/usePageChain'

const ContextState: Context<IAccountContextState | null> =
  createContext<IAccountContextState | null>(null)

const ContextAction: Context<IAccountContextAction | null> =
  createContext<IAccountContextAction | null>(null)

export const AccountContextProvider = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  const { address } = useAccount()
  const chain = usePageChain()
  // const [aaAccount, _] = useAtom(aaAccountAtom)

  // load data
  // const [aaAccountData, aaAccountAddress] = useMemo(() => {
  //   if (!address) return [undefined, undefined]
  //   if (!aaAccount[address]) return [undefined, undefined]

  //   const _account = aaAccount[address]
  //   return [_account, parseAddressFromEncryptedWallet(_account) as Address]
  // }, [address, aaAccount])

  // const isAaNeeded = useMemo(() => {
  //   if (address && !aaAccountAddress) return true
  //   return false
  // }, [address, aaAccountAddress])

  const {
    tokenBalances,
    tokenAllowances,
    refetch: refetchTokenAllowances,
  } = useBundleTokenStates(tokens, chain.id, address)

  return (
    <ContextState.Provider
      value={{
        account: address,
        tokenBalances,
        tokenAllowances,
        // , aaAccountData, aaAccountAddress, isAaNeeded
      }}
    >
      <ContextAction.Provider value={{ refetchTokenAllowances }}>
        {children}
      </ContextAction.Provider>
    </ContextState.Provider>
  )
}

export const useAccountContextState = (): IAccountContextState => {
  const context: IAccountContextState | null = useContext(ContextState)

  if (!context) {
    throw new Error(
      'useAccountContextState must be used within a AccountContextProvider',
    )
  }

  return context
}

export const useAccountContextActions = (): IAccountContextAction => {
  const context: IAccountContextAction | null = useContext(ContextAction)

  if (!context) {
    throw new Error(
      'useAccountContextActions must be used within a AccountContextProvider',
    )
  }

  return context
}
