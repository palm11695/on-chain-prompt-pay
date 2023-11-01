import { useMemo, useState } from 'react'
import { encodePacked, keccak256 } from 'viem'
import { useSignMessage } from 'wagmi'
import { useBlock } from './useBlock'

interface IUseSignExchangeRate {
  exchangeRate: bigint
}
export const useSignExchangeRate = ({ exchangeRate }: IUseSignExchangeRate) => {
  const [isSigning, setIsSigning] = useState(false)
  const [isError, setError] = useState<Error | undefined>(undefined)
  const [signedMessage, setSignedMessage] = useState<string | undefined>(
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

  return {
    signedMessage: signedMessage,
    handelSignExchangeRate: handleSign,
    isSigning,
    isError,
  }
}
