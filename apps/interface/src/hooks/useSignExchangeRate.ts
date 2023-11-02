import { useMemo, useState } from 'react'
import { Signature, encodePacked, hexToSignature, keccak256 } from 'viem'
import { useSignMessage } from 'wagmi'
import { useBlock } from './useBlock'
import { Bytes } from '../types'

interface IUseSignExchangeRate {
  signedMessage: Bytes | undefined
  verifiedMessage: Signature | undefined
  handelSignExchangeRate: () => void
  isSigning: boolean
  isError: Error | undefined
}

interface IUseSignExchangeRateProps {
  exchangeRate: bigint
}

export const useSignExchangeRate = ({
  exchangeRate,
}: IUseSignExchangeRateProps): IUseSignExchangeRate => {
  const [isSigning, setIsSigning] = useState(false)
  const [isError, setError] = useState<Error | undefined>(undefined)
  const [signedMessage, setSignedMessage] = useState<Bytes | undefined>(
    undefined,
  )
  const block = useBlock()
  const blockTimestamp: bigint = useMemo(() => {
    return block ? block.timestamp : BigInt(Math.floor(Date.now() / 1000))
  }, [block])

  const { signMessage } = useSignMessage({
    message: keccak256(
      encodePacked(
        ['uint256', 'uint256'],
        [exchangeRate, blockTimestamp + BigInt(1000)],
      ),
    ),
    onSuccess: async (data) => {
      try {
        setSignedMessage(data)
        setIsSigning(false)
      } catch (error) {
        console.log('error:', error)
      }
      return true
    },
    onError: (error) => {
      setIsSigning(false)
      setError(error)
    },
  })

  const handleSign = () => {
    setIsSigning(true)
    signMessage()
  }

  const _verifiedMessage: Signature | undefined = useMemo(() => {
    if (!signedMessage) return undefined

    return hexToSignature(signedMessage as Bytes)
  }, [signedMessage])

  return {
    signedMessage: signedMessage,
    verifiedMessage: _verifiedMessage,
    handelSignExchangeRate: handleSign,
    isSigning,
    isError,
  }
}
