import { HomeWrapper } from './pages/Home/Home'
import TransferPage from './pages/Transfer/TransferPage'
import { ConnectWalletPage } from './components/OnBoarding/ConnectWalletPage'
import { QrCodeReader } from './pages/Reader/QrCodeReader'
import LoadingPage from './pages/Loading/Loading'
import { SuccessPage } from './pages/Success/Success'

const router = [
  {
    path: '/',
    element: <HomeWrapper />,
  },
  {
    path: '/connect-wallet',
    element: <ConnectWalletPage />,
  },
  {
    path: '/transfer',
    element: <TransferPage />,
    noWalletButton: true,
  },
  {
    path: '/qr-reader',
    element: <QrCodeReader />,
    noTopbar: true,
  },
  {
    path: '/loading',
    element: <LoadingPage />,
    noWalletButton: true,
  },
  {
    path: '/success',
    element: <SuccessPage />,
    noWalletButton: true,
  },
  {
    path: '*',
    element: <HomeWrapper />,
  },
]

export default router
