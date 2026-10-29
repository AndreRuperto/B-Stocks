import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../ai/ai.service';
import { MarketDataService } from '../market-data/market-data.service';
import { PrismaService } from '../prisma/prisma.service';
import { ValuationService } from '../valuation/valuation.service';
import { StocksService } from './stocks.service';

describe('StocksService', () => {
  let service: StocksService;

  const mockStockRecord = {
    id: 'uuid-bbas3',
    ticker: 'BBAS3',
    companyName: 'Banco do Brasil',
    logoUrl: 'https://icons.brapi.dev/icons/BBAS3.svg',
    sector: 'Bancos',
    subsector: 'Bancos Comerciais',
    price: 27.4,
    pl: 4.45,
    pvp: 0.84,
    psr: 0.92,
    dy: 9.65,
    lpa: 6.15,
    vpa: 32.6,
    roe: 20.4,
    roic: 18.2,
    netMargin: 24.5,
    ebitMargin: 28.1,
    netDebtToEbitda: 0,
    grossDebtToEquity: 0,
    dailyLiquidity: 540_000_000,
    revenueGrowth5y: 14.5,
    avgDividends5y: 2.64,
    bazinCeilingPrice: 44.0,
    bazinMargin: 60.58,
    grahamFairPrice: 67.15,
    grahamMargin: 145.07,
    sma50: 26.8,
    sma200: 25.9,
    rsi14: 54.2,
    technicalTrend: 'Alta Estrutural (Golden Cross)',
    passesCutFilter: true,
    cutFilterReason: 'Aprovada nos filtros de liquidez e alavancagem',
    scoreTotal: 88.5,
    scoreValuation: 35.0,
    scoreDividends: 22.8,
    scoreProfitability: 18.7,
    scoreTechnical: 12.0,
    thematicCategory: 'Renda / Vacas Leiteiras',
    createdAt: new Date(),
    updatedAt: new Date(),
    theses: [],
  };

  const mockPrisma = {
    stock: {
      count: jest.fn().mockResolvedValue(120),
      findMany: jest.fn().mockResolvedValue([mockStockRecord]),
      findUnique: jest.fn(),
      upsert: jest.fn().mockResolvedValue(mockStockRecord),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      aggregate: jest.fn().mockResolvedValue({
        _avg: { scoreTotal: 68.4, dy: 6.8, roe: 16.2 },
      }),
      groupBy: jest.fn().mockResolvedValue([
        { thematicCategory: 'Renda / Vacas Leiteiras', _count: { ticker: 45 } },
      ]),
    },
    stockThesis: {
      create: jest.fn().mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'thesis-1',
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ),
    },
    syncLog: {
      create: jest.fn().mockResolvedValue({
        id: 'log-1',
        totalSynced: 1,
        source: 'Mock B3 Feed',
        status: 'SUCCESS',
        createdAt: new Date(),
      }),
      findFirst: jest.fn().mockResolvedValue({
        id: 'log-1',
        totalSynced: 120,
        source: 'Fundamentus + Brapi',
        status: 'SUCCESS',
        createdAt: new Date(),
      }),
    },
    $transaction: jest.fn().mockImplementation((ops) => Promise.all(ops)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        ValuationService,
        AiService,
        { provide: PrismaService, useValue: mockPrisma },
        {
          provide: MarketDataService,
          useValue: {
            fetchAllB3Stocks: jest.fn().mockResolvedValue({
              stocks: [
                {
                  ticker: 'BBAS3',
                  companyName: 'Banco do Brasil',
                  logoUrl: 'https://icons.brapi.dev/icons/BBAS3.svg',
                  sector: 'Bancos',
                  subsector: 'Bancos Comerciais',
                  price: 27.4,
                  pl: 4.45,
                  pvp: 0.84,
                  psr: 0.92,
                  dy: 9.65,
                  roe: 20.4,
                  roic: 18.2,
                  netMargin: 24.5,
                  ebitMargin: 28.1,
                  netDebtToEbitda: 0,
                  grossDebtToEquity: 0,
                  dailyLiquidity: 540_000_000,
                  revenueGrowth5y: 14.5,
                },
              ],
              source: 'Mock B3 Feed',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  it('synchronizes B3 stocks and logs sync execution', async () => {
    const syncRes = await service.syncAllB3Stocks();
    expect(syncRes.totalSynced).toBe(1);
    expect(syncRes.source).toBe('Mock B3 Feed');
    expect(mockPrisma.stock.upsert).toHaveBeenCalled();
  });

  it('queries stocks with search and cut filter parameters', async () => {
    const res = await service.findAll({
      search: 'BBAS',
      onlyPassedCut: 'true',
      page: '1',
      limit: '20',
    });
    expect(res.items).toHaveLength(1);
    expect(res.items[0].ticker).toBe('BBAS3');
  });

  it('filters by multiple categories and deduplicates one stock per company', async () => {
    mockPrisma.stock.findMany.mockResolvedValueOnce([
      { ...mockStockRecord, ticker: 'PETR4', dailyLiquidity: 1_200_000_000, marketCap: 470_000_000_000 },
      { ...mockStockRecord, ticker: 'PETR3', dailyLiquidity: 350_000_000, marketCap: 480_000_000_000 },
    ]);
    const res = await service.findAll({
      sectors: 'Petróleo, Gás e Biocombustíveis|Bancos',
      oneStockPerCompany: 'true',
      sortBy: 'marketCap',
      sortOrder: 'desc',
    });
    expect(res.items).toHaveLength(1);
    expect(res.items[0].ticker).toBe('PETR4');
  });

  it('throws NotFoundException when ticker is not found', async () => {
    mockPrisma.stock.findUnique.mockResolvedValueOnce(null);
    await expect(service.findByTicker('INVALID99')).rejects.toThrow(
      NotFoundException,
    );
  });
});
