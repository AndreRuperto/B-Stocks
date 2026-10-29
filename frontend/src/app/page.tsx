'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  fetchMarketSummary,
  fetchStocks,
  triggerMarketSync,
} from '@/lib/api';
import { FilterParams, MarketSummary, StockItem } from '@/lib/schemas';
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
  const [sectors, setSectors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    sector: 'ALL',
    thematicCategory: 'ALL',
    onlyPassedCut: true,
    minScore: 0,
    sortBy: 'scoreTotal',
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
      setSectors(stocksRes.sectors);
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
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                B-STOCKS
              </h1>
              <Badge variant="default">B3 Quant &amp; Valuation</Badge>
              <Badge variant="secondary">100% Gratuito</Badge>
            </div>
            <p className="mt-1 text-xs text-zinc-600">
              Análise determinística da B3: Preço Teto Décio Bazin, Preço Justo Benjamin Graham, SMA 50/200, IFR e Tese IA.
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

