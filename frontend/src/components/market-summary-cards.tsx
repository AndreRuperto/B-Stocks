'use client';

import React from 'react';
import { MarketSummary, StockItem } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompanyLogo } from '@/components/company-logo';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface MarketSummaryCardsProps {
  summary: MarketSummary | null;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectStock: (stock: StockItem) => void;
}

export function MarketSummaryCards({
  summary,
  selectedCategory,
  onSelectCategory,
  onSelectStock,
}: MarketSummaryCardsProps) {
  if (!summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((idx) => (
          <Card key={idx} className="border-zinc-800 bg-zinc-900">
            <CardHeader className="pb-2">
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-7 w-20 bg-zinc-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Total de Ativos na B3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              data-testid="summary-total-stocks"
              className="text-2xl font-bold text-zinc-100 tabular-nums"
            >
              {summary.totalStocks}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              {summary.passedCutCount} aprovadas no corte (Liq &gt; R$ 1M e Dív/EBITDA &lt; 3x)
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Oportunidades Décio Bazin (DY 6%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              data-testid="summary-bazin-count"
              className="text-2xl font-bold text-zinc-100 tabular-nums"
            >
              {summary.bazinOpportunities}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Ações líquidas abaixo do Preço Teto de Bazin
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Oportunidades Benjamin Graham
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              data-testid="summary-graham-count"
              className="text-2xl font-bold text-zinc-100 tabular-nums"
            >
              {summary.grahamOpportunities}
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Ações líquidas negociadas abaixo de √(22,5 × LPA × VPA)
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Média das Aprovadas no Corte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-zinc-100 tabular-nums">
                Score {summary.avgScorePassed.toFixed(1)}
              </span>
              <span className="text-xs font-medium text-zinc-400 tabular-nums">
                DY {formatPercent(summary.avgDyPassed)} | ROE {formatPercent(summary.avgRoePassed)}
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-400">
              Ações com liquidez diária consistente na B3
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="border-zinc-800 bg-zinc-900 lg:col-span-5">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Classificação Temática (Modelo de Negócio)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onSelectCategory('ALL')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === 'ALL'
                  ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-semibold'
                  : 'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              Todas ({summary.totalStocks})
            </button>
            {summary.categories.map((cat) => (
              <button
                key={cat.category}
                type="button"
                onClick={() =>
                  onSelectCategory(
                    selectedCategory === cat.category ? 'ALL' : cat.category,
                  )
                }
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.category
                    ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-semibold'
                    : 'border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                {cat.category} ({cat.count})
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900 lg:col-span-7">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Destaques Quantitativos (Top Score com Liquidez &gt; R$ 1M)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
              {summary.topRanking.map((stock) => (
                <button
                  key={stock.ticker}
                  type="button"
                  onClick={() => onSelectStock(stock)}
                  className="flex flex-col items-start justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5 text-left hover:border-zinc-700 hover:bg-zinc-800/80 transition-all"
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <CompanyLogo
                        ticker={stock.ticker}
                        logoUrl={stock.logoUrl}
                        companyName={stock.companyName}
                        size="sm"
                      />
                      <span className="font-bold text-xs text-zinc-100 truncate">
                        {stock.ticker}
                      </span>
                    </div>
                    <Badge variant="default" className="px-1.5 py-0 text-[10px] shrink-0 font-bold">
                      {stock.scoreTotal.toFixed(0)}
                    </Badge>
                  </div>
                  <span className="mt-2 text-xs font-semibold text-zinc-200 tabular-nums">
                    {formatCurrency(stock.price)}
                  </span>
                  <span className="text-[11px] text-zinc-400 tabular-nums">
                    DY {formatPercent(stock.dy)}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
