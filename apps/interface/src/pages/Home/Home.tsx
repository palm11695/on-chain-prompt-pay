// import { useState } from 'react'
// import { useAccount } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

import Button from '../../components/Button'

export const Home = () => {
  // const [count, setCount] = useState(0)
  // const account = useAccount()
  // console.log('account:', account)
  // return <div className="h-full">Home page</div>
  return (
    <div className="container mx-auto">
      <div className="h-screen px-4 py-6">
        <div className="flex h-full flex-col items-center justify-center gap-y-4">
          <div className="text-xl font-semibold">OnChainPromptPay</div>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </div>
  )
}
