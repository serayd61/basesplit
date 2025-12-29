'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { CONTRACTS, BASESPLIT_ABI, FACTORY_ABI } from './contracts'

// Read hooks
export function useSplitCounter() {
  return useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'splitCounter',
  })
}

export function useSplit(splitId: bigint) {
  return useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'splits',
    args: [splitId],
  })
}

export function useSplitHolders(splitId: bigint) {
  return useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'getHolders',
    args: [splitId],
  })
}

export function useClaimable(splitId: bigint, holder: `0x${string}`) {
  return useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'getClaimable',
    args: [splitId, holder],
  })
}

export function useTotalDistributed() {
  return useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'totalDistributed',
  })
}

export function useProtocolCount() {
  return useReadContract({
    address: CONTRACTS.factory as `0x${string}`,
    abi: FACTORY_ABI,
    functionName: 'getProtocolCount',
  })
}

// Write hooks
export function useCreateSplit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const createSplit = async (
    name: string,
    holders: `0x${string}`[],
    shares: bigint[]
  ) => {
    writeContract({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'createSplit',
      args: [name, holders, shares],
    })
  }
  
  return {
    createSplit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useDeposit() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const deposit = async (splitId: bigint, amount: string) => {
    writeContract({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'deposit',
      args: [splitId],
      value: parseEther(amount),
    })
  }
  
  return {
    deposit,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useDistribute() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const distribute = async (splitId: bigint) => {
    writeContract({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'distribute',
      args: [splitId],
    })
  }
  
  return {
    distribute,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}

export function useCreateProtocol() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })
  
  const createProtocol = async (name: string, fee: string = '0.001') => {
    writeContract({
      address: CONTRACTS.factory as `0x${string}`,
      abi: FACTORY_ABI,
      functionName: 'createProtocol',
      args: [name],
      value: parseEther(fee),
    })
  }
  
  return {
    createProtocol,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  }
}


