# Referência da API REST — B-Stocks

Base URL padrão: `http://localhost:3001/api`

---

## 1. `GET /api/stocks/summary`
Retorna as estatísticas consolidadas das ações dos 6 setores da B3 (Elétrica, Bancos, Seguradoras, Commodities, Telecomunicações e Saneamento), contagem de oportunidades em Bazin/Graham, distribuição por categoria temática e o Top 6 do ranking.

### Exemplo de Resposta (`200 OK`)
```json
{
  "totalStocks": 212,
  "passedCutCount": 115,
  "bazinOpportunities": 68,
  "grahamOpportunities": 74,
  "avgScorePassed": 71.25,
  "avgDyPassed": 7.42,
  "avgRoePassed": 18.80,
  "topRanking": [ ... ],
  "categories": [
    { "category": "Renda / Vacas Leiteiras", "count": 82 },
    { "category": "Defensiva", "count": 78 },
    { "category": "Crescimento Agressivo", "count": 28 },
    { "category": "Turnaround / Risco Alto", "count": 24 }
  ],
  "lastSync": {
    "source": "Fundamentus + Brapi B3 Core Sectors (212 tickers)",
    "totalSynced": 212,
    "timestamp": "2026-10-29T21:04:08.000Z"
  }
}
```

---

## 2. `GET /api/stocks`
Retorna a lista paginada, ordenada e filtrada de ações dos 6 setores da B3.

### Objeto Stock
Cada item retornado inclui:
- `ticker`: Símbolo de negociação (ex: `"PETR4"`).
- `companyName`: Razão social da empresa.
- `logoUrl`: URL do logotipo oficial (`https://icons.brapi.dev/icons/${ticker}.svg`).
- `sector`: Um dos 6 setores (`"Energia Elétrica"`, `"Bancos"`, `"Seguradoras"`, `"Commodities"`, `"Telecomunicações"`, `"Saneamento"`).
- `subsector`: Segmento específico de atuação.
- Indicadores determinísticos: `bazinCeilingPrice`, `bazinMargin`, `grahamFairPrice`, `grahamMargin`, `sma50`, `sma200`, `rsi14`, `scoreTotal`.

---

## 3. `GET /api/stocks/:ticker`
Retorna todos os múltiplos fundamentalistas, logotipo oficial, preços de Bazin e Graham, indicadores técnicos (SMA 50, SMA 200, RSI 14), decomposição do Score e a última tese gerada para o ticker informado.

---

## 4. `POST /api/stocks/:ticker/thesis`
Gera (ou atualiza) sob demanda o resumo narrativo em 3 pontos (**Pontos Fortes**, **Riscos** e **Veredito de Longo Prazo**) e a classificação temática do ativo.

### Body (Opcional)
```json
{
  "apiKey": "CHAVE_OPCIONAL_GEMINI_FREE_TIER",
  "forceRefresh": true
}
```

---

## 5. `POST /api/stocks/sync`
Dispara a coleta em lote das ações dos 6 setores essenciais no Fundamentus + Brapi, recalcula todos os modelos matemáticos e atualiza o banco PostgreSQL.
