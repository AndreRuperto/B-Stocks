import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

describe('StocksController', () => {
  let controller: StocksController;

  const mockStocksService = {
    findAll: jest.fn().mockResolvedValue({
      items: [{ ticker: 'PETR4', scoreTotal: 84.5 }],
      total: 1,
      page: 1,
      limit: 50,
      totalPages: 1,
      sectors: ['Petróleo, Gás e Biocombustíveis'],
    }),
    getMarketSummary: jest.fn().mockResolvedValue({
      totalStocks: 962,
      passedCutCount: 195,
      bazinOpportunities: 112,
      grahamOpportunities: 128,
      avgScorePassed: 69.4,
      avgDyPassed: 6.8,
      avgRoePassed: 17.3,
      topRanking: [],
      categories: [],
      lastSync: null,
    }),
    getMarketOverview: jest.fn().mockResolvedValue({
      ibovespa: {
        period: '1D',
        currentPoints: 169186.42,
        previousClose: 167765.62,
        changePoints: 1420.8,
        changePercent: 0.85,
        high: 169840.1,
        low: 168110.25,
        volume: 24800000000,
        source: 'Yahoo Finance (^BVSP Oficial)',
        series: [],
      },
      topGainers: [{ ticker: 'PRIO3', change24h: 4.82 }],
      topLosers: [{ ticker: 'BHIA3', change24h: -5.45 }],
      tickerTape: [{ ticker: 'BBAS3', price: 16.06, change24h: -2.02 }],
    }),
    syncAllB3Stocks: jest.fn().mockResolvedValue({
      totalSynced: 962,
      source: 'Fundamentus + Brapi',
      timestamp: new Date().toISOString(),
    }),
    findByTicker: jest.fn().mockResolvedValue({
      ticker: 'PETR4',
      price: 52.51,
      bazinCeilingPrice: 60.74,
      grahamFairPrice: 93.16,
    }),
    generateThesisForTicker: jest.fn().mockResolvedValue({
      id: 'thesis-petr4',
      strengths: 'Forte geração operacional de caixa e desconto por Graham.',
      risks: 'Volatilidade do petróleo Brent e alocação de capital.',
      verdict: 'Compensa para longo prazo com margem de segurança.',
      businessCategory: 'Renda / Vacas Leiteiras',
      provider: 'Quantitative Deterministic Engine',
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [{ provide: StocksService, useValue: mockStocksService }],
    }).compile();

    controller = module.get<StocksController>(StocksController);
  });

  it('delegates findAll query to StocksService', async () => {
    const res = await controller.findAll({ search: 'PETR4' });
    expect(res.items[0].ticker).toBe('PETR4');
    expect(mockStocksService.findAll).toHaveBeenCalledWith({ search: 'PETR4' });
  });

  it('delegates getSummary and getMarketOverview to StocksService', async () => {
    const summary = await controller.getSummary();
    expect(summary.totalStocks).toBe(962);
    expect(mockStocksService.getMarketSummary).toHaveBeenCalled();

    const overview = await controller.getMarketOverview('1M');
    expect(overview.ibovespa.currentPoints).toBe(169186.42);
    expect(mockStocksService.getMarketOverview).toHaveBeenCalledWith('1M');
  });

  it('delegates findOne and generateThesis to StocksService', async () => {
    const item = await controller.findOne('PETR4');
    expect(item.ticker).toBe('PETR4');

    const thesis = await controller.generateThesis('PETR4', {
      forceRefresh: true,
    });
    expect(thesis.businessCategory).toBe('Renda / Vacas Leiteiras');
    expect(mockStocksService.generateThesisForTicker).toHaveBeenCalledWith(
      'PETR4',
      undefined,
      true,
    );
  });
});
