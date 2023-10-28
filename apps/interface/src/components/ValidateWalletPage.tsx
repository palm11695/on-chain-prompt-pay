// import { useAtom } from 'jotai'
// import { aaSignedLocallyAtom, aaSignerAtom } from '../hooks/atoms/atoms'
import { useEffect } from 'react'
import { useAccountContextState } from '../pages/context/AccountContextProvider'
import { useNavigate } from 'react-router-dom'

export const ValidateWalletPage = () => {
  const { account } = useAccountContextState()
  // const [aaSigner, setAaSigner] = useAtom(aaSignerAtom)
  // const [aaSigned, setAASigned] = useAtom(aaSignedLocallyAtom)
  const navigate = useNavigate()

  useEffect(() => {
    if (account) navigate('/create-spending-wallet')
  }, [account])
  return <></>
}
