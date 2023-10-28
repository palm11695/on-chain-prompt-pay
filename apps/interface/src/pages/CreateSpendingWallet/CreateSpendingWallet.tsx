import Button from '../../components/Button'
import { PinInput } from '../../components/OnBoarding/PinInput'
import { usePinInputApi } from '../../hooks/usePinInputApi'
import { encodePacked, keccak256, zeroAddress } from 'viem'
import { useAccountContextState } from '../context/AccountContextProvider'
import { useSignMessage } from 'wagmi'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { aaAccountAtom } from '../../hooks/atoms/atoms'

import { useNavigate } from 'react-router-dom'
import Container from '../../components/Container'

const CreateSpendingWallet = () => {
  const { account: accountAddress } = useAccountContextState()
  const spendingWalletPin = usePinInputApi('spendingWalletPin', '')
  const [isSigning, setIsSigning] = useState(false)
  const [aaAccount, setAaAccounts] = useAtom(aaAccountAtom)
  const navigate = useNavigate()

  const { signMessage } = useSignMessage({
    message: keccak256(
      encodePacked(
        ['string'],
        [
          `This is generated on OnChainPromptPay project: To be used as account abstraction for ${accountAddress} with PIN:${spendingWalletPin.valueAsString}`,
        ],
      ),
    ),
    onSuccess: async (data) => {
      try {
        // Create the account abstraction
        const aaAccount = new ethers.Wallet(data.substring(0, 66))

        // Encrypt the account abstraction
        const encryptAASigner = await aaAccount.encrypt(
          spendingWalletPin.valueAsString,
        )

        // save addresses locally
        setAaAccounts((current) => ({
          ...current,
          [accountAddress ?? zeroAddress]: encryptAASigner,
        }))

        spendingWalletPin.clearValue()
        setIsSigning(false)
      } catch (error) {
        console.log('error:', error)
      }
      return true
    },
    onError: (error) => {
      setIsSigning(false)
      console.log(error)
    },
  })

  const handleSign = () => {
    setIsSigning(true)
    signMessage()
  }

  useEffect(() => {
    if (aaAccount[accountAddress ?? zeroAddress])
      navigate('/topup-spending-wallet')
  }, [aaAccount])

  return (
    <Container>
      <div className="text-xl font-semibold">Create Spending Wallet</div>

      <div className="h-8" />

      <div className="flex flex-col gap-4">
        <div>Enter pin</div>
        <PinInput api={spendingWalletPin} size="xl" />
      </div>

      <div className="h-12" />

      <Button onClick={handleSign} disabled={isSigning}>
        {isSigning ? 'Signing...' : 'Continue'}
      </Button>
    </Container>
  )
}

export default CreateSpendingWallet
