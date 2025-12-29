'use client'

import { motion } from 'framer-motion'

interface SplitCardProps {
  name: string
  splitId: number
  holders: number
  totalDistributed: string
  pending: string
  isActive: boolean
}

export function SplitCard({ 
  name, 
  splitId, 
  holders, 
  totalDistributed, 
  pending, 
  isActive 
}: SplitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-6 hover:border-base-blue/30 transition-all duration-300 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-lg font-semibold group-hover:gradient-text transition-all">
            {name}
          </h3>
          <p className="text-sm text-base-muted font-mono">
            Split #{splitId}
          </p>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActive 
            ? 'bg-base-success/20 text-base-success' 
            : 'bg-base-muted/20 text-base-muted'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-muted">Holders</span>
          <span className="font-medium">{holders}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-muted">Distributed</span>
          <span className="font-medium font-mono">{totalDistributed} ETH</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-base-muted">Pending</span>
          <span className="font-medium font-mono text-base-accent">{pending} ETH</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 btn-secondary text-sm py-2 rounded-lg">
          View
        </button>
        <button className="flex-1 btn-primary text-sm py-2 rounded-lg">
          Distribute
        </button>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-base opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}

