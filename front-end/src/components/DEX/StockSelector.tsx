/**
 * Stock Selector Component
 *
 * Enhanced stock selection dropdown with logos, company names, and sectors.
 * Supports both real blockchain data and mock data for testing.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useChainId } from "wagmi";
import Image from "next/image";
import { Building2, TrendingUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  mockTradingService,
  MockTradingPair,
} from "@/services/mock-trading-service";
import { cn } from "@/lib/utils";

interface StockSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  useMockData?: boolean;
}

const StockSelector: React.FC<StockSelectorProps> = ({
  value,
  onValueChange,
  placeholder = "Choose a stock to trade",
  disabled = false,
  className = "",
  useMockData = true, // Default to mock data for testing
}) => {
  const chainId = useChainId();
  const [stocks, setStocks] = useState<MockTradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available stocks
  useEffect(() => {
    const loadStocks = async () => {
      if (!chainId) {
        setStocks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (useMockData) {
          const mockStocks =
            await mockTradingService.getMockTradingPairs(chainId);
          setStocks(mockStocks);
        } else {
          // TODO: Implement real blockchain data fetching
          // For now, fall back to mock data
          const mockStocks =
            await mockTradingService.getMockTradingPairs(chainId);
          setStocks(mockStocks);
        }
      } catch (err) {
        console.error("Error loading stocks:", err);
        setError("Failed to load stocks");
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, [chainId, useMockData]);

  // Get selected stock info
  const selectedStock = stocks.find((stock) => stock.stockToken === value);

  // Group stocks by sector
  const stocksBySector = stocks.reduce(
    (acc, stock) => {
      if (!acc[stock.sector]) {
        acc[stock.sector] = [];
      }
      acc[stock.sector].push(stock);
      return acc;
    },
    {} as Record<string, MockTradingPair[]>,
  );

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <Button variant="outline" className="w-full justify-between" disabled>
          <span className="flex items-center">
            <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse mr-2" />
            Loading stocks...
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <Button
          variant="outline"
          className="w-full justify-between border-red-200 text-red-600"
          disabled
        >
          <span className="flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            {error}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedStock && (
              <div className="flex items-center">
                <div className="relative w-6 h-6 mr-2 flex-shrink-0">
                  <Image
                    src={selectedStock.logoPath}
                    alt={selectedStock.symbol}
                    fill
                    className="object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/logo/png/logo-no-background.png";
                    }}
                  />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="font-medium text-sm truncate">
                    {selectedStock.symbol}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {selectedStock.companyName}
                  </span>
                </div>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {stocks.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">
                No stocks available
              </span>
            </div>
          ) : (
            Object.entries(stocksBySector).map(([sector, sectorStocks]) => (
              <div key={sector}>
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  {sector}
                </div>
                {sectorStocks.map((stock) => (
                  <SelectItem key={stock.stockToken} value={stock.stockToken}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="relative w-8 h-8 mr-3 flex-shrink-0">
                          <Image
                            src={stock.logoPath}
                            alt={stock.symbol}
                            fill
                            className="object-contain rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/logo/png/logo-no-background.png";
                            }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {stock.symbol}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              ₦{stock.currentPrice}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground truncate">
                            {stock.companyName}
                          </span>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StockSelector;
