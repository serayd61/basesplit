'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CONTRACTS, BASESPLIT_ABI } from '@/lib/contracts'

interface Holder {
  address: string
  shares: string
}

export default function CreatePage() {
  const { isConnected, address } = useAccount()
  const [name, setName] = useState('')
  const [holders, setHolders] = useState<Holder[]>([
    { address: '', shares: '50' },
    { address: '', shares: '50' },
  ])

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const addHolder = () => {
    setHolders([...holders, { address: '', shares: '0' }])
  }

  const removeHolder = (index: number) => {
    if (holders.length > 2) {
      setHolders(holders.filter((_, i) => i !== index))
    }
  }

  const updateHolder = (index: number, field: 'address' | 'shares', value: string) => {
    const updated = [...holders]
    updated[index][field] = value
    setHolders(updated)
  }

  const useMyAddress = (index: number) => {
    if (address) {
      updateHolder(index, 'address', address)
    }
  }

  const totalShares = holders.reduce((sum, h) => sum + (parseInt(h.shares) || 0), 0)

  const handleCreate = async () => {
    if (!name || totalShares !== 100) return

    const holderAddresses = holders.map(h => h.address as `0x${string}`)
    const shareAmounts = holders.map(h => BigInt(h.shares))

    writeContract({
      address: CONTRACTS.baseSplit as `0x${string}`,
      abi: BASESPLIT_ABI,
      functionName: 'createSplit',
      args: [name, holderAddresses, shareAmounts],
    })
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-base-muted mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Create Split</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-4xl font-bold mb-2">
              Create a <span className="gradient-text">Split</span>
            </h1>
            <p className="text-base-muted mb-8">
              Define how revenue should be shared among collaborators.
            </p>

            {!isConnected ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-base-blue/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-base-muted mb-6">You need to connect your wallet to create a split.</p>
                <ConnectButton />
              </div>
            ) : isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-base-success/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">Split Created! 🎉</h3>
                <p className="text-base-muted mb-4">Your revenue split has been created on Base.</p>
                <a 
                  href={`https://basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base-accent hover:underline text-sm font-mono"
                >
                  View on Basescan →
                </a>
                <div className="mt-6 flex gap-4 justify-center">
                  <Link href="/dashboard" className="btn-primary">
                    Go to Dashboard
                  </Link>
                  <button 
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Create Another
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card rounded-2xl p-8">
                {/* Form */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Split Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Band Revenue, Project Team, NFT Royalties"
                      className="input-field w-full"
                    />
                  </div>

                  {/* Holders */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Recipients & Shares</label>
                      <span className={`text-sm font-mono ${totalShares === 100 ? 'text-base-success' : 'text-base-warning'}`}>
                        Total: {totalShares}%
                      </span>
                    </div>

                    <div className="space-y-3">
                      {holders.map((holder, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-3"
                        >
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={holder.address}
                              onChange={e => updateHolder(index, 'address', e.target.value)}
                              placeholder="0x..."
                              className="input-field w-full font-mono text-sm pr-20"
                            />
                            <button
                              onClick={() => useMyAddress(index)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-base-accent hover:text-base-blue transition-colors"
                            >
                              Use mine
                            </button>
                          </div>
                          <div className="relative w-24">
                            <input
                              type="number"
                              value={holder.shares}
                              onChange={e => updateHolder(index, 'shares', e.target.value)}
                              min="0"
                              max="100"
                              className="input-field w-full pr-8 text-right"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-muted">
                              %
                            </span>
                          </div>
                          <button
                            onClick={() => removeHolder(index)}
                            disabled={holders.length <= 2}
                            className="w-12 h-12 rounded-xl bg-base-bg hover:bg-base-error/20 hover:text-base-error flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={addHolder}
                      className="mt-3 text-sm text-base-accent hover:text-base-blue transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Recipient
                    </button>
                  </div>

                  {/* Info box */}
                  <div className="p-4 rounded-xl bg-base-blue/10 border border-base-blue/20">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-base-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-base-muted">
                        <p className="mb-1">• Each recipient will receive an NFT representing their share</p>
                        <p className="mb-1">• Shares are transferable by transferring the NFT</p>
                        <p>• A 1% protocol fee applies to all distributions</p>
                      </div>
                    </div>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="p-4 rounded-xl bg-base-error/10 border border-base-error/20">
                      <p className="text-sm text-base-error">
                        {error.message.includes('User rejected') 
                          ? 'Transaction was rejected' 
                          : 'An error occurred. Please try again.'}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleCreate}
                    disabled={isPending || isConfirming || !name || totalShares !== 100}
                    className="btn-primary w-full py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isPending ? 'Confirm in wallet...' : 'Creating Split...'}
                      </>
                    ) : (
                      'Create Split'
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

