'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Clock,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface MarketMover {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  sector: string;
}

const TOP_GAINERS: MarketMover[] = [
  {
    ticker: 'PRIO3',
    name: 'PRIO S.A.',
    price: 46.85,
    changePercent: 4.82,
    sector: 'Petróleo e Gás',
  },
  {
    ticker: 'EMBR3',
    name: 'EMBRAER S.A.',
    price: 52.40,
    changePercent: 3.95,
    sector: 'Bens Industriais',
  },
  {
    ticker: 'WEGE3',
    name: 'WEG S.A.',
    price: 53.15,
    changePercent: 2.85,
    sector: 'Bens Industriais',
  },
  {
    ticker: 'DIRR3',
    name: 'DIRECIONAL ENG.',
    price: 8.77,
    changePercent: 2.45,
    sector: 'Construção Civil',
  },
  {
    ticker: 'SUZB3',
    name: 'SUZANO S.A.',
    price: 58.10,
    changePercent: 2.10,
    sector: 'Materiais Básicos',
  },
];

const TOP_LOSERS: MarketMover[] = [
  {
    ticker: 'BHIA3',
    name: 'CASAS BAHIA S.A.',
    price: 4.15,
    changePercent: -5.45,
    sector: 'Consumo Cíclico',
  },
  {
    ticker: 'MGLU3',
    name: 'MAGAZINE LUIZA',
    price: 9.30,
    changePercent: -4.20,
    sector: 'Consumo Cíclico',
  },
  {
    ticker: 'CSNA3',
    name: 'SID NACIONAL',
    price: 11.90,
    changePercent: -3.80,
    sector: 'Mineração e Siderurgia',
  },
  {
    ticker: 'BBAS3',
    name: 'BANCO DO BRASIL',
    price: 16.06,
    changePercent: -2.02,
    sector: 'Bancos',
  },
  {
    ticker: 'COGN3',
    name: 'COGNA EDUCAÇÃO',
    price: 1.48,
    changePercent: -1.95,
    sector: 'Consumo Cíclico',
  },
];

const PERIOD_DATA: Record<
  '1D' | '5D' | '1M' | '6M' | '1A',
  {
    points: string;
    change: string;
    changePercent: number;
    high: string;
    low: string;
    svgPath: string;
    areaPath: string;
    xLabels: string[];
  }
> = {
  '1D': {
    points: '131.845',
    change: '+1.072 pts',
    changePercent: 0.82,
    high: '132.210',
    low: '130.650',
    svgPath:
      'M 0 140 C 40 135, 70 150, 110 130 C 150 110, 190 125, 230 100 C 270 75, 310 95, 350 80 C 390 65, 430 70, 470 50 C 510 30, 560 45, 600 25',
    areaPath:
      'M 0 140 C 40 135, 70 150, 110 130 C 150 110, 190 125, 230 100 C 270 75, 310 95, 350 80 C 390 65, 430 70, 470 50 C 510 30, 560 45, 600 25 L 600 180 L 0 180 Z',
    xLabels: ['10:00', '12:00', '14:00', '16:00', '17:55'],
  },
  '5D': {
    points: '131.845',
    change: '+2.410 pts',
    changePercent: 1.86,
    high: '132.500',
    low: '129.200',
    svgPath:
      'M 0 160 C 50 170, 90 130, 150 120 C 210 110, 260 140, 310 90 C 360 40, 420 80, 480 60 C 540 40, 570 30, 600 20',
    areaPath:
      'M 0 160 C 50 170, 90 130, 150 120 C 210 110, 260 140, 310 90 C 360 40, 420 80, 480 60 C 540 40, 570 30, 600 20 L 600 180 L 0 180 Z',
    xLabels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
  },
  '1M': {
    points: '131.845',
    change: '+4.120 pts',
    changePercent: 3.22,
    high: '133.100',
    low: '126.800',
    svgPath:
      'M 0 150 C 60 165, 120 180, 180 140 C 240 100, 300 130, 360 90 C 420 50, 480 75, 540 40 C 570 20, 590 35, 600 25',
    areaPath:
      'M 0 150 C 60 165, 120 180, 180 140 C 240 100, 300 130, 360 90 C 420 50, 480 75, 540 40 C 570 20, 590 35, 600 25 L 600 180 L 0 180 Z',
    xLabels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
  },
  '6M': {
    points: '131.845',
    change: '+8.950 pts',
    changePercent: 7.28,
    high: '134.500',
    low: '121.300',
    svgPath:
      'M 0 170 C 80 180, 160 130, 240 140 C 320 150, 400 90, 460 70 C 520 50, 570 30, 600 20',
    areaPath:
      'M 0 170 C 80 180, 160 130, 240 140 C 320 150, 400 90, 460 70 C 520 50, 570 30, 600 20 L 600 180 L 0 180 Z',
    xLabels: ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
  },
  '1A': {
    points: '131.845',
    change: '+14.620 pts',
    changePercent: 12.47,
    high: '137.400',
    low: '115.800',
    svgPath:
      'M 0 180 C 100 160, 180 140, 270 120 C 360 100, 430 80, 500 50 C 550 30, 580 40, 600 25',
    areaPath:
      'M 0 180 C 100 160, 180 140, 270 120 C 360 100, 430 80, 500 50 C 550 30, 580 40, 600 25 L 600 180 L 0 180 Z',
    xLabels: ['Nov/25', 'Fev/26', 'Mai/26', 'Ago/26', 'Out/26'],
  },
};

export function IbovMarketOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    '1D' | '5D' | '1M' | '6M' | '1A'
  >('1D');
  const current = PERIOD_DATA[selectedPeriod];

  return (
    <section
      data-testid="ibov-market-overview"
      className="space-y-6"
      aria-label="Visão Geral do Mercado: Índice Ibovespa e Maiores Altas e Baixas"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
              Pulso do Mercado
            </Badge>
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3" />
              B3 Oficial • Pregão Regular
            </span>
          </div>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            Índice Ibovespa &amp; Destaques do Dia
          </h2>
        </div>

        <Link href="/terminal">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-lg border-zinc-800 bg-zinc-900 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100 gap-1.5"
          >
            Abrir Terminal de Ações
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    IBOVESPA
                  </span>
                  <Badge variant="default" className="text-[10px] font-bold">
                    B3
                  </Badge>
                </div>
                <div className="mt-1 flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-zinc-100 tabular-nums">
                    {current.points}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">pts</span>
                  <span
                    className={`inline-flex items-center text-xs font-bold tabular-nums ${
                      current.changePercent >= 0
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {current.changePercent >= 0 ? (
                      <ArrowUp className="mr-0.5 h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="mr-0.5 h-3.5 w-3.5" />
                    )}
                    {current.change} (+{current.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
                {(['1D', '5D', '1M', '6M', '1A'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setSelectedPeriod(period)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                      selectedPeriod === period
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div>
                Máxima do período:{' '}
                <strong className="text-zinc-200 tabular-nums">{current.high} pts</strong>
              </div>
              <span className="text-zinc-700">•</span>
              <div>
                Mínima do período:{' '}
                <strong className="text-zinc-200 tabular-nums">{current.low} pts</strong>
              </div>
              <span className="text-zinc-700">•</span>
              <div>
                Volume Negociado:{' '}
                <strong className="text-zinc-200 tabular-nums">R$ 24,8 Bi</strong>
              </div>
            </div>
          </div>

          <div className="relative mt-6 h-48 w-full">
            <svg
              viewBox="0 0 600 180"
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
              aria-label="Gráfico de desempenho do IBOVESPA"
            >
              <line
                x1="0"
                y1="40"
                x2="600"
                y2="40"
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="90"
                x2="600"
                y2="90"
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="140"
                x2="600"
                y2="140"
                stroke="#27272a"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              <path
                d={current.areaPath}
                fill="#27272a"
                fillOpacity="0.4"
              />

              <path
                d={current.svgPath}
                fill="none"
                stroke="#34d399"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle
                cx="600"
                cy="25"
                r="4"
                fill="#10b981"
                stroke="#047857"
                strokeWidth="2"
              />
            </svg>

            <div className="mt-2 flex justify-between text-[10px] text-zinc-500 font-medium">
              {current.xLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-950/80 text-emerald-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Maiores Altas (24h)
                </h3>
              </div>
              <Link
                href="/terminal"
                className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {TOP_GAINERS.map((stock) => (
                <div
                  key={stock.ticker}
                  className="flex items-center justify-between py-2.5 text-xs transition-colors hover:bg-zinc-850/60 rounded px-1"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-100">{stock.ticker}</span>
                      <span className="text-[10px] text-zinc-500">{stock.sector}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-zinc-200 tabular-nums">
                      {stock.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                    <span className="inline-flex items-center text-[11px] font-bold text-emerald-400 tabular-nums">
                      <ArrowUp className="mr-0.5 h-3 w-3" />
                      +{stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-950/80 text-red-400">
                  <TrendingDown className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  Maiores Baixas (24h)
                </h3>
              </div>
              <Link
                href="/terminal"
                className="text-[11px] font-semibold text-zinc-400 hover:text-zinc-200"
              >
                Ver Ranking &rarr;
              </Link>
            </div>

            <div className="divide-y divide-zinc-800/80">
              {TOP_LOSERS.map((stock) => (
                <div
                  key={stock.ticker}
                  className="flex items-center justify-between py-2.5 text-xs transition-colors hover:bg-zinc-850/60 rounded px-1"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-100">{stock.ticker}</span>
                      <span className="text-[10px] text-zinc-500">{stock.sector}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-zinc-200 tabular-nums">
                      {stock.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </div>
                    <span className="inline-flex items-center text-[11px] font-bold text-red-400 tabular-nums">
                      <ArrowDown className="mr-0.5 h-3 w-3" />
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
