# Referência da API REST — B-Stocks

Base URL padrão: `http://localhost:3001/api`

---

## 1. `GET /api/stocks/summary`
Retorna as estatísticas consolidadas de todas as ações listadas na B3, contagem de oportunidades em Bazin/Graham, distribuição por categoria temática e o Top 6 do ranking.

### Exemplo de Resposta (`200 OK`)
```json
{
  "totalStocks": 962,
  "passedCutCount": 195,
  "bazinOpportunities": 112,
  "grahamOpportunities": 128,
  "avgScorePassed": 69.42,
  "avgDyPassed": 6.84,
  "avgRoePassed": 17.35,
  "topRanking": [ ... ],
  "categories": [
    { "category": "Renda / Vacas Leiteiras", "count": 148 },
    { "category": "Defensiva", "count": 290 },
    { "category": "Crescimento Agressivo", "count": 94 },
    { "category": "Turnaround / Risco Alto", "count": 430 }
  ],
  "lastSync": {
    "source": "Fundamentus + Brapi B3 Full Batch (962 tickers)",
    "totalSynced": 962,
    "timestamp": "2026-10-29T20:19:18.000Z"
  }
}
```

---

## 2. `GET /api/stocks`
Retorna a lista paginada, ordenada e filtrada de ações da B3.

### Query Parameters (Validados via Zod)
| Parâmetro | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `search` | `string` | `""` | Filtra por ticker (ex: `PETR4`), nome da empresa ou setor. |
| `sector` | `string` | `"ALL"` | Filtra por setor específico da B3. |
| `thematicCategory` | `string` | `"ALL"` | Filtra por classificação temática (`Renda / Vacas Leiteiras`, `Crescimento Agressivo`, `Defensiva`, `Turnaround / Risco Alto`). |
| `onlyPassedCut` | `boolean` | `false` | Se `true`, retorna apenas ativos com Liquidez Diária $\ge \text{R\$ } 1\text{M}$ e Dívida Líq./EBITDA $< 3{,}0\text{x}$. |
| `minScore` | `number` | `0` | Pontuação mínima no Score B-Stocks (0 a 100). |
| `sortBy` | `string` | `"scoreTotal"` | Campo de ordenação (`scoreTotal`, `bazinMargin`, `grahamMargin`, `dy`, `roe`, `pl`, `pvp`, `dailyLiquidity`, `price`, `ticker`). |
| `sortOrder` | `string` | `"desc"` | Direção da ordenação (`asc` ou `desc`). |
| `page` | `number` | `1` | Página atual. |
| `limit` | `number` | `50` | Quantidade de itens por página (máximo `1000`). |

---

## 3. `GET /api/stocks/:ticker`
Retorna todos os múltiplos fundamentalistas, preços de Bazin e Graham, indicadores técnicos (SMA 50, SMA 200, RSI 14), decomposição do Score e a última tese gerada para o ticker informado.

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
Dispara a coleta em lote de todas as ações da B3 no Fundamentus + Brapi, recalcula todos os modelos matemáticos e atualiza o banco PostgreSQL.

