import { Test, TestingModule } from '@nestjs/testing';
import { ValuationService } from './valuation.service';

describe('ValuationService', () => {
  let service: ValuationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValuationService],
    }).compile();

    service = module.get<ValuationService>(ValuationService);
  });

  describe('calculateBazin', () => {
    it('calculates ceiling price and positive margin for 6% target yield', () => {
      const result = service.calculateBazin(30, 2.4, 0.06);
      expect(result.ceilingPrice).toBe(40);
      expect(result.marginPercent).toBeCloseTo(33.33, 2);
    });

    it('calculates negative margin when current price exceeds ceiling price', () => {
      const result = service.calculateBazin(50, 2.4, 0.06);
      expect(result.ceilingPrice).toBe(40);
      expect(result.marginPercent).toBe(-20);
    });

    it('returns zero ceiling price when dividends are zero or negative', () => {
      const result = service.calculateBazin(30, 0, 0.06);
      expect(result.ceilingPrice).toBe(0);
      expect(result.marginPercent).toBe(-100);
    });
  });

  describe('calculateGraham', () => {
    it('calculates fair price using sqrt(22.5 * LPA * VPA)', () => {
      const result = service.calculateGraham(25, 4, 10);
      expect(result.fairPrice).toBe(30);
      expect(result.marginPercent).toBe(20);
    });

    it('returns zero fair price when LPA or VPA is negative', () => {
      const negativeLpa = service.calculateGraham(25, -2, 10);
      expect(negativeLpa.fairPrice).toBe(0);
      expect(negativeLpa.marginPercent).toBe(-100);

      const negativeVpa = service.calculateGraham(25, 4, -5);
      expect(negativeVpa.fairPrice).toBe(0);
      expect(negativeVpa.marginPercent).toBe(-100);
    });
  });

  describe('calculateSma and determineTechnicalTrend', () => {
    it('calculates simple moving average accurately', () => {
      const closes = [10, 20, 30, 40, 50];
      expect(service.calculateSma(closes, 3)).toBe(40);
      expect(service.calculateSma(closes, 5)).toBe(30);
    });

    it('detects Golden Cross and Death Cross trends accurately', () => {
      expect(service.determineTechnicalTrend(35, 32, 28)).toBe(
        'Alta Estrutural (Golden Cross)',
      );
      expect(service.determineTechnicalTrend(20, 25, 30)).toBe(
        'Tendência de Baixa (Death Cross)',
      );
      expect(service.determineTechnicalTrend(30, 28, 31)).toBe(
        'Tendência de Alta',
      );
      expect(service.determineTechnicalTrend(27, 29, 26)).toBe(
        'Lateral / Neutro',
      );
    });
  });

  describe('calculateRsi', () => {
    it('returns high RSI (> 70) for strongly rising price series', () => {
      const rising = Array.from({ length: 20 }, (_, i) => 10 + i * 1.5);
      const rsi = service.calculateRsi(rising, 14);
      expect(rsi).toBeGreaterThan(70);
    });

    it('returns low RSI (< 30) for strongly falling price series', () => {
      const falling = Array.from({ length: 20 }, (_, i) => 50 - i * 1.5);
      const rsi = service.calculateRsi(falling, 14);
      expect(rsi).toBeLessThan(30);
    });

    it('returns 50 when series has insufficient data or flat prices', () => {
      expect(service.calculateRsi([10], 14)).toBe(50);
      expect(service.calculateRsi([20, 20, 20, 20, 20], 14)).toBe(50);
    });
  });

  describe('evaluateCutFilters', () => {
    it('approves liquid company with low debt', () => {
      const res = service.evaluateCutFilters(15_000_000, 1.4, 'Energia Elétrica');
      expect(res.passes).toBe(true);
    });

    it('rejects illiquid company with daily volume below R$ 1M', () => {
      const res = service.evaluateCutFilters(450_000, 1.2, 'Varejo');
      expect(res.passes).toBe(false);
      expect(res.reason).toContain('Liquidez diária abaixo de R$ 1 milhão');
    });

    it('rejects overleveraged non-financial company with NetDebt/EBITDA >= 3.0', () => {
      const res = service.evaluateCutFilters(5_000_000, 3.8, 'Siderurgia');
      expect(res.passes).toBe(false);
      expect(res.reason).toContain('Dívida Líquida / EBITDA');
    });

    it('exempts banks and insurance companies from EBITDA leverage cut', () => {
      const res = service.evaluateCutFilters(50_000_000, 0, 'Bancos / Financeiro');
      expect(res.passes).toBe(true);
    });
  });

  describe('evaluateStock and classifyBusinessModel', () => {
    it('evaluates full stock profile and classifies dividend cow accurately', () => {
      const evaluated = service.evaluateStock({
        ticker: 'BBAS3',
        companyName: 'Banco do Brasil',
        logoUrl: 'https://icons.brapi.dev/icons/BBAS3.svg',
        sector: 'Bancos',
        subsector: 'Bancos',
        segment: 'Novo Mercado',
        price: 27.5,
        marketCap: 156_000_000_000,
        equity: 183_500_000_000,
        revenue: 173_000_000_000,
        netIncome: 34_600_000_000,
        pl: 4.5,
        pvp: 0.85,
        psr: 0.9,
        dy: 9.8,
        dy5y: 8.9,
        roe: 20.5,
        roic: 18.0,
        netMargin: 24.0,
        ebitMargin: 28.0,
        netDebtToEbitda: 0,
        grossDebtToEquity: 0,
        dailyLiquidity: 450_000_000,
        revenueGrowth5y: 14.2,
        change24h: 1.2,
        change30d: 4.5,
        change12m: 18.0,
        change5y: 110.0,
      });

      expect(evaluated.ticker).toBe('BBAS3');
      expect(evaluated.marketCap).toBe(156_000_000_000);
      expect(evaluated.bazinCeilingPrice).toBeGreaterThan(evaluated.price);
      expect(evaluated.grahamFairPrice).toBeGreaterThan(evaluated.price);
      expect(evaluated.passesCutFilter).toBe(true);
      expect(evaluated.scoreTotal).toBeGreaterThan(75);
      expect(evaluated.thematicCategory).toBe('Renda / Vacas Leiteiras');
    });

    it('classifies unprofitable or overleveraged company as Turnaround', () => {
      const evaluated = service.evaluateStock({
        ticker: 'TURN3',
        companyName: 'Turnaround Corp',
        logoUrl: 'https://icons.brapi.dev/icons/TURN3.svg',
        sector: 'Consumo Cíclico',
        subsector: 'Comércio',
        segment: 'Novo Mercado',
        price: 5.0,
        marketCap: 500_000_000,
        equity: 833_000_000,
        revenue: 1_660_000_000,
        netIncome: -62_500_000,
        pl: -8.0,
        pvp: 0.6,
        psr: 0.3,
        dy: 0,
        dy5y: 0,
        roe: -12.0,
        roic: 2.0,
        netMargin: -4.5,
        ebitMargin: 1.0,
        netDebtToEbitda: 4.5,
        grossDebtToEquity: 2.1,
        dailyLiquidity: 8_000_000,
        revenueGrowth5y: -2.0,
        change24h: -2.1,
        change30d: -8.4,
        change12m: -35.0,
        change5y: -70.0,
      });

      expect(evaluated.passesCutFilter).toBe(false);
      expect(evaluated.thematicCategory).toBe('Turnaround / Risco Alto');
    });
  });
});

