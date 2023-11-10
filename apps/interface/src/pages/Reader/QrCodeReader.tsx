import { useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

import scannerBox from '../../assets/scanner.png'
import { useNavigate } from 'react-router-dom'
import { getQrErrorLabel, parsePromptPay } from '../../utils/utils'
import Button from '../../components/Button'
import { Modal } from '../../components/Modal'
import { useOpenModal } from '../../hooks/useOpenModal'
import closeButton from './../../assets/close.png'

export const QrCodeReader = () => {
  const [data, setData] = useState<string | undefined>(undefined)
  const [errorMsg, setErrorMsg] = useState('')
  const [isError, setIsError] = useState<boolean | undefined>(undefined)

  const navigate = useNavigate()
  const { isOpen, handleOpen, handleClose } = useOpenModal()

  useEffect(() => {
    if (data) {
      const { id, amount, type } = parsePromptPay(data)

      if (!id || isError) {
        const errorMsg = getQrErrorLabel(id, isError)
        setErrorMsg(errorMsg)
        handleOpen()
        return
      }

      if (!isError)
        navigate(`/transfer?type=${type}&receiver=${id}&amount=${amount ?? ''}`)
    }
  }, [data, handleOpen, isError, navigate])

  const handleCloseModal = () => {
    handleClose()
    setIsError(false)
    setErrorMsg('')
    setData(undefined)
  }

  return (
    <>
      <Modal
        label="Unable to process"
        content={
          <div className="flex flex-col items-center justify-between gap-4">
            {errorMsg}
            <Button variant="primary" onClick={handleCloseModal}>
              Try again
            </Button>
          </div>
        }
        isOpen={isOpen}
        onClose={handleCloseModal}
      />

      <div className="h-full w-full">
        <div className="absolute z-20 h-[100vh]">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <img src={scannerBox} className="w-[120%]" />
          </div>
        </div>
        <div className="bg-gray-900 [&>div>svg]:hidden">
          <QrScanner
            onDecode={(result) => {
              setData(result)
            }}
            onError={(error) => {
              setIsError(true)
              console.log(error?.message)
            }}
            containerStyle={{
              height: '100vh',
              background: 'bg-gray-900',
            }}
          />
        </div>
        <div className="absolute left-0 top-0 z-40 flex pl-5 pt-5">
          <Button
            className="rounded-full border-2 border-stone-900 bg-slate-600 px-4 py-2 text-gray-700"
            onClick={() => navigate('/')}
          >
            <img src={closeButton} className="w-5" />
          </Button>
        </div>
      </div>
    </>
  )
}
