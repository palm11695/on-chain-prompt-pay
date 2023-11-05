import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import CreateSpendingWallet from './pages/CreateSpendingWallet/CreateSpendingWallet'
import TopUpSpendingWallet from './pages/TopUpSpendingWallet/TopUpSpendingWallet'
import TransferPage from './pages/Transfer/TransferPage'
import TopUpPortal from './pages/TopUpPortal/TopUpPortal'
import { ConnectWalletPage } from './components/OnBoarding/ConnectWalletPage'
import { QrCodeReader } from './pages/Reader/QrCodeReader'
import LoadingPage from './pages/Loading/Loading'

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
  {
    path: '/qr-reader',
    element: <QrCodeReader />,
  },
  {
    path: '/loading',
    element: <LoadingPage />,
  },
  {
    path: '*',
    element: <Home />,
  },
])

export default router
