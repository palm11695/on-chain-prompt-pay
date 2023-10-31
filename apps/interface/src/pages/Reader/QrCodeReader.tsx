import { useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

import scannerBox from '../../assets/scanner.svg'
import { useNavigate } from 'react-router-dom'
import { simplifyAmount, simplifyPromptPayAccount } from '../../utils/utils'
import Button from '../../components/Button'
// import flipCamera from '../../assets/flip-camera.png'

const phoneRegex = /01130066(\d{9})/
const idRegex = /0213(\d{13})/
const amountRegex = /54\d{1,9}\.\d{2}/

export enum SpenderType {
  Phone = 'Phone user',
  ID_Card = 'ID card',
}

export const QrCodeReader = () => {
  const [data, setData] = useState<string | undefined>(undefined)
  // const [camera, setCamera] = useState<'environment' | 'user'>('user')
  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      const idMatch = data.match(idRegex)
      const phoneMatch = data.match(phoneRegex)
      const amountMatch = data.match(amountRegex)
      const spenderType = idMatch ? SpenderType.ID_Card : SpenderType.Phone

      const sendValue =
        spenderType === SpenderType.ID_Card ? idMatch?.[1] : phoneMatch?.[1]
      const simplifiedAddress = simplifyPromptPayAccount(spenderType, sendValue)
      const simplifiedAmount = simplifyAmount(amountMatch?.[0])

      navigate(
        `/transfer?type=${spenderType}&transferTo=${simplifiedAddress}&amount=${simplifiedAmount}`,
      )
    }
  }, [data])

  return (
    <div className="h-full w-full">
      <img src={scannerBox} className="absolute inset-0 z-40 h-[100vh]" />
      <div className="bg-gray-900 [&>div>svg]:hidden">
        <QrScanner
          onDecode={(result) => {
            setData(result)
            console.log(result)
          }}
          onError={(error) => console.log(error?.message)}
          containerStyle={{
            height: '100vh',
            background: 'bg-gray-900',
          }}
          // constraints={{ facingMode: camera }}
        />
      </div>
      <div className="absolute left-0 top-0 z-50 flex pl-5 pt-5">
        <Button
          className="rounded-lg border-2 border-slate-500 bg-slate-300 px-4 py-2 text-gray-700"
          onClick={() => navigate('/')}
        >
          Back
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
  )
}
