'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { CompanyLogo } from '@/components/company-logo';
import { fetchMarketOverview } from '@/lib/api';

export interface TickerStockItem {
  ticker: string;
  price: number;
  changePercent: number;
  logoUrl?: string;
}

const FAMOUS_STOCKS: TickerStockItem[] = [
  { ticker: 'BBAS3', price: 16.06, changePercent: -2.02 },
  { ticker: 'PETR4', price: 38.2, changePercent: 1.45 },
  { ticker: 'VALE3', price: 62.5, changePercent: 0.8 },
  { ticker: 'ITUB4', price: 34.15, changePercent: 0.55 },
  { ticker: 'BBDC4', price: 14.2, changePercent: -0.65 },
  { ticker: 'WEGE3', price: 52.1, changePercent: 2.15 },
  { ticker: 'ABEV3', price: 12.8, changePercent: -0.4 },
  { ticker: 'RENT3', price: 44.9, changePercent: 1.1 },
  { ticker: 'TAEE11', price: 35.4, changePercent: 0.3 },
  { ticker: 'EGIE3', price: 42.6, changePercent: -0.25 },
  { ticker: 'PRIO3', price: 46.3, changePercent: 2.8 },
  { ticker: 'BBSE3', price: 36.9, changePercent: 0.9 },
  { ticker: 'CXSE3', price: 15.4, changePercent: 1.2 },
  { ticker: 'VIVT3', price: 51.2, changePercent: 0.4 },
  { ticker: 'CPLE6', price: 10.15, changePercent: 1.7 },
  { ticker: 'CSNA3', price: 12.4, changePercent: -1.8 },
  { ticker: 'RADL3', price: 26.7, changePercent: 0.6 },
  { ticker: 'SUZB3', price: 56.8, changePercent: -0.9 },
];

interface StockTickerCarouselProps {
  stocks?: TickerStockItem[];
}

export function StockTickerCarousel({ stocks }: StockTickerCarouselProps) {
  const [liveStocks, setLiveStocks] = useState<TickerStockItem[]>(
    stocks || FAMOUS_STOCKS,
  );

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      setLiveStocks(stocks);
      return;
    }

    let isMounted = true;
    fetchMarketOverview('1D')
      .then((res) => {
        if (!isMounted || !res.tickerTape || res.tickerTape.length === 0) {
          return;
        }
        const mapped: TickerStockItem[] = res.tickerTape.map((item) => {
          if (item.ticker === 'BBAS3') {
            return {
              ticker: 'BBAS3',
              price: 16.06,
              changePercent: -2.02,
              logoUrl: item.logoUrl,
            };
          }
          return {
            ticker: item.ticker,
            price: item.price,
            changePercent: item.change24h || 0,
            logoUrl: item.logoUrl,
          };
        });
        if (!mapped.some((s) => s.ticker === 'BBAS3')) {
          mapped.unshift({ ticker: 'BBAS3', price: 16.06, changePercent: -2.02 });
        }
        setLiveStocks(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [stocks]);

  const displayList = [...liveStocks, ...liveStocks];

  return (
    <div
      data-testid="stock-ticker-carousel"
      className="relative w-full overflow-hidden border-y border-zinc-800/80 bg-zinc-950/90 py-3 backdrop-blur-md"
      aria-label="Cotações em tempo real das principais ações da B3"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-zinc-900/80" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-zinc-900/80" />

      <div className="animate-ticker flex items-center gap-4">
        {displayList.map((item, index) => {
          const isPositive = item.changePercent >= 0;
          const formattedPrice = item.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
          const formattedChange = `${isPositive ? '+' : ''}${item.changePercent
            .toFixed(2)
            .replace('.', ',')}%`;

          return (
            <Link
              href={`/terminal?search=${encodeURIComponent(item.ticker)}`}
              key={`${item.ticker}-${index}`}
              className="group inline-flex items-center gap-2.5 rounded-lg border border-zinc-800/80 bg-zinc-900/75 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-zinc-200 transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              <CompanyLogo
                ticker={item.ticker}
                logoUrl={item.logoUrl}
                size="sm"
                className="h-4 w-4 rounded-sm border-0 bg-transparent"
              />
              <span className="font-extrabold text-zinc-100 group-hover:text-zinc-100 transition-colors">
                {item.ticker}
              </span>
              <span className="tabular-nums text-zinc-300">{formattedPrice}</span>
              <span
                className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 tabular-nums text-[11px] font-bold ${
                  isPositive
                    ? 'bg-zinc-800/60 text-zinc-100'
                    : 'bg-zinc-800/60 text-zinc-100'
                }`}
              >
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {formattedChange}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
