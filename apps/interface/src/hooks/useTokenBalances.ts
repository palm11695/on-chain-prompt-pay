import { useMemo } from 'react'

import { useContractReads, erc20ABI, Address } from 'wagmi'
import { ITokenProfile } from '../configs/tokens'

export const useTokenBalances = (
  tokens: ITokenProfile[],
  chainId: number,
  account?: string,
) => {
  const contractCalls = useMemo(() => {
    if (!account) return undefined

    return tokens.map((token) => {
      return {
        address: token.address as Address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
        chainId,
      }
    })
  }, [tokens, chainId, account])

  const { data, refetch } = useContractReads({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contractCalls as any[],
    onSuccess: () => {
      setTimeout(refetch, 15 * 1000)
    },
  })

  return useMemo(() => {
    if (!data || data.length === 0) return undefined

    const _data = data.map((c) => c.result)

    return tokens.reduce(
      (acc, token) => {
        return { ...acc, [token.displaySymbol]: _data.shift() as bigint }
      },
      {} as Record<string, bigint>,
    )
  }, [data])
}
