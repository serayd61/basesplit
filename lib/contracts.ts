import { Abi } from 'viem'

// Base Mainnet Contract Addresses
export const CONTRACTS = {
  baseSplit: process.env.NEXT_PUBLIC_BASESPLIT_ADDRESS || '0x73e583B16F90190E1A69f8f4772a14BAadDdC96A',
  factory: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0xF7DB9dbC56edBD1b2bB67E5eC00f03397EA6299f',
} as const

export const BASESPLIT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'string', name: '_name', type: 'string' },
      { internalType: 'address[]', name: '_holders', type: 'address[]' },
      { internalType: 'uint256[]', name: '_shares', type: 'uint256[]' },
    ],
    name: 'createSplit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_splitId', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_splitId', type: 'uint256' }],
    name: 'distribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_splitId', type: 'uint256' },
      { internalType: 'address', name: '_holder', type: 'address' },
    ],
    name: 'getClaimable',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_splitId', type: 'uint256' }],
    name: 'getHolders',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'holder', type: 'address' },
          { internalType: 'uint256', name: 'shares', type: 'uint256' },
          { internalType: 'uint256', name: 'claimed', type: 'uint256' },
        ],
        internalType: 'struct BaseSplit.ShareHolder[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'splits',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'address', name: 'creator', type: 'address' },
      { internalType: 'uint256', name: 'totalShares', type: 'uint256' },
      { internalType: 'uint256', name: 'totalDistributed', type: 'uint256' },
      { internalType: 'uint256', name: 'pendingBalance', type: 'uint256' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'splitCounter',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDistributed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalFeesCollected',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'splitId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'address[]', name: 'holders', type: 'address[]' },
      { indexed: false, internalType: 'uint256[]', name: 'shares', type: 'uint256[]' },
    ],
    name: 'SplitCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'splitId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'FundsReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'splitId', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'fee', type: 'uint256' },
    ],
    name: 'FundsDistributed',
    type: 'event',
  },
] as const satisfies Abi

export const FACTORY_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'string', name: '_name', type: 'string' }],
    name: 'createProtocol',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllProtocols',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_creator', type: 'address' }],
    name: 'getProtocolsByCreator',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getProtocolCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'creationFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalProtocolsCreated',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'protocol', type: 'address' },
      { indexed: true, internalType: 'address', name: 'creator', type: 'address' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'SplitProtocolCreated',
    type: 'event',
  },
] as const satisfies Abi


