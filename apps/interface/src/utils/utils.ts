import { ReceiverType } from '../pages/Reader/QrCodeReader'

const phoneRegex = /01130066(\d{9})/
const idCardRegex = /0213(\d{13})/
const eWalletRegex = /0315(\d{15})/
const amountRegex = /54\d{1,9}\.\d{2}/

interface IRegrexes {
  type: ReceiverType
  regex: RegExp
}

const idRegexes: IRegrexes[] = [
  {
    type: ReceiverType.PromptPay,
    regex: phoneRegex,
  },
  {
    type: ReceiverType.ID_Card,
    regex: idCardRegex,
  },
  {
    type: ReceiverType.E_Wallet,
    regex: eWalletRegex,
  },
]

export const parseAddressFromEncryptedWallet = (encryptedWallet: string) => {
  return encryptedWallet ? `0x${JSON.parse(encryptedWallet).address}` : ''
}

export const middleEllipsis = (text: string): string => {
  return text.substr(0, 4) + '...' + text.substr(text.length - 4, text.length)
}

export const simplifyPromptPayAccount = (
  accountType: ReceiverType | undefined,
  value: string | undefined,
): string | undefined => {
  const parts = []
  if (accountType && value) {
    switch (accountType) {
      case ReceiverType.ID_Card: {
        const idIndices = [0, 1, 5, 10, 12, 13]

        for (let i = 0; i < idIndices.length; i++) {
          const start = idIndices[i]
          const end = idIndices[i + 1]
          if (end !== undefined) {
            parts.push(value.slice(start, end))
          }
        }
        break
      }
      case ReceiverType.PromptPay: {
        const mobileIndices = [0, 2, 5, 9]

        for (let i = 0; i < mobileIndices.length; i++) {
          const start = mobileIndices[i]
          const end = mobileIndices[i + 1]
          if (end !== undefined) {
            if (i === 0) parts.push('0' + value.slice(start, end))
            else parts.push(value.slice(start, end))
          }
        }
        break
      }
      default:
        return value
    }

    // if (accountType === ReceiverType.ID_Card) {
    //   const idIndices = [0, 1, 5, 10, 12, 13]

    //   for (let i = 0; i < idIndices.length; i++) {
    //     const start = idIndices[i]
    //     const end = idIndices[i + 1]
    //     if (end !== undefined) {
    //       parts.push(value.slice(start, end))
    //     }
    //   }
    // } else {
    //   const mobileIndices = [0, 2, 5, 9]

    //   for (let i = 0; i < mobileIndices.length; i++) {
    //     const start = mobileIndices[i]
    //     const end = mobileIndices[i + 1]
    //     if (end !== undefined) {
    //       if (i === 0) parts.push('0' + value.slice(start, end))
    //       else parts.push(value.slice(start, end))
    //     }
    //   }
    // }

    return parts.join('-')
  }

  return undefined
}

export const simplifyAmount = (amount?: string): string | undefined => {
  if (amount) {
    // amount sent here will be '54{0x-10}{0-9999999}.xx
    const simplifiedAmount = amount.slice(4)
    return simplifiedAmount
  }

  return undefined
}

export const etherDecimal = (decimal: number) => {
  return 10 ** decimal
}

export const denormalizeToE18Decimal = (amount: bigint, decimal: number) => {
  const exp = 18 - decimal
  return amount * BigInt(etherDecimal(exp))
}

export const normalizefromE18Decimal = (amount: bigint, decimal: number) => {
  const exp = 18 - decimal
  return amount / BigInt(etherDecimal(exp))
}

export enum QrErrorLabel {
  PromptPayIDNotFound = 'PromptPay ID Not Found.',
  AmountNotFound = 'Amount Not Found.',
  CantProcessQr = 'Cant Process QR Code.',
  Unknown = 'Something went wrong.',
}

export const getQrErrorLabel = (
  receiver: string | undefined,
  isError: boolean | undefined,
) => {
  if (isError) return buildQrErrorMessage(QrErrorLabel.CantProcessQr)
  if (!receiver) return buildQrErrorMessage(QrErrorLabel.PromptPayIDNotFound)

  return buildQrErrorMessage(QrErrorLabel.Unknown)
}

const buildQrErrorMessage = (label: QrErrorLabel): string => {
  return label + ' ' + 'Please try again'
}

export const parsePromptPay = (data: string) => {
  const { simplifiedAddress, receiverType } = idRegexes.reduce(
    (acc, idRegex) => {
      const match = data.match(idRegex.regex)
      if (match) {
        return {
          simplifiedAddress: simplifyPromptPayAccount(idRegex.type, match[1]),
          receiverType: idRegex.type,
        }
      }

      return acc
    },
    { simplifiedAddress: undefined, receiverType: undefined } as {
      simplifiedAddress: string | undefined
      receiverType: string | undefined
    },
  )

  let simplifiedAmount: string | undefined = undefined
  const amountMatch = data.match(amountRegex)
  if (amountMatch) simplifiedAmount = simplifyAmount(amountMatch[0])

  return {
    id: simplifiedAddress,
    amount: simplifiedAmount,
    type: receiverType,
  }
}
