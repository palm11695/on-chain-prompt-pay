// import { useState } from 'react'
// import { useAccount } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

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
          <button className="w-full rounded-lg bg-blue-600 py-2 text-white">Connect Wallet</button>
        </div>
      </div>
    </div>
  )
}
