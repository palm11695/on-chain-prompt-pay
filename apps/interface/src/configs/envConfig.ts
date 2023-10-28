interface IENV {
  customEnv: string
  alchemyId: string
  defaultArbitrumRpcURL: string
  wssArbitrumRpcURL: string
  wagmiPollingInterval: number
}

const processEnv = import.meta.env

const envConfig: IENV = {
  customEnv: 'testnet',
  alchemyId: processEnv.ALCHEMY_ID || '_lB-1XEUQZaboGqTm_L-uaKNcBzGMev9',
  defaultArbitrumRpcURL: processEnv.VITE_DEFAULT_ARBITRUM_RPC_URL || '',
  wssArbitrumRpcURL: processEnv.VITE_WSS_ARBITRUM_RPC_URL || '',
  wagmiPollingInterval: Number(processEnv.VITE_WAGMI_POLLING_INTERVAL) || 10000,
}

export default envConfig
