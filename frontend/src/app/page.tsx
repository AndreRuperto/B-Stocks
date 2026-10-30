import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StockTickerCarousel } from '@/components/stock-ticker-carousel';
import { IbovMarketOverview } from '@/components/ibov-market-overview';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  HelpCircle,
  Layers,
  LineChart,
  Percent,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

const SECTORS_LIST = [
  'Água e Saneamento',
  'Bancos',
  'Bens Industriais',
  'Construção Civil',
  'Consumo Cíclico',
  'Consumo Não Cíclico',
  'Energia Elétrica',
  'Financeiro',
  'Materiais Básicos',
  'Mineração',
  'Petróleo, Gás e Biocombustíveis',
  'Previdência e Seguros',
  'Saúde',
  'Seguradoras',
  'Tecnologia',
  'Telecomunicações',
  'Utilidade Pública',
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
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans flex flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1520px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 font-black text-sm text-zinc-100">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-zinc-100">
                  B-STOCKS
                </span>
                <Badge
                  variant="outline"
                  className="border-zinc-700 text-[10px] text-zinc-300 px-1.5 py-0"
                >
                  B3 Realtime
                </Badge>
                <Badge
                  variant="default"
                  className="text-[10px] uppercase tracking-wider font-bold"
                >
                  100% Free MVP
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-400">
                Terminal de Inteligência Quantitativa da Bolsa Brasileira
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-300">
            <a href="#projeto" className="hover:text-zinc-100 transition-colors">
              O Projeto
            </a>
            <a href="#mercado" className="hover:text-zinc-100 transition-colors">
              Ibovespa &amp; Destaques
            </a>
            <a href="#metodologia" className="hover:text-zinc-100 transition-colors">
              Metodologia de Valuation
            </a>
            <a href="#setores" className="hover:text-zinc-100 transition-colors">
              17 Setores
            </a>
            <a href="#faq" className="hover:text-zinc-100 transition-colors">
              Dúvidas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/terminal">
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-lg px-4 text-xs font-semibold gap-1.5 shadow-sm"
              >
                Acessar Terminal
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <StockTickerCarousel />

      <main className="flex-1 mx-auto w-full max-w-[1520px] space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        <section
          data-testid="hero-landing-section"
          className="relative rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-12 lg:p-16 shadow-sm text-center"
        >
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-950/80 px-4 py-1 text-xs font-semibold text-zinc-300">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Terminal Quantitativo e Fundamentalista da B3
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">100% Gratuito no MVP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
              Análise Matemática &amp; Fundamentalista de Todas as Ações da Bolsa
            </h1>

            <p className="mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-300">
              Substitua o achismo por modelos consagrados: calcule o <strong>Preço-Teto de Décio Bazin (DY 6%)</strong>, o <strong>Preço Justo de Benjamin Graham</strong>, métricas de alavancagem, momento técnico estrutural e teses com Inteligência Artificial para todos os <strong>962 ativos da B3</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/terminal">
                <Button
                  type="button"
                  size="lg"
                  data-testid="hero-explore-button"
                  className="h-12 rounded-lg px-8 text-sm font-bold gap-2 shadow-sm"
                >
                  Abrir Terminal de Ações Completo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <a href="#metodologia">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-lg border-zinc-800 bg-zinc-950 px-6 text-sm font-semibold text-zinc-200 hover:bg-zinc-850 hover:text-zinc-100"
                >
                  Conhecer os Modelos
                </Button>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>962 ações da bolsa monitoradas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Modelos determinísticos sem alucinação</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Filtros institucionais de corte</span>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4 border-t border-zinc-800/80 pt-8">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tabular-nums">
                962
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Ativos da B3 Monitorados
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tabular-nums">
                17
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Setores Econômicos
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-zinc-100 tabular-nums">
                11
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Modos de Ranking
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 text-center">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
                100%
              </div>
              <div className="mt-1 text-xs font-semibold text-zinc-400">
                Gratuito no MVP
              </div>
            </div>
          </div>
        </section>

        <div id="mercado">
          <IbovMarketOverview />
        </div>

        <section id="projeto" className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
              Apresentação do Projeto
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Por que o B-Stocks foi criado?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              O investidor pessoa física na bolsa brasileira frequentemente é bombardeado por recomendações especulativas ou relatórios extensos. O <strong>B-Stocks</strong> nasceu para nivelar o jogo, entregando poder de processamento quantitativo institucional e cálculos matemáticos determinísticos de forma aberta e acessível.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-red-950/60 bg-zinc-900/90 p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Como a maioria investe (O Problema)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Dependência de opiniões subjetivas, notícias de curto prazo e boatos de redes sociais.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Compra de ações caras sem margem de segurança e sem preço-teto definido.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Alocação em empresas sem liquidez mínima e com endividamento impagável (Dívida/EBITDA &gt; 3x).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span>Planilhas manuais desatualizadas que tomam horas para recalcular proventos e lucros.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-emerald-950/60 bg-zinc-900/90 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Como você investe com o B-Stocks (A Solução)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Valuation matemático determinístico (Benjamin Graham e Décio Bazin 6% para dividendos).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Filtro de corte automático que descarta empresas ilíquidas ou excessivamente endividadas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Score Buy &amp; Hold único (0 a 100) ponderando valuation, dividendos, rentabilidade e momento.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Teses executivas em 3 tópicos (Pontos Fortes, Riscos e Veredito) sintetizadas via IA sob demanda.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="metodologia" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
              Modelos Matemáticos
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Metodologia de Valuation Determinística
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Todas as fórmulas são executadas com precisão no backend a partir de demonstrações financeiras oficiais.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <Percent className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Preço-Teto de Bazin (Décio Bazin)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Determina o teto máximo a pagar pela ação para receber no mínimo 6% de Dividend Yield anual, usando a média histórica real dos últimos 5 anos de dividendos.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                Preço Teto = Média Div (5 anos) / 0,06
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Preço Justo de Graham
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fórmula de Benjamin Graham que calcula o valor intrínseco baseado no lucro por ação (LPA) e valor patrimonial por ação (VPA) com multiplicador conservador 22,5.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                Preço Justo = √(22,5 × LPA × VPA)
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Score Buy &amp; Hold (0 a 100)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Algoritmo quantitativo ponderado: Valuation Graham/Bazin (35%), Histórico de Dividendos (25%), Rentabilidade ROE/Margem (20%) e Momento Técnico (20%).
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                Score = 35% Val + 25% Div + 20% Rent + 20% Tec
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Filtros de Corte &amp; Liquidez
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Proteção mandatória para eliminar empresas com liquidez diária inferior a R$ 1 milhão ou alavancagem com Dívida Líquida / EBITDA maior que 3,0x.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                Volume &gt; R$ 1M • Dív/EBITDA &lt; 3,0x
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <LineChart className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Momento Técnico Estrutural
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Acompanhamento estrutural com médias móveis simples de 50 e 200 períodos (Golden Cross de alta / Death Cross) e Índice de Força Relativa (IFR 14).
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                SMA 50 vs SMA 200 • IFR 14
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 text-zinc-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-100">
                Tese de IA em 3 Pontos
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ao abrir os detalhes de qualquer ativo, a inteligência artificial analisa os múltiplos e gera uma síntese de leitura rápida: Pontos Fortes, Riscos e Veredito.
              </p>
              <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-zinc-300">
                Pontos Fortes • Riscos • Veredito
              </div>
            </div>
          </div>
        </section>

        <section id="setores" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
              Cobertura Setorial
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              17 Setores Econômicos da B3 Padronizados
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Filtre ações simultaneamente combinando múltiplas categorias ou compare pares do mesmo segmento.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {SECTORS_LIST.map((sector) => (
              <Link
                key={sector}
                href="/terminal"
                className="group flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-3.5 transition-colors hover:border-zinc-600 hover:bg-zinc-850"
              >
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                  {sector}
                </span>
                <span className="mt-2 text-[10px] font-medium text-zinc-500 group-hover:text-zinc-400">
                  Explorar no Terminal &rarr;
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="faq" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-[10px] uppercase font-bold">
              Perguntas Frequentes
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              Dúvidas Sobre a Plataforma
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-2"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-zinc-100">
                  <HelpCircle className="h-4 w-4 text-zinc-400 shrink-0" />
                  <h4>{item.question}</h4>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed pl-6">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100">
              Pronto para analisar a bolsa com rigor matemático?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Acesse agora o terminal interativo do B-Stocks com rankings por dividend yield, mais baratas de Graham e Bazin, maiores receitas, maiores lucros e customização de colunas.
            </p>
          </div>

          <div>
            <Link href="/terminal">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-lg px-8 text-sm font-bold gap-2 shadow-sm"
              >
                Acessar Terminal B-Stocks Agora
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-zinc-800 bg-zinc-900/80 py-10">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950 font-black text-xs text-zinc-100">
                B
              </div>
              <div>
                <span className="font-bold text-sm text-zinc-100">B-STOCKS</span>
                <span className="ml-2 text-xs text-zinc-400">
                  Terminal de Inteligência Quantitativa da B3
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <Link href="/terminal" className="hover:text-zinc-200 transition-colors">
                Terminal de Ações
              </Link>
              <a href="#metodologia" className="hover:text-zinc-200 transition-colors">
                Metodologia Décio Bazin &amp; Graham
              </a>
              <a href="#mercado" className="hover:text-zinc-200 transition-colors">
                Ibovespa &amp; Destaques
              </a>
              <a href="#faq" className="hover:text-zinc-200 transition-colors">
                Perguntas Frequentes
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-zinc-800/80 pt-4 text-[11px] text-zinc-500">
            <span>
              B-Stocks MVP — Modelos matemáticos determinísticos: Preço Teto Bazin (DY 6%), Preço Justo de Benjamin Graham, SMA 50/200, IFR 14 e Tese sob demanda com IA.
            </span>
            <span>
              Finalidade exclusivamente analítica e educacional. Não constitui recomendação de investimento.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
