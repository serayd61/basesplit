'use client'

import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'

interface HeroSectionProps {
  onCreateClick: () => void
}

export function HeroSection({ onCreateClick }: HeroSectionProps) {
  const { isConnected } = useAccount()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-base-blue/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-base-accent/15 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-base-success animate-pulse" />
            <span className="text-sm text-base-muted">Built on Base</span>
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Split Revenue
            <br />
            <span className="gradient-text">Effortlessly</span>
          </h1>

          <p className="text-xl text-base-muted max-w-2xl mx-auto mb-10">
            Create NFT-based revenue splits on Base. Automatically distribute earnings 
            to collaborators, creators, and teams with on-chain transparency.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isConnected ? (
              <motion.button
                onClick={onCreateClick}
                className="btn-primary text-lg px-8 py-4 rounded-2xl animate-pulse-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Split
              </motion.button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    onClick={openConnectModal}
                    className="btn-primary text-lg px-8 py-4 rounded-2xl animate-pulse-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Connect Wallet
                  </motion.button>
                )}
              </ConnectButton.Custom>
            )}
            
            <motion.a
              href="#features"
              className="btn-secondary text-lg px-8 py-4 rounded-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </div>

          {/* Stats preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { label: 'Total Splits', value: '1,234' },
              { label: 'Distributed', value: '156 ETH' },
              { label: 'Holders', value: '5.2K' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="font-display text-2xl md:text-3xl font-bold gradient-text"
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-base-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg 
          className="w-6 h-6 text-base-muted" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </motion.div>
    </section>
  )
}


