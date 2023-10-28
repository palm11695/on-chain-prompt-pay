import { Context, ReactNode, createContext, useContext, useState } from 'react'

import { IHomePageContextAction, IHomePageContextState } from './interfaces'
import { useAccount } from 'wagmi'

const ContextState: Context<IHomePageContextState | null> = createContext<IHomePageContextState | null>(null)

const ContextAction: Context<IHomePageContextAction | null> = createContext<IHomePageContextAction | null>(null)

export const HomePageContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [state, _] = useState(0)
  const temp = useAccount()
  console.log('temp:', temp)

  return <ContextState.Provider value={state}></ContextState.Provider>
}

export const useHomePageContextState = (): IHomePageContextState => {
  const context: IHomePageContextState | null = useContext(ContextState)

  if (!context) {
    throw new Error('useHomePageContextState must be used within a HomePageContextProvider')
  }

  return context
}

export const useHomePageContextActions = (): IHomePageContextAction => {
  const context: IHomePageContextAction | null = useContext(ContextAction)

  if (!context) {
    throw new Error('useHomePageContextActions must be used within a HomePageContextProvider')
  }

  return context
}
