import { Link } from 'react-router-dom'

const TopUpSpendingWallet = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="text-xl font-semibold">Topup Spending Wallet</div>

      <div className="h-8" />

      <div className="text-sm text-gray-600">
        Spending wallet is used to increase security and enable gasless
        transaction. You need to fund the spending wallet via funding portal to
        start using OnChainPromptPay.
      </div>

      <div className="h-12" />

      <Link to="/">
        <a className="text-xs text-gray-400 underline">or topup later</a>
      </Link>
    </div>
  )
}

export default TopUpSpendingWallet
