import { useMemo } from 'react'

import { useContractReads, erc20ABI, Address } from 'wagmi'

export const useAssetBalances = (
  assets: Record<string, string>,
  chainId: number,
  account?: string,
) => {
  const contractCalls = useMemo(() => {
    if (!account) return undefined

    return Object.values(assets).map((address) => {
      return {
        address: address as Address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
        chainId,
      }
    })
  }, [assets, chainId, account])

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

    return Object.keys(assets).reduce(
      (acc, asset) => {
        return { ...acc, [asset]: _data.shift() as bigint }
      },
      {} as Record<string, bigint>,
    )
  }, [data])
}
