# Mock Trading Functionality for Morph Blockchain

This document describes the enhanced mock trading functionality implemented for the Liquidity Nigerian Stock Trading Platform, specifically designed for testing and demonstrating trading pair functionality on the Morph blockchain.

## 🎯 Overview

The mock trading system provides a comprehensive simulation of the DEX trading experience without requiring actual blockchain transactions. This is perfect for:

- **Testing**: Validate trading logic and UI components
- **Demonstrations**: Showcase platform capabilities to stakeholders
- **Development**: Rapid iteration without gas costs or network delays
- **User Onboarding**: Allow users to familiarize themselves with the platform

## 🏗️ Architecture

### Core Components

#### 1. MockTradingService (`/src/services/mock-trading-service.ts`)
- **Purpose**: Central service for all mock trading operations
- **Features**:
  - Simulated swap quotes with realistic price calculations
  - Mock balance management and tracking
  - Transaction simulation with success/failure scenarios
  - Persistent mock data across user sessions

#### 2. StockSelector (`/src/components/DEX/StockSelector.tsx`)
- **Purpose**: Enhanced stock selection component with logos and company information
- **Features**:
  - Visual stock selection with company logos
  - Grouped by sector for better organization
  - Real-time price display
  - Fallback handling for missing logos
  - TypeScript strict mode compliance

#### 3. MockTradingDemo (`/src/components/DEX/MockTradingDemo.tsx`)
- **Purpose**: Complete demo interface showcasing trading functionality
- **Features**:
  - Interactive buy/sell interface
  - Real-time swap quotes
  - Mock balance tracking
  - Transaction history
  - Reset functionality for testing

## 🚀 Features

### Enhanced Stock Display
- ✅ **Company Logos**: All Nigerian stocks display with their official logos
- ✅ **Company Information**: Full company names, sectors, and symbols
- ✅ **Price Display**: Current mock prices in NGN
- ✅ **Sector Grouping**: Stocks organized by business sector
- ✅ **Fallback Handling**: Graceful handling of missing logos

### Mock Trading Capabilities
- ✅ **Realistic Quotes**: Price calculations with slippage and fees
- ✅ **Balance Management**: Persistent mock balances across sessions
- ✅ **Transaction Simulation**: 95% success rate with realistic delays
- ✅ **Price Impact**: Simulated price impact based on trade size
- ✅ **Fee Calculation**: 0.3% trading fees applied to all swaps

### Network Support
- ✅ **Morph Holesky Testnet**: Primary testing network (Chain ID: 2810)
- ✅ **Morph Mainnet**: Production network support (Chain ID: 2818)
- ✅ **Multi-Network**: Automatic network detection and configuration
- ✅ **Network Display**: Proper network names instead of "Unknown Network"

## 🔧 Usage

### Basic Stock Selection
```tsx
import { StockSelector } from "@/components/DEX";

function TradingInterface() {
  const [selectedStock, setSelectedStock] = useState("");
  
  return (
    <StockSelector
      value={selectedStock}
      onValueChange={setSelectedStock}
      placeholder="Choose a stock to trade"
      useMockData={true}
    />
  );
}
```

### Mock Trading Service
```typescript
import { mockTradingService } from "@/services/mock-trading-service";

// Get available trading pairs
const pairs = await mockTradingService.getMockTradingPairs(chainId);

// Get swap quote
const quote = await mockTradingService.getMockSwapQuote(
  "NGN", 
  stockAddress, 
  "1000", 
  chainId
);

// Execute mock swap
const result = await mockTradingService.executeMockSwap(
  userAddress,
  "NGN",
  stockAddress,
  "1000",
  chainId
);
```

### Complete Demo Component
```tsx
import { MockTradingDemo } from "@/components/DEX";

function DEXPage() {
  return (
    <div>
      <MockTradingDemo />
    </div>
  );
}
```

## 📊 Supported Nigerian Stocks

The system includes all major Nigerian Stock Exchange (NGX) companies:

### Banking Sector
- **ZENITHBANK** - Zenith Bank Plc
- **GTCO** - Guaranty Trust Holding Company Plc
- **ACCESS** - Access Holdings Plc
- **UBA** - United Bank for Africa Plc
- **FBNH** - FBN Holdings Plc

### Telecommunications
- **MTNN** - MTN Nigeria Communications Plc
- **AIRTELAFRI** - Airtel Africa Plc

### Industrial Goods
- **DANGCEM** - Dangote Cement Plc
- **BUACEMENT** - BUA Cement Plc
- **WAPCO** - Lafarge Africa Plc

### Consumer Goods
- **NB** - Nigerian Breweries Plc
- **NESTLE** - Nestle Nigeria Plc
- **UNILEVER** - Unilever Nigeria Plc

### Oil & Gas
- **SEPLAT** - Seplat Energy Plc
- **TOTAL** - Total Energies Marketing Nigeria Plc

*And many more...*

## 🧪 Testing

### Running Tests
```bash
cd front-end
npm test MockTradingService.test.ts
```

### Test Coverage
- ✅ Trading pair retrieval
- ✅ Balance management
- ✅ Swap quote calculations
- ✅ Transaction execution
- ✅ Error handling
- ✅ Data persistence

## 🔧 Configuration

### Network Configuration
The system automatically detects and configures for supported networks:

```typescript
// Morph Holesky Testnet
chainId: 2810
name: "Morph Holesky Testnet"
rpc: "https://rpc-quicknode-holesky.morphl2.io"

// Morph Mainnet  
chainId: 2818
name: "Morph Mainnet"
rpc: "https://rpc-quicknode.morphl2.io"
```

### Mock Data Configuration
Mock prices and liquidity can be configured in the service:

```typescript
// Mock prices (NGN per stock token)
const mockPrices = {
  DANGCEM: "450.50",
  MTNN: "180.25",
  ZENITHBANK: "32.75",
  // ... more stocks
};
```

## 🚀 Deployment

### Development
```bash
cd front-end
npm run dev
```

### Production Build
```bash
cd front-end
npm run build
npm start
```

### Type Checking
```bash
cd front-end
npm run type-check
```

## 🔍 Troubleshooting

### Common Issues

1. **Stock list not showing**
   - Ensure `useMockData={true}` is set on StockSelector
   - Check network connection and chain ID
   - Verify contract addresses in `/src/abis/index.ts`

2. **Network showing as "Unknown"**
   - Check if Morph network is properly configured in RainbowKit
   - Verify chain ID matches expected values (2810 for testnet, 2818 for mainnet)

3. **Logos not displaying**
   - Ensure logo files exist in `/public/logo/png/`
   - Check fallback handling in StockSelector component
   - Verify image paths in stock-logos.ts mapping

### Debug Mode
Enable debug logging by setting:
```typescript
const DEBUG_MODE = true;
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Ensure TypeScript compliance
5. Submit a pull request

### Code Style
- Use TypeScript strict mode
- Follow existing component patterns
- Include comprehensive error handling
- Add tests for new functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Nigerian financial ecosystem on Morph blockchain**
