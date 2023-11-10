import { Address, useContractWrite, useWaitForTransaction } from 'wagmi'

import { IUsePrepareWriteParams, IUsePreparedWrite } from './interface'

import { Signature } from 'viem'
import { usePreparePaymentHandlerInitTransferRequest } from '../../../../../sdk/src'
import { useMemo } from 'react'
import { ContractKey, contracts } from '../../configs/contract'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

export interface InitTransferRequestCalldata {
  thbAmount: bigint
  exchangeRate: bigint
  deadline: bigint
  promptPayId: string
  zexSignature: Signature | undefined
}

const defaultInitTransferRequestCalldata: InitTransferRequestCalldata = {
  thbAmount: 0n,
  exchangeRate: 0n,
  deadline: 0n,
  promptPayId: '',
  zexSignature: undefined,
}

const defaultSignature: Signature = {
  v: 0n,
  r: '0x',
  s: '0x',
}

export const usePrepareCreateInitTransferRequest = ({
  calldata,
  onSuccess,
  onFail,
  enabled,
}: IUsePrepareWriteParams<InitTransferRequestCalldata>): IUsePreparedWrite => {
  const addRecentTransaction = useAddRecentTransaction()

  const { thbAmount, exchangeRate, deadline, promptPayId, zexSignature } =
    calldata ?? defaultInitTransferRequestCalldata

  const { v, r, s } = zexSignature ?? defaultSignature

  const _enabled = useMemo(() => {
    if (
      !enabled ||
      !thbAmount ||
      !exchangeRate ||
      !deadline ||
      !v ||
      !r ||
      !s ||
      !promptPayId
    )
      return false

    return true
  }, [enabled, v, r, s, thbAmount, exchangeRate, deadline, promptPayId])

  // prepare
  const { config: preparedConfig } =
    usePreparePaymentHandlerInitTransferRequest({
      address: contracts[ContractKey.PaymentHandler] as Address,
      args: [
        thbAmount,
        deadline,
        Number(exchangeRate),
        promptPayId,
        Number(v),
        r,
        s,
      ],
      enabled: _enabled,
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
    onSuccess: () => {
      onSuccess && onSuccess(),
        addRecentTransaction({
          hash: data?.hash ?? '0x00..0000',
          description: 'Init transfer request',
        })
    },
    onError: () => {
      onFail && onFail(),
        addRecentTransaction({
          hash: data?.hash ?? '0x00..0000',
          description: 'Init transfer request',
        })
    },
  })

  return {
    write: calldata && contractWrite ? () => contractWrite() : undefined,
    isLoading,
  }
}
