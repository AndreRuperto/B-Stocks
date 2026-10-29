import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  RawMarketStock,
  RawMarketStockSchema,
} from '../common/schemas/stock.schema';
import {
  B3CompanyMeta,
  FALLBACK_B3_STOCKS,
  normalizeTargetSector,
  resolveB3CompanyMeta,
} from './b3-catalog';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  parseBrazilianNumber(value: string): number {
    if (!value) return 0;
    const cleaned = value
      .replace(/\s+/g, '')
      .replace('%', '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  deriveNetDebtToEbitda(
    evEbitda: number,
    pEbit: number,
    evEbit: number,
    grossDebtToEquity: number,
    sector: string,
  ): number {
    const isFinancial =
      sector.toLowerCase().includes('financ') ||
      sector.toLowerCase().includes('banco') ||
      sector.toLowerCase().includes('segur');
    if (isFinancial) {
      return 0;
    }
    if (evEbitda > 0 && evEbit > 0 && pEbit > 0) {
      const ratio = evEbitda * (1 - pEbit / evEbit);
      if (Number.isFinite(ratio) && ratio >= -10 && ratio <= 25) {
        return Number(ratio.toFixed(2));
      }
    }
    if (grossDebtToEquity > 0) {
      return Number(Math.min(15, grossDebtToEquity * 1.35).toFixed(2));
    }
    return 0;
  }

  buildSyntheticCloses(
    price: number,
    roe: number,
    dy: number,
    revenueGrowth5y: number,
    pl: number,
  ): number[] {
    if (price <= 0) return [];
    const closes: number[] = [];
    const fundamentalDrift =
      pl > 0 && roe >= 12
        ? 0.00055
        : pl <= 0 || roe < 0
          ? -0.00065
          : 0.00018;
    const oscillationSeed =
      ((Math.abs(roe) * 3 + Math.abs(dy) * 7 + Math.abs(revenueGrowth5y)) % 17) /
      1000;
    let cursor = price / Math.pow(1 + fundamentalDrift, 210);
    for (let i = 0; i < 210; i++) {
      const wave = Math.sin(i * 0.23) * (0.004 + oscillationSeed);
      cursor = Math.max(0.1, cursor * (1 + fundamentalDrift + wave * 0.15));
      closes.push(Number(cursor.toFixed(2)));
    }
    closes[closes.length - 1] = Number(price.toFixed(2));
    return closes;
  }

  parseFundamentusHtml(
    html: string,
    externalMetaMap: Map<string, B3CompanyMeta> = new Map(),
  ): RawMarketStock[] {
    const $ = cheerio.load(html);
    const results: RawMarketStock[] = [];
    const seen = new Set<string>();

    $('#resultado tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length < 22) return;

      const ticker = $(cells[0]).text().trim().toUpperCase();
      if (!ticker || seen.has(ticker)) return;

      const catalogMeta = resolveB3CompanyMeta(ticker);
      const extMeta = externalMetaMap.get(ticker);

      const targetSector =
        catalogMeta.isAllowed
          ? catalogMeta.sector
          : extMeta?.sector
            ? normalizeTargetSector(extMeta.sector, extMeta.subsector)
            : null;

      if (!targetSector) {
        return;
      }

      const price = this.parseBrazilianNumber($(cells[1]).text());
      if (price <= 0) return;

      const pl = this.parseBrazilianNumber($(cells[2]).text());
      const pvp = this.parseBrazilianNumber($(cells[3]).text());
      const psr = this.parseBrazilianNumber($(cells[4]).text());
      const dy = this.parseBrazilianNumber($(cells[5]).text());
      const pEbit = this.parseBrazilianNumber($(cells[8]).text());
      const evEbit = this.parseBrazilianNumber($(cells[10]).text());
      const evEbitda = this.parseBrazilianNumber($(cells[11]).text());
      const ebitMargin = this.parseBrazilianNumber($(cells[13]).text());
      const netMargin = this.parseBrazilianNumber($(cells[14]).text());
      const roic = this.parseBrazilianNumber($(cells[16]).text());
      const roe = this.parseBrazilianNumber($(cells[17]).text());
      const dailyLiquidity = this.parseBrazilianNumber($(cells[18]).text());
      const grossDebtToEquity = this.parseBrazilianNumber($(cells[20]).text());
      const revenueGrowth5y = this.parseBrazilianNumber($(cells[21]).text());

      const companyName = extMeta?.companyName || catalogMeta.companyName;
      const subsector = extMeta?.subsector || catalogMeta.subsector;
      const logoUrl =
        extMeta?.logoUrl || `https://icons.brapi.dev/icons/${ticker}.svg`;

      const netDebtToEbitda = this.deriveNetDebtToEbitda(
        evEbitda,
        pEbit,
        evEbit,
        grossDebtToEquity,
        targetSector,
      );

      const closes = this.buildSyntheticCloses(
        price,
        roe,
        dy,
        revenueGrowth5y,
        pl,
      );

      const candidate = {
        ticker,
        companyName,
        logoUrl,
        sector: targetSector,
        subsector,
        price,
        pl: Math.max(-500, Math.min(500, pl)),
        pvp: Math.max(-100, Math.min(200, pvp)),
        psr: Math.max(-100, Math.min(200, psr)),
        dy: Math.max(0, Math.min(60, dy)),
        roe: Math.max(-200, Math.min(200, roe)),
        roic: Math.max(-200, Math.min(200, roic)),
        netMargin: Math.max(-200, Math.min(300, netMargin)),
        ebitMargin: Math.max(-200, Math.min(300, ebitMargin)),
        netDebtToEbitda,
        grossDebtToEquity: Math.max(0, Math.min(50, grossDebtToEquity)),
        dailyLiquidity: Math.max(0, dailyLiquidity),
        revenueGrowth5y: Math.max(-100, Math.min(300, revenueGrowth5y)),
        closes,
      };

      const parsed = RawMarketStockSchema.safeParse(candidate);
      if (parsed.success) {
        seen.add(ticker);
        results.push(parsed.data);
      }
    });

    return results;
  }

  async fetchBrapiMetadataMap(): Promise<Map<string, B3CompanyMeta>> {
    const map = new Map<string, B3CompanyMeta>();
    try {
      const response = await axios.get('https://brapi.dev/api/quote/list', {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const stocks = response.data?.stocks;
      if (Array.isArray(stocks)) {
        for (const item of stocks) {
          if (item?.stock && typeof item.stock === 'string') {
            const ticker = item.stock.toUpperCase().trim();
            const fallback = resolveB3CompanyMeta(ticker);
            const logoUrl =
              typeof item.logo === 'string' && item.logo.length > 5
                ? item.logo
                : `https://icons.brapi.dev/icons/${ticker}.svg`;
            map.set(ticker, {
              companyName: item.name || fallback.companyName,
              sector: item.sector || fallback.sector,
              subsector: fallback.subsector,
              logoUrl,
            });
          }
        }
      }
    } catch {
      this.logger.warn('Brapi metadata fetch skipped, using internal B3 catalog');
    }
    return map;
  }

  async fetchYahooHistory(ticker: string): Promise<{
    closes: number[];
    avgAnnualDividend?: number;
  }> {
    try {
      const cleanTicker = ticker.toUpperCase().trim();
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${cleanTicker}.SA?interval=1d&range=1y&events=div`;
      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });
      const result = response.data?.chart?.result?.[0];
      const rawCloses: Array<number | null> =
        result?.indicators?.quote?.[0]?.close || [];
      const closes = rawCloses.filter(
        (val): val is number => typeof val === 'number' && Number.isFinite(val) && val > 0,
      );

      let avgAnnualDividend: number | undefined;
      const divEvents = result?.events?.dividends;
      if (divEvents && typeof divEvents === 'object') {
        const values = Object.values(divEvents) as Array<{ amount?: number }>;
        const totalDiv = values.reduce(
          (sum, item) => sum + (typeof item?.amount === 'number' ? item.amount : 0),
          0,
        );
        if (totalDiv > 0) {
          avgAnnualDividend = Number(totalDiv.toFixed(4));
        }
      }

      return { closes, avgAnnualDividend };
    } catch {
      return { closes: [] };
    }
  }

  async fetchAllB3Stocks(): Promise<{
    stocks: RawMarketStock[];
    source: string;
  }> {
    const metaMap = await this.fetchBrapiMetadataMap();
    try {
      const response = await axios.get(
        'https://www.fundamentus.com.br/resultado.php',
        {
          timeout: 15000,
          responseType: 'arraybuffer',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          },
        },
      );

      const html = Buffer.from(response.data).toString('latin1');
      const scraped = this.parseFundamentusHtml(html, metaMap);
      if (scraped.length >= 25) {
        return {
          stocks: scraped,
          source: `Fundamentus + Brapi B3 Core Sectors (${scraped.length} tickers)`,
        };
      }
    } catch {
      this.logger.warn('Fundamentus live scrape failed, using fallback B3 catalog');
    }

    const fallbackWithCloses = FALLBACK_B3_STOCKS.map((stock) => ({
      ...stock,
      closes: this.buildSyntheticCloses(
        stock.price,
        stock.roe,
        stock.dy,
        stock.revenueGrowth5y,
        stock.pl,
      ),
    }));

    return {
      stocks: fallbackWithCloses,
      source: `B3 Core Sectors Catalog (${fallbackWithCloses.length} tickers)`,
    };
  }
}
