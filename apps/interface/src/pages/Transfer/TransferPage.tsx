import Button from '../../components/Button'
import Container from '../../components/Container'

const TransferPage = () => {
  return (
    <Container>
      <div className="text-xl font-semibold">Transfer</div>

      <div className="h-6" />

      <div className="font-semibold">From</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>Spending wallet</div>
          <div className="text-sm text-slate-400">0xc0ff...4979</div>
        </div>
        <div className="text-right">
          <div>63,000.00฿</div>
          <div className="text-sm text-slate-400">1 ETH</div>
        </div>
      </div>

      <div className="h-6" />

      <div className="font-semibold">To</div>
      <div className="h-2" />
      <div className="flex items-center justify-between">
        <div>
          <div>089-123-4567</div>
          <div className="text-sm text-slate-400">PromptPay</div>
        </div>
      </div>

      <div className="h-6" />

      <div className="font-semibold">Amount</div>
      <div className="relative border-b border-slate-300 focus-within:border-blue-400">
        <input
          className="w-full bg-transparent pr-4 text-right text-lg outline-none"
          placeholder="0.00"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-0.5 text-lg">
          ฿
        </div>
      </div>
      <div className="h-1" />
      <div className="w-full text-right text-sm text-slate-400">~ 0.00 ETH</div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col gap-y-1.5 px-4 pb-4">
        <Button>Confirm and Pay</Button>
        <Button variant="danger">Cancel</Button>
      </div>
    </Container>
  )
}

export default TransferPage
