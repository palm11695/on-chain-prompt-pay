import {
  getContract,
  GetContractArgs,
  readContract,
  ReadContractConfig,
  writeContract,
  WriteContractArgs,
  WriteContractPreparedArgs,
  WriteContractUnpreparedArgs,
  prepareWriteContract,
  PrepareWriteContractConfig,
} from '@wagmi/core'

import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import { ReadContractResult, WriteContractMode, PrepareWriteContractResult } from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PaymentHandler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const paymentHandlerABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_token', internalType: 'address', type: 'address' },
      { name: '_zkVerifier', internalType: 'address', type: 'address' },
      { name: '_dkimRegistry', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  { type: 'error', inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }], name: 'ECDSAInvalidSignatureS' },
  { type: 'error', inputs: [], name: 'PaymentHandler_InvalidParams' },
  { type: 'error', inputs: [], name: 'PaymentHandler_InvalidProof' },
  { type: 'error', inputs: [], name: 'PaymentHandler_InvalidSignal' },
  { type: 'error', inputs: [], name: 'PaymentHandler_KeyHashIsZero' },
  { type: 'error', inputs: [], name: 'PaymentHandler_NoTransferRequest' },
  { type: 'error', inputs: [], name: 'PaymentHandler_RequestIsLessThanOneDay' },
  { type: 'error', inputs: [], name: 'PaymentHandler_StaleExchangeRate' },
  { type: 'error', inputs: [], name: 'PaymentHandler_TransferRequestAlreadyConfirmed' },
  { type: 'error', inputs: [], name: 'PaymentHandler_Unauthorized' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'thbAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'exchangeRateBps', internalType: 'uint16', type: 'uint16', indexed: false },
      { name: 'promptPayId', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'TransferRequestInitiated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'BANK_DOMAIN',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MAX_BPS',
    outputs: [{ name: '', internalType: 'uint16', type: 'uint16' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_transferRequestId', internalType: 'uint256', type: 'uint256' }],
    name: 'cancelTransferRequest',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_transferRequestId', internalType: 'uint256', type: 'uint256' },
      { name: '_proof', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'confirmTransferRequest',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'dkimRegistry',
    outputs: [{ name: '', internalType: 'contract IDKIMRegistry', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_thbAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_rateExpiry', internalType: 'uint256', type: 'uint256' },
      { name: '_exchangeRateBps', internalType: 'uint16', type: 'uint16' },
      { name: '_promptPayId', internalType: 'string', type: 'string' },
      { name: '_v', internalType: 'uint8', type: 'uint8' },
      { name: '_r', internalType: 'bytes32', type: 'bytes32' },
      { name: '_s', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'initTransferRequest',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'reqId', internalType: 'uint256', type: 'uint256' }],
    name: 'isTransferRequestConfirmed',
    outputs: [{ name: 'isTransfered', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nextTransferRequestId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'publicKeyHashIndex',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'reservedBalances',
    outputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract ERC20', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'reqId', internalType: 'uint256', type: 'uint256' }],
    name: 'transferRequests',
    outputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'initTimestamp', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'thbAmount', internalType: 'uint256', type: 'uint256' },
      { name: 'promptPayId', internalType: 'string', type: 'string' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'zkVerifier',
    outputs: [{ name: '', internalType: 'contract ZKVerifier', type: 'address' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// erc20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
  },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'decimals', outputs: [{ name: '', type: 'uint8' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'name', outputs: [{ name: '', type: 'string' }] },
  { stateMutability: 'view', type: 'function', inputs: [], name: 'symbol', outputs: [{ name: '', type: 'string' }] },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function getPaymentHandler(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: paymentHandlerABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function readPaymentHandler<
  TAbi extends readonly unknown[] = typeof paymentHandlerABI,
  TFunctionName extends string = string,
>(config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return readContract({ abi: paymentHandlerABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function writePaymentHandler<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof paymentHandlerABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof paymentHandlerABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: paymentHandlerABI, ...config } as unknown as WriteContractArgs<
    typeof paymentHandlerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function prepareWritePaymentHandler<
  TAbi extends readonly unknown[] = typeof paymentHandlerABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: paymentHandlerABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function getErc20(config: Omit<GetContractArgs, 'abi'>) {
  return getContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function readErc20<TAbi extends readonly unknown[] = typeof erc20ABI, TFunctionName extends string = string>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>,
) {
  return readContract({ abi: erc20ABI, ...config } as unknown as ReadContractConfig<TAbi, TFunctionName>)
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function writeErc20<TFunctionName extends string>(
  config:
    | Omit<WriteContractPreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>
    | Omit<WriteContractUnpreparedArgs<typeof erc20ABI, TFunctionName>, 'abi'>,
) {
  return writeContract({ abi: erc20ABI, ...config } as unknown as WriteContractArgs<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function prepareWriteErc20<
  TAbi extends readonly unknown[] = typeof erc20ABI,
  TFunctionName extends string = string,
>(config: Omit<PrepareWriteContractConfig<TAbi, TFunctionName>, 'abi'>) {
  return prepareWriteContract({ abi: erc20ABI, ...config } as unknown as PrepareWriteContractConfig<
    TAbi,
    TFunctionName
  >)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function usePaymentHandlerRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: paymentHandlerABI, ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"BANK_DOMAIN"`.
 */
export function usePaymentHandlerBankDomain<
  TFunctionName extends 'BANK_DOMAIN',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({ abi: paymentHandlerABI, functionName: 'BANK_DOMAIN', ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"MAX_BPS"`.
 */
export function usePaymentHandlerMaxBps<
  TFunctionName extends 'MAX_BPS',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({ abi: paymentHandlerABI, functionName: 'MAX_BPS', ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"dkimRegistry"`.
 */
export function usePaymentHandlerDkimRegistry<
  TFunctionName extends 'dkimRegistry',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({ abi: paymentHandlerABI, functionName: 'dkimRegistry', ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"isTransferRequestConfirmed"`.
 */
export function usePaymentHandlerIsTransferRequestConfirmed<
  TFunctionName extends 'isTransferRequestConfirmed',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: paymentHandlerABI,
    functionName: 'isTransferRequestConfirmed',
    ...config,
  } as UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"nextTransferRequestId"`.
 */
export function usePaymentHandlerNextTransferRequestId<
  TFunctionName extends 'nextTransferRequestId',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: paymentHandlerABI,
    functionName: 'nextTransferRequestId',
    ...config,
  } as UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"publicKeyHashIndex"`.
 */
export function usePaymentHandlerPublicKeyHashIndex<
  TFunctionName extends 'publicKeyHashIndex',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: paymentHandlerABI,
    functionName: 'publicKeyHashIndex',
    ...config,
  } as UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"reservedBalances"`.
 */
export function usePaymentHandlerReservedBalances<
  TFunctionName extends 'reservedBalances',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: paymentHandlerABI,
    functionName: 'reservedBalances',
    ...config,
  } as UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"token"`.
 */
export function usePaymentHandlerToken<
  TFunctionName extends 'token',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({ abi: paymentHandlerABI, functionName: 'token', ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"transferRequests"`.
 */
export function usePaymentHandlerTransferRequests<
  TFunctionName extends 'transferRequests',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({
    abi: paymentHandlerABI,
    functionName: 'transferRequests',
    ...config,
  } as UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"zkVerifier"`.
 */
export function usePaymentHandlerZkVerifier<
  TFunctionName extends 'zkVerifier',
  TSelectData = ReadContractResult<typeof paymentHandlerABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof paymentHandlerABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return useContractRead({ abi: paymentHandlerABI, functionName: 'zkVerifier', ...config } as UseContractReadConfig<
    typeof paymentHandlerABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function usePaymentHandlerWrite<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof paymentHandlerABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof paymentHandlerABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof paymentHandlerABI, TFunctionName, TMode>({ abi: paymentHandlerABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"cancelTransferRequest"`.
 */
export function usePaymentHandlerCancelTransferRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof paymentHandlerABI, 'cancelTransferRequest'>['request']['abi'],
        'cancelTransferRequest',
        TMode
      > & { functionName?: 'cancelTransferRequest' }
    : UseContractWriteConfig<typeof paymentHandlerABI, 'cancelTransferRequest', TMode> & {
        abi?: never
        functionName?: 'cancelTransferRequest'
      } = {} as any,
) {
  return useContractWrite<typeof paymentHandlerABI, 'cancelTransferRequest', TMode>({
    abi: paymentHandlerABI,
    functionName: 'cancelTransferRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"confirmTransferRequest"`.
 */
export function usePaymentHandlerConfirmTransferRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof paymentHandlerABI, 'confirmTransferRequest'>['request']['abi'],
        'confirmTransferRequest',
        TMode
      > & { functionName?: 'confirmTransferRequest' }
    : UseContractWriteConfig<typeof paymentHandlerABI, 'confirmTransferRequest', TMode> & {
        abi?: never
        functionName?: 'confirmTransferRequest'
      } = {} as any,
) {
  return useContractWrite<typeof paymentHandlerABI, 'confirmTransferRequest', TMode>({
    abi: paymentHandlerABI,
    functionName: 'confirmTransferRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"initTransferRequest"`.
 */
export function usePaymentHandlerInitTransferRequest<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof paymentHandlerABI, 'initTransferRequest'>['request']['abi'],
        'initTransferRequest',
        TMode
      > & { functionName?: 'initTransferRequest' }
    : UseContractWriteConfig<typeof paymentHandlerABI, 'initTransferRequest', TMode> & {
        abi?: never
        functionName?: 'initTransferRequest'
      } = {} as any,
) {
  return useContractWrite<typeof paymentHandlerABI, 'initTransferRequest', TMode>({
    abi: paymentHandlerABI,
    functionName: 'initTransferRequest',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function usePreparePaymentHandlerWrite<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof paymentHandlerABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: paymentHandlerABI, ...config } as UsePrepareContractWriteConfig<
    typeof paymentHandlerABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"cancelTransferRequest"`.
 */
export function usePreparePaymentHandlerCancelTransferRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'cancelTransferRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: paymentHandlerABI,
    functionName: 'cancelTransferRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'cancelTransferRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"confirmTransferRequest"`.
 */
export function usePreparePaymentHandlerConfirmTransferRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'confirmTransferRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: paymentHandlerABI,
    functionName: 'confirmTransferRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'confirmTransferRequest'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link paymentHandlerABI}__ and `functionName` set to `"initTransferRequest"`.
 */
export function usePreparePaymentHandlerInitTransferRequest(
  config: Omit<
    UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'initTransferRequest'>,
    'abi' | 'functionName'
  > = {} as any,
) {
  return usePrepareContractWrite({
    abi: paymentHandlerABI,
    functionName: 'initTransferRequest',
    ...config,
  } as UsePrepareContractWriteConfig<typeof paymentHandlerABI, 'initTransferRequest'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link paymentHandlerABI}__.
 */
export function usePaymentHandlerEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof paymentHandlerABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: paymentHandlerABI, ...config } as UseContractEventConfig<
    typeof paymentHandlerABI,
    TEventName
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link paymentHandlerABI}__ and `eventName` set to `"TransferRequestInitiated"`.
 */
export function usePaymentHandlerTransferRequestInitiatedEvent(
  config: Omit<
    UseContractEventConfig<typeof paymentHandlerABI, 'TransferRequestInitiated'>,
    'abi' | 'eventName'
  > = {} as any,
) {
  return useContractEvent({
    abi: paymentHandlerABI,
    eventName: 'TransferRequestInitiated',
    ...config,
  } as UseContractEventConfig<typeof paymentHandlerABI, 'TransferRequestInitiated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi'> = {} as any) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'allowance', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'balanceOf', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'decimals', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'name', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'symbol', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>,
>(
  config: Omit<UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>, 'abi' | 'functionName'> = {} as any,
) {
  return useContractRead({ abi: erc20ABI, functionName: 'totalSupply', ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<TFunctionName extends string, TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({ abi: erc20ABI, ...config } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>, 'abi'> = {} as any,
) {
  return usePrepareContractWrite({ abi: erc20ABI, ...config } as UsePrepareContractWriteConfig<
    typeof erc20ABI,
    TFunctionName
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>, 'abi' | 'functionName'> = {} as any,
) {
  return usePrepareContractWrite({ abi: erc20ABI, functionName: 'approve', ...config } as UsePrepareContractWriteConfig<
    typeof erc20ABI,
    'approve'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>, 'abi' | 'functionName'> = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>, 'abi' | 'functionName'> = {} as any,
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof erc20ABI, TEventName>, 'abi'> = {} as any,
) {
  return useContractEvent({ abi: erc20ABI, ...config } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<UseContractEventConfig<typeof erc20ABI, 'Approval'>, 'abi' | 'eventName'> = {} as any,
) {
  return useContractEvent({ abi: erc20ABI, eventName: 'Approval', ...config } as UseContractEventConfig<
    typeof erc20ABI,
    'Approval'
  >)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<UseContractEventConfig<typeof erc20ABI, 'Transfer'>, 'abi' | 'eventName'> = {} as any,
) {
  return useContractEvent({ abi: erc20ABI, eventName: 'Transfer', ...config } as UseContractEventConfig<
    typeof erc20ABI,
    'Transfer'
  >)
}
