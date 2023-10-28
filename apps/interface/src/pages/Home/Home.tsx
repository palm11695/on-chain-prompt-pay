import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccountContextState } from '../context/AccountContextProvider'
import { ConnectWalletPage } from '../../components/OnBoarding/ConnectWalletPage'
import { ValidateWalletPage } from '../../components/ValidateWalletPage'

export const Home = () => {
  const { account } = useAccountContextState()
  return <>{account ? <ValidateWalletPage /> : <ConnectWalletPage />}</>
}
