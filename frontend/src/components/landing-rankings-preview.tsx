'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CompanyLogo } from '@/components/company-logo';
import { fetchStocks } from '@/lib/api';
import { StockItem } from '@/lib/schemas';
import {
  formatCompactCurrency,
  formatCurrency,
} from '@/lib/utils';
import {
  BarChart3,
  Building2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export function LandingRankingsPreview() {
  const [allStocks, setAllStocks] = useState<StockItem[]>([]);
  const [topRevenue, setTopRevenue] = useState<StockItem[]>([]);
  const [topMarketCap, setTopMarketCap] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([
      fetchStocks({
        rankingPreset: 'valor_mercado',
        sortBy: 'marketCap',
        sortOrder: 'desc',
        onlyPassedCut: true,
        limit: 10,
        page: 1,
      }),
      fetchStocks({
        rankingPreset: 'maiores_receitas',
        sortBy: 'revenue',
        sortOrder: 'desc',
        oneStockPerCompany: true,
        limit: 10,
        page: 1,
      }),
      fetchStocks({
        rankingPreset: 'valor_mercado',
        sortBy: 'marketCap',
        sortOrder: 'desc',
        oneStockPerCompany: true,
        limit: 10,
        page: 1,
      }),
    ])
      .then(([allRes, revRes, mcapRes]) => {
        if (!active) return;
        setAllStocks(allRes.items.slice(0, 5));
        setTopRevenue(revRes.items.slice(0, 5));
        setTopMarketCap(mcapRes.items.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = [
    {
      id: 'todas',
      testId: 'landing-ranking-card-todas',
      category: 'Ações',
      title: 'Maiores em Liquidez',
      href: '/terminal?headerPreset=todas',
      icon: BarChart3,
      items: allStocks,
      renderMetric: (stock: StockItem) =>
        stock.price > 0 ? formatCurrency(stock.price) : '-',
    },
    {
      id: 'maiores_receitas',
      testId: 'landing-ranking-card-receitas',
      category: 'Receita Operacional',
      title: 'Maiores Receitas',
      href: '/terminal?headerPreset=maiores_receitas',
      icon: TrendingUp,
      items: topRevenue,
      renderMetric: (stock: StockItem) =>
        stock.revenue > 0 ? formatCompactCurrency(stock.revenue) : '-',
    },
    {
      id: 'maiores_valor_mercado',
      testId: 'landing-ranking-card-valor-mercado',
      category: 'Market Cap',
      title: 'Maior Capitalização',
      href: '/terminal?headerPreset=maiores_valor_mercado',
      icon: Building2,
      items: topMarketCap,
      renderMetric: (stock: StockItem) =>
        stock.marketCap > 0 ? formatCompactCurrency(stock.marketCap) : '-',
    },
  ];

  return (
    <section
      id="rankings"
      data-testid="landing-rankings-section"
      className="space-y-10"
      aria-label="Ranking dos Ativos da B3"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-stone-200">
          <span className="text-sm">🇧🇷</span>
          <span>Mercado B3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-100">
          Os Melhores da Bolsa Brasileira
        </h2>
        <p className="text-xs sm:text-sm text-stone-400">
          Rankings oficiais calculados em tempo real com dados auditados da B3 e métricas fundamentalistas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              data-testid={card.testId}
              className="flex flex-col justify-between rounded-2xl border border-[#2b3a4a] bg-[#1a2533] p-5 shadow-xl transition-all"
            >
              <div>
                <div className="flex flex-col items-center text-center pb-4 border-b border-[#253242]">
                  <div className="flex items-center gap-2 mb-1.5 text-stone-400">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#243344] text-stone-300">
                      <IconComponent className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      {card.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-100">
                    {card.title}
                  </h3>
                </div>

                <div className="mt-2 divide-y divide-[#222e3d]">
                  {loading && card.items.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-500">
                      Carregando ranking da B3...
                    </div>
                  ) : card.items.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-500">
                      -
                    </div>
                  ) : (
                    card.items.map((stock, idx) => {
                      const metricValue = card.renderMetric(stock);
                      const rank = idx + 1;
                      const rankColorClass =
                        rank === 1
                          ? 'text-amber-400 font-black'
                          : rank === 2
                          ? 'text-slate-300 font-extrabold'
                          : rank === 3
                          ? 'text-amber-600 font-extrabold'
                          : 'text-stone-500 font-bold';

                      return (
                        <Link
                          key={stock.ticker}
                          href={`/terminal?search=${encodeURIComponent(stock.ticker)}`}
                          className="group flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors hover:bg-[#223040]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`w-5 text-center text-xs sm:text-sm tabular-nums ${rankColorClass}`}>
                              #{rank}
                            </span>
                            <CompanyLogo
                              ticker={stock.ticker}
                              companyName={stock.companyName}
                              logoUrl={stock.logoUrl}
                              size="md"
                              className="h-9 w-9 rounded-lg shrink-0"
                            />
                            <div className="min-w-0 pr-2">
                              <div className="text-sm font-black text-stone-100 group-hover:text-stone-200 transition-colors">
                                {stock.ticker}
                              </div>
                              <div className="text-[11px] text-stone-400 truncate max-w-[120px] sm:max-w-[140px]">
                                {stock.companyName}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0 text-right">
                            <span className="text-xs sm:text-sm font-black text-stone-100 tabular-nums">
                              {metricValue}
                            </span>
                            <ChevronRight className="h-4 w-4 text-stone-500 group-hover:text-stone-300 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#253242] text-center">
                <Link
                  href={card.href}
                  data-testid={`ver-ranking-btn-${card.id}`}
                  className="inline-flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-stone-300 hover:text-stone-100 transition-colors"
                >
                  <span>Ver Ranking</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
