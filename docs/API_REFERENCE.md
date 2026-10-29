# Referência da API REST — B-Stocks

Base URL padrão: `http://localhost:3001/api`

---

## 1. `GET /api/stocks/summary`
Retorna as estatísticas consolidadas das ações de todas as empresas listadas na B3, contagem de oportunidades em Bazin/Graham, distribuição por categoria temática e o Top 6 do ranking.

### Exemplo de Resposta (`200 OK`)
```json
{
  "totalStocks": 962,
  "passedCutCount": 468,
  "bazinOpportunities": 232,
  "grahamOpportunities": 298,
  "avgScorePassed": 67.45,
  "avgDyPassed": 7.12,
  "avgRoePassed": 18.50,
  "topRanking": [ ... ],
  "categories": [
    { "category": "Renda / Vacas Leiteiras", "count": 284 },
    { "category": "Defensiva", "count": 312 },
    { "category": "Crescimento Agressivo", "count": 186 },
    { "category": "Turnaround / Risco Alto", "count": 180 }
  ],
  "lastSync": {
    "source": "Fundamentus + Brapi B3 Core Sectors (962 tickers)",
    "totalSynced": 962,
    "timestamp": "2026-10-29T21:49:56.000Z"
  }
}
```

---

## 2. `GET /api/stocks`
Retorna a lista paginada, ordenada e filtrada de todas as empresas e ações da B3.

### Objeto Stock
Cada item retornado inclui:
- `ticker`: Símbolo de negociação (ex: `"PETR4"`, `"BBAS3"`, `"WEGE3"`).
- `companyName`: Razão social da empresa.
- `logoUrl`: URL do logotipo oficial (`https://icons.brapi.dev/icons/${ticker}.svg`).
- `sector`: Setor econômico na B3 (ex: `"Financeiro"`, `"Petróleo, Gás e Biocombustíveis"`, `"Bens Industriais"`, etc.).
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
Dispara a coleta em lote de todas as ações no Fundamentus + Brapi, recalcula todos os modelos matemáticos e atualiza o banco PostgreSQL.
