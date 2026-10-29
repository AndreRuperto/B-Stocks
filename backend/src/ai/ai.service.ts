import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  AiThesisResponse,
  AiThesisResponseSchema,
  ThematicCategory,
} from '../common/schemas/stock.schema';
import { EvaluatedStockMetrics } from '../valuation/valuation.service';

@Injectable()
export class AiService {
  buildDeterministicThesis(
    stock: EvaluatedStockMetrics,
  ): AiThesisResponse & { provider: string } {
    const strengthsParts: string[] = [];
    if (stock.bazinMargin > 0) {
      strengthsParts.push(
        `negocia com margem de segurança de +${stock.bazinMargin.toFixed(1)}% pelo método Décio Bazin (Preço Teto R$ ${stock.bazinCeilingPrice.toFixed(2)})`,
      );
    }
    if (stock.grahamMargin > 0) {
      strengthsParts.push(
        `apresenta desconto de +${stock.grahamMargin.toFixed(1)}% frente ao Preço Justo de Benjamin Graham (R$ ${stock.grahamFairPrice.toFixed(2)})`,
      );
    }
    if (stock.roe >= 15) {
      strengthsParts.push(
        `elevada rentabilidade sobre patrimônio (ROE de ${stock.roe.toFixed(1)}%) e margem líquida de ${stock.netMargin.toFixed(1)}%`,
      );
    }
    if (stock.dy >= 6) {
      strengthsParts.push(
        `forte geração de proventos com Dividend Yield de ${stock.dy.toFixed(2)}% a.a.`,
      );
    }
    if (strengthsParts.length === 0) {
      strengthsParts.push(
        `atuação estabelecida no setor de ${stock.sector} (${stock.subsector}) com P/L de ${stock.pl.toFixed(2)}x e P/VP de ${stock.pvp.toFixed(2)}x`,
      );
    }

    const risksParts: string[] = [];
    if (!stock.passesCutFilter) {
      risksParts.push(`alerta nos filtros de corte (${stock.cutFilterReason})`);
    }
    if (stock.netDebtToEbitda >= 2.5) {
      risksParts.push(
        `alavancagem financeira elevada com Dívida Líquida/EBITDA em ${stock.netDebtToEbitda.toFixed(2)}x`,
      );
    }
    if (stock.rsi14 > 70) {
      risksParts.push(
        `IFR/RSI de 14 períodos em ${stock.rsi14.toFixed(1)} aponta região de sobrecompra técnica no curto prazo`,
      );
    }
    if (stock.bazinMargin < 0 && stock.grahamMargin < 0) {
      risksParts.push(
        `cotação atual de R$ ${stock.price.toFixed(2)} opera acima dos limites conservadores de Graham e Bazin`,
      );
    }
    if (risksParts.length === 0) {
      risksParts.push(
        `exposição macroeconômica à taxa Selic e ciclos setoriais de ${stock.subsector}, exigindo acompanhamento trimestral de margens`,
      );
    }

    const category = stock.thematicCategory as ThematicCategory;
    let verdictText = '';
    if (stock.scoreTotal >= 70 && stock.passesCutFilter) {
      verdictText = `Ativo classificado como "${category}" com Score Quantitativo de ${stock.scoreTotal.toFixed(1)}/100. Combinação favorável entre desconto fundamentalista, solidez operacional e tendência técnica (${stock.technicalTrend}). Compensa para composição de carteira de longo prazo.`;
    } else if (stock.scoreTotal >= 50 && stock.passesCutFilter) {
      verdictText = `Ativo classificado como "${category}" com Score Quantitativo de ${stock.scoreTotal.toFixed(1)}/100. Fundamentos equilibrados, recomendando-se entradas graduais buscando ampliação da margem de segurança em correções de preço.`;
    } else {
      verdictText = `Ativo classificado como "${category}" com Score Quantitativo de ${stock.scoreTotal.toFixed(1)}/100. Relação risco-retorno exige cautela devido a ${!stock.passesCutFilter ? stock.cutFilterReason.toLowerCase() : 'assimetria desfavorável nos múltiplos atuais'}.`;
    }

    return {
      strengths: `${stock.companyName} (${stock.ticker}) ${strengthsParts.join('; ')}.`,
      risks: `Principais vetores de atenção: ${risksParts.join('; ')}.`,
      verdict: verdictText,
      businessCategory: category,
      provider: 'Quantitative Deterministic Engine',
    };
  }

  async generateThesis(
    stock: EvaluatedStockMetrics,
    customApiKey?: string,
  ): Promise<AiThesisResponse & { provider: string }> {
    const geminiKey = customApiKey || process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim().length > 10) {
      try {
        const prompt = `Você é um analista CNPI especialista em ações da B3. Analise os indicadores determinísticos de ${stock.ticker} (${stock.companyName}, Setor: ${stock.sector}):
Preço Atual: R$ ${stock.price}
Preço Teto Bazin (6%): R$ ${stock.bazinCeilingPrice} (Margem: ${stock.bazinMargin}%)
Preço Justo Graham: R$ ${stock.grahamFairPrice} (Margem: ${stock.grahamMargin}%)
P/L: ${stock.pl} | P/VP: ${stock.pvp} | DY: ${stock.dy}% | ROE: ${stock.roe}% | Margem Líquida: ${stock.netMargin}%
Dívida Líq/EBITDA: ${stock.netDebtToEbitda}x | Liquidez Diária: R$ ${stock.dailyLiquidity}
Tendência Técnica: ${stock.technicalTrend} (SMA50: ${stock.sma50}, SMA200: ${stock.sma200}, RSI14: ${stock.rsi14})
Score Geral: ${stock.scoreTotal}/100.

Retorne EXCLUSIVAMENTE um JSON válido com as chaves:
"strengths": resumo objetivo em 1 parágrafo dos pontos fortes,
"risks": resumo objetivo em 1 parágrafo dos riscos,
"verdict": veredito de longo prazo em 1 parágrafo,
"businessCategory": exatamente uma das opções ["Renda / Vacas Leiteiras", "Crescimento Agressivo", "Defensiva", "Turnaround / Risco Alto"]`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey.trim()}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          },
          { timeout: 12000 },
        );

        const rawText =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanedJson = rawText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        const parsedJson = JSON.parse(cleanedJson);
        const validated = AiThesisResponseSchema.safeParse(parsedJson);
        if (validated.success) {
          return {
            ...validated.data,
            provider: 'Google Gemini 2.0 Flash',
          };
        }
      } catch {
        return this.buildDeterministicThesis(stock);
      }
    }

    return this.buildDeterministicThesis(stock);
  }
}
