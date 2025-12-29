import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'BaseSplit - Revenue Sharing Protocol on Base',
  description: 'Split fees and rewards with collaborators on Base blockchain. Create NFT-based revenue splits instantly.',
  keywords: ['Base', 'Ethereum', 'DeFi', 'Revenue Sharing', 'NFT', 'Web3', 'Splits'],
  openGraph: {
    title: 'BaseSplit - Revenue Sharing Protocol',
    description: 'Split fees and rewards with collaborators on Base',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&f[]=general-sans@500,400&display=swap" 
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-base-bg text-base-text font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}


