import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import TransferPage from './pages/Transfer/TransferPage'
import { ConnectWalletPage } from './components/OnBoarding/ConnectWalletPage'
import { QrCodeReader } from './pages/Reader/QrCodeReader'
import LoadingPage from './pages/Loading/Loading'
import { SuccessPage } from './pages/Success/Success'

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
    path: '/transfer',
    element: <TransferPage />,
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
    path: '/success',
    element: <SuccessPage />,
  },
  {
    path: '*',
    element: <Home />,
  },
])

export default router
