import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'BaseSplit - Revenue Sharing Protocol on Base',
  description: 'Split fees and rewards with collaborators on Base blockchain. Create NFT-based revenue splits instantly.',
  keywords: ['Base', 'Ethereum', 'DeFi', 'Revenue Sharing', 'NFT', 'Web3', 'Splits', 'Crypto', 'Smart Contracts'],
  authors: [{ name: 'serayd61', url: 'https://github.com/serayd61' }],
  creator: 'serayd61',
  metadataBase: new URL('https://ethproject.vercel.app'),
  openGraph: {
    title: 'BaseSplit - Revenue Sharing Protocol on Base',
    description: 'The simplest way to split revenue on-chain. Create NFT-based splits, distribute earnings automatically.',
    url: 'https://ethproject.vercel.app',
    siteName: 'BaseSplit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BaseSplit - Revenue Sharing on Base',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaseSplit - Revenue Sharing Protocol',
    description: 'Split fees and rewards with collaborators on Base blockchain',
    creator: '@serayd61',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
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


