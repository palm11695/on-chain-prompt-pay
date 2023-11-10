import { BrowserRouter, Route, Routes } from 'react-router-dom'
import router from './router'
import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiConfig } from './configs/walletConfig'
import { AccountContextProvider } from './pages/context/AccountContextProvider'
import { Topbar } from './components/Topbar'

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} showRecentTransactions>
        <AccountContextProvider>
          <BrowserRouter>
            <Routes>
              {router.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <>
                      <Topbar
                        showButton={!route.noWalletButton}
                        showTopbar={!route.noTopbar}
                      />
                      {route.element}
                    </>
                  }
                ></Route>
              ))}
            </Routes>
          </BrowserRouter>
        </AccountContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
