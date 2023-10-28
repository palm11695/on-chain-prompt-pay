import { useEffect } from 'react'
import { useAccountContextState } from '../pages/context/AccountContextProvider'
import { useNavigate } from 'react-router-dom'

export const ValidateWalletPage = () => {
  const { account, isAaNeeded } = useAccountContextState()

  const navigate = useNavigate()

  useEffect(() => {
    if (account && isAaNeeded === true) navigate('/create-spending-wallet')
  }, [account, isAaNeeded])
  return <></>
}
