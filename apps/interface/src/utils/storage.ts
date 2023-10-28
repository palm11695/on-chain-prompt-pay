export const parseStorageKey: (key: string) => string = (
  key: string,
): string => {
  return `onChainPromptPay_${key}_0.1.0` // fixed as of now
}
