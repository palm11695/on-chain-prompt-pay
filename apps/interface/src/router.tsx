import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import CreateSpendingWallet from './pages/CreateSpendingWallet/CreateSpendingWallet'
import TopUpSpendingWallet from './pages/TopUpSpendingWallet/TopUpSpendingWallet'
import TransferPage from './pages/Transfer/TransferPage'
import TopUpPortal from './pages/TopUpPortal/TopUpPortal'
import { ConnectWalletPage } from './components/OnBoarding/ConnectWalletPage'

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
  {
    path: '/topup-portal',
    element: <TopUpPortal />,
  },
])

export default router
