import { useEffect, useState } from 'react'
import { QrScanner } from '@yudiel/react-qr-scanner'

import scannerBox from '../../assets/scanner.svg'
import { useNavigate } from 'react-router-dom'

const phoneRegex = /01130066(\d{9})/
const idRegex = /0213(\d{13})/

export enum SpenderType {
  Phone = 'Phone user',
  ID_Card = 'ID card',
}

export const QrCodeReader = () => {
  const [data, setData] = useState<string | undefined>(undefined)
  const navigator = useNavigate()

  useEffect(() => {
    if (data) {
      const idMatch = data.match(idRegex)
      const phoneMatch = data.match(phoneRegex)
      const spenderType = idMatch ? SpenderType.ID_Card : SpenderType.Phone

      navigator(
        `/transfer?type=${spenderType}&value=${
          spenderType === SpenderType.ID_Card ? idMatch?.[1] : phoneMatch?.[1]
        }`,
      )
    }
  }, [data])

  return (
    <div className="h-full w-full">
      <img src={scannerBox} className="absolute inset-0 z-50 h-[100vh]" />
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
        />
      </div>
    </div>
  )
}
