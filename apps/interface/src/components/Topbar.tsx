import { ConnectButton } from '@rainbow-me/rainbowkit'

interface ITopbarProps {
  showButton?: boolean
  showTopbar?: boolean
}

export const Topbar = ({ showButton, showTopbar }: ITopbarProps) => {
  return (
    <>
      {showTopbar ? (
        <div className="flex h-fit w-full items-center justify-between bg-blue-600 px-4 py-3 text-xl font-bold text-white">
          zkPromptPay
          {showButton ? (
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted
                const connected = ready && account && chain
                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="rounded-xl bg-blue-500 p-2 text-sm"
                          >
                            Connect Wallet
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="rounded-xl bg-red-500 p-2 text-sm"
                          >
                            Wrong network
                          </button>
                        )
                      }
                      return (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            onClick={openChainModal}
                            style={{ display: 'flex', alignItems: 'center' }}
                            type="button"
                          >
                            {chain.hasIcon && (
                              <div className="rounded-xl bg-blue-500 p-2">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    className="h-5 w-5"
                                  />
                                )}
                              </div>
                            )}
                          </button>
                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="rounded-xl bg-blue-500 p-2 text-xs drop-shadow-xl"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>
          ) : (
            ''
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
