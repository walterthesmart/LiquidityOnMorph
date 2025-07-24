/**
 * Mock Trading Demo Component
 *
 * Demonstrates trading pair functionality with simulated data and interactions.
 * Perfect for testing and showcasing the DEX functionality without real blockchain transactions.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  CheckCircle,
  Wallet,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import StockSelector from "./StockSelector";
import {
  mockTradingService,
  MockSwapQuote,
} from "@/services/mock-trading-service";

interface MockTradingDemoProps {
  className?: string;
}

const MockTradingDemo: React.FC<MockTradingDemoProps> = ({
  className = "",
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  // Trading state
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [tradeDirection, setTradeDirection] = useState<"buy" | "sell">("buy");
  const [inputAmount, setInputAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [swapQuote, setSwapQuote] = useState<MockSwapQuote | null>(null);

  // Mock balances
  const [ngnBalance, setNgnBalance] = useState("10000.00");
  const [stockBalance, setStockBalance] = useState("0.00");

  // Demo state
  const [transactionHistory, setTransactionHistory] = useState<
    Array<{
      id: string;
      type: "buy" | "sell";
      inputAmount: string;
      outputAmount: string;
      timestamp: string;
      status: string;
    }>
  >([]);

  // Get swap quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!selectedStock || !inputAmount || !chainId) {
        setSwapQuote(null);
        return;
      }

      try {
        const inputToken = tradeDirection === "buy" ? "NGN" : selectedStock;
        const outputToken = tradeDirection === "buy" ? selectedStock : "NGN";

        const quote = await mockTradingService.getMockSwapQuote(
          inputToken,
          outputToken,
          inputAmount,
        );

        setSwapQuote(quote);
      } catch (error) {
        console.error("Error getting quote:", error);
        setSwapQuote(null);
      }
    };

    const timeoutId = setTimeout(getQuote, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [selectedStock, inputAmount, tradeDirection, chainId]);

  // Execute mock swap
  const handleSwap = async () => {
    if (!selectedStock || !inputAmount || !address || !chainId) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const inputToken = tradeDirection === "buy" ? "NGN" : selectedStock;
      const outputToken = tradeDirection === "buy" ? selectedStock : "NGN";

      const result = await mockTradingService.executeMockSwap(
        address,
        inputToken,
        outputToken,
        inputAmount,
        chainId,
      );

      if (result.success) {
        // Update mock balances
        if (tradeDirection === "buy") {
          setNgnBalance((prev) =>
            (parseFloat(prev) - parseFloat(inputAmount)).toFixed(2),
          );
          setStockBalance((prev) =>
            (
              parseFloat(prev) + parseFloat(swapQuote?.outputAmount || "0")
            ).toFixed(2),
          );
        } else {
          setStockBalance((prev) =>
            (parseFloat(prev) - parseFloat(inputAmount)).toFixed(2),
          );
          setNgnBalance((prev) =>
            (
              parseFloat(prev) + parseFloat(swapQuote?.outputAmount || "0")
            ).toFixed(2),
          );
        }

        // Add to transaction history
        setTransactionHistory((prev) => [
          {
            id: result.txHash,
            type: tradeDirection,
            inputAmount,
            outputAmount: swapQuote?.outputAmount || "0",
            timestamp: new Date().toISOString(),
            status: "success",
          },
          ...prev.slice(0, 9),
        ]); // Keep last 10 transactions

        toast.success(result.message);
        setInputAmount("");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Mock swap failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset demo data
  const resetDemo = () => {
    setNgnBalance("10000.00");
    setStockBalance("0.00");
    setTransactionHistory([]);
    setInputAmount("");
    setSelectedStock("");
    mockTradingService.resetMockBalances(address || "");
    toast.success("Demo data reset!");
  };

  if (!isConnected) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to try the mock trading demo
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Demo Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Mock Trading Demo
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Demo Mode</Badge>
              <Button variant="outline" size="sm" onClick={resetDemo}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This demo uses simulated data to showcase trading pair
            functionality. No real blockchain transactions are executed.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trading Interface */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowUpDown className="h-5 w-5 mr-2" />
                Mock Trading Interface
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stock Selection */}
              <div className="space-y-2">
                <Label>Select Stock Token</Label>
                <StockSelector
                  value={selectedStock}
                  onValueChange={setSelectedStock}
                  placeholder="Choose a stock to trade"
                  useMockData={true}
                />
              </div>

              {/* Trade Direction */}
              <Tabs
                value={tradeDirection}
                onValueChange={(value: string) =>
                  setTradeDirection(value as "buy" | "sell")
                }
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="flex items-center">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    Sell
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buy" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Amount (NGN)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: ₦{ngnBalance}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="sell" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Amount (Stock Tokens)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={inputAmount}
                      onChange={(e) => setInputAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available: {stockBalance} tokens
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Swap Quote */}
              {swapQuote && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>You will receive:</span>
                      <span className="font-medium">
                        {tradeDirection === "buy"
                          ? `${swapQuote.outputAmount} tokens`
                          : `₦${swapQuote.outputAmount}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Price Impact:</span>
                      <span className="text-yellow-600">
                        {swapQuote.priceImpact}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fee:</span>
                      <span>₦{swapQuote.fee}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Swap Button */}
              <Button
                onClick={handleSwap}
                disabled={!selectedStock || !inputAmount || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Executing Mock Swap...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Execute Mock Swap
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mock Balances */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mock Balances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">NGN:</span>
                <span className="font-medium">₦{ngnBalance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Stock Tokens:</span>
                <span className="font-medium">{stockBalance}</span>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactionHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No transactions yet
                </p>
              ) : (
                <div className="space-y-2">
                  {transactionHistory.slice(0, 5).map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded"
                    >
                      <div className="flex items-center">
                        {tx.type === "buy" ? (
                          <TrendingUp className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500 mr-2" />
                        )}
                        <span className="text-xs font-medium">
                          {tx.type === "buy" ? "Buy" : "Sell"}
                        </span>
                      </div>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MockTradingDemo;
