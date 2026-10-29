'use client';

import React, { useEffect, useState } from 'react';
import {
  BazinCustomSimSchema,
  StockItem,
  StockThesis,
} from '@/lib/schemas';
import { fetchStockDetails, requestStockThesis } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyLogo } from '@/components/company-logo';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '@/lib/utils';

interface StockDetailDialogProps {
  stock: StockItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StockDetailDialog({
  stock,
  open,
  onOpenChange,
}: StockDetailDialogProps) {
  const [detailedStock, setDetailedStock] = useState<StockItem | null>(stock);
  const [thesis, setThesis] = useState<StockThesis | null>(null);
  const [loadingThesis, setLoadingThesis] = useState(false);
  const [customYield, setCustomYield] = useState<string>('6');
  const [apiKeyInput, setApiKeyInput] = useState<string>('');

  useEffect(() => {
    setDetailedStock(stock);
    setThesis(stock?.latestThesis || null);
    setCustomYield('6');

    if (open && stock) {
      let active = true;
      setLoadingThesis(true);
      fetchStockDetails(stock.ticker)
        .then(async (fresh) => {
          if (!active) return;
          setDetailedStock(fresh);
          if (fresh.latestThesis) {
            setThesis(fresh.latestThesis);
            setLoadingThesis(false);
          } else {
            const generated = await requestStockThesis(fresh.ticker);
            if (active) {
              setThesis(generated);
              setLoadingThesis(false);
            }
          }
        })
        .catch(() => {
          if (active) setLoadingThesis(false);
        });
      return () => {
        active = false;
      };
    }
  }, [stock, open]);

  if (!detailedStock) return null;

  const parsedYield = BazinCustomSimSchema.safeParse({
    targetYieldPercent: Number(customYield),
  });
  const effectiveYieldPercent = parsedYield.success
    ? parsedYield.data.targetYieldPercent
    : 6;
  const simulatedBazinCeiling =
    detailedStock.avgDividends5y > 0
      ? detailedStock.avgDividends5y / (effectiveYieldPercent / 100)
      : 0;
  const simulatedBazinMargin =
    simulatedBazinCeiling > 0 && detailedStock.price > 0
      ? ((simulatedBazinCeiling - detailedStock.price) / detailedStock.price) *
        100
      : -100;

  const handleRegenerateThesis = async () => {
    setLoadingThesis(true);
    try {
      const updated = await requestStockThesis(detailedStock.ticker, {
        apiKey: apiKeyInput.trim() || undefined,
        forceRefresh: true,
      });
      setThesis(updated);
    } finally {
      setLoadingThesis(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="stock-detail-modal">
        <DialogHeader className="border-b border-zinc-200 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <CompanyLogo
                ticker={detailedStock.ticker}
                logoUrl={detailedStock.logoUrl}
                companyName={detailedStock.companyName}
                size="lg"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle className="text-xl font-bold text-zinc-900">
                    {detailedStock.ticker} — {detailedStock.companyName}
                  </DialogTitle>
                  <Badge variant="default">
                    Score {detailedStock.scoreTotal.toFixed(1)} / 100
                  </Badge>
                  <Badge variant="secondary">
                    {detailedStock.thematicCategory}
                  </Badge>
                </div>
                <DialogDescription className="mt-1 text-xs text-zinc-600">
                  Setor: {detailedStock.sector} | Subsetor: {detailedStock.subsector}
                </DialogDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase text-zinc-500">Cotação Atual</div>
              <div
                data-testid="modal-stock-price"
                className="text-xl font-bold text-zinc-900 tabular-nums"
              >
                {formatCurrency(detailedStock.price)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview" data-testid="tab-overview">
              1. Valuation (Bazin &amp; Graham)
            </TabsTrigger>
            <TabsTrigger value="technical" data-testid="tab-technical">
              2. Tendência &amp; Score (0-100)
            </TabsTrigger>
            <TabsTrigger value="thesis" data-testid="tab-thesis">
              3. Tese de Investimento (IA)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-zinc-300 bg-zinc-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900">
                    A. Preço Teto de Dividendos (Décio Bazin)
                  </CardTitle>
                  <p className="text-xs text-zinc-600">
                    Fórmula: Média Anual de Proventos ÷ 0,06 (DY mínimo de 6% a.a.)
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Dividendo Médio Anual Estimado:</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {formatCurrency(detailedStock.avgDividends5y)} / ação
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Preço Teto Bazin (6%):</span>
                    <span
                      data-testid="modal-bazin-ceiling"
                      className="font-bold text-zinc-900 tabular-nums"
                    >
                      {detailedStock.bazinCeilingPrice > 0
                        ? formatCurrency(detailedStock.bazinCeilingPrice)
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-600">Margem de Segurança Bazin:</span>
                    <Badge
                      variant={
                        detailedStock.bazinMargin >= 0 ? 'positive' : 'negative'
                      }
                    >
                      {formatPercent(detailedStock.bazinMargin, true)}
                    </Badge>
                  </div>
                  <p className="pt-1 text-[11px] font-medium text-zinc-700">
                    {detailedStock.bazinMargin >= 0
                      ? 'Veredito Bazin: Preço Atual abaixo do Preço Teto (Margem positiva para dividendos).'
                      : 'Veredito Bazin: Preço Atual acima do Preço Teto (Ação cara para renda passiva de 6%).'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-zinc-300 bg-zinc-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900">
                    B. Preço Justo de Benjamin Graham
                  </CardTitle>
                  <p className="text-xs text-zinc-600">
                    Fórmula: √(22,5 × LPA × VPA) — P/L máx 15 e P/VP máx 1,5
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">LPA (Lucro por Ação) / VPA:</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">
                      {formatCurrency(detailedStock.lpa)} / {formatCurrency(detailedStock.vpa)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">Preço Justo Intrínseco:</span>
                    <span
                      data-testid="modal-graham-fair"
                      className="font-bold text-zinc-900 tabular-nums"
                    >
                      {detailedStock.grahamFairPrice > 0
                        ? formatCurrency(detailedStock.grahamFairPrice)
                        : 'N/A (LPA/VPA negativo)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-600">Margem de Segurança Graham:</span>
                    <Badge
                      variant={
                        detailedStock.grahamMargin >= 0 ? 'positive' : 'negative'
                      }
                    >
                      {formatPercent(detailedStock.grahamMargin, true)}
                    </Badge>
                  </div>
                  <p className="pt-1 text-[11px] font-medium text-zinc-700">
                    {detailedStock.grahamMargin >= 0
                      ? 'Veredito Graham: Empresa descontada frente aos seus lucros e patrimônio.'
                      : 'Veredito Graham: Múltiplos acima do limite clássico de Graham.'}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-zinc-300 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                  Simulador Interativo de Preço Teto (Décio Bazin)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="bazin-yield-input"
                      className="text-xs font-medium text-zinc-700"
                    >
                      Yield Mínimo Desejado (% a.a.):
                    </label>
                    <Input
                      id="bazin-yield-input"
                      data-testid="bazin-simulator-input"
                      type="number"
                      min={2}
                      max={25}
                      step={0.5}
                      value={customYield}
                      onChange={(e) => setCustomYield(e.target.value)}
                      className="w-24"
                    />
                    <div className="flex gap-1">
                      {['6', '8', '10'].map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setCustomYield(preset)}
                        >
                          {preset}%
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500">Teto Simulado ({effectiveYieldPercent}%): </span>
                      <span
                        data-testid="simulated-bazin-price"
                        className="font-bold text-zinc-900 tabular-nums"
                      >
                        {formatCurrency(simulatedBazinCeiling)}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Margem Simulada: </span>
                      <Badge
                        variant={simulatedBazinMargin >= 0 ? 'positive' : 'negative'}
                      >
                        {formatPercent(simulatedBazinMargin, true)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-[11px] text-zinc-500">P/L &amp; P/VP</div>
                <div className="mt-1 text-sm font-bold text-zinc-900 tabular-nums">
                  {detailedStock.pl.toFixed(2)}x / {detailedStock.pvp.toFixed(2)}x
                </div>
              </div>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-[11px] text-zinc-500">ROE &amp; ROIC</div>
                <div className="mt-1 text-sm font-bold text-zinc-900 tabular-nums">
                  {formatPercent(detailedStock.roe)} / {formatPercent(detailedStock.roic)}
                </div>
              </div>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-[11px] text-zinc-500">Margem Líquida / EBIT</div>
                <div className="mt-1 text-sm font-bold text-zinc-900 tabular-nums">
                  {formatPercent(detailedStock.netMargin)} / {formatPercent(detailedStock.ebitMargin)}
                </div>
              </div>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-[11px] text-zinc-500">Liquidez Diária / Dív.EBITDA</div>
                <div className="mt-1 text-sm font-bold text-zinc-900 tabular-nums">
                  {formatCompactCurrency(detailedStock.dailyLiquidity)} ({detailedStock.netDebtToEbitda.toFixed(2)}x)
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-zinc-300 bg-zinc-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900">
                    C. Tendência Técnica (Médias Móveis e IFR/RSI)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-200 py-1.5">
                    <span className="text-zinc-600">Status de Tendência:</span>
                    <Badge variant="default">{detailedStock.technicalTrend}</Badge>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1.5">
                    <span className="text-zinc-600">Média Móvel Simples 50 (SMA 50):</span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {formatCurrency(detailedStock.sma50)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1.5">
                    <span className="text-zinc-600">Média Móvel Simples 200 (SMA 200):</span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {formatCurrency(detailedStock.sma200)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-zinc-600">IFR / RSI (14 períodos):</span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {detailedStock.rsi14.toFixed(2)} (
                      {detailedStock.rsi14 > 70
                        ? 'Sobrecomprado > 70'
                        : detailedStock.rsi14 < 30
                          ? 'Sobrevendido < 30'
                          : 'Zona Neutra 30-70'}
                      )
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-300 bg-zinc-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-zinc-900">
                    D. Composição do Score Único ({detailedStock.scoreTotal.toFixed(1)} / 100)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">
                      1. Margem de Segurança (Peso 35%):
                    </span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {detailedStock.scoreValuation.toFixed(2)} / 35,00
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">
                      2. Histórico de Dividendos (Peso 25%):
                    </span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {detailedStock.scoreDividends.toFixed(2)} / 25,00
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">
                      3. Rentabilidade ROE &amp; Margem (Peso 20%):
                    </span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {detailedStock.scoreProfitability.toFixed(2)} / 20,00
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 py-1">
                    <span className="text-zinc-600">
                      4. Momento Técnico SMA &amp; RSI (Peso 20%):
                    </span>
                    <span className="font-bold text-zinc-900 tabular-nums">
                      {detailedStock.scoreTechnical.toFixed(2)} / 20,00
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-zinc-600">Filtro de Corte:</span>
                    <span className="font-semibold text-zinc-900">
                      {detailedStock.cutFilterReason}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="thesis" className="space-y-4">
            <Card className="border-zinc-300 bg-zinc-50">
              <CardHeader className="border-b border-zinc-200 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-bold text-zinc-900">
                      Resumo Narrativo de Tese &amp; Classificação Temática
                    </CardTitle>
                    <p className="text-xs text-zinc-600">
                      Motor: {thesis?.provider || 'Calculando...'}
                    </p>
                  </div>
                  <Badge variant="default">
                    {thesis?.businessCategory || detailedStock.thematicCategory}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4 text-xs leading-relaxed">
                {loadingThesis ? (
                  <div className="py-6 text-center text-zinc-600">
                    Processando múltiplos e gerando resumo narrativo...
                  </div>
                ) : thesis ? (
                  <div className="space-y-3" data-testid="thesis-content">
                    <div className="rounded border border-zinc-200 bg-white p-3">
                      <div className="font-bold uppercase tracking-wider text-zinc-800">
                        • Pontos Fortes
                      </div>
                      <p className="mt-1 text-zinc-700">{thesis.strengths}</p>
                    </div>
                    <div className="rounded border border-zinc-200 bg-white p-3">
                      <div className="font-bold uppercase tracking-wider text-zinc-800">
                        • Riscos Mapeados
                      </div>
                      <p className="mt-1 text-zinc-700">{thesis.risks}</p>
                    </div>
                    <div className="rounded border border-zinc-200 bg-white p-3">
                      <div className="font-bold uppercase tracking-wider text-zinc-800">
                        • Veredito de Longo Prazo
                      </div>
                      <p className="mt-1 font-medium text-zinc-900">
                        {thesis.verdict}
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-col gap-2 border-t border-zinc-200 pt-3 sm:flex-row sm:items-center">
                  <Input
                    type="password"
                    placeholder="Chave opcional Gemini API (Free Tier) para reprocessar..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleRegenerateThesis}
                    disabled={loadingThesis}
                    data-testid="regenerate-thesis-btn"
                  >
                    Recalcular Tese
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
