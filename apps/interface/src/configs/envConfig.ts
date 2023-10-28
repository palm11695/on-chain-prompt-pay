interface IENV {
  customEnv: string
  alchemyId: string
  defaultArbitrumRpcURL: string
  wssArbitrumRpcURL: string
  wagmiPollingInterval: number
}

const env: IENV = {
  customEnv: 'testnet',
  alchemyId: process.env.ALCHEMY_ID || '_lB-1XEUQZaboGqTm_L-uaKNcBzGMev9',
  defaultArbitrumRpcURL: process.env.REACT_APP_DEFAULT_ARBITRUM_RPC_URL || '',
  wssArbitrumRpcURL: process.env.REACT_APP_WSS_ARBITRUM_RPC_URL || '',
  wagmiPollingInterval: Number(process.env.REACT_APP_WAGMI_POLLING_INTERVAL) || 10000,
}

export default env
