import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AiService } from '../ai/ai.service';
import { StockFilterQuerySchema } from '../common/schemas/stock.schema';
import { B3_CATEGORIES } from '../market-data/b3-catalog';
import { MarketDataService } from '../market-data/market-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { ValuationService } from '../valuation/valuation.service';

@Injectable()
export class StocksService implements OnModuleInit {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketData: MarketDataService,
    private readonly valuation: ValuationService,
    private readonly aiService: AiService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    const count = await this.prisma.stock.count();
    if (count === 0) {
      await this.syncAllB3Stocks();
    }
  }

  async syncAllB3Stocks(): Promise<{
    totalSynced: number;
    source: string;
    timestamp: string;
  }> {
    const { stocks, source } = await this.marketData.fetchAllB3Stocks();
    const evaluatedList = stocks.map((raw) => this.valuation.evaluateStock(raw));
    const activeTickers = evaluatedList.map((item) => item.ticker);

    await this.prisma.stock.deleteMany({
      where: {
        ticker: { notIn: activeTickers },
      },
    });

    const chunkSize = 80;
    for (let i = 0; i < evaluatedList.length; i += chunkSize) {
      const chunk = evaluatedList.slice(i, i + chunkSize);
      await this.prisma.$transaction(
        chunk.map((item) =>
          this.prisma.stock.upsert({
            where: { ticker: item.ticker },
            update: {
              companyName: item.companyName,
              logoUrl: item.logoUrl,
              sector: item.sector,
              subsector: item.subsector,
              segment: item.segment,
              price: item.price,
              marketCap: item.marketCap,
              equity: item.equity,
              revenue: item.revenue,
              netIncome: item.netIncome,
              pl: item.pl,
              pvp: item.pvp,
              psr: item.psr,
              dy: item.dy,
              dy5y: item.dy5y,
              lpa: item.lpa,
              vpa: item.vpa,
              roe: item.roe,
              roic: item.roic,
              netMargin: item.netMargin,
              ebitMargin: item.ebitMargin,
              netDebtToEbitda: item.netDebtToEbitda,
              grossDebtToEquity: item.grossDebtToEquity,
              dailyLiquidity: item.dailyLiquidity,
              revenueGrowth5y: item.revenueGrowth5y,
              avgDividends5y: item.avgDividends5y,
              change24h: item.change24h,
              change30d: item.change30d,
              change12m: item.change12m,
              change5y: item.change5y,
              bazinCeilingPrice: item.bazinCeilingPrice,
              bazinMargin: item.bazinMargin,
              grahamFairPrice: item.grahamFairPrice,
              grahamMargin: item.grahamMargin,
              sma50: item.sma50,
              sma200: item.sma200,
              rsi14: item.rsi14,
              technicalTrend: item.technicalTrend,
              passesCutFilter: item.passesCutFilter,
              cutFilterReason: item.cutFilterReason,
              scoreTotal: item.scoreTotal,
              scoreValuation: item.scoreValuation,
              scoreDividends: item.scoreDividends,
              scoreProfitability: item.scoreProfitability,
              scoreTechnical: item.scoreTechnical,
              thematicCategory: item.thematicCategory,
            },
            create: item,
          }),
        ),
      );
    }

    const logEntry = await this.prisma.syncLog.create({
      data: {
        totalSynced: evaluatedList.length,
        source,
        status: 'SUCCESS',
      },
    });

    this.logger.log(`Synchronized ${evaluatedList.length} B3 stocks from ${source}`);

    return {
      totalSynced: evaluatedList.length,
      source,
      timestamp: logEntry.createdAt.toISOString(),
    };
  }

  async findAll(rawQuery: Record<string, unknown>) {
    const query = StockFilterQuerySchema.parse(rawQuery);
    const where: Prisma.StockWhereInput = {};

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        { ticker: { contains: term.toUpperCase(), mode: 'insensitive' } },
        { companyName: { contains: term, mode: 'insensitive' } },
        { sector: { contains: term, mode: 'insensitive' } },
      ];
    }

    if (query.sectors && query.sectors.length > 0) {
      where.sector = { in: query.sectors };
    } else if (query.sector && query.sector !== 'ALL') {
      where.sector = query.sector;
    }

    if (query.thematicCategory && query.thematicCategory !== 'ALL') {
      where.thematicCategory = query.thematicCategory;
    }

    if (query.onlyPassedCut) {
      where.passesCutFilter = true;
    }

    if (query.onlySmallCaps) {
      where.marketCap = { gt: 50_000_000, lte: 12_000_000_000 };
    }

    if (query.minScore > 0) {
      where.scoreTotal = { gte: query.minScore };
    }

    const skip = (query.page - 1) * query.limit;
    const orderBy: Prisma.StockOrderByWithRelationInput = {
      [query.sortBy]: query.sortOrder,
    };

    const isTop100Popular =
      query.onlyTop100Popular || query.rankingPreset === 'mais_queridas';

    if (query.oneStockPerCompany || isTop100Popular) {
      const [allMatched, sectorGroups] = await Promise.all([
        this.prisma.stock.findMany({
          where,
          orderBy,
        }),
        this.prisma.stock.findMany({
          select: { sector: true },
          distinct: ['sector'],
          orderBy: { sector: 'asc' },
        }),
      ]);

      let filteredList = allMatched;

      if (query.oneStockPerCompany) {
        const bestByPrefix = new Map<string, (typeof allMatched)[number]>();
        for (const stock of filteredList) {
          const prefix = stock.ticker.replace(/[0-9]+$/, '');
          const current = bestByPrefix.get(prefix);
          if (
            !current ||
            stock.dailyLiquidity > current.dailyLiquidity ||
            (stock.dailyLiquidity === current.dailyLiquidity &&
              stock.marketCap > current.marketCap)
          ) {
            bestByPrefix.set(prefix, stock);
          }
        }
        filteredList = Array.from(bestByPrefix.values());
      }

      if (isTop100Popular) {
        filteredList = [...filteredList]
          .sort((a, b) => b.dailyLiquidity - a.dailyLiquidity)
          .slice(0, 100);
      }

      const sortField = query.sortBy;
      const sortMult = query.sortOrder === 'asc' ? 1 : -1;
      filteredList.sort((a, b) => {
        const valA = a[sortField as keyof typeof a];
        const valB = b[sortField as keyof typeof b];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * sortMult;
        }
        return ((Number(valA) || 0) - (Number(valB) || 0)) * sortMult;
      });

      const total = filteredList.length;
      const pagedItems = filteredList.slice(skip, skip + query.limit);
      const distinctSectors = sectorGroups.map((s) => s.sector);
      const mergedSectors = Array.from(
        new Set([...B3_CATEGORIES, ...distinctSectors]),
      );

      return {
        items: pagedItems,
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
        sectors: mergedSectors,
      };
    }

    const [items, total, sectorGroups] = await Promise.all([
      this.prisma.stock.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
      }),
      this.prisma.stock.count({ where }),
      this.prisma.stock.findMany({
        select: { sector: true },
        distinct: ['sector'],
        orderBy: { sector: 'asc' },
      }),
    ]);

    const distinctSectors = sectorGroups.map((s) => s.sector);
    const mergedSectors = Array.from(
      new Set([...B3_CATEGORIES, ...distinctSectors]),
    );

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
      sectors: mergedSectors,
    };
  }

  async getMarketSummary() {
    const [
      totalStocks,
      passedCutCount,
      bazinOpportunities,
      grahamOpportunities,
      aggregates,
      topRanking,
      categoryGroups,
      lastSync,
    ] = await Promise.all([
      this.prisma.stock.count(),
      this.prisma.stock.count({ where: { passesCutFilter: true } }),
      this.prisma.stock.count({
        where: { passesCutFilter: true, bazinMargin: { gt: 0 } },
      }),
      this.prisma.stock.count({
        where: { passesCutFilter: true, grahamMargin: { gt: 0 } },
      }),
      this.prisma.stock.aggregate({
        where: { passesCutFilter: true },
        _avg: {
          scoreTotal: true,
          dy: true,
          roe: true,
        },
      }),
      this.prisma.stock.findMany({
        where: { passesCutFilter: true },
        orderBy: { scoreTotal: 'desc' },
        take: 6,
      }),
      this.prisma.stock.groupBy({
        by: ['thematicCategory'],
        _count: { ticker: true },
      }),
      this.prisma.syncLog.findFirst({
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      totalStocks,
      passedCutCount,
      bazinOpportunities,
      grahamOpportunities,
      avgScorePassed: Number((aggregates._avg.scoreTotal || 0).toFixed(2)),
      avgDyPassed: Number((aggregates._avg.dy || 0).toFixed(2)),
      avgRoePassed: Number((aggregates._avg.roe || 0).toFixed(2)),
      topRanking,
      categories: categoryGroups.map((group) => ({
        category: group.thematicCategory,
        count: group._count.ticker,
      })),
      lastSync: lastSync
        ? {
            source: lastSync.source,
            totalSynced: lastSync.totalSynced,
            timestamp: lastSync.createdAt.toISOString(),
          }
        : null,
    };
  }

  async findByTicker(ticker: string) {
    const clean = ticker.toUpperCase().trim();
    const stock = await this.prisma.stock.findUnique({
      where: { ticker: clean },
      include: {
        theses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(`Ativo ${clean} não encontrado na base da B3`);
    }

    const latestThesis = stock.theses[0] || null;

    return {
      ...stock,
      latestThesis,
    };
  }

  async generateThesisForTicker(
    ticker: string,
    customApiKey?: string,
    forceRefresh = false,
  ) {
    const clean = ticker.toUpperCase().trim();
    const stock = await this.prisma.stock.findUnique({
      where: { ticker: clean },
      include: {
        theses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(`Ativo ${clean} não encontrado na base da B3`);
    }

    if (!forceRefresh && !customApiKey && stock.theses.length > 0) {
      return stock.theses[0];
    }

    const generated = await this.aiService.generateThesis(
      {
        ticker: stock.ticker,
        companyName: stock.companyName,
        logoUrl: stock.logoUrl,
        sector: stock.sector,
        subsector: stock.subsector,
        segment: stock.segment,
        price: stock.price,
        marketCap: stock.marketCap,
        equity: stock.equity,
        revenue: stock.revenue,
        netIncome: stock.netIncome,
        pl: stock.pl,
        pvp: stock.pvp,
        psr: stock.psr,
        dy: stock.dy,
        dy5y: stock.dy5y,
        lpa: stock.lpa,
        vpa: stock.vpa,
        roe: stock.roe,
        roic: stock.roic,
        netMargin: stock.netMargin,
        ebitMargin: stock.ebitMargin,
        netDebtToEbitda: stock.netDebtToEbitda,
        grossDebtToEquity: stock.grossDebtToEquity,
        dailyLiquidity: stock.dailyLiquidity,
        revenueGrowth5y: stock.revenueGrowth5y,
        avgDividends5y: stock.avgDividends5y,
        change24h: stock.change24h,
        change30d: stock.change30d,
        change12m: stock.change12m,
        change5y: stock.change5y,
        bazinCeilingPrice: stock.bazinCeilingPrice,
        bazinMargin: stock.bazinMargin,
        grahamFairPrice: stock.grahamFairPrice,
        grahamMargin: stock.grahamMargin,
        sma50: stock.sma50,
        sma200: stock.sma200,
        rsi14: stock.rsi14,
        technicalTrend: stock.technicalTrend as any,
        passesCutFilter: stock.passesCutFilter,
        cutFilterReason: stock.cutFilterReason,
        scoreTotal: stock.scoreTotal,
        scoreValuation: stock.scoreValuation,
        scoreDividends: stock.scoreDividends,
        scoreProfitability: stock.scoreProfitability,
        scoreTechnical: stock.scoreTechnical,
        thematicCategory: stock.thematicCategory as any,
      },
      customApiKey,
    );

    const saved = await this.prisma.stockThesis.create({
      data: {
        stockId: stock.id,
        strengths: generated.strengths,
        risks: generated.risks,
        verdict: generated.verdict,
        businessCategory: generated.businessCategory,
        provider: generated.provider,
      },
    });

    return saved;
  }
}
