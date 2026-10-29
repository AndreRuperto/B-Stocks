import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { AiService } from './ai.service';
import { EvaluatedStockMetrics } from '../valuation/valuation.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AiService', () => {
  let service: AiService;

  const sampleStock: EvaluatedStockMetrics = {
    ticker: 'BBAS3',
    companyName: 'Banco do Brasil',
    sector: 'Financeiro',
    subsector: 'Bancos',
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
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('builds structured 3-point deterministic thesis when no API key is provided', async () => {
    const thesis = await service.generateThesis(sampleStock);
    expect(thesis.strengths).toContain('Banco do Brasil (BBAS3)');
    expect(thesis.strengths).toContain('Décio Bazin');
    expect(thesis.risks).toContain('Principais vetores de atenção');
    expect(thesis.verdict).toContain('Score Quantitativo de 88.5/100');
    expect(thesis.businessCategory).toBe('Renda / Vacas Leiteiras');
    expect(thesis.provider).toBe('Quantitative Deterministic Engine');
  });

  it('uses Gemini API response when valid API key and valid JSON schema are returned', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    strengths: 'Forte geração de caixa, ROE acima de 20% e múltiplo P/VP descontado.',
                    risks: 'Risco político-regulatório e sensibilidade à inadimplência do agronegócio.',
                    verdict: 'Excelente ativo gerador de renda passiva com ampla margem de segurança.',
                    businessCategory: 'Renda / Vacas Leiteiras',
                  }),
                },
              ],
            },
          },
        ],
      },
    });

    const thesis = await service.generateThesis(
      sampleStock,
      'AIzaSyDummyValidLengthApiKey12345',
    );
    expect(thesis.provider).toBe('Google Gemini 2.0 Flash');
    expect(thesis.businessCategory).toBe('Renda / Vacas Leiteiras');
    expect(thesis.strengths).toContain('Forte geração de caixa');
  });

  it('falls back to deterministic engine if external API request fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Rate limit exceeded'));

    const thesis = await service.generateThesis(
      sampleStock,
      'AIzaSyDummyValidLengthApiKey12345',
    );
    expect(thesis.provider).toBe('Quantitative Deterministic Engine');
    expect(thesis.verdict).toContain('88.5/100');
  });
});
