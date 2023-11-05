import { useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

import scannerBox from '../../assets/scanner.png'
import { useNavigate } from 'react-router-dom'
import {
  getQrErrorLabel,
  simplifyAmount,
  simplifyPromptPayAccount,
} from '../../utils/utils'
import Button from '../../components/Button'
import { Modal } from '../../components/Modal'
import { useOpenModal } from '../../hooks/useOpenModal'
import closeButton from './../../assets/close.png'
// import flipCamera from '../../assets/flip-camera.png'

const phoneRegex = /01130066(\d{9})/
const idRegex = /0213(\d{13})/
const amountRegex = /54\d{1,9}\.\d{2}/

export enum ReceiverType {
  PromptPay = 'PromptPay',
  ID_Card = 'ID Card',
}

export const QrCodeReader = () => {
  const [data, setData] = useState<string | undefined>(undefined)
  const [errorMsg, setErrorMsg] = useState('')
  const [isError, setIsError] = useState<boolean | undefined>(undefined)

  // const [camera, setCamera] = useState<'environment' | 'user'>('user')
  const navigate = useNavigate()
  const { isOpen, handleOpen, handleClose } = useOpenModal()

  useEffect(() => {
    if (data) {
      const idMatch = data.match(idRegex)
      const phoneMatch = data.match(phoneRegex)
      const amountMatch = data.match(amountRegex)
      const receiverType = idMatch
        ? ReceiverType.ID_Card
        : ReceiverType.PromptPay

      const rawReceiverAddress =
        receiverType === ReceiverType.ID_Card ? idMatch?.[1] : phoneMatch?.[1]
      const simplifiedAddress = simplifyPromptPayAccount(
        receiverType,
        rawReceiverAddress,
      )
      const simplifiedAmount = simplifyAmount(amountMatch?.[0])

      if (!simplifiedAddress || !simplifiedAmount || isError) {
        const errorMsg = getQrErrorLabel(
          simplifiedAddress,
          simplifiedAmount,
          isError,
        )
        setErrorMsg(errorMsg)
        handleOpen()
        return
      }

      if (!isError)
        navigate(
          `/transfer?type=${receiverType}&receiver=${simplifiedAddress}&amount=${simplifiedAmount}`,
        )
    }
  }, [data, isError])

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
          <>
            <div className="flex flex-col items-center justify-between gap-4">
              {errorMsg}
              <Button variant="primary" onClick={handleCloseModal}>
                Try again
              </Button>
            </div>
          </>
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
            // constraints={{ facingMode: camera }}
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
        {/* <div className="absolute bottom-0 right-0 z-50 pb-5 pr-5">
        <Button
          className="rounded-lg border-2 border-slate-500 bg-slate-300 px-4  py-2"
          onClick={() => navigate('/')}
        >
          <img className="w-10" src={flipCamera} />
        </Button>
      </div> */}
      </div>
    </>
  )
}
