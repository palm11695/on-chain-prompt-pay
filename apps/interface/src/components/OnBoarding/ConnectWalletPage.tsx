import { ConnectButton } from '@rainbow-me/rainbowkit'

export const ConnectWalletPage = () => {
  return (
    <div className="container mx-auto">
      <div className="h-screen px-4 py-6">
        <div className="flex h-full flex-col items-center justify-center gap-y-4">
          <div className="text-xl font-semibold">zkPromptPay</div>
          <ConnectButton />
        </div>
      </div>
    </div>
  )
}
