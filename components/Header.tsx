'use client'

import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-base flex items-center justify-center">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="w-6 h-6 text-white"
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-display font-bold text-xl">
            Base<span className="gradient-text">Split</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="/create" 
            className="text-base-muted hover:text-white transition-colors"
          >
            Create Split
          </Link>
          <Link 
            href="/dashboard" 
            className="text-base-muted hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <a 
            href="https://github.com/serayd61/basesplit" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-base-muted hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>

        <ConnectButton 
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </motion.header>
  )
}


