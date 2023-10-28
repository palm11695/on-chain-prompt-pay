export const parseAddressFromEncryptedWallet = (encryptedWallet: string) => {
  return encryptedWallet ? `0x${JSON.parse(encryptedWallet).address}` : ''
}
