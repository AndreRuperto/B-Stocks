import { Injectable } from '@nestjs/common';
import {
  RawMarketStock,
  TechnicalTrend,
  ThematicCategory,
} from '../common/schemas/stock.schema';

export interface EvaluatedStockMetrics {
  ticker: string;
  companyName: string;
  sector: string;
  subsector: string;
  price: number;
  pl: number;
  pvp: number;
  psr: number;
  dy: number;
  lpa: number;
  vpa: number;
  roe: number;
  roic: number;
  netMargin: number;
  ebitMargin: number;
  netDebtToEbitda: number;
  grossDebtToEquity: number;
  dailyLiquidity: number;
  revenueGrowth5y: number;
  avgDividends5y: number;
  bazinCeilingPrice: number;
  bazinMargin: number;
  grahamFairPrice: number;
  grahamMargin: number;
  sma50: number;
  sma200: number;
  rsi14: number;
  technicalTrend: TechnicalTrend;
  passesCutFilter: boolean;
  cutFilterReason: string;
  scoreTotal: number;
  scoreValuation: number;
  scoreDividends: number;
  scoreProfitability: number;
  scoreTechnical: number;
  thematicCategory: ThematicCategory;
}

@Injectable()
export class ValuationService {
  calculateLpa(price: number, pl: number, explicitLpa?: number): number {
    if (explicitLpa !== undefined && Number.isFinite(explicitLpa)) {
      return Number(explicitLpa.toFixed(4));
    }
    if (price <= 0 || pl === 0 || !Number.isFinite(pl)) {
      return 0;
    }
    return Number((price / pl).toFixed(4));
  }

  calculateVpa(price: number, pvp: number, explicitVpa?: number): number {
    if (explicitVpa !== undefined && Number.isFinite(explicitVpa)) {
      return Number(explicitVpa.toFixed(4));
    }
    if (price <= 0 || pvp <= 0 || !Number.isFinite(pvp)) {
      return 0;
    }
    return Number((price / pvp).toFixed(4));
  }

  calculateBazin(
    price: number,
    avgAnnualDividend: number,
    targetYield = 0.06,
  ): { ceilingPrice: number; marginPercent: number } {
    if (avgAnnualDividend <= 0 || targetYield <= 0 || price <= 0) {
      return { ceilingPrice: 0, marginPercent: -100 };
    }
    const ceilingPrice = Number((avgAnnualDividend / targetYield).toFixed(2));
    const marginPercent = Number(
      (((ceilingPrice - price) / price) * 100).toFixed(2),
    );
    return { ceilingPrice, marginPercent };
  }

  calculateGraham(
    price: number,
    lpa: number,
    vpa: number,
  ): { fairPrice: number; marginPercent: number } {
    if (lpa <= 0 || vpa <= 0 || price <= 0) {
      return { fairPrice: 0, marginPercent: -100 };
    }
    const product = 22.5 * lpa * vpa;
    const fairPrice = Number(Math.sqrt(product).toFixed(2));
    const marginPercent = Number(
      (((fairPrice - price) / price) * 100).toFixed(2),
    );
    return { fairPrice, marginPercent };
  }

  calculateSma(closes: number[], period: number): number {
    if (!closes || closes.length === 0 || period <= 0) {
      return 0;
    }
    const slice = closes.slice(-period);
    const sum = slice.reduce((acc, val) => acc + val, 0);
    return Number((sum / slice.length).toFixed(2));
  }

  calculateRsi(closes: number[], period = 14): number {
    if (!closes || closes.length < 2 || period <= 0) {
      return 50;
    }
    const relevant = closes.slice(-(period + 1));
    if (relevant.length < 2) {
      return 50;
    }
    let gains = 0;
    let losses = 0;
    const changesCount = relevant.length - 1;
    for (let i = 1; i < relevant.length; i++) {
      const diff = relevant[i] - relevant[i - 1];
      if (diff > 0) {
        gains += diff;
      } else if (diff < 0) {
        losses += Math.abs(diff);
      }
    }
    const avgGain = gains / changesCount;
    const avgLoss = losses / changesCount;
    if (avgLoss === 0 && avgGain === 0) {
      return 50;
    }
    if (avgLoss === 0) {
      return 100;
    }
    const rs = avgGain / avgLoss;
    const rsi = 100 - 100 / (1 + rs);
    return Number(rsi.toFixed(2));
  }

  determineTechnicalTrend(
    price: number,
    sma50: number,
    sma200: number,
  ): TechnicalTrend {
    if (price <= 0 || sma50 <= 0 || sma200 <= 0) {
      return 'Lateral / Neutro';
    }
    if (price > sma50 && price > sma200 && sma50 > sma200) {
      return 'Alta Estrutural (Golden Cross)';
    }
    if (price < sma50 && price < sma200 && sma50 < sma200) {
      return 'Tendência de Baixa (Death Cross)';
    }
    if (price > sma50) {
      return 'Tendência de Alta';
    }
    return 'Lateral / Neutro';
  }

  evaluateCutFilters(
    dailyLiquidity: number,
    netDebtToEbitda: number,
    sector: string,
  ): { passes: boolean; reason: string } {
    const reasons: string[] = [];
    if (dailyLiquidity < 1_000_000) {
      reasons.push('Liquidez diária abaixo de R$ 1 milhão');
    }
    const isFinancial =
      sector.toLowerCase().includes('financ') ||
      sector.toLowerCase().includes('banco') ||
      sector.toLowerCase().includes('segur');
    if (!isFinancial && netDebtToEbitda >= 3.0) {
      reasons.push('Dívida Líquida / EBITDA igual ou superior a 3,0x');
    }
    if (reasons.length > 0) {
      return { passes: false, reason: reasons.join('; ') };
    }
    return { passes: true, reason: 'Aprovada nos filtros de liquidez e alavancagem' };
  }

  calculateScoreComponents(params: {
    bazinMargin: number;
    grahamMargin: number;
    dy: number;
    roe: number;
    netMargin: number;
    price: number;
    sma50: number;
    sma200: number;
    rsi14: number;
    passesCutFilter: boolean;
  }): {
    scoreValuation: number;
    scoreDividends: number;
    scoreProfitability: number;
    scoreTechnical: number;
    scoreTotal: number;
  } {
    const normalizeMargin = (margin: number): number => {
      if (margin <= -50) return 0;
      if (margin >= 50) return 1;
      return (margin + 50) / 100;
    };

    const grahamNorm = normalizeMargin(params.grahamMargin);
    const bazinNorm = normalizeMargin(params.bazinMargin);
    const bestMarginNorm = Math.max(grahamNorm, bazinNorm);
    const avgMarginNorm = (grahamNorm + bazinNorm) / 2;
    const scoreValuation = Number(
      ((bestMarginNorm * 0.65 + avgMarginNorm * 0.35) * 35).toFixed(2),
    );

    let dividendRatio = 0;
    if (params.dy > 0) {
      if (params.dy >= 6 && params.dy <= 18) {
        dividendRatio = Math.min(1, 0.7 + ((params.dy - 6) / 12) * 0.3);
      } else if (params.dy > 18) {
        dividendRatio = 0.65;
      } else {
        dividendRatio = (params.dy / 6) * 0.7;
      }
    }
    const scoreDividends = Number((dividendRatio * 25).toFixed(2));

    const roeFactor =
      params.roe <= 0
        ? 0
        : params.roe >= 15
          ? Math.min(1, 0.75 + ((params.roe - 15) / 15) * 0.25)
          : (params.roe / 15) * 0.75;

    const marginFactor =
      params.netMargin <= 0
        ? 0
        : params.netMargin >= 10
          ? Math.min(1, 0.75 + ((params.netMargin - 10) / 15) * 0.25)
          : (params.netMargin / 10) * 0.75;

    const scoreProfitability = Number(
      ((roeFactor * 0.55 + marginFactor * 0.45) * 20).toFixed(2),
    );

    let smaPoints = 5;
    if (
      params.price > params.sma50 &&
      params.price > params.sma200 &&
      params.sma50 > params.sma200
    ) {
      smaPoints = 12;
    } else if (params.price > params.sma50 && params.price > params.sma200) {
      smaPoints = 9.5;
    } else if (params.price > params.sma50) {
      smaPoints = 7;
    } else if (
      params.price < params.sma50 &&
      params.price < params.sma200 &&
      params.sma50 < params.sma200
    ) {
      smaPoints = 2;
    }

    let rsiPoints = 4;
    if (params.rsi14 >= 30 && params.rsi14 <= 65) {
      rsiPoints = 8;
    } else if (params.rsi14 < 30) {
      rsiPoints = 6.5;
    } else if (params.rsi14 > 70) {
      rsiPoints = 2.5;
    } else {
      rsiPoints = 5.5;
    }

    const scoreTechnical = Number(Math.min(20, smaPoints + rsiPoints).toFixed(2));

    const rawTotal =
      scoreValuation + scoreDividends + scoreProfitability + scoreTechnical;
    const finalTotal = params.passesCutFilter ? rawTotal : rawTotal * 0.55;

    return {
      scoreValuation,
      scoreDividends,
      scoreProfitability,
      scoreTechnical,
      scoreTotal: Number(Math.max(0, Math.min(100, finalTotal)).toFixed(2)),
    };
  }

  classifyBusinessModel(params: {
    pl: number;
    dy: number;
    roe: number;
    netMargin: number;
    netDebtToEbitda: number;
    revenueGrowth5y: number;
  }): ThematicCategory {
    if (
      params.pl <= 0 ||
      params.roe < 4 ||
      params.netMargin < 0 ||
      params.netDebtToEbitda >= 3.5
    ) {
      return 'Turnaround / Risco Alto';
    }
    if (params.dy >= 6.0 && params.roe >= 12 && params.netMargin >= 8) {
      return 'Renda / Vacas Leiteiras';
    }
    if (
      (params.revenueGrowth5y >= 12 || params.roe >= 20) &&
      params.dy < 6.0 &&
      params.pl > 0
    ) {
      return 'Crescimento Agressivo';
    }
    return 'Defensiva';
  }

  evaluateStock(raw: RawMarketStock): EvaluatedStockMetrics {
    const lpa = this.calculateLpa(raw.price, raw.pl, raw.lpa);
    const vpa = this.calculateVpa(raw.price, raw.pvp, raw.vpa);

    const avgDividends5y =
      raw.avgDividends5y !== undefined
        ? Number(raw.avgDividends5y.toFixed(4))
        : raw.price > 0 && raw.dy > 0
          ? Number(((raw.price * Math.min(raw.dy, 25)) / 100).toFixed(4))
          : 0;

    const bazin = this.calculateBazin(raw.price, avgDividends5y, 0.06);
    const graham = this.calculateGraham(raw.price, lpa, vpa);

    const hasCloses = raw.closes && raw.closes.length >= 15;
    const sma50 = hasCloses
      ? this.calculateSma(raw.closes!, 50)
      : Number((raw.price * 0.98).toFixed(2));
    const sma200 = hasCloses
      ? this.calculateSma(raw.closes!, 200)
      : Number((raw.price * 0.95).toFixed(2));
    const rsi14 = hasCloses ? this.calculateRsi(raw.closes!, 14) : 52;

    const technicalTrend = this.determineTechnicalTrend(raw.price, sma50, sma200);
    const cutEval = this.evaluateCutFilters(
      raw.dailyLiquidity,
      raw.netDebtToEbitda,
      raw.sector,
    );

    const scores = this.calculateScoreComponents({
      bazinMargin: bazin.marginPercent,
      grahamMargin: graham.marginPercent,
      dy: raw.dy,
      roe: raw.roe,
      netMargin: raw.netMargin,
      price: raw.price,
      sma50,
      sma200,
      rsi14,
      passesCutFilter: cutEval.passes,
    });

    const thematicCategory = this.classifyBusinessModel({
      pl: raw.pl,
      dy: raw.dy,
      roe: raw.roe,
      netMargin: raw.netMargin,
      netDebtToEbitda: raw.netDebtToEbitda,
      revenueGrowth5y: raw.revenueGrowth5y,
    });

    return {
      ticker: raw.ticker.toUpperCase(),
      companyName: raw.companyName,
      sector: raw.sector,
      subsector: raw.subsector,
      price: Number(raw.price.toFixed(2)),
      pl: Number(raw.pl.toFixed(2)),
      pvp: Number(raw.pvp.toFixed(2)),
      psr: Number(raw.psr.toFixed(2)),
      dy: Number(raw.dy.toFixed(2)),
      lpa,
      vpa,
      roe: Number(raw.roe.toFixed(2)),
      roic: Number(raw.roic.toFixed(2)),
      netMargin: Number(raw.netMargin.toFixed(2)),
      ebitMargin: Number(raw.ebitMargin.toFixed(2)),
      netDebtToEbitda: Number(raw.netDebtToEbitda.toFixed(2)),
      grossDebtToEquity: Number(raw.grossDebtToEquity.toFixed(2)),
      dailyLiquidity: Number(raw.dailyLiquidity.toFixed(2)),
      revenueGrowth5y: Number(raw.revenueGrowth5y.toFixed(2)),
      avgDividends5y,
      bazinCeilingPrice: bazin.ceilingPrice,
      bazinMargin: bazin.marginPercent,
      grahamFairPrice: graham.fairPrice,
      grahamMargin: graham.marginPercent,
      sma50,
      sma200,
      rsi14,
      technicalTrend,
      passesCutFilter: cutEval.passes,
      cutFilterReason: cutEval.reason,
      scoreTotal: scores.scoreTotal,
      scoreValuation: scores.scoreValuation,
      scoreDividends: scores.scoreDividends,
      scoreProfitability: scores.scoreProfitability,
      scoreTechnical: scores.scoreTechnical,
      thematicCategory,
    };
  }
}
