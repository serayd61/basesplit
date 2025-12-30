# 🔷 BaseSplit - Revenue Sharing Protocol on Base

<div align="center">

![BaseSplit Banner](https://via.placeholder.com/800x200/0052FF/ffffff?text=BaseSplit)

**The simplest way to share revenue on-chain**

[![Built on Base](https://img.shields.io/badge/Built%20on-Base-0052FF?style=for-the-badge&logo=ethereum)](https://base.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://ethproject.vercel.app)

[🌐 Live Demo](https://ethproject.vercel.app) • [📜 Contracts](#-smart-contracts) • [🚀 Getting Started](#-quick-start)

</div>

---

## 🚀 Overview

BaseSplit is a decentralized revenue sharing protocol built on Base L2. Create NFT-based revenue splits, automatically distribute earnings to collaborators, and pay your team instantly with minimal gas fees.

### Key Features

- **🎯 Automatic Distribution** - Funds are automatically split among holders based on share percentages
- **🖼️ NFT-Based Shares** - Each share is an ERC-721 NFT, making ownership transferable and tradeable
- **🔒 Secure & Audited** - Built with battle-tested OpenZeppelin contracts
- **⚡ Low Gas on Base** - Minimal transaction costs leveraging Base L2
- **👥 Unlimited Holders** - Add up to 100 recipients per split
- **📊 Real-time Analytics** - Track distributions and historical payouts

---

## 🔗 Deployed Contracts (Base Mainnet)

| Contract | Address | Basescan |
|----------|---------|----------|
| **BaseSplit** | `0x73e583B16F90190E1A69f8f4772a14BAadDdC96A` | [View](https://basescan.org/address/0x73e583B16F90190E1A69f8f4772a14BAadDdC96A) |
| **Factory** | `0xF7DB9dbC56edBD1b2bB67E5eC00f03397EA6299f` | [View](https://basescan.org/address/0xF7DB9dbC56edBD1b2bB67E5eC00f03397EA6299f) |

---

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/basesplit-protocol.git
cd basesplit-protocol

# Install dependencies
npm install

# Copy environment template
cp env.template .env

# Add your configuration to .env
```

### Development

```bash
# Compile smart contracts
npm run compile

# Run tests
npm run test

# Start frontend development server
npm run dev
```

### Deployment

```bash
# Deploy to Base Sepolia (testnet)
npm run deploy:base-sepolia

# Deploy to Base Mainnet
npm run deploy:base

# Verify contracts on Basescan
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

---

## 🏗️ Architecture

```
basesplit-protocol/
├── contracts/              # Solidity smart contracts
│   ├── BaseSplit.sol       # Main protocol contract
│   └── BaseSplitFactory.sol # Factory for creating protocols
├── app/                    # Next.js 14 frontend
│   ├── page.tsx            # Main landing page
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # Web3 providers
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── Header.tsx          
│   ├── HeroSection.tsx     
│   ├── FeaturesSection.tsx 
│   ├── CreateSplitModal.tsx
│   ├── SplitCard.tsx       
│   ├── Stats.tsx           
│   └── Footer.tsx          
├── lib/                    # Utilities and hooks
│   ├── contracts.ts        # Contract ABIs and addresses
│   └── hooks.ts            # Custom React hooks
├── scripts/                # Deployment scripts
│   └── deploy.ts           
├── test/                   # Contract tests
│   └── BaseSplit.test.ts   
└── hardhat.config.ts       # Hardhat configuration
```

---

## 📜 Smart Contracts

### BaseSplit.sol

The main protocol contract that handles:

- **Creating Splits**: Define holders and their share percentages
- **Receiving Funds**: Accept ETH deposits to splits
- **Distributing Funds**: Automatically split funds among holders
- **NFT Minting**: Each share is represented as an ERC-721 token

```solidity
// Create a new revenue split
function createSplit(
    string calldata _name,
    address[] calldata _holders,
    uint256[] calldata _shares
) external returns (uint256)

// Deposit funds to a split
function deposit(uint256 _splitId) external payable

// Distribute pending funds
function distribute(uint256 _splitId) external
```

### BaseSplitFactory.sol

Factory contract for creating independent BaseSplit instances:

```solidity
// Create a new protocol instance
function createProtocol(string calldata _name) external payable returns (address)
```

---

## 🎨 Frontend

Built with:

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **RainbowKit** - Wallet connection
- **wagmi/viem** - Ethereum interactions

### Key Components

| Component | Description |
|-----------|-------------|
| `Header` | Navigation with wallet connect |
| `HeroSection` | Landing hero with CTA |
| `FeaturesSection` | Product features grid |
| `CreateSplitModal` | Modal for creating splits |
| `SplitCard` | Split display card |
| `Stats` | User statistics dashboard |

---

## 🔧 Configuration

### Environment Variables

```env
# Deployment
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_api_key

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASESPLIT_ADDRESS=0x...
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
```

### Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Base Mainnet | 8453 | https://mainnet.base.org |
| Base Sepolia | 84532 | https://sepolia.base.org |

---

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npx hardhat coverage

# Run specific test file
npx hardhat test test/BaseSplit.test.ts
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow Solidity style guide
- Use TypeScript strict mode
- Format with Prettier
- Lint with ESLint

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [basesplit.xyz](https://basesplit.xyz)
- **Documentation**: [docs.basesplit.xyz](https://docs.basesplit.xyz)
- **Twitter**: [@basesplit](https://twitter.com/basesplit)
- **Discord**: [discord.gg/basesplit](https://discord.gg/basesplit)

---

## 🙏 Acknowledgments

- [Base](https://base.org) - L2 network
- [OpenZeppelin](https://openzeppelin.com) - Secure contract library
- [RainbowKit](https://rainbowkit.com) - Wallet connection
- [Hardhat](https://hardhat.org) - Development environment

---

<div align="center">

**Built with 💙 on Base**

</div>

# Built with ❤️ on Base

