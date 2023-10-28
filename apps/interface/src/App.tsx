import { RouterProvider } from 'react-router-dom'
import router from './router'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiConfig } from './configs/walletConfig'
import { AccountContextProvider } from './pages/context/AccountContextProvider'

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <AccountContextProvider>
          <RouterProvider router={router} />
        </AccountContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
