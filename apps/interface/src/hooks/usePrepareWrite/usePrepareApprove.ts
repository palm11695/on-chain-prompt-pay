import {
  Address,
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'

import { IUsePrepareWriteParams, IUsePreparedWrite } from './interface'
import { ITokenProfile } from '../../configs/tokens'
import { zeroAddress } from 'viem'

export interface ApproveCalldata {
  asset: ITokenProfile | undefined
  spender: Address
  amount: bigint
}

const defaultApproveCalldata: ApproveCalldata = {
  asset: undefined,
  spender: '0x',
  amount: BigInt(0),
}

export const usePrepareApprove = ({
  calldata,
  onSuccess,
  onFail,
  enabled = true,
}: IUsePrepareWriteParams<ApproveCalldata>): IUsePreparedWrite => {
  const { asset, spender, amount } = calldata ?? defaultApproveCalldata

  // prepare
  const { config: preparedConfig } = usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    address: (asset?.address ?? zeroAddress) as Address,
    args: [spender, amount],
    enabled,
  })

  // confirm
  const {
    data,
    write: contractWrite,
    isLoading,
  } = useContractWrite({
    ...preparedConfig,
  })

  // wait for transaction
  useWaitForTransaction({
    hash: data?.hash,
    onSuccess: onSuccess,
    onError: onFail,
  })

  return {
    write: calldata && contractWrite ? () => contractWrite() : undefined,
    isLoading,
  }
}
