import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home/Home'
import { Login } from './pages/Login'
import CreateSpendingWallet from './pages/CreateSpendingWallet/CreateSpendingWallet'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/create-spending-wallet',
    element: <CreateSpendingWallet />,
  },
])

export default router
