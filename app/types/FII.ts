export interface PriceHistoryItem {
  date: string;
  price: number;
}

export interface DividendHistoryItem {
  month: string;
  value: number;
}

export interface FII {
  id: string;
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  dividend: number;
  dividendYield: number;
  patrimony: number;
  pvp: number;
  category: string;
  manager: string;
  description: string;
}

export interface FIIDetails extends FII {
  priceHistory: Array<PriceHistoryItem>;
  dividendHistory: Array<DividendHistoryItem>;
  composition: Array<{ label: string; value: number; color?: string }>;
  lastUpdate: string;
  assetValue: number;
  lastDividend: number;
  liquidPatrimony: number;
  dailyLiquidity: number;
  marketValue: number;
}
