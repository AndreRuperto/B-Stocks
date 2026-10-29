'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchMarketSummary,
  fetchStocks,
  triggerMarketSync,
} from '@/lib/api';
import {
  B3_STANDARD_CATEGORIES,
  FilterParams,
  MarketSummary,
  StockItem,
} from '@/lib/schemas';
import { MarketSummaryCards } from '@/components/market-summary-cards';
import { StocksRankingTable } from '@/components/stocks-ranking-table';
import { StockDetailDialog } from '@/components/stock-detail-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  Layers,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  const [summary, setSummary] = useState<MarketSummary | null>(null);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sectors, setSectors] = useState<string[]>([...B3_STANDARD_CATEGORIES]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [activeHeaderPreset, setActiveHeaderPreset] = useState<
    'todas' | 'maiores_receitas' | 'maiores_valor_mercado'
  >('todas');

  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    sector: 'ALL',
    sectors: [],
    thematicCategory: 'ALL',
    rankingPreset: 'valor_mercado',
    variationPeriod: '24h',
    onlyPassedCut: false,
    onlySmallCaps: false,
    oneStockPerCompany: false,
    onlyTop100Popular: false,
    minScore: 0,
    sortBy: 'marketCap',
    sortOrder: 'desc',
    page: 1,
    limit: 50,
  });

  const loadData = useCallback(async (currentFilters: FilterParams) => {
    setLoading(true);
    try {
      const [summaryRes, stocksRes] = await Promise.all([
        fetchMarketSummary(),
        fetchStocks(currentFilters),
      ]);
      setSummary(summaryRes);
      setStocks(stocksRes.items);
      setTotal(stocksRes.total);
      setTotalPages(stocksRes.totalPages);
      if (stocksRes.sectors && stocksRes.sectors.length > 0) {
        setSectors(stocksRes.sectors);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]);

  const handleUpdateFilters = (partial: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleHeaderPreset = (
    preset: 'todas' | 'maiores_receitas' | 'maiores_valor_mercado',
  ) => {
    setActiveHeaderPreset(preset);
    if (preset === 'todas') {
      setFilters((prev) => ({
        ...prev,
        rankingPreset: 'valor_mercado',
        onlyTop100Popular: false,
        sortBy: 'marketCap',
        sortOrder: 'desc',
        page: 1,
      }));
    } else if (preset === 'maiores_receitas') {
      setFilters((prev) => ({
        ...prev,
        rankingPreset: 'maiores_receitas',
        onlyTop100Popular: false,
        sortBy: 'revenue',
        sortOrder: 'desc',
        page: 1,
      }));
    } else if (preset === 'maiores_valor_mercado') {
      setFilters((prev) => ({
        ...prev,
        rankingPreset: 'valor_mercado',
        onlyTop100Popular: false,
        sortBy: 'marketCap',
        sortOrder: 'desc',
        page: 1,
      }));
    }
  };

  const handleToggleCategory = (category: string) => {
    setFilters((prev) => {
      const exists = prev.sectors.includes(category);
      const nextSectors = exists
        ? prev.sectors.filter((item) => item !== category)
        : [...prev.sectors, category];
      return {
        ...prev,
        sector: 'ALL',
        sectors: nextSectors,
        page: 1,
      };
    });
  };

  const handleClearCategories = () => {
    setFilters((prev) => ({
      ...prev,
      sector: 'ALL',
      sectors: [],
      page: 1,
    }));
  };

  const handleSelectStock = (stock: StockItem) => {
    setSelectedStock(stock);
    setModalOpen(true);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await triggerMarketSync();
      await loadData(filters);
    } finally {
      setSyncing(false);
    }
  };

  const scrollToTable = () => {
    const el = document.getElementById('ranking-table-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 font-black text-sm text-zinc-100">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-zinc-100">
                    B-STOCKS
                  </h1>
                  <Badge variant="default" className="text-[10px] font-semibold">
                    B3 Completo
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    100% Gratuito
                  </Badge>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Terminal de Análise Quantitativa e Fundamentalista da Bolsa Brasileira
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {summary?.lastSync && (
                <div className="text-right text-[11px] text-zinc-400">
                  <div>Fonte: {summary.lastSync.source}</div>
                  <div>
                    Atualizado em:{' '}
                    {new Date(summary.lastSync.timestamp).toLocaleString('pt-BR')}
                  </div>
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={syncing}
                data-testid="sync-b3-button"
                className="h-8"
              >
                <RefreshCw
                  className={`mr-1.5 h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`}
                />
                {syncing ? 'Sincronizando B3...' : 'Sincronizar B3'}
              </Button>
            </div>
          </div>

          <nav
            aria-label="Opções de Ranking no Header"
            className="flex flex-wrap items-center gap-2 border-t border-zinc-800/80 pt-2.5"
          >
            <span className="text-xs font-semibold text-zinc-400 mr-1">
              Modo Inicial:
            </span>
            <Button
              type="button"
              size="sm"
              variant={activeHeaderPreset === 'todas' ? 'default' : 'outline'}
              data-testid="header-preset-all"
              onClick={() => handleHeaderPreset('todas')}
              className="h-8"
            >
              Todas as Ações da Bolsa
            </Button>
            <Button
              type="button"
              size="sm"
              variant={
                activeHeaderPreset === 'maiores_receitas' ? 'default' : 'outline'
              }
              data-testid="header-preset-revenue"
              onClick={() => handleHeaderPreset('maiores_receitas')}
              className="h-8"
            >
              Maiores Receitas
            </Button>
            <Button
              type="button"
              size="sm"
              variant={
                activeHeaderPreset === 'maiores_valor_mercado'
                  ? 'default'
                  : 'outline'
              }
              data-testid="header-preset-marketcap"
              onClick={() => handleHeaderPreset('maiores_valor_mercado')}
              className="h-8"
            >
              Maiores Valor de Mercado
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1520px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section
          aria-label="Tela Inicial - Apresentação do Terminal"
          className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-2.5">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="text-[11px] uppercase tracking-wider font-bold">
                  Terminal de Mercado
                </Badge>
                <span className="text-xs text-zinc-400">
                  962 Ativos • 17 Setores • 11 Modos de Ranking
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
                Análise Matemática &amp; Fundamentalista para Decisões Conscientes na B3
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Combine o <strong>Preço-teto de Dividendos de Décio Bazin</strong>, o <strong>Preço Justo de Benjamin Graham</strong>, métricas de saúde financeira e tendências técnicas objetivas com síntese em 3 pontos gerada sob demanda via Inteligência Artificial.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={scrollToTable}
                  className="h-8 gap-1.5"
                >
                  Explorar Tabela Completa
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => handleHeaderPreset('maiores_valor_mercado')}
                  className="h-8"
                >
                  Ver Maiores por Market Cap
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 lg:w-96 shrink-0">
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Database className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Bazin 6%</span>
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-100">
                  Preço Teto Real
                </div>
                <div className="text-[10px] text-zinc-400">Renda passiva</div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <BookOpen className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Graham</span>
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-100">
                  Preço Justo
                </div>
                <div className="text-[10px] text-zinc-400">√(22,5 × LPA × VPA)</div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Activity className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Médias &amp; IFR</span>
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-100">
                  SMA 50 / 200
                </div>
                <div className="text-[10px] text-zinc-400">Golden &amp; Death Cross</div>
              </div>

              <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
                  <span>Tese IA</span>
                </div>
                <div className="mt-1 text-sm font-bold text-zinc-100">
                  3 Pontos Chave
                </div>
                <div className="text-[10px] text-zinc-400">Fortes, Riscos, Veredito</div>
              </div>
            </div>
          </div>
        </section>

        <MarketSummaryCards
          summary={summary}
          selectedCategory={filters.thematicCategory}
          onSelectCategory={(cat) =>
            handleUpdateFilters({ thematicCategory: cat, page: 1 })
          }
          onSelectStock={handleSelectStock}
        />

        <section
          aria-label="Filtro de Categorias da B3"
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm"
        >
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Categorias da B3 (Multi-seleção)
              </span>
              {filters.sectors.length > 0 && (
                <Badge variant="default" className="text-[11px] font-semibold">
                  {filters.sectors.length} selecionada(s)
                </Badge>
              )}
            </div>
            {filters.sectors.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs"
                data-testid="clear-categories-btn"
                onClick={handleClearCategories}
              >
                Limpar Categorias
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5" data-testid="category-chips-container">
            <button
              type="button"
              data-testid="category-chip-ALL"
              onClick={handleClearCategories}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.sectors.length === 0
                  ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-bold'
                  : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              Todas ({B3_STANDARD_CATEGORIES.length})
            </button>
            {B3_STANDARD_CATEGORIES.map((category) => {
              const isSelected = filters.sectors.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  data-testid={`category-chip-${category}`}
                  onClick={() => handleToggleCategory(category)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-zinc-100 bg-zinc-100 text-zinc-950 font-bold'
                      : 'border-zinc-800 bg-zinc-950/80 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        <div id="ranking-table-section">
          <StocksRankingTable
            items={stocks}
            total={total}
            page={filters.page}
            totalPages={totalPages}
            sectors={sectors}
            filters={filters}
            loading={loading}
            onUpdateFilters={handleUpdateFilters}
            onSelectStock={handleSelectStock}
          />
        </div>
      </main>

      <footer className="mt-12 border-t border-zinc-800 bg-zinc-900/60 py-5">
        <div className="mx-auto flex max-w-[1520px] flex-col items-center justify-between gap-2 px-4 text-xs text-zinc-400 sm:flex-row sm:px-6 lg:px-8">
          <span>
            B-Stocks MVP — Modelos matemáticos determinísticos (Décio Bazin, Benjamin Graham, SMA 50/200, RSI 14).
          </span>
          <span>
            Caráter exclusivamente educacional e analítico. Não constitui recomendação de compra ou venda.
          </span>
        </div>
      </footer>

      <StockDetailDialog
        stock={selectedStock}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
