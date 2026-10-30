'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Database,
  Layers,
  LineChart,
  Percent,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface LandingPresentationProps {
  totalStocks: number;
  onExplore: () => void;
  onSelectPreset: (preset: 'todas' | 'maiores_receitas' | 'maiores_valor_mercado') => void;
}

export function LandingPresentation({
  totalStocks,
  onExplore,
  onSelectPreset,
}: LandingPresentationProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-testid="hero-landing-section"
      className="space-y-12"
      aria-label="Tela Inicial - Landing Page B-Stocks"
    >
      <section className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-3.5 py-1 text-xs font-semibold text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Terminal Quantitativo 100% Gratuito no MVP
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">Dados Reais da B3</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl leading-tight sm:leading-none">
            Análise Fundamentalista &amp; Matemática de Ações na B3
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-300">
            Encontre ativos subavaliados com margem de segurança real. Aplicamos os modelos de <strong>Décio Bazin (DY 6%)</strong>, <strong>Benjamin Graham</strong>, métricas de alavancagem, momento técnico e teses sintéticas com Inteligência Artificial.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              size="lg"
              data-testid="hero-explore-button"
              onClick={onExplore}
              className="h-11 rounded-lg px-6 text-sm font-semibold gap-2 shadow-sm"
            >
              Acessar Terminal de Ações
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('metodologia')}
              className="h-11 rounded-lg border-zinc-800 bg-zinc-950 px-6 text-sm font-semibold text-zinc-200 hover:bg-zinc-850 hover:text-zinc-100"
            >
              Conhecer os Modelos
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
              <span>{totalStocks > 0 ? totalStocks : 962} ações da bolsa monitoradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
              <span>Modelos determinísticos sem alucinações</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-zinc-300" />
              <span>Filtros de liquidez e governança</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
            <div className="text-xl sm:text-2xl font-black text-zinc-100 tabular-nums">
              {totalStocks > 0 ? totalStocks : 962}
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-400">
              Empresas na B3
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
            <div className="text-xl sm:text-2xl font-black text-zinc-100 tabular-nums">
              17
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-400">
              Setores Econômicos
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
            <div className="text-xl sm:text-2xl font-black text-zinc-100 tabular-nums">
              11
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-400">
              Modos de Ranking
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
            <div className="text-xl sm:text-2xl font-black text-zinc-100 tabular-nums">
              0%
            </div>
            <div className="mt-1 text-xs font-medium text-zinc-400">
              Custo no MVP
            </div>
          </div>
        </div>
      </section>

      <section id="metodologia" className="space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="border-zinc-700 text-zinc-300 uppercase text-[11px] font-bold">
            Metodologias Quantitativas
          </Badge>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
            Como Avaliamos se Vale a Pena Comprar
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-zinc-400">
            A IA não calcula valuations sozinha. Nossos algoritmos executam fórmulas matemáticas determinísticas no backend e usam inteligência artificial apenas para resumir o cenário.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Preço-Teto de Bazin
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Determina o preço máximo a pagar para garantir no mínimo 6% de Dividend Yield anual, utilizando a média histórica dos proventos pagos nos últimos 5 anos.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              Preço Teto = Média Dividendos / 0,06
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Preço Justo de Graham
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Modelo clássico de Benjamin Graham que identifica companhias com lucro e patrimônio consistentes negociadas abaixo do seu valor intrínseco.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              Preço Justo = √(22,5 × LPA × VPA)
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Filtros de Corte &amp; Liquidez
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Proteção institucional para eliminar armadilhas: volume financeiro diário superior a R$ 1 milhão e relação Dívida Líquida / EBITDA menor que 3,0x.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              Liq &gt; R$ 1M • Dív/EBITDA &lt; 3,0x
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Score Buy &amp; Hold (0 a 100)
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Algoritmo ponderado ponderando Valuation (35%), Proventos (25%), Rentabilidade ROE/Margem (20%) e Momento Técnico Estrutural (20%).
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              Score = 35% Val + 25% Div + 20% Rent + 20% Tec
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <LineChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Momento Técnico (SMA &amp; IFR)
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Acompanhamento estrutural com médias móveis simples de 50 e 200 períodos (Golden e Death Cross) e Índice de Força Relativa (IFR 14).
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              SMA 50 vs SMA 200 • IFR 14
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Tese de IA em 3 Pontos
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Quando você abre uma ação, a inteligência artificial analisa os múltiplos e gera uma síntese objetiva: Pontos Fortes, Riscos Mapeados e Veredito de Longo Prazo.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
              Pontos Fortes • Riscos • Veredito
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8">
        <div className="text-center mb-8">
          <Badge variant="outline" className="border-zinc-700 text-zinc-300 uppercase text-[11px] font-bold">
            Fluxo do Sistema
          </Badge>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
            Como Funciona o B-Stocks
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="text-xs font-black text-zinc-500">ETAPA 01</div>
            <div className="text-sm font-bold text-zinc-100">Coleta e Tratamento B3</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consolidação de cotações, múltiplos, histórico de dividendos e balanços de todas as empresas listadas.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="text-xs font-black text-zinc-500">ETAPA 02</div>
            <div className="text-sm font-bold text-zinc-100">Cálculo Determinístico</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Processamento quantitativo dos preços justos de Graham e Bazin, além dos scores ponderados de Buy &amp; Hold.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="text-xs font-black text-zinc-500">ETAPA 03</div>
            <div className="text-sm font-bold text-zinc-100">11 Modos de Ranking</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Filtros multicategoria por 17 setores, opções de customização e ordenação por upside ou múltiplos operacionais.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-2">
            <div className="text-xs font-black text-zinc-500">ETAPA 04</div>
            <div className="text-sm font-bold text-zinc-100">Decisão &amp; Simulação</div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Simulador em tempo real de yield mínimo desejado e geração de teses de investimento com IA sob demanda.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 border-t border-zinc-800/80 pt-6 sm:flex-row">
          <span className="text-xs text-zinc-400">
            Pronto para começar a analisar as empresas da B3?
          </span>
          <Button
            type="button"
            size="sm"
            onClick={onExplore}
            className="rounded-lg font-semibold gap-1.5"
          >
            Ir para a Tabela do Terminal
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

