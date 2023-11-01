import { useMemo } from 'react'

import { useContractReads, erc20ABI, Address } from 'wagmi'
import { ITokenProfile } from '../configs/tokens'
import { ContractKeys, contracts } from '../configs/contract'
import { IContractBalanceMap, ITokenAllowanceMap } from '../types'

export const useBundleTokenStates = (
  tokens: ITokenProfile[],
  chainId: number,
  account?: string,
) => {
  const contractCalls = useMemo(() => {
    if (!account) return undefined

    return [
      ...tokens.map((token) => {
        return {
          address: token.address as Address,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [account],
          chainId,
        }
      }),
      ...tokens.flatMap((token) => {
        return ContractKeys.map((c) => {
          return {
            address: token.address as Address,
            abi: erc20ABI,
            functionName: 'allowance',
            args: [account, contracts[c]],
            chainId,
          }
        })
      }),
    ]
  }, [tokens, chainId, account])

  const { data, refetch } = useContractReads({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contracts: contractCalls as any[],
    onSuccess: () => {
      setTimeout(refetch, 15 * 1000)
    },
  })

  const tokenStates = useMemo(() => {
    if (!data || data.length === 0)
      return {
        tokenBalances: undefined,
        tokenAllowances: undefined,
      }

    const _data = data.map((c) => c.result)

    const balanceMap = tokens.reduce(
      (acc, token) => {
        return { ...acc, [token.displaySymbol]: _data.shift() as bigint }
      },
      {} as Record<string, bigint>,
    )
    const allowanceMap = tokens.reduce((acc, token) => {
      return {
        ...acc,
        [token.displaySymbol]: ContractKeys.reduce((acc, c) => {
          return { ...acc, [c]: _data.shift() as bigint }
        }, {} as IContractBalanceMap),
      }
    }, {} as ITokenAllowanceMap)

    return { tokenBalances: balanceMap, tokenAllowances: allowanceMap }
  }, [data])

  return {
    ...tokenStates,
    refetch,
  }
}
