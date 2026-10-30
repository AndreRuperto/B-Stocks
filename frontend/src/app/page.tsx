'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockTickerCarousel } from '@/components/stock-ticker-carousel';
import { IbovMarketOverview } from '@/components/ibov-market-overview';
import { LandingRankingsPreview } from '@/components/landing-rankings-preview';
import { MarketNewsSection } from '@/components/market-news-section';
import { CompanyLogo } from '@/components/company-logo';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Flame,
  HelpCircle,
  Layers,
  LineChart,
  LockOpen,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Zap,
} from 'lucide-react';

interface ShowcaseStock {
  ticker: string;
  companyName: string;
  sector: string;
  price: number;
  dy: number;
  pl: number;
  pvp: number;
  roe: number;
  bazinCeiling: number;
  bazinUpside: number;
  grahamFair: number;
  grahamUpside: number;
  score: number;
  verdict: string;
}

const SHOWCASE_STOCKS: ShowcaseStock[] = [
  {
    ticker: 'BBAS3',
    companyName: 'BANCO DO BRASIL S.A.',
    sector: 'Bancos',
    price: 16.06,
    dy: 10.42,
    pl: 4.35,
    pvp: 0.78,
    roe: 20.8,
    bazinCeiling: 24.8,
    bazinUpside: 54.42,
    grahamFair: 28.9,
    grahamUpside: 79.95,
    score: 94,
    verdict:
      'Múltiplos descontados frente ao ROE histórico de 20,8%, amplo upside nos modelos de Bazin (6%) e Benjamin Graham.',
  },
  {
    ticker: 'PETR4',
    companyName: 'PETROBRAS PN',
    sector: 'Petróleo, Gás e Biocombustíveis',
    price: 38.2,
    dy: 14.85,
    pl: 4.1,
    pvp: 1.18,
    roe: 28.4,
    bazinCeiling: 58.5,
    bazinUpside: 53.14,
    grahamFair: 54.6,
    grahamUpside: 42.93,
    score: 92,
    verdict:
      'Forte geração de caixa livre e distribuição consistente de proventos com Dívida Líquida/EBITDA controlada abaixo de 1,2x.',
  },
  {
    ticker: 'WEGE3',
    companyName: 'WEG S.A.',
    sector: 'Bens Industriais',
    price: 52.1,
    dy: 1.85,
    pl: 31.4,
    pvp: 10.2,
    roe: 32.6,
    bazinCeiling: 18.9,
    bazinUpside: -63.72,
    grahamFair: 26.4,
    grahamUpside: -49.33,
    score: 81,
    verdict:
      'Compounder de altíssima rentabilidade (ROE > 32%) e caixa líquido, negociada com prêmio de qualidade frente a Graham.',
  },
  {
    ticker: 'TAEE11',
    companyName: 'TAESA UNT',
    sector: 'Energia Elétrica',
    price: 35.4,
    dy: 9.8,
    pl: 8.6,
    pvp: 1.75,
    roe: 20.3,
    bazinCeiling: 48.2,
    bazinUpside: 36.15,
    grahamFair: 41.8,
    grahamUpside: 18.08,
    score: 88,
    verdict:
      'Receita previsível corrigida por inflação (RAP) em concessões de transmissão elétrica, ideal para carteira previdenciária.',
  },
];

const FAQ_ITEMS = [
  {
    question: 'O B-Stocks é realmente 100% gratuito no MVP?',
    answer:
      'Sim. Todas as ferramentas, filtros multicategoria, fórmulas de valuation de Graham e Bazin, rankings e teses geradas por Inteligência Artificial são totalmente gratuitas nesta versão.',
  },
  {
    question: 'A Inteligência Artificial calcula os valuations sozinha?',
    answer:
      'Não. IA generativa não deve calcular valuation sozinha pois pode alucinar números. Nossos modelos de Décio Bazin, Benjamin Graham e indicadores técnicos são 100% determinísticos e processados matematicamente no backend. A IA é acionada apenas para sintetizar os 3 tópicos qualitativos de tese quando solicitada.',
  },
  {
    question: 'O que é o Filtro de Corte institucional?',
    answer:
      'É uma blindagem para o investidor: ele exige que a ação tenha liquidez média diária acima de R$ 1 milhão (garantindo facilidade de compra e saída) e alavancagem financeira com Dívida Líquida / EBITDA menor que 3,0x (eliminando empresas superendividadas).',
  },
  {
    question: 'Como funciona o Preço-Teto de Décio Bazin?',
    answer:
      'Baseado no método do autor Décio Bazin, calcula o preço máximo a pagar pela ação dividindo a média dos proventos dos últimos 5 anos por 0,06 (garantindo um yield mínimo desejado de 6% ao ano para renda passiva).',
  },
];

export default function LandingHomePage() {
  const [selectedShowcase, setSelectedShowcase] = useState<ShowcaseStock>(
    SHOWCASE_STOCKS[0],
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100 antialiased font-sans flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[540px] w-[980px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute top-[680px] -left-40 h-[420px] w-[520px] rounded-full bg-cyan-500/8 blur-[130px]" />
        <div className="absolute top-[1400px] -right-40 h-[460px] w-[560px] rounded-full bg-emerald-600/8 blur-[140px]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-zinc-900 to-zinc-950 font-black text-base text-emerald-400 shadow-lg shadow-emerald-950/50">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-zinc-50">
                  B-STOCKS
                </span>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-300 px-2 py-0"
                >
                  B3 Quantitative
                </Badge>
                <Badge
                  variant="outline"
                  className="hidden sm:inline-flex border-zinc-700 bg-zinc-900/90 text-[10px] uppercase tracking-wider font-bold text-zinc-300"
                >
                  100% Free MVP
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400">
                Terminal de Inteligência Fundamentalista &amp; Valuation da B3
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-300">
            <a
              href="#mercado"
              className="hover:text-emerald-400 transition-colors"
            >
              Ibovespa &amp; Pregão
            </a>
            <a
              href="#rankings"
              className="hover:text-emerald-400 transition-colors"
            >
              Ranking dos Ativos
            </a>
            <a
              href="#metodologia"
              className="hover:text-emerald-400 transition-colors"
            >
              Engenharia Quantitativa
            </a>
            <a
              href="#projeto"
              className="hover:text-emerald-400 transition-colors"
            >
              Por Que B-Stocks
            </a>
            <a
              href="#noticias"
              className="hover:text-emerald-400 transition-colors"
            >
              Notícias da Bolsa
            </a>
            <a
              href="#faq"
              className="hover:text-emerald-400 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/terminal">
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-xl bg-emerald-500 px-4 text-xs font-extrabold text-zinc-950 hover:bg-emerald-400 gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Terminal className="h-3.5 w-3.5" />
                Acessar Terminal
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <StockTickerCarousel />

      <main className="relative z-10 flex-1 mx-auto w-full max-w-[1520px] space-y-24 px-4 py-10 sm:px-6 lg:px-8">
        <section
          data-testid="hero-landing-section"
          className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-zinc-950 p-6 sm:p-10 lg:p-14 shadow-2xl"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Motor Quantitativo B3 em Tempo Real</span>
                <span className="text-emerald-500/50">•</span>
                <span className="text-zinc-200">962 Ações Sincronizadas</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-zinc-50 leading-[1.08]">
                Decisões na Bolsa com{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Rigor Matemático
                </span>{' '}
                e Zero Achismo.
              </h1>

              <p className="max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-zinc-300">
                Unificamos as fórmulas clássicas de{' '}
                <strong className="text-zinc-100">
                  Décio Bazin (Preço-Teto DY 6%)
                </strong>{' '}
                e{' '}
                <strong className="text-zinc-100">
                  Benjamin Graham (Valor Intrínseco)
                </strong>{' '}
                com filtros institucionais de liquidez, momento técnico e teses
                qualitativas sob demanda para todas as empresas listadas na B3.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/terminal">
                  <Button
                    type="button"
                    size="lg"
                    data-testid="hero-explore-button"
                    className="h-12 rounded-xl bg-emerald-500 px-7 text-sm font-black text-zinc-950 hover:bg-emerald-400 gap-2 shadow-xl shadow-emerald-500/20 transition-all"
                  >
                    Abrir Terminal de Ações Completo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <a href="#mercado">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl border-zinc-700/90 bg-zinc-900/80 px-6 text-sm font-bold text-zinc-100 hover:border-zinc-600 hover:bg-zinc-800/90"
                  >
                    Ver Gráfico Ibovespa
                  </Button>
                </a>
              </div>

              <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3 text-xs font-medium text-zinc-300">
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-3.5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Valuation 100% Determinístico</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-3.5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>Filtro Anti-Alavancagem (&lt;3x EBITDA)</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-3.5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>11 Rankings Prontos + Customização</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-700/80 bg-zinc-900/90 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-200">
                      Simulador Rápido de Valuation
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-400">
                    Clique em um ativo
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-1.5">
                  {SHOWCASE_STOCKS.map((item) => {
                    const active = item.ticker === selectedShowcase.ticker;
                    return (
                      <button
                        key={item.ticker}
                        type="button"
                        onClick={() => setSelectedShowcase(item)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 px-2 text-xs font-extrabold transition-all ${
                          active
                            ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 shadow-sm'
                            : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <CompanyLogo
                          ticker={item.ticker}
                          size="sm"
                          className="h-4 w-4 border-0 bg-transparent"
                        />
                        <span>{item.ticker}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CompanyLogo
                        ticker={selectedShowcase.ticker}
                        companyName={selectedShowcase.companyName}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-zinc-50">
                            {selectedShowcase.ticker}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-zinc-700 text-[10px] text-zinc-300"
                          >
                            {selectedShowcase.sector}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400">
                          {selectedShowcase.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-zinc-500">
                        Cotação Atual
                      </div>
                      <div className="text-xl font-black text-zinc-100 tabular-nums">
                        {selectedShowcase.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Preço-Teto Bazin (6%)</span>
                        <Percent className="h-3.5 w-3.5 text-emerald-400" />
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <strong className="text-base font-black text-zinc-100 tabular-nums">
                          {selectedShowcase.bazinCeiling.toLocaleString(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          )}
                        </strong>
                        <span
                          className={`text-xs font-extrabold tabular-nums ${
                            selectedShowcase.bazinUpside >= 0
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {selectedShowcase.bazinUpside >= 0 ? '+' : ''}
                          {selectedShowcase.bazinUpside
                            .toFixed(1)
                            .replace('.', ',')}
                          %
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Preço Justo Graham</span>
                        <Calculator className="h-3.5 w-3.5 text-cyan-400" />
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <strong className="text-base font-black text-zinc-100 tabular-nums">
                          {selectedShowcase.grahamFair.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </strong>
                        <span
                          className={`text-xs font-extrabold tabular-nums ${
                            selectedShowcase.grahamUpside >= 0
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {selectedShowcase.grahamUpside >= 0 ? '+' : ''}
                          {selectedShowcase.grahamUpside
                            .toFixed(1)
                            .replace('.', ',')}
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-2.5 text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-zinc-500">
                        P/L
                      </span>
                      <strong className="font-bold text-zinc-200 tabular-nums">
                        {selectedShowcase.pl.toFixed(1).replace('.', ',')}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500">
                        P/VP
                      </span>
                      <strong className="font-bold text-zinc-200 tabular-nums">
                        {selectedShowcase.pvp.toFixed(1).replace('.', ',')}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500">
                        DY 12m
                      </span>
                      <strong className="font-bold text-emerald-400 tabular-nums">
                        {selectedShowcase.dy.toFixed(2).replace('.', ',')}%
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500">
                        Score B&amp;H
                      </span>
                      <strong className="font-black text-emerald-400 tabular-nums">
                        {selectedShowcase.score}/100
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[11px] leading-relaxed text-zinc-300">
                    <strong className="text-emerald-400">Síntese Quant: </strong>
                    {selectedShowcase.verdict}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">
                    Dados processados via motor B-Stocks
                  </span>
                  <Link
                    href={`/terminal?search=${encodeURIComponent(selectedShowcase.ticker)}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    Inspecionar {selectedShowcase.ticker} no Terminal
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-zinc-800/80 pt-8">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-zinc-50 tabular-nums">
                962
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Ativos da B3 Monitorados
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-zinc-50 tabular-nums">
                17
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Setores Econômicos Oficiais
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                11
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Rankings Fundamentalistas
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 tabular-nums">
                100%
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Aberto &amp; Gratuito no MVP
              </div>
            </div>
          </div>
        </section>

        <div id="mercado" className="scroll-mt-24">
          <IbovMarketOverview />
        </div>

        <LandingRankingsPreview />

        <section id="metodologia" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl space-y-2">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold tracking-wider"
              >
                Arquitetura Quantitativa Determinística
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
                Seis Pilares de Análise em um Único Terminal
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Zero caixas-pretas: todas as fórmulas seguem a literatura
                clássica de Value Investing e são calculadas diretamente no
                servidor sobre os balanços oficiais da B3.
              </p>
            </div>

            <Link href="/terminal">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-zinc-700 bg-zinc-900 text-xs font-bold text-zinc-100 hover:border-emerald-500/50 hover:bg-zinc-800 gap-1.5"
              >
                Testar Fórmulas na Prática
                <ArrowRight className="h-3.5 w-3.5 text-emerald-400" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/95 via-zinc-900/70 to-zinc-950 p-6 shadow-xl lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                    <Percent className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-300"
                  >
                    Renda Passiva &amp; Dividendos
                  </Badge>
                </div>
                <h3 className="text-lg font-extrabold text-zinc-100">
                  Preço-Teto de Décio Bazin (Piso de 6% a.a.)
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Extraído do livro{' '}
                  <em>&ldquo;Faça Fortuna com Ações Antes que Seja Tarde&rdquo;</em>
                  , estabelece o preço máximo que o investidor previdenciário
                  deve pagar para garantir um Dividend Yield mínimo de 6% ao ano
                  com base na média de proventos pagos nos últimos 5 anos.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5 font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span>Preço Teto = Média Proventos (5A) ÷ 0,06</span>
                <span className="text-[10px] text-zinc-500">Simulável 4% a 12%</span>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/95 via-zinc-900/70 to-zinc-950 p-6 shadow-xl lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-400">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold text-cyan-300"
                  >
                    Margem de Segurança Intrínseca
                  </Badge>
                </div>
                <h3 className="text-lg font-extrabold text-zinc-100">
                  Preço Justo de Benjamin Graham
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Criada pelo mentor de Warren Buffett, combina o Lucro por Ação
                  (LPA) e o Valor Patrimonial por Ação (VPA) sob a constante
                  conservadora 22,5 (equivalente a P/L máximo de 15x e P/VP
                  máximo de 1,5x), revelando o desconto real do papel.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/90 p-3.5 font-mono text-xs text-cyan-300 flex items-center justify-between">
                <span>Valor Intrínseco = √(22,5 × LPA × VPA)</span>
                <span className="text-[10px] text-zinc-500">Upside Automático</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-emerald-400">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">
                  Score Buy &amp; Hold (0–100)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Nota multifatorial ponderando Valuation (35%), Dividendos
                  (25%), Rentabilidade ROE/Margem (20%) e Tendência Técnica
                  (20%).
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300">
                35% Val + 25% Div + 20% ROE + 20% Tec
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">
                  Filtro Institucional de Corte
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Bloqueia micos e armadilhas de valor exigindo liquidez diária
                  acima de R$ 1M e Dívida Líquida/EBITDA inferior a 3,0x.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300">
                Liquidez &gt; R$ 1M • Dív/EBITDA &lt; 3x
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-cyan-400">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">
                  Momento Técnico (SMA &amp; IFR)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Rastreia médias móveis simples de 50 e 200 períodos (Golden
                  Cross) e o Índice de Força Relativa de 14 dias para timing de
                  entrada.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300">
                SMA 50 vs SMA 200 • IFR 14
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950 text-amber-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">
                  Tese Executiva IA em 3 Pontos
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ao clicar em qualquer ativo, nossa IA lê os múltiplos reais e
                  sintetiza: Pontos Fortes, Riscos Principais e Veredito
                  Direto.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300">
                Forças • Riscos • Veredito
              </div>
            </div>
          </div>
        </section>

        <section id="projeto" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] uppercase font-bold"
            >
              Por Que Criamos o B-Stocks
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
              O Fim das Planilhas Quebradas e do Ruído de Mercado
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Compare a abordagem tradicional do investidor pessoa física com o
              fluxo de trabalho estruturado do terminal B-Stocks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/25 bg-gradient-to-b from-red-950/20 via-zinc-900/90 to-zinc-900/90 p-6 sm:p-7 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 text-red-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 border border-red-500/30">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider">
                  Investindo no Escuro (Sem B-Stocks)
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">✕</span>
                  <span>
                    Compra por dicas de redes sociais ou manchetes emocionais no
                    topo histórico.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">✕</span>
                  <span>
                    Ausência de Preço-Teto claro, pagando caro por empresas com
                    lucros estagnados.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">✕</span>
                  <span>
                    Exposição acidental a empresas ilíquidas ou com dívida
                    explosiva (&gt; 3x EBITDA).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-black">✕</span>
                  <span>
                    Horas perdidas atualizando planilhas de Excel que quebram a
                    cada grupamento ou dividendo.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/25 via-zinc-900/90 to-zinc-900/90 p-6 sm:p-7 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider">
                  Investindo com B-Stocks (Processo Institucional)
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>
                    Preço-Teto de Bazin e Preço Justo de Graham calculados
                    instantaneamente para 962 ações.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>
                    Filtro institucional de corte que limpa automaticamente
                    empresas sem liquidez ou superendividadas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>
                    11 presets de ranking (Mais Baratas Graham/Bazin, Maiores
                    Receitas, Buy &amp; Hold, DY, Mais Queridas).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-black">✓</span>
                  <span>
                    Customizador de colunas para montar sua própria visão com
                    ROE, Margem Líquida, DY 5 anos e Variação.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <MarketNewsSection />

        <section id="faq" className="scroll-mt-24 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-300 text-[10px] uppercase font-bold"
            >
              Perguntas Frequentes
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
              Tire Suas Dúvidas Sobre o B-Stocks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800/90 bg-zinc-900/75 p-6 space-y-2.5 shadow-md"
              >
                <div className="flex items-center gap-2.5 font-extrabold text-sm text-zinc-100">
                  <HelpCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <h4>{item.question}</h4>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-zinc-900 via-emerald-950/30 to-zinc-900 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <Badge
              variant="outline"
              className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold"
            >
              Acesso Imediato • Sem Cadastro Obrigatório
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-zinc-50 tracking-tight">
              Pronto para encontrar as ações mais descontadas da B3?
            </h2>
            <p className="text-xs sm:text-base text-zinc-300 leading-relaxed">
              Abra o terminal completo agora mesmo, alterne entre os 11 rankings
              quantitativos e simule seu próprio Preço-Teto de Bazin.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/terminal">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-xl bg-emerald-500 px-8 text-sm font-black text-zinc-950 hover:bg-emerald-400 gap-2 shadow-xl shadow-emerald-500/20"
              >
                Acessar Terminal B-Stocks Agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-16 border-t border-zinc-800/80 bg-zinc-950/90 py-10">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-zinc-900 font-black text-xs text-emerald-400">
                B
              </div>
              <div>
                <span className="font-black text-sm text-zinc-100">
                  B-STOCKS
                </span>
                <span className="ml-2 text-xs text-zinc-400">
                  Terminal de Inteligência Quantitativa da B3
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-zinc-400">
              <Link
                href="/terminal"
                className="hover:text-emerald-400 transition-colors"
              >
                Terminal de Ações
              </Link>
              <a
                href="#mercado"
                className="hover:text-emerald-400 transition-colors"
              >
                Ibovespa &amp; Destaques
              </a>
              <a
                href="#metodologia"
                className="hover:text-emerald-400 transition-colors"
              >
                Metodologia Décio Bazin &amp; Graham
              </a>
              <a
                href="#faq"
                className="hover:text-emerald-400 transition-colors"
              >
                Perguntas Frequentes
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500">
            <span>
              B-Stocks MVP — Modelos matemáticos determinísticos: Preço Teto
              Bazin (DY 6%), Preço Justo de Benjamin Graham, SMA 50/200, IFR 14
              e Tese sob demanda com IA.
            </span>
            <span>
              Finalidade exclusivamente analítica e educacional. Não constitui
              recomendação de investimento.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
