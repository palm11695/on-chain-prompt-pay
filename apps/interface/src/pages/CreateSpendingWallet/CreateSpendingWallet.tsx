import Button from '../../components/Button'

const CreateSpendingWallet = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-xl font-semibold">Create Spending Wallet</div>

      <div className="h-8" />

      <div>Enter pin</div>
      <div>Pin input here</div>

      <div className="h-12" />

      <Button>Continue</Button>
    </div>
  )
}

export default CreateSpendingWallet
