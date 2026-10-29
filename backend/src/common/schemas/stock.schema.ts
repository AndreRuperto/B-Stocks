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
  sector: z.string().min(1),
  subsector: z.string().min(1),
  price: z.number().nonnegative(),
  pl: z.number(),
  pvp: z.number(),
  psr: z.number(),
  dy: z.number(),
  roe: z.number(),
  roic: z.number(),
  netMargin: z.number(),
  ebitMargin: z.number(),
  netDebtToEbitda: z.number(),
  grossDebtToEquity: z.number(),
  dailyLiquidity: z.number().nonnegative(),
  revenueGrowth5y: z.number(),
  lpa: z.number().optional(),
  vpa: z.number().optional(),
  avgDividends5y: z.number().nonnegative().optional(),
  closes: z.array(z.number().positive()).optional(),
});

export type RawMarketStock = z.infer<typeof RawMarketStockSchema>;

export const StockFilterQuerySchema = z.object({
  search: z.string().optional().default(''),
  sector: z.string().optional().default('ALL'),
  thematicCategory: z.string().optional().default('ALL'),
  onlyPassedCut: z
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
      'grahamMargin',
      'dy',
      'roe',
      'pl',
      'pvp',
      'dailyLiquidity',
      'ticker',
      'price',
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
