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
import { RefreshCw } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <header className="border-b border-zinc-300 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                  B-STOCKS
                </h1>
                <Badge variant="default">B3 Completo</Badge>
                <Badge variant="secondary">100% Gratuito</Badge>
              </div>
              <p className="mt-1 text-xs text-zinc-600">
                Análise determinística de todas as ações da B3: Preço Teto Décio Bazin, Preço Justo Benjamin Graham, SMA 50/200, IFR e Tese IA.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {summary?.lastSync && (
                <div className="text-right text-[11px] text-zinc-500">
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
            className="flex flex-wrap items-center gap-2 border-t border-zinc-200 pt-3"
          >
            <Button
              type="button"
              size="sm"
              variant={activeHeaderPreset === 'todas' ? 'default' : 'outline'}
              data-testid="header-preset-all"
              onClick={() => handleHeaderPreset('todas')}
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
            >
              Maiores Valor de Mercado
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
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
          className="rounded-md border border-zinc-300 bg-white p-4"
        >
          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                Categorias da B3 (Multi-seleção)
              </span>
              {filters.sectors.length > 0 && (
                <Badge variant="default" className="text-[11px]">
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
              className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                filters.sectors.length === 0
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:bg-zinc-200'
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
                  className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

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
      </main>

      <footer className="mt-12 border-t border-zinc-300 bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-zinc-500 sm:flex-row">
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
