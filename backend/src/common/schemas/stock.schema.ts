import { z } from 'zod';

export const ThematicCategoryEnum = z.enum([
  'Renda / Vacas Leiteiras',
  'Crescimento Agressivo',
  'Defensiva',
  'Turnaround / Risco Alto',
]);

export type ThematicCategory = z.infer<typeof ThematicCategoryEnum>;

export const TechnicalTrendEnum = z.enum([
  'Alta Estrutural (Golden Cross)',
  'Tendência de Alta',
  'Lateral / Neutro',
  'Tendência de Baixa (Death Cross)',
]);

export type TechnicalTrend = z.infer<typeof TechnicalTrendEnum>;

export const RawMarketStockSchema = z.object({
  ticker: z.string().min(4).max(10).transform((val) => val.toUpperCase().trim()),
  companyName: z.string().min(1),
  logoUrl: z.string().optional().default(''),
  sector: z.string().min(1),
  subsector: z.string().min(1),
  segment: z.string().optional().default('Tradicional B3'),
  price: z.number().nonnegative(),
  marketCap: z.number().optional().default(0),
  equity: z.number().optional().default(0),
  revenue: z.number().optional().default(0),
  netIncome: z.number().optional().default(0),
  pl: z.number(),
  pvp: z.number(),
  psr: z.number(),
  dy: z.number(),
  dy5y: z.number().optional().default(0),
  roe: z.number(),
  roic: z.number(),
  netMargin: z.number(),
  ebitMargin: z.number(),
  netDebtToEbitda: z.number(),
  grossDebtToEquity: z.number(),
  dailyLiquidity: z.number().nonnegative(),
  revenueGrowth5y: z.number(),
  change24h: z.number().optional().default(0),
  change30d: z.number().optional().default(0),
  change12m: z.number().optional().default(0),
  change5y: z.number().optional().default(0),
  lpa: z.number().optional(),
  vpa: z.number().optional(),
  avgDividends5y: z.number().nonnegative().optional(),
  closes: z.array(z.number().positive()).optional(),
});

export type RawMarketStock = z.infer<typeof RawMarketStockSchema>;

export const StockFilterQuerySchema = z.object({
  search: z.string().optional().default(''),
  sector: z.string().optional().default('ALL'),
  sectors: z
    .union([z.array(z.string()), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map((s) => s.trim()).filter(Boolean);
      return val
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
    })
    .default([]),
  thematicCategory: z.string().optional().default('ALL'),
  rankingPreset: z.string().optional().default('valor_mercado'),
  onlyPassedCut: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      return false;
    })
    .default(false),
  onlySmallCaps: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      return false;
    })
    .default(false),
  oneStockPerCompany: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      return false;
    })
    .default(false),
  onlyTop100Popular: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => {
      if (typeof val === 'boolean') return val;
      if (val === 'true') return true;
      return false;
    })
    .default(false),
  minScore: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      if (val === undefined || val === '') return 0;
      const parsed = Number(val);
      return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
    })
    .default(0),
  sortBy: z
    .enum([
      'scoreTotal',
      'bazinMargin',
      'bazinCeilingPrice',
      'grahamMargin',
      'grahamFairPrice',
      'dy',
      'dy5y',
      'roe',
      'pl',
      'pvp',
      'dailyLiquidity',
      'ticker',
      'price',
      'marketCap',
      'equity',
      'revenue',
      'netIncome',
      'netMargin',
      'grossDebtToEquity',
      'change24h',
      'change30d',
      'change12m',
      'change5y',
      'sector',
      'subsector',
      'segment',
    ])
    .optional()
    .default('scoreTotal'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  page: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      const parsed = Number(val);
      return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
    })
    .default(1),
  limit: z
    .union([z.number(), z.string()])
    .optional()
    .transform((val) => {
      const parsed = Number(val);
      return Number.isFinite(parsed) && parsed >= 1 ? Math.min(1000, Math.floor(parsed)) : 50;
    })
    .default(50),
});

export type StockFilterQuery = z.infer<typeof StockFilterQuerySchema>;

export const AiThesisResponseSchema = z.object({
  strengths: z.string().min(10),
  risks: z.string().min(10),
  verdict: z.string().min(10),
  businessCategory: ThematicCategoryEnum,
});

export type AiThesisResponse = z.infer<typeof AiThesisResponseSchema>;
