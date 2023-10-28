export const parseAddressFromEncryptedWallet = (encryptedWallet: string) => {
  return encryptedWallet ? `0x${JSON.parse(encryptedWallet).address}` : ''
}

export function middleEllipsis(text: string): string {
  return text.substr(0, 4) + '...' + text.substr(text.length - 4, text.length)
}
