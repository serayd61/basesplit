'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { CreateSplitModal } from '@/components/CreateSplitModal'
import { SplitCard } from '@/components/SplitCard'
import { Stats } from '@/components/Stats'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { Footer } from '@/components/Footer'

export default function Home() {
  const { isConnected } = useAccount()
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <HeroSection onCreateClick={() => setShowCreateModal(true)} />
        
        {isConnected && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-7xl mx-auto px-6 py-16"
          >
            <Stats />
            
            <div className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-display font-bold">Your Splits</h2>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  + Create Split
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SplitCard 
                  name="Demo Split"
                  splitId={0}
                  holders={3}
                  totalDistributed="0.5"
                  pending="0.1"
                  isActive={true}
                />
              </div>
            </div>
          </motion.section>
        )}
        
        <FeaturesSection />
      </main>
      
      <Footer />
      
      {showCreateModal && (
        <CreateSplitModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

