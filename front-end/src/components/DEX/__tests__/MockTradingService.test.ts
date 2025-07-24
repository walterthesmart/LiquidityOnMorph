/**
 * Mock Trading Service Tests
 * 
 * Tests for the mock trading service functionality
 */

import { mockTradingService } from "@/services/mock-trading-service";

describe("MockTradingService", () => {
  const testChainId = 2810; // Morph Holesky Testnet
  const testUserAddress = "0x1234567890123456789012345678901234567890";

  beforeEach(() => {
    // Reset mock balances before each test
    mockTradingService.resetMockBalances(testUserAddress);
  });

  describe("getMockTradingPairs", () => {
    it("should return trading pairs for valid chain ID", async () => {
      const pairs = await mockTradingService.getMockTradingPairs(testChainId);
      
      expect(pairs).toBeDefined();
      expect(Array.isArray(pairs)).toBe(true);
      expect(pairs.length).toBeGreaterThan(0);
      
      // Check structure of first pair
      if (pairs.length > 0) {
        const pair = pairs[0];
        expect(pair).toHaveProperty("stockToken");
        expect(pair).toHaveProperty("symbol");
        expect(pair).toHaveProperty("name");
        expect(pair).toHaveProperty("companyName");
        expect(pair).toHaveProperty("sector");
        expect(pair).toHaveProperty("logoPath");
        expect(pair).toHaveProperty("currentPrice");
        expect(pair.isActive).toBe(true);
      }
    });

    it("should return empty array for invalid chain ID", async () => {
      const pairs = await mockTradingService.getMockTradingPairs(999999);
      expect(pairs).toEqual([]);
    });

    it("should return pairs sorted by symbol", async () => {
      const pairs = await mockTradingService.getMockTradingPairs(testChainId);
      
      if (pairs.length > 1) {
        for (let i = 1; i < pairs.length; i++) {
          expect(pairs[i].symbol.localeCompare(pairs[i - 1].symbol)).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  describe("getMockBalance", () => {
    it("should return mock balance for user", async () => {
      const balance = await mockTradingService.getMockBalance(
        testUserAddress,
        "0x1234567890123456789012345678901234567890"
      );
      
      expect(balance).toBeDefined();
      expect(typeof balance).toBe("string");
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
    });

    it("should return consistent balance for same inputs", async () => {
      const tokenAddress = "0x1234567890123456789012345678901234567890";
      
      const balance1 = await mockTradingService.getMockBalance(
        testUserAddress,
        tokenAddress
      );

      const balance2 = await mockTradingService.getMockBalance(
        testUserAddress,
        tokenAddress
      );
      
      expect(balance1).toBe(balance2);
    });
  });

  describe("getMockSwapQuote", () => {
    it("should return valid swap quote", async () => {
      const quote = await mockTradingService.getMockSwapQuote(
        "NGN",
        "STOCK",
        "1000"
      );
      
      expect(quote).toBeDefined();
      expect(quote).toHaveProperty("inputAmount", "1000");
      expect(quote).toHaveProperty("outputAmount");
      expect(quote).toHaveProperty("priceImpact");
      expect(quote).toHaveProperty("fee");
      expect(quote).toHaveProperty("minimumReceived");
      expect(quote).toHaveProperty("exchangeRate");
      
      // Validate numeric values
      expect(parseFloat(quote.outputAmount)).toBeGreaterThan(0);
      expect(parseFloat(quote.fee)).toBeGreaterThan(0);
      expect(parseFloat(quote.priceImpact)).toBeGreaterThanOrEqual(0);
      expect(parseFloat(quote.minimumReceived)).toBeGreaterThan(0);
      expect(parseFloat(quote.exchangeRate)).toBeGreaterThan(0);
    });

    it("should calculate fee correctly", async () => {
      const inputAmount = "1000";
      const quote = await mockTradingService.getMockSwapQuote(
        "NGN",
        "STOCK",
        inputAmount
      );
      
      const expectedFee = parseFloat(inputAmount) * 0.003; // 0.3% fee
      const actualFee = parseFloat(quote.fee);
      
      expect(actualFee).toBeCloseTo(expectedFee, 6);
    });
  });

  describe("executeMockSwap", () => {
    it("should execute successful mock swap", async () => {
      const result = await mockTradingService.executeMockSwap(
        testUserAddress,
        "NGN",
        "STOCK",
        "1000",
        testChainId
      );
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("success");
      expect(result).toHaveProperty("txHash");
      expect(result).toHaveProperty("message");
      
      if (result.success) {
        expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/);
        expect(result.message).toContain("successful");
      }
    });

    it("should update mock balances after swap", async () => {
      const inputToken = "NGN";
      const outputToken = "STOCK";
      const inputAmount = "1000";
      
      // Get initial balances
      const initialInputBalance = await mockTradingService.getMockBalance(
        testUserAddress,
        inputToken
      );

      const initialOutputBalance = await mockTradingService.getMockBalance(
        testUserAddress,
        outputToken
      );
      
      // Execute swap
      const result = await mockTradingService.executeMockSwap(
        testUserAddress,
        inputToken,
        outputToken,
        inputAmount,
        testChainId
      );
      
      if (result.success) {
        // Check that balances were updated
        const finalInputBalance = await mockTradingService.getMockBalance(
          testUserAddress,
          inputToken
        );

        const finalOutputBalance = await mockTradingService.getMockBalance(
          testUserAddress,
          outputToken
        );
        
        expect(parseFloat(finalInputBalance)).toBeLessThan(parseFloat(initialInputBalance));
        expect(parseFloat(finalOutputBalance)).toBeGreaterThan(parseFloat(initialOutputBalance));
      }
    });
  });

  describe("resetMockBalances", () => {
    it("should reset user balances", () => {
      // Add some mock balances
      mockTradingService.getMockBalances(testUserAddress);
      
      // Reset balances
      mockTradingService.resetMockBalances(testUserAddress);
      
      // Check that balances are empty
      const balances = mockTradingService.getMockBalances(testUserAddress);
      expect(balances).toEqual([]);
    });
  });

  describe("getMockBalances", () => {
    it("should return empty array for new user", () => {
      const balances = mockTradingService.getMockBalances(testUserAddress);
      expect(balances).toEqual([]);
    });

    it("should return balances after transactions", async () => {
      // Execute a mock swap to create balances
      await mockTradingService.executeMockSwap(
        testUserAddress,
        "NGN",
        "STOCK",
        "1000",
        testChainId
      );
      
      const balances = mockTradingService.getMockBalances(testUserAddress);
      expect(Array.isArray(balances)).toBe(true);
    });
  });
});
