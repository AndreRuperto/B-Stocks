import { RawMarketStock } from '../common/schemas/stock.schema';

export interface B3CompanyMeta {
  companyName: string;
  sector: string;
  subsector: string;
  logoUrl?: string;
}

export const TARGET_SECTORS = [
  'Energia Elétrica',
  'Bancos',
  'Seguradoras',
  'Commodities',
  'Telecomunicações',
  'Saneamento',
] as const;

export function isTargetSector(sectorName: string): boolean {
  if (!sectorName) return false;
  const lower = sectorName.toLowerCase();
  return (
    lower.includes('elétr') ||
    lower.includes('eletric') ||
    lower.includes('energia') ||
    lower.includes('banco') ||
    lower.includes('financ') ||
    lower.includes('segur') ||
    lower.includes('comodit') ||
    lower.includes('petróleo') ||
    lower.includes('petroleo') ||
    lower.includes('miner') ||
    lower.includes('siderur') ||
    lower.includes('papel') ||
    lower.includes('celulose') ||
    lower.includes('agro') ||
    lower.includes('telecom') ||
    lower.includes('comunica') ||
    lower.includes('saneam') ||
    lower.includes('água') ||
    lower.includes('agua')
  );
}

export function normalizeTargetSector(sectorName: string, subsectorName = ''): string | null {
  const combined = `${sectorName} ${subsectorName}`.toLowerCase();
  if (combined.includes('elétr') || combined.includes('eletric') || (combined.includes('energia') && !combined.includes('petr'))) {
    return 'Energia Elétrica';
  }
  if (combined.includes('segur') || combined.includes('previdência') || combined.includes('resseguro')) {
    return 'Seguradoras';
  }
  if (combined.includes('banco') || combined.includes('financ') || combined.includes('crédito')) {
    return 'Bancos';
  }
  if (
    combined.includes('petróleo') ||
    combined.includes('petroleo') ||
    combined.includes('combust') ||
    combined.includes('miner') ||
    combined.includes('siderur') ||
    combined.includes('metalur') ||
    combined.includes('papel') ||
    combined.includes('celulose') ||
    combined.includes('agro') ||
    combined.includes('açúcar') ||
    combined.includes('carne') ||
    combined.includes('químic') ||
    combined.includes('comodit')
  ) {
    return 'Commodities';
  }
  if (combined.includes('telecom') || combined.includes('telef') || combined.includes('comunica')) {
    return 'Telecomunicações';
  }
  if (combined.includes('saneam') || combined.includes('água') || combined.includes('agua') || combined.includes('resíduo')) {
    return 'Saneamento';
  }
  return null;
}

export const B3_PREFIX_CATALOG: Record<string, B3CompanyMeta> = {
  ELET: { companyName: 'Eletrobras', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão' },
  EQTL: { companyName: 'Equatorial Energia', sector: 'Energia Elétrica', subsector: 'Distribuição e Transmissão' },
  ENGI: { companyName: 'Energisa', sector: 'Energia Elétrica', subsector: 'Distribuição e Transmissão' },
  CPFE: { companyName: 'CPFL Energia', sector: 'Energia Elétrica', subsector: 'Distribuição e Geração' },
  EGIE: { companyName: 'Engie Brasil', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão' },
  TAEE: { companyName: 'Taesa', sector: 'Energia Elétrica', subsector: 'Transmissão' },
  TRPL: { companyName: 'ISA CTEEP', sector: 'Energia Elétrica', subsector: 'Transmissão' },
  ISAE: { companyName: 'ISA Energia Brasil', sector: 'Energia Elétrica', subsector: 'Transmissão' },
  CMIG: { companyName: 'Cemig', sector: 'Energia Elétrica', subsector: 'Distribuição e Geração' },
  CPLE: { companyName: 'Copel', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição' },
  NEOE: { companyName: 'Neoenergia', sector: 'Energia Elétrica', subsector: 'Distribuição e Renováveis' },
  AURE: { companyName: 'Auren Energia', sector: 'Energia Elétrica', subsector: 'Geração Renovável' },
  ALUP: { companyName: 'Alupar', sector: 'Energia Elétrica', subsector: 'Transmissão e Geração' },
  ENEV: { companyName: 'Eneva', sector: 'Energia Elétrica', subsector: 'Geração Térmica e Gás' },
  LIGT: { companyName: 'Light S.A.', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  CLSC: { companyName: 'Celesc', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  COCE: { companyName: 'Coelce', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  CEEB: { companyName: 'Coelba', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  SRNA: { companyName: 'Serena Energia', sector: 'Energia Elétrica', subsector: 'Geração Renovável' },
  AESB: { companyName: 'AES Brasil', sector: 'Energia Elétrica', subsector: 'Geração Renovável' },
  MEGA: { companyName: 'Omega Energia', sector: 'Energia Elétrica', subsector: 'Geração Renovável' },
  REDE: { companyName: 'Rede Energia', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  GEPA: { companyName: 'Ger Paranapanema', sector: 'Energia Elétrica', subsector: 'Geração' },
  CBEE: { companyName: 'Ampla Energia', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  CEBR: { companyName: 'CEB', sector: 'Energia Elétrica', subsector: 'Geração' },
  CSRN: { companyName: 'Cosern', sector: 'Energia Elétrica', subsector: 'Distribuição' },
  EKTR: { companyName: 'Elektro', sector: 'Energia Elétrica', subsector: 'Distribuição' },

  ITUB: { companyName: 'Itaú Unibanco', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BBDC: { companyName: 'Bradesco', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BBAS: { companyName: 'Banco do Brasil', sector: 'Bancos', subsector: 'Bancos Comerciais' },
  SANB: { companyName: 'Banco Santander Brasil', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BPAC: { companyName: 'BTG Pactual', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  BRSR: { companyName: 'Banrisul', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  ABCB: { companyName: 'Banco ABC Brasil', sector: 'Bancos', subsector: 'Bancos Comerciais' },
  BMGB: { companyName: 'Banco BMG', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BPAN: { companyName: 'Banco PAN', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  PINE: { companyName: 'Banco Pine', sector: 'Bancos', subsector: 'Bancos Comerciais' },
  BMEB: { companyName: 'Banco Mercantil do Brasil', sector: 'Bancos', subsector: 'Bancos Comerciais' },
  BGIP: { companyName: 'Banese', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BEES: { companyName: 'Banestes', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BMIN: { companyName: 'Banco Mercantil de Investimentos', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  BRBI: { companyName: 'BR Partners', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  ITSA: { companyName: 'Itaúsa', sector: 'Bancos', subsector: 'Holdings Bancárias' },
  B3SA: { companyName: 'B3 S.A.', sector: 'Bancos', subsector: 'Infraestrutura Financeira' },
  MODL: { companyName: 'Banco Modal', sector: 'Bancos', subsector: 'Bancos Digitais' },
  INBR: { companyName: 'Inter & Co', sector: 'Bancos', subsector: 'Bancos Digitais' },

  BBSE: { companyName: 'BB Seguridade', sector: 'Seguradoras', subsector: 'Previdência e Seguros' },
  CXSE: { companyName: 'Caixa Seguridade', sector: 'Seguradoras', subsector: 'Previdência e Seguros' },
  PSSA: { companyName: 'Porto Seguro', sector: 'Seguradoras', subsector: 'Seguros Gerais e Auto' },
  IRBR: { companyName: 'IRB Brasil RE', sector: 'Seguradoras', subsector: 'Resseguros' },
  WIZC: { companyName: 'Wiz Co', sector: 'Seguradoras', subsector: 'Corretoras de Seguros' },
  CSAB: { companyName: 'Cia Seguros Aliança da Bahia', sector: 'Seguradoras', subsector: 'Seguros Gerais' },

  PETR: { companyName: 'Petrobras', sector: 'Commodities', subsector: 'Petróleo e Gás' },
  VALE: { companyName: 'Vale S.A.', sector: 'Commodities', subsector: 'Mineração de Ferro' },
  PRIO: { companyName: 'PRIO (PetroRio)', sector: 'Commodities', subsector: 'Petróleo e Gás' },
  RECV: { companyName: 'PetroReconcavo', sector: 'Commodities', subsector: 'Petróleo e Gás Onshore' },
  BRAV: { companyName: 'Brava Energia', sector: 'Commodities', subsector: 'Petróleo e Gás' },
  CSAN: { companyName: 'Cosan', sector: 'Commodities', subsector: 'Açúcar, Etanol e Logística' },
  UGPA: { companyName: 'Ultrapar', sector: 'Commodities', subsector: 'Distribuição de Combustíveis' },
  VBBR: { companyName: 'Vibra Energia', sector: 'Commodities', subsector: 'Distribuição de Combustíveis' },
  RAIZ: { companyName: 'Raízen', sector: 'Commodities', subsector: 'Biocombustíveis e Açúcar' },
  SUZB: { companyName: 'Suzano', sector: 'Commodities', subsector: 'Papel e Celulose' },
  KLBN: { companyName: 'Klabin', sector: 'Commodities', subsector: 'Papel e Celulose' },
  RANI: { companyName: 'Irani Papel e Embalagem', sector: 'Commodities', subsector: 'Papel e Celulose' },
  GGBR: { companyName: 'Gerdau', sector: 'Commodities', subsector: 'Siderurgia e Aço Longo' },
  GOAU: { companyName: 'Metalúrgica Gerdau', sector: 'Commodities', subsector: 'Siderurgia' },
  CSNA: { companyName: 'CSN', sector: 'Commodities', subsector: 'Siderurgia e Mineração' },
  USIM: { companyName: 'Usiminas', sector: 'Commodities', subsector: 'Siderurgia e Aço Plano' },
  FESA: { companyName: 'Ferbasa', sector: 'Commodities', subsector: 'Ferroligas e Metalurgia' },
  CMIN: { companyName: 'CSN Mineração', sector: 'Commodities', subsector: 'Mineração de Ferro' },
  CBAV: { companyName: 'CBA Alumínio', sector: 'Commodities', subsector: 'Alumínio e Metalurgia' },
  BRAP: { companyName: 'Bradespar', sector: 'Commodities', subsector: 'Holdings de Mineração' },
  BRKM: { companyName: 'Braskem', sector: 'Commodities', subsector: 'Petroquímicos Básicos' },
  UNIP: { companyName: 'Unipar Carbocloro', sector: 'Commodities', subsector: 'Cloro e Petroquímicos' },
  DXCO: { companyName: 'Dexco', sector: 'Commodities', subsector: 'Painéis de Madeira e Celulose' },
  EUCA: { companyName: 'Eucatex', sector: 'Commodities', subsector: 'Madeira e Painéis' },
  SMTO: { companyName: 'São Martinho', sector: 'Commodities', subsector: 'Açúcar e Etanol' },
  JALL: { companyName: 'Jalles Machado', sector: 'Commodities', subsector: 'Açúcar e Etanol' },
  SLCE: { companyName: 'SLC Agrícola', sector: 'Commodities', subsector: 'Soja, Milho e Algodão' },
  AGRO: { companyName: 'BrasilAgro', sector: 'Commodities', subsector: 'Terras e Grãos' },
  TTEN: { companyName: '3tentos', sector: 'Commodities', subsector: 'Grãos e Insumos Agrícolas' },
  SOJA: { companyName: 'Boa Safra Sementes', sector: 'Commodities', subsector: 'Sementes de Soja' },
  JBSS: { companyName: 'JBS S.A.', sector: 'Commodities', subsector: 'Proteína Animal e Carnes' },
  BRFS: { companyName: 'BRF S.A.', sector: 'Commodities', subsector: 'Aves e Suínos' },
  MRFG: { companyName: 'Marfrig', sector: 'Commodities', subsector: 'Bovinos e Carnes' },
  BEEF: { companyName: 'Minerva Foods', sector: 'Commodities', subsector: 'Exportação de Carne Bovina' },
  MDIA: { companyName: 'M. Dias Branco', sector: 'Commodities', subsector: 'Trigo e Massas' },
  CAML: { companyName: 'Camil Alimentos', sector: 'Commodities', subsector: 'Arroz e Grãos' },
  ENAT: { companyName: 'Enauta', sector: 'Commodities', subsector: 'Petróleo e Gás' },
  DMMO: { companyName: 'Dommo Energia', sector: 'Commodities', subsector: 'Petróleo' },
  OPCT: { companyName: 'OceanPact', sector: 'Commodities', subsector: 'Serviços Offshore de Petróleo' },

  VIVT: { companyName: 'Telefônica Brasil (Vivo)', sector: 'Telecomunicações', subsector: 'Telefonia Móvel e Fixa' },
  TIMS: { companyName: 'TIM S.A.', sector: 'Telecomunicações', subsector: 'Telefonia Móvel e Dados' },
  FIQE: { companyName: 'Unifique', sector: 'Telecomunicações', subsector: 'Banda Larga e Fibra' },
  BRST: { companyName: 'Brisanet', sector: 'Telecomunicações', subsector: 'Banda Larga e 5G' },
  DESK: { companyName: 'Desktop Telecom', sector: 'Telecomunicações', subsector: 'Internet Fibra Óptica' },
  OIBR: { companyName: 'Oi S.A.', sector: 'Telecomunicações', subsector: 'Serviços de Telecomunicações' },
  TELB: { companyName: 'Telebras', sector: 'Telecomunicações', subsector: 'Infraestrutura de Telecom' },

  SBSP: { companyName: 'Sabesp', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto' },
  CSMG: { companyName: 'Copasa', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto' },
  SAPR: { companyName: 'Sanepar', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto' },
  ORVR: { companyName: 'Orizon Valorização de Resíduos', sector: 'Saneamento', subsector: 'Tratamento de Resíduos e Biogás' },
  AMBP: { companyName: 'Ambipar', sector: 'Saneamento', subsector: 'Gestão Ambiental e Resíduos' },
  CASN: { companyName: 'Casan', sector: 'Saneamento', subsector: 'Água e Esgoto' },
};

export function resolveB3CompanyMeta(ticker: string): B3CompanyMeta & { isAllowed: boolean } {
  const clean = ticker.toUpperCase().trim();
  const prefix = clean.replace(/[0-9]+$/, '');
  const logoUrl = `https://icons.brapi.dev/icons/${clean}.svg`;
  if (B3_PREFIX_CATALOG[prefix]) {
    const meta = B3_PREFIX_CATALOG[prefix];
    return {
      companyName: meta.companyName,
      sector: meta.sector,
      subsector: meta.subsector,
      logoUrl,
      isAllowed: true,
    };
  }
  return {
    companyName: `${prefix} S.A. (${clean})`,
    sector: 'Outros Setores B3',
    subsector: 'Mercado de Capitais',
    logoUrl,
    isAllowed: false,
  };
}

export const FALLBACK_B3_STOCKS: RawMarketStock[] = [
  { ticker: 'BBAS3', companyName: 'Banco do Brasil', logoUrl: 'https://icons.brapi.dev/icons/BBAS3.svg', sector: 'Bancos', subsector: 'Bancos Comerciais', price: 27.4, pl: 4.45, pvp: 0.84, psr: 0.92, dy: 9.65, roe: 20.4, roic: 18.2, netMargin: 24.5, ebitMargin: 28.1, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 540_000_000, revenueGrowth5y: 14.5 },
  { ticker: 'ITUB4', companyName: 'Itaú Unibanco', logoUrl: 'https://icons.brapi.dev/icons/ITUB4.svg', sector: 'Bancos', subsector: 'Bancos Múltiplos', price: 34.5, pl: 8.2, pvp: 1.68, psr: 1.45, dy: 6.8, roe: 21.2, roic: 19.1, netMargin: 22.4, ebitMargin: 26.8, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 920_000_000, revenueGrowth5y: 11.9 },
  { ticker: 'BBDC4', companyName: 'Bradesco', logoUrl: 'https://icons.brapi.dev/icons/BBDC4.svg', sector: 'Bancos', subsector: 'Bancos Múltiplos', price: 14.16, pl: 9.4, pvp: 0.95, psr: 1.05, dy: 6.2, roe: 10.8, roic: 9.8, netMargin: 12.4, ebitMargin: 16.5, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 410_000_000, revenueGrowth5y: 5.4 },
  { ticker: 'SANB11', companyName: 'Banco Santander Brasil', logoUrl: 'https://icons.brapi.dev/icons/SANB11.svg', sector: 'Bancos', subsector: 'Bancos Múltiplos', price: 28.4, pl: 8.9, pvp: 1.15, psr: 1.12, dy: 7.4, roe: 13.8, roic: 12.4, netMargin: 14.2, ebitMargin: 18.2, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 85_000_000, revenueGrowth5y: 6.8 },
  { ticker: 'ITSA4', companyName: 'Itaúsa', logoUrl: 'https://icons.brapi.dev/icons/ITSA4.svg', sector: 'Bancos', subsector: 'Holdings Bancárias', price: 10.4, pl: 7.1, pvp: 1.25, psr: 12.4, dy: 7.9, roe: 17.6, roic: 15.8, netMargin: 165.0, ebitMargin: 140.0, netDebtToEbitda: 0.35, grossDebtToEquity: 0.14, dailyLiquidity: 240_000_000, revenueGrowth5y: 10.2 },
  { ticker: 'TAEE11', companyName: 'Taesa', logoUrl: 'https://icons.brapi.dev/icons/TAEE11.svg', sector: 'Energia Elétrica', subsector: 'Transmissão', price: 34.8, pl: 8.6, pvp: 1.72, psr: 4.8, dy: 9.4, roe: 20.1, roic: 14.2, netMargin: 55.4, ebitMargin: 68.2, netDebtToEbitda: 2.65, grossDebtToEquity: 1.38, dailyLiquidity: 85_000_000, revenueGrowth5y: 8.5 },
  { ticker: 'TRPL4', companyName: 'ISA CTEEP', logoUrl: 'https://icons.brapi.dev/icons/TRPL4.svg', sector: 'Energia Elétrica', subsector: 'Transmissão', price: 25.2, pl: 6.8, pvp: 0.98, psr: 3.2, dy: 9.8, roe: 15.4, roic: 13.8, netMargin: 48.5, ebitMargin: 58.0, netDebtToEbitda: 2.45, grossDebtToEquity: 0.85, dailyLiquidity: 65_000_000, revenueGrowth5y: 7.9 },
  { ticker: 'EGIE3', companyName: 'Engie Brasil', logoUrl: 'https://icons.brapi.dev/icons/EGIE3.svg', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão', price: 41.2, pl: 8.9, pvp: 3.1, psr: 3.1, dy: 7.2, roe: 34.8, roic: 17.5, netMargin: 34.2, ebitMargin: 48.9, netDebtToEbitda: 2.15, grossDebtToEquity: 1.95, dailyLiquidity: 78_000_000, revenueGrowth5y: 5.2 },
  { ticker: 'ELET3', companyName: 'Eletrobras', logoUrl: 'https://icons.brapi.dev/icons/ELET3.svg', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão', price: 38.6, pl: 14.5, pvp: 0.82, psr: 1.95, dy: 3.4, roe: 5.8, roic: 6.4, netMargin: 12.8, ebitMargin: 24.5, netDebtToEbitda: 2.35, grossDebtToEquity: 0.72, dailyLiquidity: 310_000_000, revenueGrowth5y: 6.2 },
  { ticker: 'EQTL3', companyName: 'Equatorial Energia', logoUrl: 'https://icons.brapi.dev/icons/EQTL3.svg', sector: 'Energia Elétrica', subsector: 'Distribuição e Transmissão', price: 31.5, pl: 12.8, pvp: 1.65, psr: 0.98, dy: 3.8, roe: 14.5, roic: 11.2, netMargin: 8.5, ebitMargin: 15.2, netDebtToEbitda: 2.85, grossDebtToEquity: 1.45, dailyLiquidity: 185_000_000, revenueGrowth5y: 18.5 },
  { ticker: 'CMIG4', companyName: 'Cemig', logoUrl: 'https://icons.brapi.dev/icons/CMIG4.svg', sector: 'Energia Elétrica', subsector: 'Distribuição e Geração', price: 11.2, pl: 5.4, pvp: 1.18, psr: 0.82, dy: 10.8, roe: 21.8, roic: 16.4, netMargin: 15.2, ebitMargin: 21.4, netDebtToEbitda: 1.12, grossDebtToEquity: 0.48, dailyLiquidity: 145_000_000, revenueGrowth5y: 9.8 },
  { ticker: 'CPLE6', companyName: 'Copel', logoUrl: 'https://icons.brapi.dev/icons/CPLE6.svg', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição', price: 10.1, pl: 9.8, pvp: 1.16, psr: 1.32, dy: 6.4, roe: 11.8, roic: 10.9, netMargin: 13.5, ebitMargin: 19.8, netDebtToEbitda: 1.85, grossDebtToEquity: 0.62, dailyLiquidity: 132_000_000, revenueGrowth5y: 7.6 },
  { ticker: 'CPFE3', companyName: 'CPFL Energia', logoUrl: 'https://icons.brapi.dev/icons/CPFE3.svg', sector: 'Energia Elétrica', subsector: 'Distribuição e Geração', price: 34.2, pl: 7.8, pvp: 2.15, psr: 0.95, dy: 8.6, roe: 28.5, roic: 18.4, netMargin: 11.8, ebitMargin: 20.5, netDebtToEbitda: 2.25, grossDebtToEquity: 1.35, dailyLiquidity: 72_000_000, revenueGrowth5y: 8.8 },
  { ticker: 'ALUP11', companyName: 'Alupar', logoUrl: 'https://icons.brapi.dev/icons/ALUP11.svg', sector: 'Energia Elétrica', subsector: 'Transmissão e Geração', price: 29.8, pl: 7.2, pvp: 1.18, psr: 2.45, dy: 6.5, roe: 16.8, roic: 12.4, netMargin: 32.5, ebitMargin: 45.8, netDebtToEbitda: 2.55, grossDebtToEquity: 1.15, dailyLiquidity: 42_000_000, revenueGrowth5y: 9.4 },
  { ticker: 'BBSE3', companyName: 'BB Seguridade', logoUrl: 'https://icons.brapi.dev/icons/BBSE3.svg', sector: 'Seguradoras', subsector: 'Previdência e Seguros', price: 35.4, pl: 8.5, pvp: 6.4, psr: 7.2, dy: 8.9, roe: 75.2, roic: 68.0, netMargin: 84.5, ebitMargin: 88.0, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 175_000_000, revenueGrowth5y: 13.2 },
  { ticker: 'CXSE3', companyName: 'Caixa Seguridade', logoUrl: 'https://icons.brapi.dev/icons/CXSE3.svg', sector: 'Seguradoras', subsector: 'Previdência e Seguros', price: 14.8, pl: 11.8, pvp: 3.45, psr: 8.9, dy: 7.4, roe: 29.2, roic: 27.5, netMargin: 75.4, ebitMargin: 80.2, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 68_000_000, revenueGrowth5y: 16.4 },
  { ticker: 'PSSA3', companyName: 'Porto Seguro', logoUrl: 'https://icons.brapi.dev/icons/PSSA3.svg', sector: 'Seguradoras', subsector: 'Seguros Gerais e Auto', price: 36.8, pl: 9.6, pvp: 1.84, psr: 0.72, dy: 5.4, roe: 19.2, roic: 17.8, netMargin: 7.5, ebitMargin: 11.2, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 64_000_000, revenueGrowth5y: 14.8 },
  { ticker: 'PETR4', companyName: 'Petrobras', logoUrl: 'https://icons.brapi.dev/icons/PETR4.svg', sector: 'Commodities', subsector: 'Petróleo e Gás', price: 36.2, pl: 4.8, pvp: 1.15, psr: 0.95, dy: 14.2, roe: 24.1, roic: 19.8, netMargin: 19.6, ebitMargin: 33.4, netDebtToEbitda: 0.95, grossDebtToEquity: 0.78, dailyLiquidity: 1_350_000_000, revenueGrowth5y: 12.8 },
  { ticker: 'PETR3', companyName: 'Petrobras ON', logoUrl: 'https://icons.brapi.dev/icons/PETR3.svg', sector: 'Commodities', subsector: 'Petróleo e Gás', price: 39.1, pl: 5.18, pvp: 1.24, psr: 1.02, dy: 13.15, roe: 24.1, roic: 19.8, netMargin: 19.6, ebitMargin: 33.4, netDebtToEbitda: 0.95, grossDebtToEquity: 0.78, dailyLiquidity: 380_000_000, revenueGrowth5y: 12.8 },
  { ticker: 'VALE3', companyName: 'Vale S.A.', logoUrl: 'https://icons.brapi.dev/icons/VALE3.svg', sector: 'Commodities', subsector: 'Mineração de Ferro', price: 58.9, pl: 6.1, pvp: 1.32, psr: 1.28, dy: 8.9, roe: 21.6, roic: 18.9, netMargin: 20.8, ebitMargin: 31.2, netDebtToEbitda: 0.65, grossDebtToEquity: 0.42, dailyLiquidity: 1_450_000_000, revenueGrowth5y: 6.4 },
  { ticker: 'PRIO3', companyName: 'PRIO', logoUrl: 'https://icons.brapi.dev/icons/PRIO3.svg', sector: 'Commodities', subsector: 'Petróleo e Gás', price: 42.6, pl: 7.8, pvp: 2.15, psr: 2.85, dy: 0.4, roe: 27.5, roic: 21.4, netMargin: 36.5, ebitMargin: 51.2, netDebtToEbitda: 0.85, grossDebtToEquity: 0.68, dailyLiquidity: 420_000_000, revenueGrowth5y: 42.5 },
  { ticker: 'GGBR4', companyName: 'Gerdau', logoUrl: 'https://icons.brapi.dev/icons/GGBR4.svg', sector: 'Commodities', subsector: 'Siderurgia e Aço Longo', price: 18.9, pl: 7.4, pvp: 0.74, psr: 0.58, dy: 5.8, roe: 10.1, roic: 11.4, netMargin: 7.8, ebitMargin: 11.9, netDebtToEbitda: 0.52, grossDebtToEquity: 0.22, dailyLiquidity: 195_000_000, revenueGrowth5y: 9.2 },
  { ticker: 'GOAU4', companyName: 'Metalúrgica Gerdau', logoUrl: 'https://icons.brapi.dev/icons/GOAU4.svg', sector: 'Commodities', subsector: 'Siderurgia', price: 10.5, pl: 6.5, pvp: 0.68, psr: 0.42, dy: 6.5, roe: 11.4, roic: 10.8, netMargin: 8.2, ebitMargin: 12.4, netDebtToEbitda: 0.58, grossDebtToEquity: 0.25, dailyLiquidity: 75_000_000, revenueGrowth5y: 8.5 },
  { ticker: 'CSNA3', companyName: 'CSN', logoUrl: 'https://icons.brapi.dev/icons/CSNA3.svg', sector: 'Commodities', subsector: 'Siderurgia e Mineração', price: 11.8, pl: 16.2, pvp: 0.85, psr: 0.35, dy: 5.2, roe: 5.4, roic: 6.8, netMargin: 2.8, ebitMargin: 14.5, netDebtToEbitda: 2.85, grossDebtToEquity: 1.85, dailyLiquidity: 165_000_000, revenueGrowth5y: 5.5 },
  { ticker: 'SUZB3', companyName: 'Suzano', logoUrl: 'https://icons.brapi.dev/icons/SUZB3.svg', sector: 'Commodities', subsector: 'Papel e Celulose', price: 58.2, pl: 14.2, pvp: 1.85, psr: 1.82, dy: 2.6, roe: 13.0, roic: 10.4, netMargin: 12.8, ebitMargin: 28.4, netDebtToEbitda: 2.92, grossDebtToEquity: 2.12, dailyLiquidity: 280_000_000, revenueGrowth5y: 10.8 },
  { ticker: 'KLBN11', companyName: 'Klabin', logoUrl: 'https://icons.brapi.dev/icons/KLBN11.svg', sector: 'Commodities', subsector: 'Papel e Celulose', price: 21.4, pl: 12.8, pvp: 2.35, psr: 1.32, dy: 6.1, roe: 18.4, roic: 11.8, netMargin: 10.3, ebitMargin: 21.5, netDebtToEbitda: 2.85, grossDebtToEquity: 2.45, dailyLiquidity: 115_000_000, revenueGrowth5y: 11.6 },
  { ticker: 'VIVT3', companyName: 'Telefônica Brasil (Vivo)', logoUrl: 'https://icons.brapi.dev/icons/VIVT3.svg', sector: 'Telecomunicações', subsector: 'Telefonia Móvel e Fixa', price: 51.4, pl: 15.6, pvp: 1.22, psr: 1.54, dy: 6.3, roe: 7.8, roic: 8.4, netMargin: 9.9, ebitMargin: 16.8, netDebtToEbitda: 0.62, grossDebtToEquity: 0.28, dailyLiquidity: 125_000_000, revenueGrowth5y: 5.4 },
  { ticker: 'TIMS3', companyName: 'TIM S.A.', logoUrl: 'https://icons.brapi.dev/icons/TIMS3.svg', sector: 'Telecomunicações', subsector: 'Telefonia Móvel e Dados', price: 17.6, pl: 13.8, pvp: 1.65, psr: 1.72, dy: 7.1, roe: 11.9, roic: 11.2, netMargin: 12.5, ebitMargin: 21.4, netDebtToEbitda: 0.42, grossDebtToEquity: 0.19, dailyLiquidity: 98_000_000, revenueGrowth5y: 8.2 },
  { ticker: 'SBSP3', companyName: 'Sabesp', logoUrl: 'https://icons.brapi.dev/icons/SBSP3.svg', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto', price: 92.5, pl: 12.4, pvp: 1.95, psr: 2.45, dy: 2.8, roe: 15.7, roic: 12.8, netMargin: 19.8, ebitMargin: 29.4, netDebtToEbitda: 1.62, grossDebtToEquity: 0.65, dailyLiquidity: 320_000_000, revenueGrowth5y: 11.4 },
  { ticker: 'SAPR11', companyName: 'Sanepar', logoUrl: 'https://icons.brapi.dev/icons/SAPR11.svg', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto', price: 28.4, pl: 5.6, pvp: 0.86, psr: 1.35, dy: 6.2, roe: 15.4, roic: 13.1, netMargin: 24.1, ebitMargin: 35.8, netDebtToEbitda: 1.48, grossDebtToEquity: 0.54, dailyLiquidity: 42_000_000, revenueGrowth5y: 10.1 },
  { ticker: 'CSMG3', companyName: 'Copasa', logoUrl: 'https://icons.brapi.dev/icons/CSMG3.svg', sector: 'Saneamento', subsector: 'Água e Tratamento de Esgoto', price: 21.8, pl: 5.9, pvp: 1.04, psr: 1.18, dy: 8.7, roe: 17.6, roic: 14.2, netMargin: 20.1, ebitMargin: 28.4, netDebtToEbitda: 1.32, grossDebtToEquity: 0.51, dailyLiquidity: 38_000_000, revenueGrowth5y: 8.9 },
  { ticker: 'ORVR3', companyName: 'Orizon', logoUrl: 'https://icons.brapi.dev/icons/ORVR3.svg', sector: 'Saneamento', subsector: 'Tratamento de Resíduos e Biogás', price: 44.5, pl: 28.4, pvp: 3.8, psr: 4.2, dy: 0, roe: 13.8, roic: 10.4, netMargin: 14.8, ebitMargin: 26.5, netDebtToEbitda: 2.4, grossDebtToEquity: 1.65, dailyLiquidity: 24_000_000, revenueGrowth5y: 22.4 },
];
