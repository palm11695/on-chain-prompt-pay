import { useEffect, useState } from 'react'
import LoadingPage from '../Loading/Loading'
import checkLogo from './../../assets/check.png'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

export const SuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // make component loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000000)
  }, [])

  const handleClick = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading ? (
        <LoadingPage
          isComponent
          label="Waiting for tx..."
          onClick={handleClick}
        />
      ) : (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-6">
          <img src={checkLogo} className="w-40" />
          <p className="text-2xl">Success</p>
          <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-2 px-4 pb-4">
            <Button onClick={() => navigate('/loading')} buttonClass="mb-3">
              Back to Homepage
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
