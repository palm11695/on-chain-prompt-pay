import { Address, useContractWrite, useWaitForTransaction } from 'wagmi'

import { IUsePrepareWriteParams, IUsePreparedWrite } from './interface'

import { Signature } from 'viem'
import { usePreparePaymentHandlerInitTransferRequest } from '../../../../../sdk/src'
import { useMemo } from 'react'
import { ContractKey, contracts } from '../../configs/contract'

export interface InitTransferRequestCalldata {
  thbAmount: bigint
  exchangeRate: bigint
  deadline: bigint
  promptPayId: string
  verifiedMessage: Signature | undefined
}

const defaultInitTransferRequestCalldata: InitTransferRequestCalldata = {
  thbAmount: 0n,
  exchangeRate: 0n,
  deadline: 0n,
  promptPayId: '',
  verifiedMessage: undefined,
}

const defaultVerifiedMessage: Signature = {
  v: 0n,
  r: '0x',
  s: '0x',
}

export const usePrepareCreateInitTransferRequest = ({
  calldata,
  onSuccess,
  onFail,
  enabled = true,
}: IUsePrepareWriteParams<InitTransferRequestCalldata>): IUsePreparedWrite => {
  const { thbAmount, exchangeRate, deadline, promptPayId, verifiedMessage } =
    calldata ?? defaultInitTransferRequestCalldata

  const { v, r, s } = verifiedMessage ?? defaultVerifiedMessage

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
    onSuccess: onSuccess,
    onError: onFail,
  })

  return {
    write: calldata && contractWrite ? () => contractWrite() : undefined,
    isLoading,
  }
}
