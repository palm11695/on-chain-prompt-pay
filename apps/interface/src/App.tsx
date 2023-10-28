import { RouterProvider } from 'react-router-dom'
import router from './router'
// import { WagmiConfig } from 'wagmi'
// import { wagmiConfig } from './configs/walletConfig'
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit'

function App() {
  return (
    <div>
      {/* <WagmiConfig config={wagmiConfig}> */}
      {/* <RainbowKitProvider chains={chains}> */}
      <RouterProvider router={router} />
      {/* </RainbowKitProvider> */}
      {/* </WagmiConfig> */}
    </div>
  )
}

export default App
