import { useMemo, useState } from 'react'
import {
  Address,
  Signature,
  custom,
  encodePacked,
  keccak256,
  zeroAddress,
} from 'viem'
import { Bytes } from '../types'
import { createWalletClient } from 'viem'
import 'viem/window'
import { arbitrumGoerli } from 'viem/chains'
import { verifiedMessageHardCoded } from '../utils/constants'

const walletClient = createWalletClient({
  chain: arbitrumGoerli,
  transport: custom(window.ethereum!),
})

interface IUseSignExchangeRate {
  signedMessage: Bytes | undefined
  verifiedMessage: Signature | undefined
  handleSignExchangeRate: () => void
  deadline: bigint
  isSigning: boolean
  isError: unknown | undefined
}

interface IUseSignExchangeRateProps {
  exchangeRate: bigint
  account: Address | undefined
}

export const useSignExchangeRate = ({
  // exchangeRate,
  account,
}: IUseSignExchangeRateProps): IUseSignExchangeRate => {
  const [isSigning, setIsSigning] = useState(false)
  const [isError, setError] = useState<unknown | undefined>(undefined)
  const [signedMessage, setSignedMessage] = useState<Bytes | undefined>(
    undefined,
  )

  const _exchangeRate = BigInt(280)
  const deadline = BigInt(1701568800)

  const messageHash = keccak256(
    encodePacked(['uint256', 'uint256'], [_exchangeRate, deadline]),
  )
  // const msgHash = hashMessage({ raw: toBytes(messageHex) })

  const handleSign = () => {
    setIsSigning(true)
    ;(async () => {
      try {
        const signature = await walletClient.signMessage({
          account: account ?? zeroAddress,
          message: messageHash,
        })

        setSignedMessage(signature)
        setIsSigning(false)
      } catch (err) {
        console.log('err:', err)
        setIsSigning(false)
        setError(err)
      }
      return true
    })()
  }

  const _verifiedMessage: Signature | undefined = useMemo(() => {
    if (!signedMessage) return undefined

    return verifiedMessageHardCoded
  }, [signedMessage])

  return {
    signedMessage: signedMessage,
    verifiedMessage: _verifiedMessage,
    handleSignExchangeRate: handleSign,
    deadline: deadline,
    isSigning,
    isError,
  }
}
