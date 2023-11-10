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
  const { address, isConnected } = useAccount()
  const chain = usePageChain()

  const {
    tokenBalances,
    tokenAllowances,
    refetch: refetchTokenStates,
  } = useBundleTokenStates(tokens, chain.id, address)

  return (
    <ContextState.Provider
      value={{
        account: address,
        isConnected,
        tokenBalances,
        tokenAllowances,
      }}
    >
      <ContextAction.Provider value={{ refetchTokenStates }}>
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
