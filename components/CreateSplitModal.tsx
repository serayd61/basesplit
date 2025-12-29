'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CreateSplitModalProps {
  onClose: () => void
}

interface Holder {
  address: string
  shares: string
}

export function CreateSplitModal({ onClose }: CreateSplitModalProps) {
  const [name, setName] = useState('')
  const [holders, setHolders] = useState<Holder[]>([
    { address: '', shares: '50' },
    { address: '', shares: '50' },
  ])
  const [isCreating, setIsCreating] = useState(false)

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

  const totalShares = holders.reduce((sum, h) => sum + (parseInt(h.shares) || 0), 0)

  const handleCreate = async () => {
    setIsCreating(true)
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsCreating(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={e => e.stopPropagation()}
          className="glass-card rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">Create Split</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-base-bg hover:bg-base-border flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Split Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="My Revenue Split"
                className="input-field w-full"
              />
            </div>

            {/* Holders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Holders & Shares</label>
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
                    <input
                      type="text"
                      value={holder.address}
                      onChange={e => updateHolder(index, 'address', e.target.value)}
                      placeholder="0x..."
                      className="input-field flex-1 font-mono text-sm"
                    />
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
                Add Holder
              </button>
            </div>

            {/* Info box */}
            <div className="p-4 rounded-xl bg-base-blue/10 border border-base-blue/20">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-base-blue mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-base-muted">
                  <p className="mb-1">Each holder receives an NFT representing their share.</p>
                  <p>A 1% protocol fee applies to all distributions.</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleCreate}
              disabled={isCreating || !name || totalShares !== 100}
              className="btn-primary w-full py-4 rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Split...
                </>
              ) : (
                'Create Split'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

