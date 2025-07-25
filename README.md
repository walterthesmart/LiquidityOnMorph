
# Liquidity - Nigerian Stock Trading Platform on Morph 🇳🇬

Liquidity is a decentralized stock trading platform built on **Morph blockchain** that allows users to trade tokenized stocks from the Nigerian Stock Exchange (NGX). The platform leverages Morph's high-performance Layer 2 infrastructure to provide a seamless, low-cost experience for Nigerian investors to buy and sell blue-chip stock tokens with modern DeFi capabilities.

## 🌐 Morph Blockchain Integration

The platform is specifically optimized for Morph's Layer 2 ecosystem, providing:

### Primary Networks
- **Morph Holesky Testnet** (Chain ID: 2810) - Primary development and testing network
- **Morph Mainnet** (Chain ID: 2818) - Production network for live trading

### Additional Network Support
- **Ethereum Sepolia Testnet** (Chain ID: 11155111) - Cross-chain testing environment
- **Bitfinity EVM** - Alternative EVM compatibility testing
- **Hedera Hashgraph** - Legacy implementation support

### Why Morph?
- **Ultra-Low Fees**: Significantly reduced transaction costs compared to Ethereum mainnet
- **High Throughput**: Fast transaction processing for seamless trading experience
- **EVM Compatibility**: Full Ethereum compatibility with enhanced performance
- **Decentralized Sequencer**: Enhanced security and decentralization
- **Optimistic Rollup**: Proven Layer 2 scaling solution

## 🚀 Key Features

### Morph-Optimized Capabilities
- **Morph Layer 2 Integration**: Ultra-fast, low-cost transactions on Morph's optimistic rollup
- **Decentralized Trading**: Fully decentralized stock token trading with Morph's security guarantees
- **Cross-Chain Compatibility**: Seamless bridging between Morph and Ethereum mainnet
- **Gas Optimization**: Smart contract optimizations specifically for Morph's fee structure

### Core Trading Features
- **Tokenized NGX Stocks**: Access to 30+ major Nigerian companies including Dangote Cement, MTN Nigeria, Zenith Bank
- **NGN Stablecoin**: Native Nigerian Naira stablecoin for seamless local currency trading
- **Automated Market Making**: Built-in DEX with automated liquidity provision
- **Real-time Price Feeds**: Live NGX stock prices and market data integration
- **Portfolio Management**: Comprehensive tracking of Nigerian stock holdings on Morph

### DeFi Integration
- **StockNGNDEX**: Native decentralized exchange for stock tokens
- **Liquidity Pools**: Earn fees by providing liquidity to stock/NGN trading pairs
- **Yield Farming**: Stake tokens to earn additional rewards
- **Trading Pair Management**: Automated rebalancing and liquidity optimization

### Security & Compliance
- **OpenZeppelin Standards**: Industry-standard security patterns and upgradeable contracts
- **Rate Limiting**: Advanced protection against spam and manipulation
- **Emergency Controls**: Circuit breakers and pause mechanisms for security
- **Role-Based Access**: Granular permissions for different user types

## 📈 Supported Nigerian Stocks

### Banking Sector
- **ZENITHBANK** - Zenith Bank Plc
- **GTCO** - Guaranty Trust Holding Company Plc
- **ACCESS** - Access Holdings Plc
- **UBA** - United Bank for Africa Plc
- **FBNH** - FBN Holdings Plc
- **STANBIC** - Stanbic IBTC Holdings Plc

### Industrial/Cement Sector
- **DANGCEM** - Dangote Cement Plc
- **BUACEMENT** - BUA Cement Plc
- **WAPCO** - Lafarge Africa Plc

### Telecommunications
- **MTNN** - MTN Nigeria Communications Plc
- **AIRTELAFRI** - Airtel Africa Plc

### Consumer Goods
- **NB** - Nigerian Breweries Plc
- **NESTLE** - Nestle Nigeria Plc
- **FLOURMILL** - Flour Mills of Nigeria Plc

### Oil & Gas
- **SEPLAT** - Seplat Energy Plc

## 🛠 Technology Stack

### Blockchain Infrastructure
- **Primary Blockchain**: Morph Layer 2 (Optimistic Rollup)
- **Smart Contracts**: Solidity 0.8.24 with OpenZeppelin standards
- **Development Framework**: Hardhat with TypeScript
- **Contract Verification**: Morph Explorer integration

### Frontend & Backend
- **Frontend**: Next.js 14 with TypeScript (Strict Mode)
- **Wallet Integration**: RainbowKit with wagmi for Morph connectivity
- **Database**: MongoDB with Nigerian stock market data
- **Authentication**: Clerk for user management
- **Styling**: Tailwind CSS with responsive design

### DeFi & Trading
- **DEX Protocol**: Custom StockNGNDEX with automated market making
- **Token Standards**: ERC-20 compliant stock tokens and NGN stablecoin
- **Liquidity Management**: Automated trading pair management
- **Price Oracles**: Real-time NGX price feed integration

### Payments & Integration
- **Nigerian Payments**: Paystack integration (cards, bank transfers, USSD)
- **Cross-Chain**: Morph-Ethereum bridge compatibility
- **Security**: Advanced rate limiting, emergency controls, and role-based access

## 🏗 Architecture

### Smart Contract Layer (Morph)
- **NGNStablecoin.sol**: Nigerian Naira stablecoin with minting controls
- **NigerianStockTokenFactory.sol**: Factory for deploying stock tokens
- **StockNGNDEX.sol**: Decentralized exchange for stock/NGN trading
- **TradingPairManager.sol**: Automated liquidity and pair management
- **NigerianStockToken.sol**: Individual stock token contracts with metadata

### DeFi Protocol Components
- **Automated Market Making**: Constant product formula with price impact protection
- **Liquidity Pools**: Stock/NGN trading pairs with fee collection
- **Yield Farming**: Staking rewards for liquidity providers
- **Price Oracle Integration**: Real-time NGX price feeds

### Backend Services
- **Morph RPC Integration**: Direct blockchain interaction via Morph nodes
- **Nigerian Stock Price Service**: Real-time NGX market data fetching
- **Payment Service**: Paystack integration for Naira on/off ramps
- **Cross-Chain Bridge**: Morph-Ethereum asset bridging support

### Frontend Components
- **Morph Wallet Manager**: RainbowKit integration for Morph network
- **DEX Trading Interface**: Swap stocks for NGN with slippage protection
- **Liquidity Management**: Add/remove liquidity from trading pairs
- **Portfolio Dashboard**: Real-time holdings and P&L tracking
- **Bridge Interface**: Cross-chain asset transfers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- Morph-compatible wallet (MetaMask, WalletConnect, etc.)
- Morph Holesky testnet ETH for gas fees
- Paystack Account (for Nigerian payment integration)
- Git for version control

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/LiquidityOnMorph.git
cd LiquidityOnMorph
```

2. **Install frontend dependencies:**
```bash
cd front-end
npm install
```

3. **Install contract dependencies:**
```bash
cd ../contracts
npm install
```

4. **Set up environment variables:**
```bash
# For contracts
cd contracts
cp .env.example .env

# For frontend
cd ../front-end
cp .env.example .env.local
```

5. **Configure your environment variables:**

**For contracts (`.env`):**
```env
# Morph Configuration
MORPH_PRIVATE_KEY=your_morph_private_key_here
MORPH_HOLESKY_RPC_URL=https://rpc-quicknode-holesky.morphl2.io
MORPH_MAINNET_RPC_URL=https://rpc-quicknode.morphl2.io

# Additional Networks (for testing)
SEPOLIA_PRIVATE_KEY=your_sepolia_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**For frontend (`.env.local`):**
```env
# Database
CONN_STRING=mongodb://localhost:27017/LiquidityMorph

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Morph Network Configuration
NEXT_PUBLIC_MORPH_HOLESKY_RPC_URL=https://rpc-quicknode-holesky.morphl2.io
NEXT_PUBLIC_MORPH_MAINNET_RPC_URL=https://rpc-quicknode.morphl2.io
NEXT_PUBLIC_MORPH_HOLESKY_CHAIN_ID=2810
NEXT_PUBLIC_MORPH_MAINNET_CHAIN_ID=2818

# Contract Addresses (update after deployment)
NEXT_PUBLIC_NGN_STABLECOIN_ADDRESS=your_ngn_contract_address
NEXT_PUBLIC_STOCK_FACTORY_ADDRESS=your_factory_contract_address
NEXT_PUBLIC_DEX_ADDRESS=your_dex_contract_address

# Paystack (Nigerian Payments)
PAYSTACK_URL=https://api.paystack.co
TEST_PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
LIVE_PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
```

6. **Add Morph network to your wallet:**
   - Network Name: Morph Holesky Testnet
   - RPC URL: https://rpc-quicknode-holesky.morphl2.io
   - Chain ID: 2810
   - Currency Symbol: ETH
   - Block Explorer: https://explorer-holesky.morphl2.io

7. **Get testnet ETH:**
   - Use Morph faucet or bridge ETH from Ethereum Sepolia
   - Visit: https://bridge-holesky.morphl2.io

8. **Start the development server:**
```bash
cd front-end
npm run dev
```

## 📝 Smart Contract Deployment on Morph

### Deploy to Morph Holesky Testnet

1. **Navigate to contracts directory:**
```bash
cd contracts
```

2. **Compile contracts:**
```bash
npm run compile
```

3. **Deploy to Morph Holesky:**
```bash
npx hardhat run scripts/deploy-morph.ts --network morph_holesky
```

4. **Verify contracts on Morph Explorer:**
```bash
npx hardhat verify --network morph_holesky <CONTRACT_ADDRESS>
```

### Deploy to Morph Mainnet

```bash
npx hardhat run scripts/deploy-morph.ts --network morph_mainnet
```

## 🌉 Cross-Chain Deployment & Utilities

The platform supports deployment across multiple networks with Morph as the primary chain.

### Morph-Specific Deployment Features

1. **Optimized Gas Usage:**
```bash
# Deploy with Morph-optimized gas settings
npx hardhat run scripts/deploy-morph.ts --network morph_holesky
```

2. **Contract Verification:**
```bash
# Verify on Morph Explorer
npx hardhat verify --network morph_holesky <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

3. **Morph Bridge Integration:**
```bash
# Test cross-chain functionality
npx hardhat run scripts/test-morph-bridge.ts --network morph_holesky
```

### Multi-Network Testing

```bash
# Deploy to Ethereum Sepolia for cross-chain testing
npm run deploy:sepolia

# Deploy NGN DEX system to multiple networks
npm run deploy:ngn-dex:testnet  # Morph Holesky
npm run deploy:ngn-dex:sepolia  # Ethereum Sepolia

# Test cross-chain compatibility
npm run test:deployment:morph
npm run test:deployment:sepolia
```

### Network Utilities

```bash
# Check Morph network status
npx hardhat run scripts/check-morph-network.ts --network morph_holesky

# Monitor gas prices across networks
npx hardhat run scripts/gas-monitor.ts

# Bridge assets between Ethereum and Morph
npx hardhat run scripts/bridge-assets.ts --network morph_holesky

# Create trading pairs on Morph
npm run create-pairs:morph
```

### Morph Faucet & Testing

```bash
# Get Morph testnet ETH
# Visit: https://bridge-holesky.morphl2.io

# Mint test NGN tokens
npx hardhat run scripts/mint-ngn.ts --network morph_holesky

# Test DEX functionality
npm run test:ngn-dex:morph
```

## 🔧 API Endpoints

### Nigerian Stocks API

- `GET /api/nigerian-stocks?action=stocks` - Get all Nigerian stocks
- `GET /api/nigerian-stocks?action=prices` - Get all stock prices
- `GET /api/nigerian-stocks?action=prices&symbol=DANGCEM` - Get specific stock price
- `GET /api/nigerian-stocks?action=market-stats` - Get market statistics
- `POST /api/nigerian-stocks` - Handle stock purchases and sales

### Example Usage

```javascript
// Fetch all Nigerian stocks
const response = await fetch('/api/nigerian-stocks?action=stocks');
const { data: stocks } = await response.json();

// Get Dangote Cement price
const priceResponse = await fetch('/api/nigerian-stocks?action=prices&symbol=DANGCEM');
const { data: price } = await priceResponse.json();

// Purchase stock
const purchaseResponse = await fetch('/api/nigerian-stocks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'purchase',
    userEmail: 'user@example.com',
    userWallet: '0.0.123456',
    stockSymbol: 'DANGCEM',
    sharesAmount: 100
  })
});
```

## 🔐 Security Features

- **Rate Limiting**: Prevents spam transactions
- **Blacklisting**: Admin can blacklist suspicious addresses
- **Emergency Stop**: Circuit breaker for emergency situations
- **Transaction Limits**: Daily and per-transaction limits
- **Access Control**: Role-based permissions
- **ReentrancyGuard**: Prevents reentrancy attacks

## 💰 Payment Integration

### Supported Payment Methods

- **Bank Cards**: Visa, Mastercard, Verve
- **Bank Transfer**: Direct bank transfers
- **USSD**: Mobile banking codes
- **Mobile Money**: Various mobile money providers
- **QR Codes**: Quick payment via QR scanning

### Nigerian Banks Supported

All major Nigerian banks are supported including:
- Access Bank, First Bank, GTBank, Zenith Bank, UBA, Stanbic IBTC, and more

## 📱 Morph Wallet Integration

### Supported Wallets

The application uses RainbowKit optimized for Morph network connectivity:

1. **MetaMask** - Add Morph network manually or via our integration
2. **WalletConnect** - Connect mobile wallets with Morph support
3. **Coinbase Wallet** - Full Morph network compatibility
4. **Rainbow Wallet** - Native Morph support
5. **Trust Wallet** - Mobile wallet with Morph integration
6. **And 100+ more** - RainbowKit supports all major EVM wallets

### Morph Network Auto-Configuration

```javascript
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

function MorphWalletConnection() {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const switchToMorph = () => {
    switchNetwork?.(2810); // Morph Holesky testnet
  };

  return (
    <div>
      <ConnectButton />
      {isConnected && (
        <div>
          <p>Connected: {address}</p>
          {chain?.id !== 2810 && (
            <button onClick={switchToMorph}>
              Switch to Morph Network
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

### Morph Network Configuration

The app automatically configures Morph network settings:
- **Chain ID**: 2810 (Holesky) / 2818 (Mainnet)
- **RPC URL**: Optimized Morph endpoints
- **Block Explorer**: Morph Explorer integration
- **Gas Settings**: Morph-optimized gas estimation

## 🧪 Testing

### Run Tests

```bash
# Frontend tests
cd front-end
npm test

# Smart contract tests
cd contracts
npm test

# Morph-specific tests
npm run test:morph

# Cross-chain integration tests
npm run test:cross-chain
```

### Test Coverage

```bash
# Generate coverage report
npm run test:coverage

# Coverage for Morph deployments
npm run coverage:morph
```

### Morph Network Testing

```bash
# Test Morph Holesky deployment
npx hardhat test --network morph_holesky

# Test gas optimization on Morph
npm run test:gas:morph

# Test bridge functionality
npm run test:bridge:morph
```

## 🚀 Production Deployment

### Frontend Deployment (Vercel)

1. **Connect repository to Vercel**
2. **Configure environment variables:**
   ```env
   # Morph Mainnet Configuration
   NEXT_PUBLIC_MORPH_MAINNET_RPC_URL=https://rpc-quicknode.morphl2.io
   NEXT_PUBLIC_MORPH_MAINNET_CHAIN_ID=2818

   # Production contract addresses
   NEXT_PUBLIC_NGN_STABLECOIN_ADDRESS=0x...
   NEXT_PUBLIC_STOCK_FACTORY_ADDRESS=0x...
   NEXT_PUBLIC_DEX_ADDRESS=0x...
   ```
3. **Deploy automatically on push to main branch**

### Smart Contract Deployment to Morph Mainnet

```bash
# Deploy to Morph Mainnet
npx hardhat run scripts/deploy-morph.ts --network morph_mainnet

# Verify contracts
npx hardhat verify --network morph_mainnet <CONTRACT_ADDRESS>

# Initialize trading pairs
npm run create-pairs:mainnet
```

### Production Monitoring

- **Morph Explorer**: https://explorer.morphl2.io
- **Contract Verification**: Automatic via Hardhat
- **Gas Optimization**: Morph's low-cost transactions
- **Uptime Monitoring**: Morph's high availability

## 📊 Monitoring & Analytics

### Market Data on Morph

- **Real-time NGX Prices**: Live stock price feeds integrated with Morph
- **Trading Volume**: Track volume across all stock/NGN pairs
- **Liquidity Metrics**: Monitor pool depths and utilization
- **Market Statistics**: Comprehensive market cap and trend analysis

### Morph Network Monitoring

- **Transaction Costs**: Ultra-low fees compared to Ethereum mainnet
- **Block Confirmation**: Fast finality with Morph's optimistic rollup
- **Network Health**: Real-time Morph network status monitoring
- **Bridge Activity**: Cross-chain asset movement tracking

### DeFi Analytics

- **DEX Performance**: Trading volume, fees collected, and slippage metrics
- **Liquidity Pools**: APY tracking and impermanent loss calculations
- **Yield Farming**: Staking rewards and distribution analytics
- **User Activity**: Active traders and liquidity providers on Morph

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **TypeScript Strict Mode**: Maintain type safety across the codebase
- **Morph Optimization**: Optimize contracts for Morph's gas model
- **Comprehensive Testing**: Test on both Morph Holesky and mainnet
- **Security Best Practices**: Follow OpenZeppelin standards
- **Cross-Chain Compatibility**: Ensure bridge functionality works correctly
- **Documentation**: Update docs for Morph-specific features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔗 Important Links

### Morph Blockchain
- [Morph Official Website](https://morphl2.io)
- [Morph Documentation](https://docs.morphl2.io)
- [Morph Holesky Explorer](https://explorer-holesky.morphl2.io)
- [Morph Mainnet Explorer](https://explorer.morphl2.io)
- [Morph Bridge](https://bridge-holesky.morphl2.io)

### Nigerian Financial Markets
- [Nigerian Stock Exchange](https://ngxgroup.com)
- [Central Bank of Nigeria](https://cbn.gov.ng)
- [Securities and Exchange Commission](https://sec.gov.ng)

### Development Tools
- [Paystack](https://paystack.com) - Nigerian payment processor
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat](https://hardhat.org) - Ethereum development environment
- [OpenZeppelin](https://openzeppelin.com) - Smart contract security

### Community & Support
- [Morph Discord](https://discord.gg/morphl2)
- [GitHub Repository](https://github.com/your-username/LiquidityOnMorph)
- [Project Documentation](./docs/)

---

**Made with ❤️ for Nigerian investors on Morph blockchain**
