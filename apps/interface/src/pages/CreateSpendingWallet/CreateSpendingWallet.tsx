import Button from '../../components/Button'
import Container from '../../components/Container'

const CreateSpendingWallet = () => {
  return (
    <Container>
      <div className="text-xl font-semibold">Create Spending Wallet</div>

      <div className="h-8" />

      <div>Enter pin</div>
      <div>Pin input here</div>

      <div className="h-12" />

      <Button>Continue</Button>
    </Container>
  )
}

export default CreateSpendingWallet
