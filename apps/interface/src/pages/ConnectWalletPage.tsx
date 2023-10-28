import Button from '../components/Button'
import Container from '../components/Container'

export const ConnectWalletPage = () => {
  return (
    <Container>
      <div className="h-screen">
        <div className="flex h-full flex-col items-center justify-center gap-y-4">
          <div className="text-xl font-semibold">OnChainPromptPay</div>
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </Container>
  )
}
