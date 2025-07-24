/**
 * Mock Trading Service
 *
 * Provides mock/dummy trading functionality for testing purposes.
 * This service simulates swap operations without requiring actual blockchain transactions.
 */

import { getContractAddresses } from "@/abis";
import { getStockInfoByAddress } from "@/utils/dex-stock-mapping";

export interface MockBalance {
  address: string;
  symbol: string;
  balance: string;
  decimals: number;
}

export interface MockSwapQuote {
  inputAmount: string;
  outputAmount: string;
  priceImpact: string;
  fee: string;
  minimumReceived: string;
  exchangeRate: string;
}

export interface MockTradingPair {
  stockToken: string;
  symbol: string;
  name: string;
  companyName: string;
  sector: string;
  logoPath: string;
  ngnReserve: string;
  stockReserve: string;
  totalLiquidity: string;
  currentPrice: string;
  isActive: boolean;
}

class MockTradingService {
  private mockBalances: Map<string, MockBalance[]> = new Map();
  private mockPrices: Map<string, string> = new Map();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    // Initialize mock prices (NGN per stock token)
    const mockPrices = {
      DANGCEM: "450.50",
      MTNN: "180.25",
      ZENITHBANK: "32.75",
      GTCO: "28.90",
      ACCESS: "15.60",
      UBA: "12.45",
      FBNH: "18.30",
      NB: "85.20",
      NESTLE: "1250.00",
      SEPLAT: "2100.75",
      BUACEMENT: "95.40",
      AIRTELAFRI: "1850.30",
      WAPCO: "42.15",
      FLOURMILL: "38.60",
      TRANSCORP: "4.25",
      OKOMUOIL: "125.80",
      LIVESTOCK: "3.45",
      MAYBAKER: "6.75",
      FIDSON: "12.90",
      CWG: "2.85",
    };

    Object.entries(mockPrices).forEach(([symbol, price]) => {
      this.mockPrices.set(symbol, price);
    });
  }

  /**
   * Get available trading pairs for a specific chain
   */
  async getMockTradingPairs(chainId: number): Promise<MockTradingPair[]> {
    const contractAddresses = getContractAddresses(chainId);
    if (!contractAddresses?.tokens) {
      return [];
    }

    const pairs: MockTradingPair[] = [];

    Object.entries(contractAddresses.tokens).forEach(([symbol, address]) => {
      const stockInfo = getStockInfoByAddress(address, chainId);
      if (stockInfo) {
        const price = this.mockPrices.get(symbol) || "100.00";
        pairs.push({
          stockToken: address,
          symbol: stockInfo.symbol,
          name: stockInfo.name,
          companyName: stockInfo.companyName,
          sector: stockInfo.sector,
          logoPath: stockInfo.logoPath,
          ngnReserve: this.generateMockLiquidity("ngn"),
          stockReserve: this.generateMockLiquidity("stock"),
          totalLiquidity: this.generateMockLiquidity("total"),
          currentPrice: price,
          isActive: true,
        });
      }
    });

    return pairs.sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  /**
   * Get mock balance for a user
   */
  async getMockBalance(
    userAddress: string,
    tokenAddress: string,
  ): Promise<string> {
    const balances = this.mockBalances.get(userAddress) || [];
    const balance = balances.find(
      (b) => b.address.toLowerCase() === tokenAddress.toLowerCase(),
    );

    if (balance) {
      return balance.balance;
    }

    // Generate random mock balance
    const randomBalance = (Math.random() * 10000).toFixed(2);
    return randomBalance;
  }

  /**
   * Get mock swap quote
   */
  async getMockSwapQuote(
    inputToken: string,
    outputToken: string,
    inputAmount: string,
  ): Promise<MockSwapQuote> {
    // Simulate price calculation with some randomness
    const baseRate = Math.random() * 0.1 + 0.95; // 0.95 to 1.05
    const outputAmount = (parseFloat(inputAmount) * baseRate).toFixed(6);
    const fee = (parseFloat(inputAmount) * 0.003).toFixed(6); // 0.3% fee
    const priceImpact = (Math.random() * 2).toFixed(2); // 0-2% price impact
    const slippage = 0.05; // 5% slippage tolerance
    const minimumReceived = (parseFloat(outputAmount) * (1 - slippage)).toFixed(
      6,
    );

    return {
      inputAmount,
      outputAmount,
      priceImpact,
      fee,
      minimumReceived,
      exchangeRate: baseRate.toFixed(6),
    };
  }

  /**
   * Execute mock swap (for testing purposes)
   */
  async executeMockSwap(
    userAddress: string,
    inputToken: string,
    outputToken: string,
    inputAmount: string,
    chainId: number,
  ): Promise<{ success: boolean; txHash: string; message: string }> {
    // Suppress unused variable warning - chainId may be used for chain-specific logic in future
    void chainId;

    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate success/failure (95% success rate)
    const success = Math.random() > 0.05;

    if (success) {
      // Update mock balances
      this.updateMockBalance(userAddress, inputToken, inputAmount, "subtract");
      const quote = await this.getMockSwapQuote(
        inputToken,
        outputToken,
        inputAmount,
      );
      this.updateMockBalance(
        userAddress,
        outputToken,
        quote.outputAmount,
        "add",
      );

      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        message: "Mock swap executed successfully!",
      };
    } else {
      return {
        success: false,
        txHash: "",
        message:
          "Mock swap failed - insufficient liquidity (simulated failure)",
      };
    }
  }

  /**
   * Generate mock liquidity values
   */
  private generateMockLiquidity(type: "ngn" | "stock" | "total"): string {
    switch (type) {
      case "ngn":
        return (Math.random() * 1000000 + 100000).toFixed(2); // 100K - 1.1M NGN
      case "stock":
        return (Math.random() * 10000 + 1000).toFixed(2); // 1K - 11K tokens
      case "total":
        return (Math.random() * 500000 + 50000).toFixed(2); // 50K - 550K liquidity tokens
      default:
        return "0";
    }
  }

  /**
   * Update mock balance
   */
  private updateMockBalance(
    userAddress: string,
    tokenAddress: string,
    amount: string,
    operation: "add" | "subtract",
  ): void {
    const balances = this.mockBalances.get(userAddress) || [];
    const existingIndex = balances.findIndex(
      (b) => b.address.toLowerCase() === tokenAddress.toLowerCase(),
    );

    const currentAmount =
      existingIndex >= 0 ? parseFloat(balances[existingIndex].balance) : 0;
    const changeAmount = parseFloat(amount);
    const newAmount =
      operation === "add"
        ? currentAmount + changeAmount
        : Math.max(0, currentAmount - changeAmount);

    if (existingIndex >= 0) {
      balances[existingIndex].balance = newAmount.toFixed(6);
    } else {
      balances.push({
        address: tokenAddress,
        symbol: "UNKNOWN",
        balance: newAmount.toFixed(6),
        decimals: 18,
      });
    }

    this.mockBalances.set(userAddress, balances);
  }

  /**
   * Reset mock balances for testing
   */
  resetMockBalances(userAddress: string): void {
    this.mockBalances.delete(userAddress);
  }

  /**
   * Get all mock balances for a user
   */
  getMockBalances(userAddress: string): MockBalance[] {
    return this.mockBalances.get(userAddress) || [];
  }
}

// Export singleton instance
export const mockTradingService = new MockTradingService();
export default mockTradingService;
