'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CONTRACTS, BASESPLIT_ABI } from '@/lib/contracts'

export default function DashboardPage() {
  const { isConnected, address } = useAccount()
  const [selectedSplit, setSelectedSplit] = useState<number | null>(null)
  const [depositAmount, setDepositAmount] = useState('')

  // Read split counter
  const { data: splitCounter } = useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'splitCounter',
  })

  // Read total distributed
  const { data: totalDistributed } = useReadContract({
    address: CONTRACTS.baseSplit as `0x${string}`,
    abi: BASESPLIT_ABI,
    functionName: 'totalDistributed',
  })

  // Deposit
  const { writeContract: deposit, data: depositHash, isPending: isDepositing } = useWriteContract()
  const { isSuccess: depositSuccess } = useWaitForTransactionReceipt({ hash: depositHash })

  // Distribute
  const { writeContract: distribute, data: distributeHash, isPending: isDistributing } = useWriteContract()
  const { isSuccess: distributeSuccess } = useWaitForTransactionReceipt({ hash: distributeHash })

  const handleDeposit = (splitId: number) => {
    if (!depositAmount) return
    deposit({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'deposit',
      args: [BigInt(splitId)],
      value: BigInt(parseFloat(depositAmount) * 1e18),
    })
  }

  const handleDistribute = (splitId: number) => {
    distribute({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'distribute',
      args: [BigInt(splitId)],
    })
  }

  const stats = [
    {
      label: 'Total Splits',
      value: splitCounter?.toString() || '0',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Total Distributed',
      value: totalDistributed ? `${parseFloat(formatEther(totalDistributed)).toFixed(4)} ETH` : '0 ETH',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Protocol',
      value: 'BaseSplit',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-violet-500 to-purple-500',
    },
    {
      label: 'Network',
      value: 'Base',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-base-muted">Manage your splits and track distributions</p>
            </div>
            {isConnected && (
              <Link href="/create" className="btn-primary">
                + Create Split
              </Link>
            )}
          </div>

          {!isConnected ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-base-blue/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl font-semibold mb-3">Connect Your Wallet</h2>
              <p className="text-base-muted mb-6 max-w-md mx-auto">
                Connect your wallet to view your splits, track earnings, and manage distributions.
              </p>
              <ConnectButton />
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} p-2.5`}>
                        <div className="text-white">{stat.icon}</div>
                      </div>
                    </div>
                    <div className="font-display text-2xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-base-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deposit */}
                  <div className="p-4 rounded-xl bg-base-bg border border-base-border">
                    <h3 className="font-medium mb-3">Deposit to Split</h3>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={selectedSplit ?? ''}
                        onChange={e => setSelectedSplit(parseInt(e.target.value) || 0)}
                        placeholder="Split ID"
                        className="input-field w-24"
                      />
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={e => setDepositAmount(e.target.value)}
                        placeholder="ETH amount"
                        step="0.001"
                        className="input-field flex-1"
                      />
                      <button
                        onClick={() => selectedSplit !== null && handleDeposit(selectedSplit)}
                        disabled={isDepositing || !depositAmount || selectedSplit === null}
                        className="btn-primary px-4 disabled:opacity-50"
                      >
                        {isDepositing ? 'Depositing...' : 'Deposit'}
                      </button>
                    </div>
                    {depositSuccess && (
                      <p className="text-sm text-base-success mt-2">✓ Deposit successful!</p>
                    )}
                  </div>

                  {/* Distribute */}
                  <div className="p-4 rounded-xl bg-base-bg border border-base-border">
                    <h3 className="font-medium mb-3">Distribute Funds</h3>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={selectedSplit ?? ''}
                        onChange={e => setSelectedSplit(parseInt(e.target.value) || 0)}
                        placeholder="Split ID"
                        className="input-field flex-1"
                      />
                      <button
                        onClick={() => selectedSplit !== null && handleDistribute(selectedSplit)}
                        disabled={isDistributing || selectedSplit === null}
                        className="btn-secondary px-6 disabled:opacity-50"
                      >
                        {isDistributing ? 'Distributing...' : 'Distribute'}
                      </button>
                    </div>
                    {distributeSuccess && (
                      <p className="text-sm text-base-success mt-2">✓ Distribution complete!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-display text-xl font-semibold mb-4">Contract Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-base-bg">
                    <div>
                      <p className="text-sm text-base-muted mb-1">BaseSplit Contract</p>
                      <p className="font-mono text-sm">{CONTRACTS.baseSplit}</p>
                    </div>
                    <a
                      href={`https://basescan.org/address/${CONTRACTS.baseSplit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      View on Basescan
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-base-bg">
                    <div>
                      <p className="text-sm text-base-muted mb-1">Factory Contract</p>
                      <p className="font-mono text-sm">{CONTRACTS.factory}</p>
                    </div>
                    <a
                      href={`https://basescan.org/address/${CONTRACTS.factory}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      View on Basescan
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

