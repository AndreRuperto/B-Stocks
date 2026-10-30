'use client';

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { CompanyLogo } from '@/components/company-logo';

export interface TickerStockItem {
  ticker: string;
  price: number;
  changePercent: number;
}

const FAMOUS_STOCKS: TickerStockItem[] = [
  { ticker: 'BBAS3', price: 16.06, changePercent: -2.02 },
  { ticker: 'PETR4', price: 38.20, changePercent: 1.45 },
  { ticker: 'VALE3', price: 62.50, changePercent: 0.80 },
  { ticker: 'ITUB4', price: 34.15, changePercent: 0.55 },
  { ticker: 'BBDC4', price: 14.20, changePercent: -0.65 },
  { ticker: 'WEGE3', price: 52.10, changePercent: 2.15 },
  { ticker: 'ABEV3', price: 12.80, changePercent: -0.40 },
  { ticker: 'RENT3', price: 44.90, changePercent: 1.10 },
  { ticker: 'TAEE11', price: 35.40, changePercent: 0.30 },
  { ticker: 'EGIE3', price: 42.60, changePercent: -0.25 },
  { ticker: 'PRIO3', price: 46.30, changePercent: 2.80 },
  { ticker: 'BBSE3', price: 36.90, changePercent: 0.90 },
  { ticker: 'CXSE3', price: 15.40, changePercent: 1.20 },
  { ticker: 'VIVT3', price: 51.20, changePercent: 0.40 },
  { ticker: 'CPLE6', price: 10.15, changePercent: 1.70 },
  { ticker: 'CSNA3', price: 12.40, changePercent: -1.80 },
  { ticker: 'RADL3', price: 26.70, changePercent: 0.60 },
  { ticker: 'SUZB3', price: 56.80, changePercent: -0.90 },
];

interface StockTickerCarouselProps {
  stocks?: TickerStockItem[];
}

export function StockTickerCarousel({ stocks = FAMOUS_STOCKS }: StockTickerCarouselProps) {
  const displayList = [...stocks, ...stocks];

  return (
    <div
      data-testid="stock-ticker-carousel"
      className="relative w-full overflow-hidden border-y border-zinc-800 bg-zinc-950 py-2.5"
      aria-label="Cotações em tempo real das principais ações da B3"
    >
      <div className="animate-ticker flex items-center gap-6">
        {displayList.map((item, index) => {
          const isPositive = item.changePercent >= 0;
          const formattedPrice = item.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
          const formattedChange = `${isPositive ? '+' : ''}${item.changePercent.toFixed(2).replace('.', ',')}%`;

          return (
            <div
              key={`${item.ticker}-${index}`}
              className="inline-flex items-center gap-2 rounded-md border border-zinc-800/80 bg-zinc-900/90 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-200 transition-colors hover:border-zinc-700"
            >
              <CompanyLogo
                ticker={item.ticker}
                size="sm"
                className="h-4 w-4 rounded-sm border-0 bg-transparent"
              />
              <span className="font-extrabold text-zinc-100">{item.ticker}</span>
              <span className="tabular-nums text-zinc-300">{formattedPrice}</span>
              <span
                className={`inline-flex items-center gap-0.5 tabular-nums text-[11px] font-bold ${
                  isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {formattedChange}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
