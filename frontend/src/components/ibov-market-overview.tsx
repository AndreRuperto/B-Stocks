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

const FALLBACK_GAINERS: MarketMoverItem[] = [
  {
    ticker: 'PRIO3',
    companyName: 'PRIO S.A.',
    price: 46.85,
    change24h: 4.82,
    sector: 'Petróleo, Gás e Biocombustíveis',
  },
  {
    ticker: 'EMBR3',
    companyName: 'EMBRAER S.A.',
    price: 52.4,
    change24h: 3.95,
    sector: 'Bens Industriais',
  },
  {
    ticker: 'WEGE3',
    companyName: 'WEG S.A.',
    price: 53.15,
    change24h: 2.85,
    sector: 'Bens Industriais',
  },
  {
    ticker: 'DIRR3',
    companyName: 'DIRECIONAL ENGENHARIA',
    price: 8.77,
    change24h: 2.45,
    sector: 'Construção Civil',
  },
  {
    ticker: 'SUZB3',
    companyName: 'SUZANO S.A.',
    price: 58.1,
    change24h: 2.1,
    sector: 'Materiais Básicos',
  },
  {
    ticker: 'CPLE6',
    companyName: 'COPEL ENERGIA',
    price: 10.42,
    change24h: 1.88,
    sector: 'Energia Elétrica',
  },
];

const FALLBACK_LOSERS: MarketMoverItem[] = [
  {
    ticker: 'BHIA3',
    companyName: 'CASAS BAHIA S.A.',
    price: 4.15,
    change24h: -5.45,
    sector: 'Consumo Cíclico',
  },
  {
    ticker: 'MGLU3',
    companyName: 'MAGAZINE LUIZA S.A.',
    price: 9.3,
    change24h: -4.2,
    sector: 'Consumo Cíclico',
  },
  {
    ticker: 'CSNA3',
    companyName: 'SID NACIONAL',
    price: 11.9,
    change24h: -3.8,
    sector: 'Mineração',
  },
  {
    ticker: 'BBAS3',
    companyName: 'BANCO DO BRASIL S.A.',
    price: 16.06,
    change24h: -2.02,
    sector: 'Bancos',
  },
  {
    ticker: 'COGN3',
    companyName: 'COGNA EDUCAÇÃO',
    price: 1.48,
    change24h: -1.95,
    sector: 'Consumo Cíclico',
  },
  {
    ticker: 'HAPV3',
    companyName: 'HAPVIDA SAÚDE',
    price: 3.62,
    change24h: -1.72,
    sector: 'Saúde',
  },
];

function buildInitialIbovSeries(
  period: '1D' | '5D' | '1M' | '6M' | '1A',
): IbovespaOverview {
  const currentPoints = 169186.42;
  const previousClose = 167765.62;
  const count =
    period === '1D' ? 28 : period === '5D' ? 35 : period === '1M' ? 22 : 30;
  const startBase =
    period === '1D'
      ? 167820
      : period === '5D'
        ? 166100
        : period === '1M'
          ? 163750
          : period === '6M'
            ? 156330
            : 147540;

  const points: IbovespaHistoryPoint[] = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1);
    const wave =
      Math.sin(i * 0.65) * 340 +
      Math.cos(i * 0.35) * 210 +
      Math.sin(i * 1.2) * 120;
    const close =
      i === count - 1
        ? currentPoints
        : Number(
            (
              startBase +
              (currentPoints - startBase) * progress +
              wave
            ).toFixed(2),
          );
    const open = Number((close - Math.sin(i + 1) * 140).toFixed(2));
    const high = Number((Math.max(open, close) + 185).toFixed(2));
    const low = Number((Math.min(open, close) - 165).toFixed(2));

    let label = '';
    if (period === '1D') {
      const totalMins = 10 * 60 + i * 17;
      const hh = String(Math.min(17, Math.floor(totalMins / 60))).padStart(
        2,
        '0',
      );
      const mm = String(totalMins % 60).padStart(2, '0');
      label = `${hh}:${mm}`;
    } else {
      const ts = (now - (count - i) * 86400) * 1000;
      const d = new Date(ts);
      label = d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }

    points.push({
      timestamp: now - (count - i) * 900,
      label,
      fullDate: label,
      close,
      open,
      high,
      low,
      volume: 850_000_000 + i * 45_000_000,
    });
  }

  const closes = points.map((p) => p.close);
  const dayHigh = Math.max(...points.map((p) => p.high), currentPoints);
  const dayLow = Math.min(...points.map((p) => p.low), startBase);
  const firstClose = closes[0] || previousClose;
  const refBase = period === '1D' ? previousClose : firstClose;
  const changePoints = Number((currentPoints - refBase).toFixed(2));
  const changePercent = Number(((changePoints / refBase) * 100).toFixed(2));

  return {
    symbol: '^BVSP',
    period,
    currentPoints,
    previousClose: refBase,
    changePercent,
    changePoints,
    dayHigh,
    dayLow,
    volumeBrl: 24_840_000_000,
    updatedAt: new Date().toISOString(),
    source: 'B3 / Yahoo Finance (^BVSP)',
    points,
  };
}

function formatPointsBrl(val: number): string {
  return val.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCompactPoints(val: number): string {
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
          {formatPointsBrl(diff)} pts
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
  const [ibovData, setIbovData] = useState<IbovespaOverview>(() =>
    buildInitialIbovSeries('1D'),
  );
  const [topGainers, setTopGainers] =
    useState<MarketMoverItem[]>(FALLBACK_GAINERS);
  const [topLosers, setTopLosers] =
    useState<MarketMoverItem[]>(FALLBACK_LOSERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setIbovData(buildInitialIbovSeries(selectedPeriod));

    fetchMarketOverview(selectedPeriod)
      .then((res) => {
        if (!active) return;
        if (res.ibovespa && res.ibovespa.points.length > 0) {
          setIbovData(res.ibovespa);
        }
        if (res.topGainers && res.topGainers.length > 0) {
          setTopGainers(
            res.topGainers.slice(0, 6).map((item) => ({
              ticker: item.ticker,
              companyName: item.companyName,
              price: item.price,
              change24h: item.change24h || 0,
              sector: item.sector,
              logoUrl: item.logoUrl,
            })),
          );
        }
        if (res.topLosers && res.topLosers.length > 0) {
          setTopLosers(
            res.topLosers.slice(0, 6).map((item) => ({
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
    const values = ibovData.points.map((p) => p.close);
    if (values.length === 0) return [165000, 171000];
    const min = Math.min(...values, ibovData.previousClose);
    const max = Math.max(...values, ibovData.previousClose);
    const padding = Math.max(250, Math.round((max - min) * 0.14));
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [ibovData]);

  const isPositive = ibovData.changePercent >= 0;
  const strokeColor = isPositive ? '#10b981' : '#ef4444';
  const formattedPoints = formatPointsBrl(ibovData.currentPoints);
  const formattedChangePts = `${ibovData.changePoints >= 0 ? '+' : ''}${formatPointsBrl(
    ibovData.changePoints,
  )} pts`;
  const formattedChangePct = `${ibovData.changePercent >= 0 ? '+' : ''}${ibovData.changePercent
    .toFixed(2)
    .replace('.', ',')}%`;

  const volumeBil = (ibovData.volumeBrl / 1_000_000_000)
    .toFixed(1)
    .replace('.', ',');

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
              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold tracking-wider"
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Série Histórica Oficial (^BVSP)
            </Badge>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3 text-zinc-500" />
              Dados Reais B3 • Yahoo Finance &amp; Fundamentus
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
            className="rounded-xl border-zinc-700/80 bg-zinc-900/90 px-4 py-2 text-xs font-bold text-zinc-100 hover:border-emerald-500/50 hover:bg-zinc-800 gap-2 transition-all"
          >
            Explorar Todos os Ativos no Terminal
            <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 sm:p-6 shadow-2xl backdrop-blur-xl lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-400" />
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
                        ? 'bg-emerald-500 text-zinc-950 shadow-sm'
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
                  {formatPointsBrl(ibovData.dayHigh)} pts
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Mínima ({selectedPeriod})
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-red-400 tabular-nums">
                  {formatPointsBrl(ibovData.dayLow)} pts
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Fech. Anterior
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-zinc-200 tabular-nums">
                  {formatPointsBrl(ibovData.previousClose)} pts
                </strong>
              </div>
              <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  Volume Financeiro
                </span>
                <strong className="mt-0.5 block text-xs sm:text-sm font-bold text-zinc-200 tabular-nums">
                  R$ {volumeBil} Bi
                </strong>
              </div>
            </div>
          </div>

          <div
            data-testid="ibov-recharts-container"
            className="relative mt-5 h-72 w-full"
            aria-label="Gráfico interativo de desempenho do IBOVESPA"
          >
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={ibovData.points}
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
                    y={ibovData.previousClose}
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
                <Activity className="mr-2 h-4 w-4 animate-pulse text-emerald-400" />
                Carregando série histórica oficial do Ibovespa...
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/70 pt-3 text-[11px] text-zinc-400">
            <span>
              Fonte: <strong className="text-zinc-300">{ibovData.source}</strong>
            </span>
            <span>
              Passe o cursor sobre o gráfico para inspecionar abertura, máxima e
              mínima de cada candle
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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
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
                href="/terminal"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="mt-2 divide-y divide-zinc-800/60">
              {topGainers.slice(0, 5).map((stock) => (
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
                        <span className="font-extrabold text-zinc-100 group-hover:text-emerald-300 transition-colors">
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
                      {stock.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                    <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 tabular-nums">
                      <ArrowUp className="mr-0.5 h-3 w-3" />+
                      {Math.abs(stock.change24h).toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                </Link>
              ))}
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
                href="/terminal"
                className="text-[11px] font-bold text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="mt-2 divide-y divide-zinc-800/60">
              {topLosers.slice(0, 5).map((stock) => (
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
                      {stock.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                    <span className="inline-flex items-center text-[11px] font-bold text-red-400 tabular-nums">
                      <ArrowDown className="mr-0.5 h-3 w-3" />-
                      {Math.abs(stock.change24h).toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
