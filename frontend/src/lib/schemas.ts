import { z } from 'zod';

export const StockThesisSchema = z.object({
  id: z.string(),
  stockId: z.string(),
  strengths: z.string(),
  risks: z.string(),
  verdict: z.string(),
  businessCategory: z.string(),
  provider: z.string(),
  createdAt: z.string().optional(),
});

export type StockThesis = z.infer<typeof StockThesisSchema>;

export const StockItemSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  companyName: z.string(),
  logoUrl: z.string().optional().default(''),
  sector: z.string(),
  subsector: z.string(),
  price: z.number(),
  pl: z.number(),
  pvp: z.number(),
  psr: z.number(),
  dy: z.number(),
  lpa: z.number(),
  vpa: z.number(),
  roe: z.number(),
  roic: z.number(),
  netMargin: z.number(),
  ebitMargin: z.number(),
  netDebtToEbitda: z.number(),
  grossDebtToEquity: z.number(),
  dailyLiquidity: z.number(),
  revenueGrowth5y: z.number(),
  avgDividends5y: z.number(),
  bazinCeilingPrice: z.number(),
  bazinMargin: z.number(),
  grahamFairPrice: z.number(),
  grahamMargin: z.number(),
  sma50: z.number(),
  sma200: z.number(),
  rsi14: z.number(),
  technicalTrend: z.string(),
  passesCutFilter: z.boolean(),
  cutFilterReason: z.string(),
  scoreTotal: z.number(),
  scoreValuation: z.number(),
  scoreDividends: z.number(),
  scoreProfitability: z.number(),
  scoreTechnical: z.number(),
  thematicCategory: z.string(),
  updatedAt: z.string().optional(),
  latestThesis: StockThesisSchema.nullable().optional(),
});

export type StockItem = z.infer<typeof StockItemSchema>;

export const PaginatedStocksResponseSchema = z.object({
  items: z.array(StockItemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  sectors: z.array(z.string()),
});

export type PaginatedStocksResponse = z.infer<typeof PaginatedStocksResponseSchema>;

export const MarketSummarySchema = z.object({
  totalStocks: z.number(),
  passedCutCount: z.number(),
  bazinOpportunities: z.number(),
  grahamOpportunities: z.number(),
  avgScorePassed: z.number(),
  avgDyPassed: z.number(),
  avgRoePassed: z.number(),
  topRanking: z.array(StockItemSchema),
  categories: z.array(
    z.object({
      category: z.string(),
      count: z.number(),
    }),
  ),
  lastSync: z
    .object({
      source: z.string(),
      totalSynced: z.number(),
      timestamp: z.string(),
    })
    .nullable(),
});

export type MarketSummary = z.infer<typeof MarketSummarySchema>;

export const FilterParamsSchema = z.object({
  search: z.string().default(''),
  sector: z.string().default('ALL'),
  thematicCategory: z.string().default('ALL'),
  onlyPassedCut: z.boolean().default(false),
  minScore: z.number().min(0).max(100).default(0),
  sortBy: z
    .enum([
      'scoreTotal',
      'bazinMargin',
      'grahamMargin',
      'dy',
      'roe',
      'pl',
      'pvp',
      'dailyLiquidity',
      'ticker',
      'price',
    ])
    .default('scoreTotal'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(10).max(200).default(50),
});

export type FilterParams = z.infer<typeof FilterParamsSchema>;

export const BazinCustomSimSchema = z.object({
  targetYieldPercent: z.number().min(2).max(25),
});
