interface IENV {
  customEnv: string
  arbitrumRpcURL: string
  wagmiPollingInterval: number
}

const processEnv = import.meta.env

const envConfig: IENV = {
  customEnv: 'testnet',
  arbitrumRpcURL: processEnv.VITE_DEFAULT_ARBITRUM_RPC_URL || '',
  wagmiPollingInterval: Number(processEnv.VITE_WAGMI_POLLING_INTERVAL) || 10000,
}

export default envConfig
