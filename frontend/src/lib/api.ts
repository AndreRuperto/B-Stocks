import axios from 'axios';
import {
  FilterParams,
  FilterParamsSchema,
  MarketSummary,
  MarketSummarySchema,
  PaginatedStocksResponse,
  PaginatedStocksResponseSchema,
  StockItem,
  StockItemSchema,
  StockThesis,
  StockThesisSchema,
} from './schemas';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
});

export async function fetchMarketSummary(): Promise<MarketSummary> {
  const response = await http.get('/stocks/summary');
  return MarketSummarySchema.parse(response.data);
}

export async function fetchStocks(
  rawParams: Partial<FilterParams>,
): Promise<PaginatedStocksResponse> {
  const params = FilterParamsSchema.parse(rawParams);
  const response = await http.get('/stocks', {
    params: {
      search: params.search,
      sector: params.sector,
      thematicCategory: params.thematicCategory,
      onlyPassedCut: String(params.onlyPassedCut),
      minScore: params.minScore,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      page: params.page,
      limit: params.limit,
    },
  });
  return PaginatedStocksResponseSchema.parse(response.data);
}

export async function fetchStockDetails(ticker: string): Promise<StockItem> {
  const response = await http.get(`/stocks/${encodeURIComponent(ticker)}`);
  return StockItemSchema.parse(response.data);
}

export async function requestStockThesis(
  ticker: string,
  options?: { apiKey?: string; forceRefresh?: boolean },
): Promise<StockThesis> {
  const response = await http.post(
    `/stocks/${encodeURIComponent(ticker)}/thesis`,
    options || {},
  );
  return StockThesisSchema.parse(response.data);
}

export async function triggerMarketSync(): Promise<{
  totalSynced: number;
  source: string;
  timestamp: string;
}> {
  const response = await http.post('/stocks/sync');
  return response.data;
}
