'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from '@/components/company-logo';
import { fetchMarketOverview } from '@/lib/api';
import { IbovespaHistoryPoint, IbovespaOverview } from '@/lib/schemas';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Clock,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface MarketMoverItem {
  ticker: string;
  companyName: string;
  price: number;
  change24h: number;
  sector: string;
  logoUrl?: string;
}

function formatPointsBrl(val: number): string {
  if (!Number.isFinite(val) || val <= 0) return '-';
  return val.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCompactPoints(val: number): string {
  if (!Number.isFinite(val) || val <= 0) return '-';
  return Math.round(val).toLocaleString('pt-BR');
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: IbovespaHistoryPoint }>;
}

function IbovCustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;
  const diff = point.close - point.open;
  const isUp = diff >= 0;

  return (
    <div className="rounded-xl border border-zinc-700/90 bg-zinc-950/95 p-3.5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-1.5 text-[11px] font-semibold text-zinc-400">
        <span>IBOVESPA (^BVSP)</span>
        <span className="font-mono text-zinc-300">{point.fullDate}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-base font-black tabular-nums text-zinc-100">
          {formatPointsBrl(point.close)} pts
        </span>
        <span
          className={`text-[11px] font-bold tabular-nums ${
            isUp ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {isUp ? '+' : ''}
          {diff.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          pts
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-zinc-800/80 pt-2 text-[10px] text-zinc-400">
        <div>
          <span className="block text-zinc-500">Abertura</span>
          <strong className="tabular-nums text-zinc-200">
            {formatCompactPoints(point.open)}
          </strong>
        </div>
        <div>
          <span className="block text-zinc-500">Máxima</span>
          <strong className="tabular-nums text-emerald-400">
            {formatCompactPoints(point.high)}
          </strong>
        </div>
        <div>
          <span className="block text-zinc-500">Mínima</span>
          <strong className="tabular-nums text-red-400">
            {formatCompactPoints(point.low)}
          </strong>
        </div>
      </div>
    </div>
  );
}

export function IbovMarketOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    '1D' | '5D' | '1M' | '6M' | '1A'
  >('1D');
  const [ibovData, setIbovData] = useState<IbovespaOverview | null>(null);
  const [topGainers, setTopGainers] = useState<MarketMoverItem[]>([]);
  const [topLosers, setTopLosers] = useState<MarketMoverItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchMarketOverview(selectedPeriod)
      .then((res) => {
        if (!active) return;
        if (res.ibovespa) {
          setIbovData(res.ibovespa);
        }
        if (Array.isArray(res.topGainers)) {
          setTopGainers(
            res.topGainers.slice(0, 5).map((item) => ({
              ticker: item.ticker,
              companyName: item.companyName,
              price: item.price,
              change24h: item.change24h || 0,
              sector: item.sector,
              logoUrl: item.logoUrl,
            })),
          );
        }
        if (Array.isArray(res.topLosers)) {
          setTopLosers(
            res.topLosers.slice(0, 5).map((item) => ({
              ticker: item.ticker,
              companyName: item.companyName,
              price: item.price,
              change24h: item.change24h || 0,
              sector: item.sector,
              logoUrl: item.logoUrl,
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedPeriod]);

  const yDomain = useMemo<[number, number]>(() => {
    if (!ibovData || ibovData.points.length === 0) return [0, 100];
    const values = ibovData.points.map((p) => p.close);
    const min = Math.min(
      ...values,
      ibovData.previousClose > 0 ? ibovData.previousClose : values[0],
    );
    const max = Math.max(
      ...values,
      ibovData.previousClose > 0 ? ibovData.previousClose : values[0],
    );
    const padding = Math.max(150, Math.round((max - min) * 0.12));
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [ibovData]);

  const hasValidIbov = Boolean(
    ibovData && ibovData.currentPoints > 0 && ibovData.points.length > 0,
  );
  const isPositive = (ibovData?.changePercent ?? 0) >= 0;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';

  const formattedPoints = hasValidIbov
    ? formatPointsBrl(ibovData!.currentPoints)
    : '-';
  const formattedChangePts = hasValidIbov
    ? `${ibovData!.changePoints >= 0 ? '+' : ''}${ibovData!.changePoints.toLocaleString(
        'pt-BR',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )} pts`
    : '-';
  const formattedChangePct = hasValidIbov
    ? `${ibovData!.changePercent >= 0 ? '+' : ''}${ibovData!.changePercent
        .toFixed(2)
        .replace('.', ',')}%`
    : '-';

  const volumeDisplay =
    ibovData && ibovData.volumeBrl > 0
      ? ibovData.volumeBrl >= 1_000_000_000
        ? `R$ ${(ibovData.volumeBrl / 1_000_000_000).toFixed(1).replace('.', ',')} Bi`
        : `${ibovData.volumeBrl.toLocaleString('pt-BR')}`
      : '-';

  return (
    <section
      data-testid="ibov-market-overview"
      className="space-y-6"
      aria-label="Visão Geral do Mercado: Índice Ibovespa e Maiores Altas e Baixas"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-zinc-700 bg-zinc-800/60 text-zinc-200 text-[10px] uppercase font-bold tracking-wider"
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-zinc-800 animate-pulse" />
              Série Histórica Oficial (^BVSP)
            </Badge>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3 text-zinc-500" />
              Dados Reais B3 • Yahoo Finance &amp; Brapi
            </span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-zinc-100">
            Índice Ibovespa &amp; Movimentações em Tempo Real
          </h2>
        </div>

        <Link href="/terminal">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-zinc-700/80 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 gap-2 transition-all"
          >
            Explorar Todos os Ativos no Terminal
            <ArrowRight className="h-3.5 w-3.5 text-zinc-200" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 sm:p-6 shadow-2xl backdrop-blur-xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-zinc-200" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-300">
                    IBOVESPA
                  </span>
                  <Badge
                    variant="outline"
                    className="border-zinc-700 bg-zinc-950/80 text-[10px] font-mono text-zinc-300"
                  >
                    ^BVSP
                  </Badge>
                  {isLoading && (
                    <RefreshCw className="h-3 w-3 animate-spin text-zinc-500" />
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <span
                    data-testid="ibov-current-points"
                    className="text-3xl sm:text-4xl font-black text-zinc-50 tabular-nums tracking-tight"
                  >
                    {formattedPoints}
                  </span>
                  <span className="text-xs font-semibold uppercase text-zinc-400">
                    pontos
                  </span>
                  {hasValidIbov && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ${
                        isPositive
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )}
                      {formattedChangePts} ({formattedChangePct})
                    </span>
                  )}
                </div>
              </div>

              <div
                className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/90 p-1"
                role="tablist"
                aria-label="Período do gráfico Ibovespa"
              >
                {(['1D', '5D', '1M', '6M', '1A'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    role="tab"
                    aria-selected={selectedPeriod === period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedPeriod === period
                        ? 'bg-zinc-700 text-zinc-50 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Máxima ({selectedPeriod})
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-emerald-400 tabular-nums">
                  {hasValidIbov ? `${formatPointsBrl(ibovData!.dayHigh)} pts` : '-'}
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Mínima ({selectedPeriod})
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-red-400 tabular-nums">
                  {hasValidIbov ? `${formatPointsBrl(ibovData!.dayLow)} pts` : '-'}
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Fech. Anterior
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-zinc-200 tabular-nums">
                  {hasValidIbov
                    ? `${formatPointsBrl(ibovData!.previousClose)} pts`
                    : '-'}
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Volume Reportado
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-zinc-200 tabular-nums">
                  {volumeDisplay}
                </strong>
              </div>
            </div>
          </div>

          <div
            data-testid="ibov-recharts-container"
            className="relative mt-5 h-72 w-full"
            aria-label="Gráfico interativo de desempenho do IBOVESPA"
          >
            {mounted && hasValidIbov ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ibovData!.points}
                  margin={{ top: 10, right: 8, left: 4, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="ibovAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={strokeColor}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="95%"
                        stopColor={strokeColor}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#27272a' }}
                    minTickGap={28}
                  />
                  <YAxis
                    domain={yDomain}
                    stroke="#71717a"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={62}
                    tickFormatter={(val: number) => formatCompactPoints(val)}
                  />
                  <Tooltip content={<IbovCustomTooltip />} />
                  <ReferenceLine
                    y={ibovData!.previousClose}
                    stroke="#52525b"
                    strokeDasharray="4 4"
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={strokeColor}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#ibovAreaGradient)"
                    activeDot={{
                      r: 5,
                      fill: strokeColor,
                      stroke: '#09090b',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-zinc-800/60 bg-zinc-950/40 text-xs text-zinc-400">
                <Activity className="mr-2 h-4 w-4 animate-pulse text-zinc-200" />
                {isLoading
                  ? 'Carregando série histórica oficial do Ibovespa (^BVSP)...'
                  : 'Série histórica indisponível no momento (-)'}
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/70 pt-3 text-[11px] text-zinc-400">
            <span>
              Fonte:{' '}
              <strong className="text-zinc-300">
                {ibovData?.source || '-'}
              </strong>
            </span>
            <span>
              Passe o cursor sobre o gráfico para inspecionar abertura, máxima e
              mínima reais de cada candle
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div
            data-testid="ibov-top-gainers-card"
            className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-4 sm:p-5 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/60 text-zinc-200">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-100">
                    Maiores Altas do Pregão
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Ativos com liquidez institucional na B3
                  </p>
                </div>
              </div>
              <Link
                href="/terminal?preset=maiores_altas"
                className="text-[11px] font-bold text-zinc-200 hover:text-zinc-50 transition-colors"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="mt-2 divide-y divide-zinc-800/60">
              {topGainers.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  {isLoading ? 'Carregando maiores altas da API...' : '-'}
                </div>
              ) : (
                topGainers.slice(0, 5).map((stock) => (
                  <Link
                    href={`/terminal?search=${encodeURIComponent(stock.ticker)}`}
                    key={stock.ticker}
                    className="flex items-center justify-between py-2.5 px-2 text-xs transition-all hover:bg-zinc-800/50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo
                        ticker={stock.ticker}
                        companyName={stock.companyName}
                        logoUrl={stock.logoUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-zinc-100 group-hover:text-zinc-200 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="truncate rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 max-w-[115px]">
                            {stock.sector}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[165px]">
                          {stock.companyName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-zinc-100 tabular-nums">
                        {stock.price > 0
                          ? stock.price.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          : '-'}
                      </div>
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 tabular-nums">
                        <ArrowUp className="mr-0.5 h-3 w-3" />+
                        {Math.abs(stock.change24h).toFixed(2).replace('.', ',')}%
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div
            data-testid="ibov-top-losers-card"
            className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-4 sm:p-5 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 text-red-400">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-zinc-100">
                    Maiores Baixas do Pregão
                  </h3>
                  <p className="text-[10px] text-zinc-400">
                    Descontos e correções recentes na B3
                  </p>
                </div>
              </div>
              <Link
                href="/terminal?preset=maiores_baixas"
                className="text-[11px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="mt-2 divide-y divide-zinc-800/60">
              {topLosers.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  {isLoading ? 'Carregando maiores baixas da API...' : '-'}
                </div>
              ) : (
                topLosers.slice(0, 5).map((stock) => (
                  <Link
                    href={`/terminal?search=${encodeURIComponent(stock.ticker)}`}
                    key={stock.ticker}
                    className="flex items-center justify-between py-2.5 px-2 text-xs transition-all hover:bg-zinc-800/50 rounded-lg group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CompanyLogo
                        ticker={stock.ticker}
                        companyName={stock.companyName}
                        logoUrl={stock.logoUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-zinc-100 group-hover:text-red-300 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="truncate rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 max-w-[115px]">
                            {stock.sector}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate max-w-[165px]">
                          {stock.companyName}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-zinc-100 tabular-nums">
                        {stock.price > 0
                          ? stock.price.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })
                          : '-'}
                      </div>
                      <span className="inline-flex items-center text-[11px] font-bold text-red-400 tabular-nums">
                        <ArrowDown className="mr-0.5 h-3 w-3" />-
                        {Math.abs(stock.change24h).toFixed(2).replace('.', ',')}%
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
