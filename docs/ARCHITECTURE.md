# Arquitetura do Sistema B-Stocks

## 1. Visão Geral

O **B-Stocks** foi projetado com separação estrita entre coleta/normalização de dados da B3, motor matemático determinístico, síntese assistida por IA sob demanda e apresentação visual sólida com logotipos das empresas.

```mermaid
flowchart TD
    subgraph Sources["Fontes de Dados Gratuitas (B3)"]
        Fundamentus["Fundamentus (Scraping em Lote dos 6 Setores)"]
        Brapi["Brapi.dev (Metadados, Setores e Logotipos SVG)"]
        Yahoo["Yahoo Finance v8 API (Série Histórica OHLCV e Dividendos)"]
        Gemini["Google Gemini 2.0 Flash API (Tier Gratuito)"]
    end

    subgraph Backend["Backend NestJS (TypeScript)"]
        MarketData["MarketDataService (Filtro dos 6 Setores + Ingestão de Logos)"]
        Valuation["ValuationService (Bazin, Graham, SMA 50/200, RSI 14, Score 0-100)"]
        AiService["AiService (Tese em 3 Pontos + Fallback Determinístico)"]
        StocksService["StocksService (Orquestração e Filtros)"]
        Prisma["PrismaService (ORM)"]
    end

    subgraph Database["PostgreSQL 18 (b-stocks)"]
        StockTable[("Tabela Stock (Elétrica, Bancos, Seguros, Commodities, Telecom, Saneamento)")]
        ThesisTable[("Tabela StockThesis")]
        SyncLogTable[("Tabela SyncLog")]
    end

    subgraph Frontend["Frontend Next.js 14 (React + Shadcn UI + Tailwind)"]
        Dashboard["Dashboard de Resumo Quantitativo"]
        RankingTable["Tabela com Ícones das Empresas e Filtros Zod"]
        Modal["Modal de Análise, Simulador Bazin e Tese IA"]
    end

    Fundamentus & Brapi & Yahoo --> MarketData
    MarketData --> Valuation
    Valuation --> StocksService
    Gemini --> AiService
    AiService --> StocksService
    StocksService --> Prisma
    Prisma --> StockTable & ThesisTable & SyncLogTable
    StocksService --> Dashboard & RankingTable & Modal
```

---

## 2. Setores Filtrados no Sistema

O sistema restringe o universo de análise aos 6 setores mais consistentes para geração de valor e renda passiva:
1. **Energia Elétrica:** Empresas de geração, transmissão e distribuição (ex: `TAEE11`, `TRPL4`, `EGIE3`, `CPFE3`, `CMIG4`).
2. **Bancos:** Instituições bancárias e holdings financeiras (ex: `BBAS3`, `ITUB4`, `BBDC4`, `SANB11`, `ITSA4`).
3. **Seguradoras:** Companhias de seguros, previdência e corretagem (ex: `BBSE3`, `CXSE3`, `PSSA3`).
4. **Commodities:** Petróleo, Mineração, Siderurgia, Papel & Celulose e Agronegócio (ex: `PETR4`, `VALE3`, `PRIO3`, `GGBR4`, `SUZB3`, `KLBN11`).
5. **Telecomunicações:** Provedoras de infraestrutura e serviços de telecomunicação (ex: `VIVT3`, `TIMS3`).
6. **Saneamento:** Empresas de saneamento básico, água e tratamento de resíduos (ex: `SBSP3`, `SAPR11`, `CSMG3`).

---

## 3. Pipeline de Identificação Visual (Logotipos)

- Cada ativo armazena um campo `logoUrl` persistido no banco de dados.
- O componente `CompanyLogo` busca o SVG vetorial oficial do ativo (`https://icons.brapi.dev/icons/${ticker}.svg`).
- Caso a imagem não esteja disponível ou ocorra falha de rede, um avatar monograma sólido com as iniciais do ticker é renderizado imediatamente em estilo neutro (`zinc-100`/`zinc-800`), sem layout shift.
