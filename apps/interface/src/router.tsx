import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { ConnectWalletPage } from './pages/ConnectWalletPage'
import CreateSpendingWallet from './pages/CreateSpendingWallet/CreateSpendingWallet'
import TopUpSpendingWallet from './pages/TopUpSpendingWallet/TopUpSpendingWallet'
import TransferPage from './pages/Transfer/TransferPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/connect-wallet',
    element: <ConnectWalletPage />,
  },
  {
    path: '/create-spending-wallet',
    element: <CreateSpendingWallet />,
  },
  {
    path: '/topup-spending-wallet',
    element: <TopUpSpendingWallet />,
  },
  {
    path: '/transfer',
    element: <TransferPage />,
  },
])

export default router
