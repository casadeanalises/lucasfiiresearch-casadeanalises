"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Stock {
  symbol: string;
  price: number;
  change: number;
}

export default function StockTicker() {
  const [stocks, setStocks] = useState<Stock[]>([
    { symbol: "KNRI11", price: 111.50, change: -0.45 },
    { symbol: "HGLG11", price: 107.24, change: 0.42 },
    { symbol: "XPLG11", price: 91.84, change: 0.00 },
    { symbol: "VISC11", price: 100.90, change: 0.00 },
    { symbol: "HGRE11", price: 124.57, change: 1.46 },
    { symbol: "MXRF11", price: 9.70, change: -0.30 },
    { symbol: "BCFF11", price: 65.10, change: 0.20 },
    { symbol: "HSML11", price: 82.35, change: -0.15 },
 
  ]);


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  
  const formatChange = (change: number) => {
    return change > 0 ? `+${change}` : `${change}`;
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-900 py-3">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
      
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={`${stock.symbol}-${index}`}
            className="flex items-center gap-2"
          >
            <span className="font-medium text-white">{stock.symbol}</span>
            <span className="text-gray-300">{formatPrice(stock.price)}</span>
            <span
              className={`${
                stock.change > 0
                  ? "text-green-400"
                  : stock.change < 0
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              {formatChange(stock.change)}
            </span>
          </div>
        ))}
      </div>

   
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-900 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-900 to-transparent" />

     
      <button className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-white backdrop-blur-sm transition-all hover:bg-white/20">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1 text-white backdrop-blur-sm transition-all hover:bg-white/20">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
} 