import { useEffect, useMemo, useState } from 'react'
import {
  Address,
  Signature,
  custom,
  encodeAbiParameters,
  encodePacked,
  hashMessage,
  hexToSignature,
  keccak256,
  pad,
  recoverAddress,
  recoverMessageAddress,
  signatureToHex,
  toBytes,
  toHex,
  verifyMessage,
  zeroAddress,
} from 'viem'
import { useSignMessage } from 'wagmi'
import { useBlock } from './useBlock'
import { Bytes } from '../types'
import { createWalletClient } from 'viem'
import 'viem/window'
import { arbitrumGoerli } from 'viem/chains'

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
  console.log('account:', account)
  const [isSigning, setIsSigning] = useState(false)
  const [isError, setError] = useState<unknown | undefined>(undefined)
  const [signedMessage, setSignedMessage] = useState<Bytes | undefined>(
    undefined,
  )
  // const block = useBlock()
  // const deadline: bigint = useMemo(() => {
  //   return block
  //     ? block.timestamp + BigInt(1000)
  //     : BigInt(Math.floor(Date.now() / 1000)) + BigInt(1000)
  // }, [block])

  const _exchangeRate = BigInt(280)
  const deadline = BigInt(1698960120)
  // console.log('exchangeRate:', exchangeRate)
  // console.log('deadline:', deadline)

  const messageHash = keccak256(
    encodePacked(['uint256', 'uint256'], [_exchangeRate, deadline]),
  )
  // const msgHash = hashMessage({ raw: toBytes(messageHex) })

  // console.log('messageHash:', messageHash)
  // console.log('messageHex:', messageHex)
  // console.log('exchangeRate:', exchangeRate)
  // console.log('deadline:', deadline)
  // console.log('msgHash:', msgHash)

  const handleSign = () => {
    setIsSigning(true)
    ;(async () => {
      try {
        const signature = await walletClient.signMessage({
          account: account ?? zeroAddress,
          // message: { raw: messageHex },
          message: messageHash,
        })
        console.log('signature:', signature)

        // const recover = await recoverAddress({
        //   hash: messageHash,
        //   signature: signature,
        // })
        const recover = await recoverMessageAddress({
          message: messageHash,
          signature: signature,
        })
        // Should eq to account address
        console.log('recover:', recover)

        const isCorrect = await verifyMessage({
          address: account ?? zeroAddress,
          message: messageHash,
          // message: { raw: messageHex },
          signature: signature,
        })
        // console.log('isCorrect:', isCorrect)

        const verifiedMessage = hexToSignature(signature as Bytes)

        const _signatureHex = signatureToHex({
          r: verifiedMessage.r,
          s: verifiedMessage.s,
          v: verifiedMessage.v,
        })
        // console.log('signatureHex:', signatureHex)

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

  // const { _signMessage } = useAsync(async () => {
  //   const signMessage = await walletClient.signMessage({
  //     account: account ?? zeroAddress,
  //     message: { raw: messageHex },
  //   })
  // })

  // const message = keccak256(
  // encodePacked(
  //   ['bytes'],
  //   [
  //   ],
  // ),
  // )
  // console.log('message:', message)
  // console.log('messageBytes:', toBytes(message))
  // const messageBytesHashed = hashMessage(toBytes(message))
  // const messageRawBytesHashed = hashMessage({ raw: toBytes(message) })
  // console.log('messageRawBytesHashed:', messageRawBytesHashed)
  // const messageHashed = hashMessage('hello world')
  // console.log('messageHashed:', messageHashed)

  // const encodedParams = pad(encodePacked(['string'], ['hello world']), {
  //   dir: 'left',
  //   size: 64,
  // })
  // console.log('encodedParams:', encodedParams)
  // const encodedData = encodeAbiParameters(
  //   [{ type: 'address' }, { type: 'uint256' }],
  //   [minter, salt],
  // )

  // const message = keccak256(encodedData)
  // console.log('message:', message)

  // useEffect(() => {
  //   setSignedMessage(undefined)
  // }, [])

  // const { signMessage } = useSignMessage({
  //   message: message,
  //   // message: message,
  //   onSuccess: async (data) => {
  //     try {
  //       // console.log('message:', message)
  //       // console.log('account:', account)
  //       console.log('message:', message)
  //       // await signMessage(walletClient!, {
  //       //   account: accounts[0].address,
  //       //   message: 'hello world',
  //       // }),
  //       const signatureFromViem = await walletClient.signMessage({
  //         account: account ?? zeroAddress,
  //         message: { raw: messageHex },
  //       })
  //       console.log('signatureFromViem:', signatureFromViem)
  //       const recoverFromViem = await recoverAddress({
  //         hash: message,
  //         signature: signatureFromViem,
  //       })
  //       console.log('recoverFromViem:', recoverFromViem)

  //       console.log('signatureFromWagmi:', data)
  //       // const recoverFromWagmi = await recoverAddress({
  //       //   hash: message,
  //       //   signature: data,
  //       // })
  //       // console.log('recoverFromWagmi:', recoverFromWagmi)

  //       setSignedMessage(data)
  //       setIsSigning(false)
  //     } catch (error) {
  //       console.log('error:', error)
  //     }
  //     return true
  //   },
  //   onError: (error) => {
  //     setIsSigning(false)
  //     setError(error)
  //   },
  // })

  // const handleSign = () => {
  //   setIsSigning(true)
  //   signMessage()
  // }

  const _verifiedMessage: Signature | undefined = useMemo(() => {
    if (!signedMessage) return undefined
    // console.log('signedMessage:', signedMessage)

    return hexToSignature(signedMessage as Bytes)
  }, [signedMessage])
  // console.log('_verifiedMessage:', _verifiedMessage)

  return {
    signedMessage: signedMessage,
    verifiedMessage: _verifiedMessage,
    handleSignExchangeRate: handleSign,
    deadline: deadline,
    isSigning,
    isError,
  }
}
