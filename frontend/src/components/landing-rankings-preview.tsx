'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/company-logo';
import { fetchStocks } from '@/lib/api';
import { StockItem } from '@/lib/schemas';
import {
  formatCompactCurrency,
  formatCurrency,
  formatMultiple,
} from '@/lib/utils';
import {
  ArrowRight,
  BarChart3,
  Building2,
  Coins,
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
      title: 'Todas as Ações da Bolsa',
      subtitle: 'Top 5 ativos com maior liquidez e valor na B3',
      href: '/terminal?headerPreset=todas',
      icon: BarChart3,
      accentColor: 'text-emerald-400',
      badgeBg: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
      items: allStocks,
      renderMetric: (stock: StockItem) => ({
        primary:
          stock.price > 0 ? formatCurrency(stock.price) : '-',
        secondary: `P/L ${formatMultiple(stock.pl)} • P/VP ${formatMultiple(stock.pvp)}`,
      }),
    },
    {
      id: 'maiores_receitas',
      testId: 'landing-ranking-card-receitas',
      title: 'Maiores Receitas',
      subtitle: 'Top 5 companhias por receita operacional líquida',
      href: '/terminal?headerPreset=maiores_receitas',
      icon: TrendingUp,
      accentColor: 'text-cyan-400',
      badgeBg: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-400',
      items: topRevenue,
      renderMetric: (stock: StockItem) => ({
        primary:
          stock.revenue > 0 ? formatCompactCurrency(stock.revenue) : '-',
        secondary:
          stock.price > 0
            ? `${formatCurrency(stock.price)} • P/L ${formatMultiple(stock.pl)}`
            : '-',
      }),
    },
    {
      id: 'maiores_valor_mercado',
      testId: 'landing-ranking-card-valor-mercado',
      title: 'Maiores Valor de Mercado',
      subtitle: 'Top 5 empresas mais valiosas listadas na B3',
      href: '/terminal?headerPreset=maiores_valor_mercado',
      icon: Building2,
      accentColor: 'text-amber-400',
      badgeBg: 'border-amber-500/30 bg-amber-500/15 text-amber-400',
      items: topMarketCap,
      renderMetric: (stock: StockItem) => ({
        primary:
          stock.marketCap > 0 ? formatCompactCurrency(stock.marketCap) : '-',
        secondary:
          stock.price > 0
            ? `${formatCurrency(stock.price)} • P/VP ${formatMultiple(stock.pvp)}`
            : '-',
      }),
    },
  ];

  return (
    <section
      id="rankings"
      data-testid="landing-rankings-section"
      className="scroll-mt-24 space-y-6"
      aria-label="Ranking dos Ativos da B3"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold tracking-wider"
            >
              Rankings Oficiais do Terminal
            </Badge>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
            Ranking dos Ativos
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            As 5 primeiras colocadas nos 3 modos principais disponíveis no
            cabeçalho do terminal B-Stocks.
          </p>
        </div>

        <Link href="/terminal">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-zinc-700/80 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-zinc-100 hover:border-emerald-500/50 hover:bg-zinc-800 gap-2 transition-all"
          >
            Ver Todos os 11 Rankings no Terminal
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {cards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              data-testid={card.testId}
              className="flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-zinc-900/80 p-5 shadow-xl backdrop-blur-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.badgeBg}`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-zinc-100">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-zinc-400">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 divide-y divide-zinc-800/60">
                  {loading && card.items.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      Carregando top 5 ativos da API...
                    </div>
                  ) : card.items.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-500">
                      -
                    </div>
                  ) : (
                    card.items.map((stock, idx) => {
                      const metrics = card.renderMetric(stock);
                      return (
                        <Link
                          key={stock.ticker}
                          href={`/terminal?search=${encodeURIComponent(stock.ticker)}`}
                          className="group flex items-center justify-between py-3 px-2 rounded-lg transition-colors hover:bg-zinc-800/50"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-5 text-xs font-black text-zinc-500 tabular-nums">
                              {idx + 1}º
                            </span>
                            <CompanyLogo
                              ticker={stock.ticker}
                              companyName={stock.companyName}
                              logoUrl={stock.logoUrl}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                                  {stock.ticker}
                                </span>
                                <span className="truncate rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 max-w-[100px]">
                                  {stock.sector}
                                </span>
                              </div>
                              <div className="text-[11px] text-zinc-400 truncate max-w-[155px]">
                                {stock.companyName}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-extrabold text-zinc-100 tabular-nums">
                              {metrics.primary}
                            </div>
                            <div className="text-[10px] font-medium text-zinc-400 tabular-nums">
                              {metrics.secondary}
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-4 border-t border-zinc-800/80 pt-3.5">
                <Link href={card.href} className="block w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-testid={`ver-ranking-btn-${card.id}`}
                    className="w-full rounded-xl border-zinc-700/80 bg-zinc-950/90 text-xs font-bold text-zinc-100 hover:border-emerald-500/50 hover:bg-zinc-800 gap-1.5 transition-all"
                  >
                    Ver Ranking
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
