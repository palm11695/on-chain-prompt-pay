// import { useState } from 'react'
// import { useAccount } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

import Button from '../../components/Button'
import Container from '../../components/Container'

export const Home = () => {
  return (
    <Container>
      <div className="w-full rounded-xl bg-blue-600 p-4 text-white">
        <div className="text-sm text-blue-200">Usable balance</div>
        <div className="text-2xl font-medium">฿10,000.00</div>

        <div className="h-8" />

        <div className="text-xs font-light text-blue-300">
          Spending wallet address
        </div>
        <div className="text-xs text-blue-200">0xc0ff...4979</div>
      </div>

      <div className="h-8" />

      <div className="text-lg font-semibold">My Assets</div>
      <div className="h-4" />
      <div className="flex items-center justify-between">
        <div>
          <div>ETH</div>
          <div className="text-sm text-slate-400">Ethereum</div>
        </div>
        <div className="text-right">
          <div>1 ETH</div>
          <div className="text-sm text-slate-400">63,000.00฿</div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button>Pay via QR</Button>
        <Button variant="secondary">Topup</Button>
      </div>
    </Container>
  )
}
