import { getContract, readContract, writeContract, prepareWriteContract, watchContractEvent } from 'wagmi/actions'

import { useContractRead, useContractWrite, usePrepareContractWrite, useContractEvent } from 'wagmi'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Counter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const counterABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'increment',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'number',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'setNumber',
    outputs: [],
  },
]

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
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
  },
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
]

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Core
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link counterABI}__.
 */
export function getCounter(config) {
  return getContract({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link counterABI}__.
 */
export function readCounter(config) {
  return readContract({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link counterABI}__.
 */
export function writeCounter(config) {
  return writeContract({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link counterABI}__.
 */
export function prepareWriteCounter(config) {
  return prepareWriteContract({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link getContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function getErc20(config) {
  return getContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link readContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function readErc20(config) {
  return readContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link writeContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function writeErc20(config) {
  return writeContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link prepareWriteContract}__ with `abi` set to __{@link erc20ABI}__.
 */
export function prepareWriteErc20(config) {
  return prepareWriteContract({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link watchContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function watchErc20Event(config, callback) {
  return watchContractEvent({ abi: erc20ABI, ...config }, callback)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__.
 */
export function useCounterRead(config = {}) {
  return useContractRead({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"number"`.
 */
export function useCounterNumber(config = {}) {
  return useContractRead({
    abi: counterABI,
    functionName: 'number',
    ...config,
  })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__.
 */
export function useCounterWrite(config = {}) {
  return useContractWrite({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"increment"`.
 */
export function useCounterIncrement(config = {}) {
  return useContractWrite({
    abi: counterABI,
    functionName: 'increment',
    ...config,
  })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"setNumber"`.
 */
export function useCounterSetNumber(config = {}) {
  return useContractWrite({
    abi: counterABI,
    functionName: 'setNumber',
    ...config,
  })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__.
 */
export function usePrepareCounterWrite(config = {}) {
  return usePrepareContractWrite({ abi: counterABI, ...config })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"increment"`.
 */
export function usePrepareCounterIncrement(config = {}) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'increment',
    ...config,
  })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link counterABI}__ and `functionName` set to `"setNumber"`.
 */
export function usePrepareCounterSetNumber(config = {}) {
  return usePrepareContractWrite({
    abi: counterABI,
    functionName: 'setNumber',
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read(config = {}) {
  return useContractRead({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance(config = {}) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'allowance',
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf(config = {}) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'balanceOf',
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals(config = {}) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'decimals',
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name(config = {}) {
  return useContractRead({ abi: erc20ABI, functionName: 'name', ...config })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol(config = {}) {
  return useContractRead({ abi: erc20ABI, functionName: 'symbol', ...config })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply(config = {}) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'totalSupply',
    ...config,
  })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write(config = {}) {
  return useContractWrite({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve(config = {}) {
  return useContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer(config = {}) {
  return useContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  })
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom(config = {}) {
  return useContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write(config = {}) {
  return usePrepareContractWrite({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(config = {}) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config,
  })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(config = {}) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config,
  })
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(config = {}) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config,
  })
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event(config = {}) {
  return useContractEvent({ abi: erc20ABI, ...config })
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(config = {}) {
  return useContractEvent({ abi: erc20ABI, eventName: 'Approval', ...config })
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(config = {}) {
  return useContractEvent({ abi: erc20ABI, eventName: 'Transfer', ...config })
}
