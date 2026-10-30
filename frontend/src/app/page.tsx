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
import { BrandLogo } from '@/components/brand-logo';
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Calculator,
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
    <div className="relative min-h-screen overflow-x-hidden bg-mist-950 text-stone-100 antialiased font-sans flex flex-col selection:bg-mist-700 selection:text-stone-50">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        </div>

      <header className="sticky top-0 z-40 border-b border-mist-800/80 bg-mist-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <BrandLogo />

          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-stone-300">
            <a
              href="#mercado"
              className="hover:text-stone-100 transition-colors"
            >
              Ibovespa &amp; Pregão
            </a>
            <a
              href="#rankings"
              className="hover:text-stone-100 transition-colors"
            >
              Ranking dos Ativos
            </a>
            <a
              href="#metodologia"
              className="hover:text-stone-100 transition-colors"
            >
              Engenharia Quantitativa
            </a>
            <a
              href="#projeto"
              className="hover:text-stone-100 transition-colors"
            >
              Por Que B-Stocks
            </a>
            <a
              href="#noticias"
              className="hover:text-stone-100 transition-colors"
            >
              Notícias da Bolsa
            </a>
            <a
              href="#faq"
              className="hover:text-stone-100 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/terminal">
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-xl bg-mist-700 px-4 text-xs font-extrabold text-stone-50 border border-mist-600 hover:bg-mist-600 gap-1.5 shadow-lg transition-all"
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
          className="relative overflow-hidden rounded-3xl border border-mist-800/90 bg-mist-900/80 p-6 sm:p-10 lg:p-14 shadow-2xl"
        >
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">

              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-stone-50 leading-[1.08]">
                Decisões na Bolsa com{' '}
                <span className="text-mist-400">
                  Rigor Matemático
                </span>{' '}
                e Zero Achismo.
              </h1>

              <p className="max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-stone-300">
                Unificamos as fórmulas clássicas de{' '}
                <strong className="text-stone-100">
                  Décio Bazin (Preço-Teto DY 6%)
                </strong>{' '}
                e{' '}
                <strong className="text-stone-100">
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
                    className="h-12 rounded-xl bg-mist-700 px-7 text-sm font-black text-stone-50 border border-mist-600 hover:bg-mist-600 gap-2 shadow-xl transition-all"
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
                    className="h-12 rounded-xl border-mist-700/90 bg-mist-900/80 px-6 text-sm font-bold text-stone-100 hover:border-mist-600 hover:bg-mist-800/90"
                  >
                    Ver Gráfico Ibovespa
                  </Button>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-mist-700/80 bg-mist-900/90 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-mist-800 pb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-mist-500" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-stone-200">
                      Simulador Rápido de Valuation
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-400">
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
                            ? 'border-mist-700 bg-mist-800/60 text-stone-100 shadow-sm'
                            : 'border-mist-800 bg-mist-950/70 text-stone-400 hover:border-mist-700 hover:text-stone-200'
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

                <div className="mt-4 rounded-xl border border-mist-800 bg-mist-950/90 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CompanyLogo
                        ticker={selectedShowcase.ticker}
                        companyName={selectedShowcase.companyName}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-stone-50">
                            {selectedShowcase.ticker}
                          </span>
                          <Badge
                            variant="outline"
                            className="border-mist-700 text-[10px] text-stone-300"
                          >
                            {selectedShowcase.sector}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-400">
                          {selectedShowcase.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase text-stone-500">
                        Cotação Atual
                      </div>
                      <div className="text-xl font-black text-stone-100 tabular-nums">
                        {selectedShowcase.price.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-mist-800/90 bg-mist-900/70 p-3">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Preço-Teto Bazin (6%)</span>
                        <Percent className="h-3.5 w-3.5 text-stone-100" />
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <strong className="text-base font-black text-stone-100 tabular-nums">
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
                              : 'text-red-400'
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

                    <div className="rounded-xl border border-mist-800/90 bg-mist-900/70 p-3">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Preço Justo Graham</span>
                        <Calculator className="h-3.5 w-3.5 text-stone-100" />
                      </div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <strong className="text-base font-black text-stone-100 tabular-nums">
                          {selectedShowcase.grahamFair.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </strong>
                        <span
                          className={`text-xs font-extrabold tabular-nums ${
                            selectedShowcase.grahamUpside >= 0
                              ? 'text-emerald-400'
                              : 'text-red-400'
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

                  <div className="mt-3 grid grid-cols-4 gap-2 rounded-xl border border-mist-800/80 bg-mist-900/40 p-2.5 text-center text-xs">
                    <div>
                      <span className="block text-[10px] text-stone-500">
                        P/L
                      </span>
                      <strong className="font-bold text-stone-200 tabular-nums">
                        {selectedShowcase.pl.toFixed(1).replace('.', ',')}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500">
                        P/VP
                      </span>
                      <strong className="font-bold text-stone-200 tabular-nums">
                        {selectedShowcase.pvp.toFixed(1).replace('.', ',')}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500">
                        DY 12m
                      </span>
                      <strong className="font-bold text-emerald-400 tabular-nums">
                        {selectedShowcase.dy.toFixed(2).replace('.', ',')}%
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500">
                        Score B&amp;H
                      </span>
                      <strong className="font-black text-emerald-400 tabular-nums">
                        {selectedShowcase.score}/100
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3 rounded-lg border border-mist-700 bg-mist-800/60 p-2.5 text-[11px] leading-relaxed text-stone-300">
                    <strong className="text-stone-100">Síntese Quant: </strong>
                    {selectedShowcase.verdict}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    Dados processados via motor B-Stocks
                  </span>
                  <Link
                    href={`/terminal?search=${encodeURIComponent(selectedShowcase.ticker)}`}
                    className="inline-flex items-center gap-1 font-bold text-stone-100 hover:text-stone-100"
                  >
                    Inspecionar {selectedShowcase.ticker} no Terminal
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-mist-800/80 pt-8">
            <div className="rounded-2xl border border-mist-800/80 bg-mist-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-stone-50 tabular-nums">
                962
              </div>
              <div className="mt-1 text-xs font-semibold text-stone-400">
                Ativos da B3 Monitorados
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/80 bg-mist-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-stone-50 tabular-nums">
                17
              </div>
              <div className="mt-1 text-xs font-semibold text-stone-400">
                Setores Econômicos Oficiais
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/80 bg-mist-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-stone-100 tabular-nums">
                11
              </div>
              <div className="mt-1 text-xs font-semibold text-stone-400">
                Rankings Fundamentalistas
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/80 bg-mist-900/60 p-4 text-center backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-black text-stone-100 tabular-nums">
                100%
              </div>
              <div className="mt-1 text-xs font-semibold text-stone-400">
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
                className="border-mist-700 bg-mist-800/60 text-stone-100 text-[10px] uppercase font-bold tracking-wider"
              >
                Arquitetura Quantitativa Determinística
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
                Seis Pilares de Análise em um Único Terminal
              </h2>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
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
                className="rounded-xl border-mist-700 bg-mist-900 text-xs font-bold text-stone-100 hover:border-mist-700 hover:bg-mist-800 gap-1.5"
              >
                Testar Fórmulas na Prática
                <ArrowRight className="h-3.5 w-3.5 text-stone-100" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
            <div className="group relative overflow-hidden rounded-2xl border border-mist-800/90 bg-mist-900/80 p-6 shadow-xl lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-mist-700 bg-mist-800/60 text-stone-100">
                    <Percent className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-mist-700 bg-mist-800/60 text-[10px] font-bold text-stone-100"
                  >
                    Renda Passiva &amp; Dividendos
                  </Badge>
                </div>
                <h3 className="text-lg font-extrabold text-stone-100">
                  Preço-Teto de Décio Bazin (Piso de 6% a.a.)
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Extraído do livro{' '}
                  <em>&ldquo;Faça Fortuna com Ações Antes que Seja Tarde&rdquo;</em>
                  , estabelece o preço máximo que o investidor previdenciário
                  deve pagar para garantir um Dividend Yield mínimo de 6% ao ano
                  com base na média de proventos pagos nos últimos 5 anos.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-mist-800 bg-mist-950/90 p-3.5 font-mono text-xs text-stone-100 flex items-center justify-between">
                <span>Preço Teto = Média Proventos (5A) ÷ 0,06</span>
                <span className="text-[10px] text-stone-500">Simulável 4% a 12%</span>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-mist-800/90 bg-mist-900/80 p-6 shadow-xl lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-mist-700 bg-mist-800/60 text-stone-100">
                    <Calculator className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-mist-700 bg-mist-800/60 text-[10px] font-bold text-stone-100"
                  >
                    Margem de Segurança Intrínseca
                  </Badge>
                </div>
                <h3 className="text-lg font-extrabold text-stone-100">
                  Preço Justo de Benjamin Graham
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                  Criada pelo mentor de Warren Buffett, combina o Lucro por Ação
                  (LPA) e o Valor Patrimonial por Ação (VPA) sob a constante
                  conservadora 22,5 (equivalente a P/L máximo de 15x e P/VP
                  máximo de 1,5x), revelando o desconto real do papel.
                </p>
              </div>
              <div className="mt-5 rounded-xl border border-mist-800 bg-mist-950/90 p-3.5 font-mono text-xs text-stone-100 flex items-center justify-between">
                <span>Valor Intrínseco = √(22,5 × LPA × VPA)</span>
                <span className="text-[10px] text-stone-500">Upside Automático</span>
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/90 bg-mist-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-700 bg-mist-950 text-stone-100">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-stone-100">
                  Score Buy &amp; Hold (0–100)
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Nota multifatorial ponderando Valuation (35%), Dividendos
                  (25%), Rentabilidade ROE/Margem (20%) e Tendência Técnica
                  (20%).
                </p>
              </div>
              <div className="rounded-lg border border-mist-800 bg-mist-950 p-2.5 font-mono text-[11px] text-stone-300">
                35% Val + 25% Div + 20% ROE + 20% Tec
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/90 bg-mist-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-700 bg-mist-950 text-stone-100">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-stone-100">
                  Filtro Institucional de Corte
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Bloqueia micos e armadilhas de valor exigindo liquidez diária
                  acima de R$ 1M e Dívida Líquida/EBITDA inferior a 3,0x.
                </p>
              </div>
              <div className="rounded-lg border border-mist-800 bg-mist-950 p-2.5 font-mono text-[11px] text-stone-300">
                Liquidez &gt; R$ 1M • Dív/EBITDA &lt; 3x
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/90 bg-mist-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-700 bg-mist-950 text-stone-100">
                  <LineChart className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-stone-100">
                  Momento Técnico (SMA &amp; IFR)
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Rastreia médias móveis simples de 50 e 200 períodos (Golden
                  Cross) e o Índice de Força Relativa de 14 dias para timing de
                  entrada.
                </p>
              </div>
              <div className="rounded-lg border border-mist-800 bg-mist-950 p-2.5 font-mono text-[11px] text-stone-300">
                SMA 50 vs SMA 200 • IFR 14
              </div>
            </div>

            <div className="rounded-2xl border border-mist-800/90 bg-mist-900/75 p-5 shadow-lg lg:col-span-3 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-mist-700 bg-mist-950 text-stone-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-stone-100">
                  Tese Executiva IA em 3 Pontos
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Ao clicar em qualquer ativo, nossa IA lê os múltiplos reais e
                  sintetiza: Pontos Fortes, Riscos Principais e Veredito
                  Direto.
                </p>
              </div>
              <div className="rounded-lg border border-mist-800 bg-mist-950 p-2.5 font-mono text-[11px] text-stone-300">
                Forças • Riscos • Veredito
              </div>
            </div>
          </div>
        </section>

        <section id="projeto" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge
              variant="outline"
              className="border-mist-700 bg-mist-900 text-stone-300 text-[10px] uppercase font-bold"
            >
              Por Que Criamos o B-Stocks
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
              O Fim das Planilhas Quebradas e do Ruído de Mercado
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Compare a abordagem tradicional do investidor pessoa física com o
              fluxo de trabalho estruturado do terminal B-Stocks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-mist-700 bg-mist-900/80 p-6 sm:p-7 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 text-stone-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist-800/60 border border-mist-700">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider">
                  Investindo no Escuro (Sem B-Stocks)
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✕</span>
                  <span>
                    Compra por dicas de redes sociais ou manchetes emocionais no
                    topo histórico.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✕</span>
                  <span>
                    Ausência de Preço-Teto claro, pagando caro por empresas com
                    lucros estagnados.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✕</span>
                  <span>
                    Exposição acidental a empresas ilíquidas ou com dívida
                    explosiva (&gt; 3x EBITDA).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✕</span>
                  <span>
                    Horas perdidas atualizando planilhas de Excel que quebram a
                    cada grupamento ou dividendo.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-mist-700 bg-mist-900/80 p-6 sm:p-7 space-y-4 shadow-lg">
              <div className="flex items-center gap-2.5 text-stone-100">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mist-800/60 border border-mist-700">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider">
                  Investindo com B-Stocks (Processo Institucional)
                </h3>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✓</span>
                  <span>
                    Preço-Teto de Bazin e Preço Justo de Graham calculados
                    instantaneamente para 962 ações.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✓</span>
                  <span>
                    Filtro institucional de corte que limpa automaticamente
                    empresas sem liquidez ou superendividadas.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✓</span>
                  <span>
                    11 presets de ranking (Mais Baratas Graham/Bazin, Maiores
                    Receitas, Buy &amp; Hold, DY, Mais Queridas).
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-stone-100 font-black">✓</span>
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
              className="border-mist-700 bg-mist-900 text-stone-300 text-[10px] uppercase font-bold"
            >
              Perguntas Frequentes
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-50">
              Tire Suas Dúvidas Sobre o B-Stocks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-mist-800/90 bg-mist-900/75 p-6 space-y-2.5 shadow-md"
              >
                <div className="flex items-center gap-2.5 font-extrabold text-sm text-stone-100">
                  <HelpCircle className="h-4 w-4 text-stone-100 shrink-0" />
                  <h4>{item.question}</h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-mist-700 bg-mist-900/80 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <Badge
              variant="outline"
              className="border-mist-700 bg-mist-800/60 text-stone-100 text-[10px] uppercase font-bold"
            >
              Acesso Imediato • Sem Cadastro Obrigatório
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-50 tracking-tight">
              Pronto para encontrar as ações mais descontadas da B3?
            </h2>
            <p className="text-xs sm:text-base text-stone-300 leading-relaxed">
              Abra o terminal completo agora mesmo, alterne entre os 11 rankings
              quantitativos e simule seu próprio Preço-Teto de Bazin.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/terminal">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-xl bg-mist-700 px-8 text-sm font-black text-stone-50 border border-mist-600 hover:bg-mist-600 gap-2 shadow-xl"
              >
                Acessar Terminal B-Stocks Agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-16 border-t border-mist-800/80 bg-mist-950/90 py-10">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-mist-700 bg-mist-900 font-black text-xs text-stone-100">
                B
              </div>
              <div>
                <span className="font-black text-sm text-stone-100">
                  B-STOCKS
                </span>
                <span className="ml-2 text-xs text-stone-400">
                  Terminal de Inteligência Quantitativa da B3
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-stone-400">
              <Link
                href="/terminal"
                className="hover:text-stone-100 transition-colors"
              >
                Terminal de Ações
              </Link>
              <a
                href="#mercado"
                className="hover:text-stone-100 transition-colors"
              >
                Ibovespa &amp; Destaques
              </a>
              <a
                href="#metodologia"
                className="hover:text-stone-100 transition-colors"
              >
                Metodologia Décio Bazin &amp; Graham
              </a>
              <a
                href="#faq"
                className="hover:text-stone-100 transition-colors"
              >
                Perguntas Frequentes
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-mist-800/80 pt-4 text-[11px] text-stone-500">
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
