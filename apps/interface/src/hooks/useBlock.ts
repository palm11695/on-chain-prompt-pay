import { useEffect, useMemo, useState } from 'react'
import { Block } from 'viem'

import { useBlockNumber, usePublicClient } from 'wagmi'

export const useBlock = (): Block | undefined => {
  // hooks
  const provider = usePublicClient()
  const { data: blockNumber } = useBlockNumber({
    staleTime: Infinity,
  })

  const tick = useMemo(() => {
    return Math.floor(Number((blockNumber || BigInt(0)) / BigInt(120)))
  }, [blockNumber])

  // states
  const [block, setBlock] = useState<Block | undefined>(undefined)

  useEffect(() => {
    ;(async () => {
      const block: Block = await provider.getBlock()

      setBlock(block)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, provider, setBlock])

  return block
}
