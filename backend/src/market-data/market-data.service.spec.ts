import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataService } from './market-data.service';
import { resolveB3CompanyMeta } from './b3-catalog';

describe('MarketDataService', () => {
  let service: MarketDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketDataService],
    }).compile();

    service = module.get<MarketDataService>(MarketDataService);
  });

  describe('parseBrazilianNumber', () => {
    it('parses Brazilian currency and percentage strings properly', () => {
      expect(service.parseBrazilianNumber('1.234.567,89')).toBe(1234567.89);
      expect(service.parseBrazilianNumber('14,25%')).toBe(14.25);
      expect(service.parseBrazilianNumber('-8,40%')).toBe(-8.4);
      expect(service.parseBrazilianNumber('')).toBe(0);
    });
  });

  describe('deriveNetDebtToEbitda', () => {
    it('calculates NetDebt/EBITDA from EV/EBITDA, P/EBIT, and EV/EBIT', () => {
      const ratio = service.deriveNetDebtToEbitda(
        4.0,
        3.0,
        6.0,
        0.8,
        'Energia Elétrica',
      );
      expect(ratio).toBe(2.0);
    });

    it('returns 0 for financial sector companies', () => {
      const ratio = service.deriveNetDebtToEbitda(
        5.0,
        3.0,
        6.0,
        1.2,
        'Financeiro / Bancos',
      );
      expect(ratio).toBe(0);
    });
  });

  describe('parseFundamentusHtml', () => {
    it('extracts valid B3 stock entries from Fundamentus HTML table', () => {
      const sampleHtml = `
        <html>
          <body>
            <table id="resultado">
              <tbody>
                <tr>
                  <td><a href="detalhes.php?papel=PETR4">PETR4</a></td>
                  <td>36,50</td>
                  <td>4,80</td>
                  <td>1,15</td>
                  <td>0,92</td>
                  <td>14,20%</td>
                  <td>0,45</td>
                  <td>4,10</td>
                  <td>2,90</td>
                  <td>-1,20</td>
                  <td>3,80</td>
                  <td>2,70</td>
                  <td>50,60%</td>
                  <td>33,40%</td>
                  <td>19,60%</td>
                  <td>1,25</td>
                  <td>19,80%</td>
                  <td>24,10%</td>
                  <td>1.350.000.000,00</td>
                  <td>380.000.000.000,00</td>
                  <td>0,78</td>
                  <td>12,80%</td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      `;

      const parsed = service.parseFundamentusHtml(sampleHtml);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].ticker).toBe('PETR4');
      expect(parsed[0].companyName).toBe('Petrobras');
      expect(parsed[0].price).toBe(36.5);
      expect(parsed[0].dy).toBe(14.2);
      expect(parsed[0].roe).toBe(24.1);
      expect(parsed[0].dailyLiquidity).toBe(1350000000);
      expect(parsed[0].closes?.length).toBeGreaterThan(100);
    });
  });

  describe('resolveB3CompanyMeta', () => {
    it('resolves cataloged B3 prefixes and provides fallback for unknown tickers', () => {
      const vale = resolveB3CompanyMeta('VALE3');
      expect(vale.companyName).toBe('Vale S.A.');
      expect(vale.sector).toBe('Mineração');

      const unknown = resolveB3CompanyMeta('XYZW3');
      expect(unknown.companyName).toContain('XYZW');
    });
  });
});
