import { Context, ReactNode, createContext, useContext, useState } from 'react'

import { IAccountContextState, IAccountContextAction } from './interfaces'
import { useAccount } from 'wagmi'

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

  return (
    <ContextState.Provider value={{ account: address }}>
      {children}
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

export const useHomePageContextActions = (): IAccountContextAction => {
  const context: IAccountContextAction | null = useContext(ContextAction)

  if (!context) {
    throw new Error(
      'useHomePageContextActions must be used within a AccountContextProvider',
    )
  }

  return context
}
