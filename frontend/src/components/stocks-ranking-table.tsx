'use client';

import React from 'react';
import { FilterParams, StockItem } from '@/lib/schemas';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyLogo } from '@/components/company-logo';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';

interface StocksRankingTableProps {
  items: StockItem[];
  total: number;
  page: number;
  totalPages: number;
  sectors: string[];
  filters: FilterParams;
  loading: boolean;
  onUpdateFilters: (partial: Partial<FilterParams>) => void;
  onSelectStock: (stock: StockItem) => void;
}

export function StocksRankingTable({
  items,
  total,
  page,
  totalPages,
  sectors,
  filters,
  loading,
  onUpdateFilters,
  onSelectStock,
}: StocksRankingTableProps) {
  const getScoreBadgeVariant = (score: number, passes: boolean) => {
    if (!passes) return 'secondary';
    if (score >= 70) return 'positive';
    if (score >= 50) return 'warning';
    return 'negative';
  };

  const getMarginBadgeVariant = (margin: number) => {
    if (margin >= 10) return 'positive';
    if (margin >= 0) return 'warning';
    return 'negative';
  };

  return (
    <Card className="border-zinc-300 bg-white">
      <CardHeader className="border-b border-zinc-200 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base font-bold text-zinc-900">
              Ranking de Ações da B3
            </CardTitle>
            <p className="mt-1 text-xs text-zinc-600">
              Exibindo {items.length} de {total} empresas listadas na B3
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-zinc-300 bg-zinc-50 px-3 py-1.5">
              <Switch
                data-testid="cut-filter-switch"
                checked={filters.onlyPassedCut}
                onCheckedChange={(checked) =>
                  onUpdateFilters({ onlyPassedCut: checked, page: 1 })
                }
              />
              <span className="text-xs font-medium text-zinc-800">
                Filtro de Corte (Liq &gt; R$ 1M e Dív/EBITDA &lt; 3,0)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              data-testid="search-input"
              placeholder="Buscar por ticker (ex: PETR4, BBAS3, TAEE11) ou empresa..."
              value={filters.search}
              onChange={(e) =>
                onUpdateFilters({ search: e.target.value, page: 1 })
              }
              className="pl-9"
            />
          </div>

          <div>
            <select
              data-testid="sector-select"
              value={filters.sector}
              onChange={(e) =>
                onUpdateFilters({ sector: e.target.value, page: 1 })
              }
              className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            >
              <option value="ALL">Todos os Setores da B3</option>
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              data-testid="sort-select"
              value={filters.sortBy}
              onChange={(e) =>
                onUpdateFilters({
                  sortBy: e.target.value as FilterParams['sortBy'],
                  page: 1,
                })
              }
              className="flex h-9 w-full rounded-md border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-600"
            >
              <option value="scoreTotal">Ordenar por: Score Geral (0-100)</option>
              <option value="bazinMargin">Ordenar por: Margem Décio Bazin</option>
              <option value="grahamMargin">Ordenar por: Margem Benjamin Graham</option>
              <option value="dy">Ordenar por: Dividend Yield (DY)</option>
              <option value="roe">Ordenar por: ROE (%)</option>
              <option value="dailyLiquidity">Ordenar por: Liquidez Diária</option>
              <option value="pl">Ordenar por: P/L</option>
              <option value="pvp">Ordenar por: P/VP</option>
              <option value="price">Ordenar por: Cotação (R$)</option>
              <option value="ticker">Ordenar por: Ticker (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 flex-1"
              onClick={() =>
                onUpdateFilters({
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
                  page: 1,
                })
              }
            >
              {filters.sortOrder === 'desc' ? (
                <>
                  <ArrowDown className="mr-1.5 h-3.5 w-3.5" /> Maior p/ Menor
                </>
              ) : (
                <>
                  <ArrowUp className="mr-1.5 h-3.5 w-3.5" /> Menor p/ Maior
                </>
              )}
            </Button>
            <select
              data-testid="limit-select"
              value={filters.limit}
              onChange={(e) =>
                onUpdateFilters({ limit: Number(e.target.value), page: 1 })
              }
              className="flex h-9 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-900 focus:outline-none"
            >
              <option value={25}>25 / pág</option>
              <option value={50}>50 / pág</option>
              <option value={100}>100 / pág</option>
              <option value={200}>200 / pág</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Ativo / Empresa</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Teto Bazin (6%)</TableHead>
              <TableHead>Justo Graham</TableHead>
              <TableHead>DY / ROE</TableHead>
              <TableHead>P/L &amp; P/VP</TableHead>
              <TableHead>Liquidez / Dív.</TableHead>
              <TableHead>Tendência &amp; IFR</TableHead>
              <TableHead>Classificação</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell colSpan={12} className="h-12 text-center text-xs text-zinc-500">
                    Carregando dados quantitativos da B3...
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center text-sm text-zinc-600">
                  Nenhuma ação encontrada para os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              items.map((stock, index) => {
                const rankNumber = (page - 1) * filters.limit + index + 1;
                return (
                  <TableRow
                    key={stock.ticker}
                    data-testid={`stock-row-${stock.ticker}`}
                    className="cursor-pointer"
                    onClick={() => onSelectStock(stock)}
                  >
                    <TableCell className="text-xs font-medium text-zinc-500">
                      {rankNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <CompanyLogo
                          ticker={stock.ticker}
                          logoUrl={stock.logoUrl}
                          companyName={stock.companyName}
                          size="md"
                        />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-zinc-900">
                              {stock.ticker}
                            </span>
                            {!stock.passesCutFilter && (
                              <Badge variant="outline" className="px-1 py-0 text-[10px] text-zinc-500">
                                Alerta Corte
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-zinc-600 truncate max-w-[170px]">
                            {stock.companyName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {stock.sector}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900">
                      {formatCurrency(stock.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-zinc-900">
                          {stock.bazinCeilingPrice > 0
                            ? formatCurrency(stock.bazinCeilingPrice)
                            : 'N/A'}
                        </span>
                        {stock.bazinCeilingPrice > 0 ? (
                          <Badge
                            variant={getMarginBadgeVariant(stock.bazinMargin)}
                            className="w-fit px-1.5 py-0 text-[10px]"
                          >
                            {formatPercent(stock.bazinMargin, true)}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-zinc-400">Sem DY</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-zinc-900">
                          {stock.grahamFairPrice > 0
                            ? formatCurrency(stock.grahamFairPrice)
                            : 'N/A'}
                        </span>
                        {stock.grahamFairPrice > 0 ? (
                          <Badge
                            variant={getMarginBadgeVariant(stock.grahamMargin)}
                            className="w-fit px-1.5 py-0 text-[10px]"
                          >
                            {formatPercent(stock.grahamMargin, true)}
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-zinc-400">
                            LPA/VPA neg.
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-900">
                          DY: {formatPercent(stock.dy)}
                        </span>
                        <span className="text-zinc-600">
                          ROE: {formatPercent(stock.roe)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-zinc-900">
                          P/L: {stock.pl.toFixed(2)}x
                        </span>
                        <span className="text-zinc-600">
                          P/VP: {stock.pvp.toFixed(2)}x
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-zinc-900">
                          {formatCompactCurrency(stock.dailyLiquidity)}
                        </span>
                        <span className="text-zinc-500">
                          Dív/EBITDA: {stock.netDebtToEbitda.toFixed(2)}x
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-zinc-800">
                          {stock.technicalTrend.includes('Golden Cross')
                            ? 'Alta (Golden Cross)'
                            : stock.technicalTrend.includes('Death Cross')
                              ? 'Baixa (Death Cross)'
                              : stock.technicalTrend}
                        </span>
                        <span className="text-zinc-500">
                          RSI(14): {stock.rsi14.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {stock.thematicCategory}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-0.5">
                        <Badge
                          variant={getScoreBadgeVariant(
                            stock.scoreTotal,
                            stock.passesCutFilter,
                          )}
                          className="text-xs font-bold"
                        >
                          {stock.scoreTotal.toFixed(1)} / 100
                        </Badge>
                        <span className="text-[10px] font-medium text-zinc-600">
                          {!stock.passesCutFilter
                            ? 'Reprovada no Corte'
                            : stock.scoreTotal >= 68
                              ? 'Compensa'
                              : stock.scoreTotal >= 50
                                ? 'Neutro / Aguardar'
                                : 'Evitar / Cara'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        data-testid={`analyze-btn-${stock.ticker}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                      >
                        Analisar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-200 px-4 py-3 sm:flex-row">
          <div className="text-xs text-zinc-600">
            Página <span className="font-bold text-zinc-900">{page}</span> de{' '}
            <span className="font-bold text-zinc-900">{totalPages}</span> ({total}{' '}
            ações encontradas)
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onUpdateFilters({ page: Math.max(1, page - 1) })}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                onUpdateFilters({ page: Math.min(totalPages, page + 1) })
              }
            >
              Próxima <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
