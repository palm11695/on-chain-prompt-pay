import { SpenderType } from '../pages/Reader/QrCodeReader'

export const parseAddressFromEncryptedWallet = (encryptedWallet: string) => {
  return encryptedWallet ? `0x${JSON.parse(encryptedWallet).address}` : ''
}

export const middleEllipsis = (text: string): string => {
  return text.substr(0, 4) + '...' + text.substr(text.length - 4, text.length)
}

export const simplifyPromptPayAccount = (
  accountType: string,
  value?: string,
): string => {
  const parts = []
  if (value) {
    if (accountType === SpenderType.ID_Card.toString()) {
      const idIndices = [0, 1, 5, 10, 12, 13]

      for (let i = 0; i < idIndices.length; i++) {
        const start = idIndices[i]
        const end = idIndices[i + 1]
        if (end !== undefined) {
          parts.push(value.slice(start, end))
        }
      }
    } else {
      const mobileIndices = [0, 2, 5, 9]

      for (let i = 0; i < mobileIndices.length; i++) {
        const start = mobileIndices[i]
        const end = mobileIndices[i + 1]
        if (end !== undefined) {
          if (i === 0) parts.push('0' + value.slice(start, end))
          else parts.push(value.slice(start, end))
        }
      }
    }

    return parts.join('-')
  }

  return ''
}

export const simplifyAmount = (amount?: string) => {
  if (amount) {
    // amount sent here will be '54{0x-10}{0-9999999}.xx
    const simplifiedAmount = amount.slice(4)
    return simplifiedAmount
  }

  return '0.00'
}

export const etherDecimal = (decimal: number) => {
  return 10 ** decimal
}
