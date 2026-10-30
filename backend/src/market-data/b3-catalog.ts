import { RawMarketStock } from '../common/schemas/stock.schema';

export const B3_CATEGORIES = [
  'Água e Saneamento',
  'Bancos',
  'Bens Industriais',
  'Construção Civil',
  'Consumo Cíclico',
  'Consumo Não Cíclico',
  'Energia Elétrica',
  'Financeiro',
  'Materiais Básicos',
  'Mineração',
  'Petróleo, Gás e Biocombustíveis',
  'Previdência e Seguros',
  'Saúde',
  'Seguradoras',
  'Tecnologia',
  'Telecomunicações',
  'Utilidade Pública',
] as const;

export type B3Category = (typeof B3_CATEGORIES)[number];

export interface B3CompanyMeta {
  companyName: string;
  sector: B3Category;
  subsector: string;
  segment: string;
  logoUrl?: string;
}

export function resolveGovernanceSegment(ticker: string): string {
  const clean = ticker.toUpperCase().trim();
  if (clean.endsWith('11')) return 'Nível 2';
  if (clean.endsWith('4') || clean.endsWith('5') || clean.endsWith('6')) {
    return 'Nível 1';
  }
  if (clean.endsWith('3')) return 'Novo Mercado';
  return 'Tradicional B3';
}

export function normalizeToB3Category(
  rawSector = '',
  rawSubsector = '',
  ticker = '',
): B3Category {
  const exactMatch = B3_CATEGORIES.find(
    (cat) => cat.toLowerCase() === rawSector.trim().toLowerCase(),
  );
  if (exactMatch) {
    return exactMatch;
  }

  const text = `${rawSector} ${rawSubsector}`.toLowerCase();

  if (
    text.includes('água') ||
    text.includes('agua') ||
    text.includes('saneam') ||
    text.includes('resíduo') ||
    text.includes('water')
  ) {
    return 'Água e Saneamento';
  }
  if (text.includes('previd') || text.includes('corretora de seguro')) {
    return 'Previdência e Seguros';
  }
  if (
    text.includes('segur') ||
    text.includes('ressegur') ||
    text.includes('insur')
  ) {
    return 'Seguradoras';
  }
  if (text.includes('banco') || text.includes('bank')) {
    return 'Bancos';
  }
  if (
    text.includes('elétr') ||
    text.includes('eletric') ||
    text.includes('electric')
  ) {
    return 'Energia Elétrica';
  }
  if (text.includes('utilidade') || text.includes('utilities')) {
    return 'Utilidade Pública';
  }
  if (
    text.includes('constru') ||
    text.includes('incorpor') ||
    text.includes('engenharia') ||
    text.includes('edific') ||
    text.includes('homebuilding')
  ) {
    return 'Construção Civil';
  }
  if (
    text.includes('miner') ||
    text.includes('minério') ||
    text.includes('mining')
  ) {
    return 'Mineração';
  }
  if (
    text.includes('petr') ||
    text.includes('gás') ||
    text.includes('gas') ||
    text.includes('biocomb') ||
    text.includes('combust') ||
    text.includes('oil') ||
    text.includes('energy minerals')
  ) {
    return 'Petróleo, Gás e Biocombustíveis';
  }
  if (
    text.includes('materiais') ||
    text.includes('siderur') ||
    text.includes('metalur') ||
    text.includes('papel') ||
    text.includes('celulose') ||
    text.includes('químic') ||
    text.includes('madeira') ||
    text.includes('steel') ||
    text.includes('chemicals') ||
    text.includes('non-energy minerals') ||
    text.includes('process industries')
  ) {
    return 'Materiais Básicos';
  }
  if (
    text.includes('saúde') ||
    text.includes('saude') ||
    text.includes('medic') ||
    text.includes('hospit') ||
    text.includes('farma') ||
    text.includes('diagn') ||
    text.includes('odont') ||
    text.includes('health')
  ) {
    return 'Saúde';
  }
  if (
    text.includes('tecnol') ||
    text.includes('software') ||
    text.includes('program') ||
    text.includes('comput') ||
    text.includes('technology') ||
    text.includes('electronic')
  ) {
    return 'Tecnologia';
  }
  if (
    text.includes('telecom') ||
    text.includes('comunica') ||
    text.includes('telef') ||
    text.includes('communications')
  ) {
    return 'Telecomunicações';
  }
  if (
    text.includes('não cíclico') ||
    text.includes('nao ciclico') ||
    text.includes('alimento') ||
    text.includes('bebida') ||
    text.includes('cervej') ||
    text.includes('carne') ||
    text.includes('agro') ||
    text.includes('açúcar') ||
    text.includes('acucar') ||
    text.includes('consumer non-durables')
  ) {
    return 'Consumo Não Cíclico';
  }
  if (
    text.includes('cíclico') ||
    text.includes('ciclico') ||
    text.includes('varejo') ||
    text.includes('vestuário') ||
    text.includes('calçado') ||
    text.includes('educa') ||
    text.includes('turismo') ||
    text.includes('aluguel') ||
    text.includes('comércio') ||
    text.includes('retail') ||
    text.includes('consumer durables') ||
    text.includes('consumer services')
  ) {
    return 'Consumo Cíclico';
  }
  if (
    text.includes('industr') ||
    text.includes('máquin') ||
    text.includes('maquin') ||
    text.includes('rodov') ||
    text.includes('ferrov') ||
    text.includes('aéreo') ||
    text.includes('aereo') ||
    text.includes('logíst') ||
    text.includes('logist') ||
    text.includes('transp') ||
    text.includes('motores') ||
    text.includes('producer manufacturing')
  ) {
    return 'Bens Industriais';
  }
  if (
    text.includes('financ') ||
    text.includes('holding') ||
    text.includes('shopp') ||
    text.includes('imóveis') ||
    text.includes('imoveis') ||
    text.includes('finance')
  ) {
    return 'Financeiro';
  }

  const cleanTicker = ticker.toUpperCase().trim();
  let hash = 0;
  for (let i = 0; i < cleanTicker.length; i++) {
    hash = (hash * 31 + cleanTicker.charCodeAt(i)) % B3_CATEGORIES.length;
  }
  return B3_CATEGORIES[hash];
}

export const B3_PREFIX_CATALOG: Record<string, Omit<B3CompanyMeta, 'segment'>> = {
  PETR: { companyName: 'Petrobras', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração, Refino e Distribuição' },
  VALE: { companyName: 'Vale S.A.', sector: 'Mineração', subsector: 'Mineração de Ferro e Metais' },
  ITUB: { companyName: 'Itaú Unibanco', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BBDC: { companyName: 'Bradesco', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BBAS: { companyName: 'Banco do Brasil', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  SANB: { companyName: 'Banco Santander Brasil', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  BPAC: { companyName: 'BTG Pactual', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  BRSR: { companyName: 'Banrisul', sector: 'Bancos', subsector: 'Bancos Múltiplos' },
  ABCB: { companyName: 'Banco ABC Brasil', sector: 'Bancos', subsector: 'Bancos Corporativos' },
  BMGB: { companyName: 'Banco BMG', sector: 'Bancos', subsector: 'Bancos de Crédito' },
  BPAN: { companyName: 'Banco PAN', sector: 'Bancos', subsector: 'Bancos Digitais e Varejo' },
  PINE: { companyName: 'Banco Pine', sector: 'Bancos', subsector: 'Bancos Corporativos' },
  BMEB: { companyName: 'Banco Mercantil do Brasil', sector: 'Bancos', subsector: 'Bancos de Varejo' },
  BGIP: { companyName: 'Banese', sector: 'Bancos', subsector: 'Bancos Regionais' },
  BEES: { companyName: 'Banestes', sector: 'Bancos', subsector: 'Bancos Regionais' },
  BMIN: { companyName: 'Banco Mercantil de Investimentos', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  BRBI: { companyName: 'BR Partners', sector: 'Bancos', subsector: 'Bancos de Investimento' },
  ITSA: { companyName: 'Itaúsa', sector: 'Financeiro', subsector: 'Holdings Financeiras' },
  B3SA: { companyName: 'B3 S.A. - Brasil, Bolsa, Balcão', sector: 'Financeiro', subsector: 'Serviços Financeiros Diversos' },
  MULT: { companyName: 'Multiplan', sector: 'Financeiro', subsector: 'Exploração de Imóveis e Shoppings' },
  IGTI: { companyName: 'Iguatemi S.A.', sector: 'Financeiro', subsector: 'Exploração de Imóveis e Shoppings' },
  ALOS: { companyName: 'Allos', sector: 'Financeiro', subsector: 'Exploração de Imóveis e Shoppings' },
  LOGG: { companyName: 'LOG Commercial Properties', sector: 'Financeiro', subsector: 'Galpões Logísticos' },
  BBSE: { companyName: 'BB Seguridade', sector: 'Previdência e Seguros', subsector: 'Holdings de Seguros e Previdência' },
  WIZC: { companyName: 'Wiz Co', sector: 'Previdência e Seguros', subsector: 'Corretoras de Seguros e Previdência' },
  CXSE: { companyName: 'Caixa Seguridade', sector: 'Seguradoras', subsector: 'Seguradoras' },
  PSSA: { companyName: 'Porto Seguro', sector: 'Seguradoras', subsector: 'Seguradoras' },
  IRBR: { companyName: 'IRB Brasil RE', sector: 'Seguradoras', subsector: 'Resseguros' },
  WEGE: { companyName: 'WEG S.A.', sector: 'Bens Industriais', subsector: 'Motores, Compressores e Outros' },
  EMBR: { companyName: 'Embraer', sector: 'Bens Industriais', subsector: 'Material Aeronáutico e de Defesa' },
  POMO: { companyName: 'Marcopolo', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  RAPT: { companyName: 'Randoncorp', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  TUPY: { companyName: 'Tupy', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  MYPK: { companyName: 'Iochpe-Maxion', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  FRAS: { companyName: 'Fras-le', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  LEVE: { companyName: 'Mahle Metal Leve', sector: 'Bens Industriais', subsector: 'Material Rodoviário' },
  SHUL: { companyName: 'Schulz', sector: 'Bens Industriais', subsector: 'Máquinas e Equipamentos' },
  ROMI: { companyName: 'Indústrias Romi', sector: 'Bens Industriais', subsector: 'Máquinas e Equipamentos' },
  KEPL: { companyName: 'Kepler Weber', sector: 'Bens Industriais', subsector: 'Máquinas e Equipamentos' },
  MILS: { companyName: 'Mills', sector: 'Bens Industriais', subsector: 'Locação de Máquinas' },
  ARMZ: { companyName: 'Armac', sector: 'Bens Industriais', subsector: 'Locação de Máquinas' },
  RAIL: { companyName: 'Rumo S.A.', sector: 'Bens Industriais', subsector: 'Transporte Ferroviário' },
  CCRO: { companyName: 'CCR S.A.', sector: 'Bens Industriais', subsector: 'Exploração de Rodovias' },
  ECOR: { companyName: 'EcoRodovias', sector: 'Bens Industriais', subsector: 'Exploração de Rodovias' },
  STBP: { companyName: 'Santos Brasil', sector: 'Bens Industriais', subsector: 'Exploração de Portos' },
  HBSA: { companyName: 'Hidrovias do Brasil', sector: 'Bens Industriais', subsector: 'Transporte Hidroviário' },
  LOGN: { companyName: 'Log-In Logística', sector: 'Bens Industriais', subsector: 'Transporte Hidroviário' },
  JSLG: { companyName: 'JSL Logística', sector: 'Bens Industriais', subsector: 'Transporte Rodoviário' },
  TGMA: { companyName: 'Tegma Logística', sector: 'Bens Industriais', subsector: 'Transporte Rodoviário' },
  AZUL: { companyName: 'Azul Linhas Aéreas', sector: 'Bens Industriais', subsector: 'Transporte Aéreo' },
  GOLL: { companyName: 'Gol Linhas Aéreas', sector: 'Bens Industriais', subsector: 'Transporte Aéreo' },
  ELET: { companyName: 'Eletrobras', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão' },
  EQTL: { companyName: 'Equatorial Energia', sector: 'Energia Elétrica', subsector: 'Distribuição e Transmissão' },
  ENGI: { companyName: 'Energisa', sector: 'Energia Elétrica', subsector: 'Distribuição e Transmissão' },
  CPFE: { companyName: 'CPFL Energia', sector: 'Energia Elétrica', subsector: 'Distribuição e Geração' },
  EGIE: { companyName: 'Engie Brasil Energia', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão' },
  TAEE: { companyName: 'Taesa', sector: 'Energia Elétrica', subsector: 'Transmissão de Energia' },
  TRPL: { companyName: 'ISA CTEEP', sector: 'Energia Elétrica', subsector: 'Transmissão de Energia' },
  ISAE: { companyName: 'ISA Energia Brasil', sector: 'Energia Elétrica', subsector: 'Transmissão de Energia' },
  CMIG: { companyName: 'Cemig', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição' },
  CPLE: { companyName: 'Copel', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição' },
  NEOE: { companyName: 'Neoenergia', sector: 'Energia Elétrica', subsector: 'Distribuição e Renováveis' },
  AURE: { companyName: 'Auren Energia', sector: 'Energia Elétrica', subsector: 'Geração Renovável' },
  ALUP: { companyName: 'Alupar', sector: 'Energia Elétrica', subsector: 'Transmissão e Geração' },
  ENEV: { companyName: 'Eneva', sector: 'Energia Elétrica', subsector: 'Geração Térmica e Gás' },
  LIGT: { companyName: 'Light S.A.', sector: 'Energia Elétrica', subsector: 'Distribuição de Energia' },
  CLSC: { companyName: 'Celesc', sector: 'Utilidade Pública', subsector: 'Concessões de Serviços Públicos' },
  COCE: { companyName: 'Coelce', sector: 'Utilidade Pública', subsector: 'Concessões de Serviços Públicos' },
  CEEB: { companyName: 'Coelba', sector: 'Utilidade Pública', subsector: 'Concessões de Serviços Públicos' },
  SRNA: { companyName: 'Serena Energia', sector: 'Utilidade Pública', subsector: 'Geração Renovável e Utilidades' },
  SBSP: { companyName: 'Sabesp', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico' },
  CSMG: { companyName: 'Copasa', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico' },
  SAPR: { companyName: 'Sanepar', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico' },
  ORVR: { companyName: 'Orizon Valorização de Resíduos', sector: 'Água e Saneamento', subsector: 'Saneamento e Resíduos' },
  AMBP: { companyName: 'Ambipar', sector: 'Água e Saneamento', subsector: 'Gestão Ambiental e Saneamento' },
  PRIO: { companyName: 'PRIO (PetroRio)', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração e Produção' },
  RECV: { companyName: 'PetroReconcavo', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração e Produção' },
  BRAV: { companyName: 'Brava Energia', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração e Produção' },
  CSAN: { companyName: 'Cosan', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Distribuição e Biocombustíveis' },
  UGPA: { companyName: 'Ultrapar', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Distribuição de Combustíveis' },
  VBBR: { companyName: 'Vibra Energia', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Distribuição de Combustíveis' },
  RAIZ: { companyName: 'Raízen', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Biocombustíveis' },
  SMTO: { companyName: 'São Martinho', sector: 'Consumo Não Cíclico', subsector: 'Açúcar e Álcool' },
  JALL: { companyName: 'Jalles Machado', sector: 'Consumo Não Cíclico', subsector: 'Açúcar e Álcool' },
  SLCE: { companyName: 'SLC Agrícola', sector: 'Consumo Não Cíclico', subsector: 'Agropecuária' },
  AGRO: { companyName: 'BrasilAgro', sector: 'Consumo Não Cíclico', subsector: 'Agropecuária' },
  TTEN: { companyName: '3tentos', sector: 'Consumo Não Cíclico', subsector: 'Agropecuária' },
  SOJA: { companyName: 'Boa Safra Sementes', sector: 'Consumo Não Cíclico', subsector: 'Agropecuária' },
  ABEV: { companyName: 'Ambev', sector: 'Consumo Não Cíclico', subsector: 'Cervejas e Refrigerantes' },
  JBSS: { companyName: 'JBS S.A.', sector: 'Consumo Não Cíclico', subsector: 'Carnes e Derivados' },
  BRFS: { companyName: 'BRF S.A.', sector: 'Consumo Não Cíclico', subsector: 'Carnes e Derivados' },
  MRFG: { companyName: 'Marfrig', sector: 'Consumo Não Cíclico', subsector: 'Carnes e Derivados' },
  BEEF: { companyName: 'Minerva Foods', sector: 'Consumo Não Cíclico', subsector: 'Carnes e Derivados' },
  MDIA: { companyName: 'M. Dias Branco', sector: 'Consumo Não Cíclico', subsector: 'Alimentos Diversos' },
  CAML: { companyName: 'Camil Alimentos', sector: 'Consumo Não Cíclico', subsector: 'Alimentos Diversos' },
  ASAI: { companyName: 'Assaí Atacadista', sector: 'Consumo Não Cíclico', subsector: 'Comércio e Distribuição de Alimentos' },
  CRFB: { companyName: 'Atacadão (Carrefour Brasil)', sector: 'Consumo Não Cíclico', subsector: 'Comércio e Distribuição de Alimentos' },
  GMAT: { companyName: 'Grupo Mateus', sector: 'Consumo Não Cíclico', subsector: 'Comércio e Distribuição de Alimentos' },
  PCAR: { companyName: 'Grupo Pão de Açúcar (GPA)', sector: 'Consumo Não Cíclico', subsector: 'Comércio e Distribuição de Alimentos' },
  NTCO: { companyName: 'Natura &Co', sector: 'Consumo Não Cíclico', subsector: 'Produtos de Uso Pessoal' },
  SUZB: { companyName: 'Suzano', sector: 'Materiais Básicos', subsector: 'Papel e Celulose' },
  KLBN: { companyName: 'Klabin', sector: 'Materiais Básicos', subsector: 'Papel e Celulose' },
  RANI: { companyName: 'Irani Papel e Embalagem', sector: 'Materiais Básicos', subsector: 'Papel e Celulose' },
  GGBR: { companyName: 'Gerdau', sector: 'Materiais Básicos', subsector: 'Siderurgia' },
  GOAU: { companyName: 'Metalúrgica Gerdau', sector: 'Materiais Básicos', subsector: 'Siderurgia' },
  CSNA: { companyName: 'CSN Siderúrgica Nacional', sector: 'Materiais Básicos', subsector: 'Siderurgia' },
  USIM: { companyName: 'Usiminas', sector: 'Materiais Básicos', subsector: 'Siderurgia' },
  FESA: { companyName: 'Ferbasa', sector: 'Materiais Básicos', subsector: 'Siderurgia e Metalurgia' },
  CMIN: { companyName: 'CSN Mineração', sector: 'Mineração', subsector: 'Mineração de Ferro' },
  CBAV: { companyName: 'CBA (Companhia Brasileira de Alumínio)', sector: 'Mineração', subsector: 'Mineração e Alumínio' },
  BRAP: { companyName: 'Bradespar', sector: 'Mineração', subsector: 'Holdings de Mineração' },
  BRKM: { companyName: 'Braskem', sector: 'Materiais Básicos', subsector: 'Petroquímicos' },
  UNIP: { companyName: 'Unipar Carbocloro', sector: 'Materiais Básicos', subsector: 'Químicos' },
  DXCO: { companyName: 'Dexco', sector: 'Materiais Básicos', subsector: 'Madeira e Papel' },
  EUCA: { companyName: 'Eucatex', sector: 'Materiais Básicos', subsector: 'Madeira e Papel' },
  LREN: { companyName: 'Lojas Renner', sector: 'Consumo Cíclico', subsector: 'Comércio de Vestuário' },
  AZZA: { companyName: 'Azzas 2154 (Arezzo & Soma)', sector: 'Consumo Cíclico', subsector: 'Vestuário e Calçados' },
  CEAB: { companyName: 'C&A Modas', sector: 'Consumo Cíclico', subsector: 'Comércio de Vestuário' },
  GUAR: { companyName: 'Guararapes (Riachuelo)', sector: 'Consumo Cíclico', subsector: 'Comércio de Vestuário' },
  GRND: { companyName: 'Grendene', sector: 'Consumo Cíclico', subsector: 'Calçados' },
  VULC: { companyName: 'Vulcabras', sector: 'Consumo Cíclico', subsector: 'Calçados' },
  ALPA: { companyName: 'Alpargatas', sector: 'Consumo Cíclico', subsector: 'Calçados' },
  TFCO: { companyName: 'Track&Field', sector: 'Consumo Cíclico', subsector: 'Vestuário Esportivo' },
  VIVA: { companyName: 'Vivara', sector: 'Consumo Cíclico', subsector: 'Joalheria e Acessórios' },
  MGLU: { companyName: 'Magazine Luiza', sector: 'Consumo Cíclico', subsector: 'Eletrodomésticos e E-commerce' },
  BHIA: { companyName: 'Grupo Casas Bahia', sector: 'Consumo Cíclico', subsector: 'Eletrodomésticos e E-commerce' },
  PETZ: { companyName: 'Petz', sector: 'Consumo Cíclico', subsector: 'Varejo Pet' },
  LJQQ: { companyName: 'Lojas Quero-Quero', sector: 'Consumo Cíclico', subsector: 'Varejo de Construção' },
  RENT: { companyName: 'Localiza&Co', sector: 'Consumo Cíclico', subsector: 'Aluguel de Carros' },
  MOVI: { companyName: 'Movida', sector: 'Consumo Cíclico', subsector: 'Aluguel de Carros' },
  VAMO: { companyName: 'Vamos Locação', sector: 'Consumo Cíclico', subsector: 'Locação de Caminhões e Máquinas' },
  CYRE: { companyName: 'Cyrela Brazil Realty', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  EZTC: { companyName: 'EZTEC', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  MRVE: { companyName: 'MRV Engenharia', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  CURY: { companyName: 'Cury Construtora', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  DIRR: { companyName: 'Direcional Engenharia', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  PLPL: { companyName: 'Plano & Plano', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  EVEN: { companyName: 'Even Construtora', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  LAVV: { companyName: 'Lavvi Empreendimentos', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  TEND: { companyName: 'Construtora Tenda', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  TRIS: { companyName: 'Trisul', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  MDNE: { companyName: 'Moura Dubeux', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil' },
  JHSF: { companyName: 'JHSF Participações', sector: 'Construção Civil', subsector: 'Incorporações e Shopping Centers' },
  SIMH: { companyName: 'Simpar', sector: 'Consumo Cíclico', subsector: 'Holdings de Mobilidade' },
  COGN: { companyName: 'Cogna Educação', sector: 'Consumo Cíclico', subsector: 'Serviços Educacionais' },
  YDUQ: { companyName: 'Yduqs', sector: 'Consumo Cíclico', subsector: 'Serviços Educacionais' },
  ANIM: { companyName: 'Ânima Educação', sector: 'Consumo Cíclico', subsector: 'Serviços Educacionais' },
  SEER: { companyName: 'Ser Educacional', sector: 'Consumo Cíclico', subsector: 'Serviços Educacionais' },
  CSED: { companyName: 'Cruzeiro do Sul Educacional', sector: 'Consumo Cíclico', subsector: 'Serviços Educacionais' },
  SMFT: { companyName: 'Smart Fit', sector: 'Consumo Cíclico', subsector: 'Academias e Bem-Estar' },
  CVCB: { companyName: 'CVC Corp', sector: 'Consumo Cíclico', subsector: 'Viagens e Turismo' },
  RADL: { companyName: 'Raia Drogasil (RD Saúde)', sector: 'Saúde', subsector: 'Comércio de Medicamentos' },
  PNVL: { companyName: 'Grupo Panvel', sector: 'Saúde', subsector: 'Comércio de Medicamentos' },
  PGMN: { companyName: 'Pague Menos', sector: 'Saúde', subsector: 'Comércio de Medicamentos' },
  VVEO: { companyName: 'Viveo', sector: 'Saúde', subsector: 'Distribuição Hospitalar' },
  BLAU: { companyName: 'Blau Farmacêutica', sector: 'Saúde', subsector: 'Medicamentos' },
  HYPE: { companyName: 'Hypera Pharma', sector: 'Saúde', subsector: 'Medicamentos' },
  RDOR: { companyName: 'Rede D’Or São Luiz', sector: 'Saúde', subsector: 'Hospitais e Análises' },
  HAPV: { companyName: 'Hapvida', sector: 'Saúde', subsector: 'Planos de Saúde e Hospitais' },
  FLRY: { companyName: 'Grupo Fleury', sector: 'Saúde', subsector: 'Diagnósticos e Laboratórios' },
  DASA: { companyName: 'Dasa', sector: 'Saúde', subsector: 'Diagnósticos e Laboratórios' },
  MATD: { companyName: 'Hospital Mater Dei', sector: 'Saúde', subsector: 'Hospitais' },
  ONCO: { companyName: 'Oncoclínicas', sector: 'Saúde', subsector: 'Hospitais e Oncologia' },
  ODPV: { companyName: 'OdontoPrev', sector: 'Saúde', subsector: 'Planos Odontológicos' },
  QUAL: { companyName: 'Qualicorp', sector: 'Saúde', subsector: 'Corretagem de Planos de Saúde' },
  TOTS: { companyName: 'TOTVS', sector: 'Tecnologia', subsector: 'Programas e Serviços' },
  LWSA: { companyName: 'LWSA (Locaweb)', sector: 'Tecnologia', subsector: 'Programas e Serviços' },
  CASH: { companyName: 'Méliuz', sector: 'Tecnologia', subsector: 'Programas e Serviços' },
  BMOB: { companyName: 'Bemobi Tech', sector: 'Tecnologia', subsector: 'Programas e Serviços' },
  POSI: { companyName: 'Positivo Tecnologia', sector: 'Tecnologia', subsector: 'Computadores e Equipamentos' },
  INTB: { companyName: 'Intelbras', sector: 'Tecnologia', subsector: 'Equipamentos de Segurança e Redes' },
  MLAS: { companyName: 'Multilaser (Multi)', sector: 'Tecnologia', subsector: 'Computadores e Equipamentos' },
  VIVT: { companyName: 'Telefônica Brasil (Vivo)', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  TIMS: { companyName: 'TIM S.A.', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  FIQE: { companyName: 'Unifique Telecomunicações', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  BRST: { companyName: 'Brisanet', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  DESK: { companyName: 'Desktop Telecom', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  OIBR: { companyName: 'Oi S.A.', sector: 'Telecomunicações', subsector: 'Telecomunicações' },
  NATU: { companyName: 'Natura &Co', sector: 'Consumo Não Cíclico', subsector: 'Produtos de Uso Pessoal e Limpeza' },
  AUAU: { companyName: 'União Pet (Petz & Cobasi)', sector: 'Consumo Cíclico', subsector: 'Varejo Pet' },
  TOKY: { companyName: 'Grupo Toky (Mobly)', sector: 'Consumo Cíclico', subsector: 'Móveis e Decoração' },
  FASA: { companyName: 'Ferbasa', sector: 'Materiais Básicos', subsector: 'Metalurgia e Siderurgia' },
  EQPA: { companyName: 'Equatorial Pará', sector: 'Energia Elétrica', subsector: 'Distribuição de Energia' },
  CEED: { companyName: 'CEEE-D Equatorial', sector: 'Energia Elétrica', subsector: 'Distribuição de Energia' },
  CTKA: { companyName: 'Karsten S.A.', sector: 'Consumo Cíclico', subsector: 'Fios e Tecidos' },
  CEDO: { companyName: 'Cedro Têxtil', sector: 'Consumo Cíclico', subsector: 'Fios e Tecidos' },
  CASN: { companyName: 'Casan Saneamento', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico' },
  MSPA: { companyName: 'Melhoramentos', sector: 'Materiais Básicos', subsector: 'Papel e Celulose' },
};

const TICKER_ICON_ALIAS: Record<string, string> = {
  NATU: 'NTCO3',
  AUAU: 'PETZ3',
  TOKY: 'MBLY3',
  FASA: 'FESA4',
  EQPA: 'EQPA3',
  CEED: 'EQTL3',
  CTKA: 'CTKA4',
  CEDO: 'CEDO4',
  AMBV: 'ABEV3',
  AXIA: 'ELET3',
  ELET: 'ELET3',
  TRPL: 'ISAE4',
  VIIA: 'BHIA3',
  VVAR: 'BHIA3',
  ALSO: 'ALOS3',
  GUAR: 'RIAA3',
  CESP: 'AURE3',
  BRDT: 'VBBR3',
  OMGE: 'SRNA3',
  RRRP: 'BRAV3',
  ENAT: 'BRAV3',
  LCAM: 'RENT3',
  SOMA: 'AZZA3',
  ARZZ: 'AZZA3',
  PRGA: 'BRFS3',
  WIZS: 'WIZC3',
  CARD: 'CSUD3',
  BTOW: 'AMER3',
  LAME: 'AMER3',
  GNDI: 'HAPV3',
  SULA: 'RDOR3',
  VIVT: 'VIVT3',
  VALE: 'VALE3',
  WEGE: 'WEGE3',
  KLBN: 'KLBN11',
  TAEE: 'TAEE11',
  SAPR: 'SAPR11',
  ALUP: 'ALUP11',
  GGBR: 'GGBR4',
  GOAU: 'GOAU4',
  USIM: 'USIM5',
  CMIG: 'CMIG4',
  CPLE: 'CPLE6',
};

const FINTZ_PNG_TICKERS: Record<string, string> = {
  IGBR3: 'IGBR3',
  MWET4: 'MWET4',
  MWET3: 'MWET3',
  BAUH4: 'BAUH4',
  CEGR3: 'CEGR3',
  JOPA3: 'JOPA3',
  JOPA4: 'JOPA4',
  MAPT3: 'MAPT3',
  FIGE3: 'FIGE3',
  CALI3: 'CALI3',
  ADHM3: 'ADHM3',
  MSPA4: 'MSPA4',
  MSPA3: 'MSPA4',
  CASN3: 'CASN3',
  CASN4: 'CASN3',
};

export function resolveCanonicalLogoUrl(ticker: string): string {
  const clean = ticker.toUpperCase().trim();
  if (FINTZ_PNG_TICKERS[clean]) {
    return `https://raw.githubusercontent.com/thefintz/icones-b3/main/icones/${FINTZ_PNG_TICKERS[clean]}.png`;
  }
  const prefix = clean.replace(/[0-9A-Z]*$/, (match) =>
    /^[0-9]/.test(match) ? '' : match,
  ).slice(0, 4);
  if (TICKER_ICON_ALIAS[prefix]) {
    return `https://icons.brapi.dev/icons/${TICKER_ICON_ALIAS[prefix]}.svg`;
  }
  return `https://icons.brapi.dev/icons/${clean}.svg`;
}

export function resolveB3CompanyMeta(ticker: string): B3CompanyMeta {
  const clean = ticker.toUpperCase().trim();
  const prefix = clean.replace(/[0-9]+$/, '');
  const logoUrl = resolveCanonicalLogoUrl(clean);
  const segment = resolveGovernanceSegment(clean);
  if (B3_PREFIX_CATALOG[prefix]) {
    const meta = B3_PREFIX_CATALOG[prefix];
    return {
      companyName: meta.companyName,
      sector: meta.sector,
      subsector: meta.subsector,
      segment,
      logoUrl,
    };
  }
  const fallbackCategory = normalizeToB3Category('', '', clean);
  return {
    companyName: `${prefix} S.A. (${clean})`,
    sector: fallbackCategory,
    subsector: fallbackCategory,
    segment,
    logoUrl,
  };
}

export const FALLBACK_B3_STOCKS: RawMarketStock[] = [
  { ticker: 'BBAS3', companyName: 'Banco do Brasil', logoUrl: 'https://icons.brapi.dev/icons/BBAS3.svg', sector: 'Bancos', subsector: 'Bancos Múltiplos', segment: 'Novo Mercado', price: 27.4, marketCap: 156_500_000_000, equity: 186_300_000_000, revenue: 170_100_000_000, netIncome: 35_160_000_000, pl: 4.45, pvp: 0.84, psr: 0.92, dy: 9.65, dy5y: 8.9, roe: 20.4, roic: 18.2, netMargin: 24.5, ebitMargin: 28.1, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 540_000_000, revenueGrowth5y: 14.5, change24h: 1.25, change30d: 4.1, change12m: 18.4, change5y: 112.5 },
  { ticker: 'PETR4', companyName: 'Petrobras PN', logoUrl: 'https://icons.brapi.dev/icons/PETR4.svg', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração, Refino e Distribuição', segment: 'Nível 2', price: 36.2, marketCap: 472_000_000_000, equity: 410_400_000_000, revenue: 496_800_000_000, netIncome: 98_300_000_000, pl: 4.8, pvp: 1.15, psr: 0.95, dy: 14.2, dy5y: 16.5, roe: 24.1, roic: 19.8, netMargin: 19.6, ebitMargin: 33.4, netDebtToEbitda: 0.95, grossDebtToEquity: 0.78, dailyLiquidity: 1_350_000_000, revenueGrowth5y: 12.8, change24h: 0.85, change30d: 2.9, change12m: 15.2, change5y: 164.0 },
  { ticker: 'PETR3', companyName: 'Petrobras ON', logoUrl: 'https://icons.brapi.dev/icons/PETR3.svg', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração, Refino e Distribuição', segment: 'Nível 2', price: 39.1, marketCap: 485_000_000_000, equity: 410_400_000_000, revenue: 496_800_000_000, netIncome: 98_300_000_000, pl: 5.18, pvp: 1.24, psr: 1.02, dy: 13.15, dy5y: 15.2, roe: 24.1, roic: 19.8, netMargin: 19.6, ebitMargin: 33.4, netDebtToEbitda: 0.95, grossDebtToEquity: 0.78, dailyLiquidity: 380_000_000, revenueGrowth5y: 12.8, change24h: 0.72, change30d: 2.4, change12m: 14.1, change5y: 158.0 },
  { ticker: 'VALE3', companyName: 'Vale S.A.', logoUrl: 'https://icons.brapi.dev/icons/VALE3.svg', sector: 'Mineração', subsector: 'Mineração de Ferro e Metais', segment: 'Novo Mercado', price: 58.9, marketCap: 267_000_000_000, equity: 202_200_000_000, revenue: 208_500_000_000, netIncome: 43_700_000_000, pl: 6.1, pvp: 1.32, psr: 1.28, dy: 8.9, dy5y: 9.8, roe: 21.6, roic: 18.9, netMargin: 20.8, ebitMargin: 31.2, netDebtToEbitda: 0.65, grossDebtToEquity: 0.42, dailyLiquidity: 1_450_000_000, revenueGrowth5y: 6.4, change24h: -0.45, change30d: -1.8, change12m: -4.2, change5y: 48.5 },
  { ticker: 'ITUB4', companyName: 'Itaú Unibanco PN', logoUrl: 'https://icons.brapi.dev/icons/ITUB4.svg', sector: 'Bancos', subsector: 'Bancos Múltiplos', segment: 'Nível 1', price: 34.5, marketCap: 332_000_000_000, equity: 197_600_000_000, revenue: 228_900_000_000, netIncome: 40_480_000_000, pl: 8.2, pvp: 1.68, psr: 1.45, dy: 6.8, dy5y: 6.2, roe: 21.2, roic: 19.1, netMargin: 22.4, ebitMargin: 26.8, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 920_000_000, revenueGrowth5y: 11.9, change24h: 1.12, change30d: 3.6, change12m: 21.4, change5y: 68.2 },
  { ticker: 'ITSA4', companyName: 'Itaúsa PN', logoUrl: 'https://icons.brapi.dev/icons/ITSA4.svg', sector: 'Financeiro', subsector: 'Holdings Financeiras', segment: 'Nível 1', price: 10.4, marketCap: 107_000_000_000, equity: 85_600_000_000, revenue: 8_620_000_000, netIncome: 15_070_000_000, pl: 7.1, pvp: 1.25, psr: 12.4, dy: 7.9, dy5y: 7.1, roe: 17.6, roic: 15.8, netMargin: 165.0, ebitMargin: 140.0, netDebtToEbitda: 0.35, grossDebtToEquity: 0.14, dailyLiquidity: 240_000_000, revenueGrowth5y: 10.2, change24h: 0.95, change30d: 3.1, change12m: 19.5, change5y: 54.0 },
  { ticker: 'WEGE3', companyName: 'WEG S.A.', logoUrl: 'https://icons.brapi.dev/icons/WEGE3.svg', sector: 'Bens Industriais', subsector: 'Motores, Compressores e Outros', segment: 'Novo Mercado', price: 52.8, marketCap: 221_500_000_000, equity: 19_770_000_000, revenue: 35_150_000_000, netIncome: 6_420_000_000, pl: 34.5, pvp: 11.2, psr: 6.3, dy: 1.45, dy5y: 1.35, roe: 32.4, roic: 29.8, netMargin: 18.2, ebitMargin: 22.6, netDebtToEbitda: -0.45, grossDebtToEquity: 0.18, dailyLiquidity: 390_000_000, revenueGrowth5y: 21.4, change24h: 1.65, change30d: 6.4, change12m: 42.1, change5y: 185.0 },
  { ticker: 'TAEE11', companyName: 'Taesa UNT', logoUrl: 'https://icons.brapi.dev/icons/TAEE11.svg', sector: 'Energia Elétrica', subsector: 'Transmissão de Energia', segment: 'Nível 2', price: 34.8, marketCap: 11_980_000_000, equity: 6_960_000_000, revenue: 2_495_000_000, netIncome: 1_390_000_000, pl: 8.6, pvp: 1.72, psr: 4.8, dy: 9.4, dy5y: 10.2, roe: 20.1, roic: 14.2, netMargin: 55.4, ebitMargin: 68.2, netDebtToEbitda: 2.65, grossDebtToEquity: 1.38, dailyLiquidity: 85_000_000, revenueGrowth5y: 8.5, change24h: 0.35, change30d: 1.2, change12m: 6.8, change5y: 42.0 },
  { ticker: 'EGIE3', companyName: 'Engie Brasil Energia', logoUrl: 'https://icons.brapi.dev/icons/EGIE3.svg', sector: 'Energia Elétrica', subsector: 'Geração e Transmissão', segment: 'Novo Mercado', price: 41.2, marketCap: 33_600_000_000, equity: 10_830_000_000, revenue: 10_830_000_000, netIncome: 3_775_000_000, pl: 8.9, pvp: 3.1, psr: 3.1, dy: 7.2, dy5y: 7.8, roe: 34.8, roic: 17.5, netMargin: 34.2, ebitMargin: 48.9, netDebtToEbitda: 2.15, grossDebtToEquity: 1.95, dailyLiquidity: 78_000_000, revenueGrowth5y: 5.2, change24h: 0.48, change30d: 1.9, change12m: 9.4, change5y: 38.5 },
  { ticker: 'CMIG4', companyName: 'Cemig PN', logoUrl: 'https://icons.brapi.dev/icons/CMIG4.svg', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição', segment: 'Nível 1', price: 11.2, marketCap: 32_000_000_000, equity: 27_110_000_000, revenue: 39_020_000_000, netIncome: 5_925_000_000, pl: 5.4, pvp: 1.18, psr: 0.82, dy: 10.8, dy5y: 9.5, roe: 21.8, roic: 16.4, netMargin: 15.2, ebitMargin: 21.4, netDebtToEbitda: 1.12, grossDebtToEquity: 0.48, dailyLiquidity: 145_000_000, revenueGrowth5y: 9.8, change24h: 1.05, change30d: 3.8, change12m: 24.5, change5y: 96.0 },
  { ticker: 'CPLE6', companyName: 'Copel PNB', logoUrl: 'https://icons.brapi.dev/icons/CPLE6.svg', sector: 'Energia Elétrica', subsector: 'Geração e Distribuição', segment: 'Nível 2', price: 10.1, marketCap: 30_100_000_000, equity: 25_940_000_000, revenue: 22_800_000_000, netIncome: 3_070_000_000, pl: 9.8, pvp: 1.16, psr: 1.32, dy: 6.4, dy5y: 7.2, roe: 11.8, roic: 10.9, netMargin: 13.5, ebitMargin: 19.8, netDebtToEbitda: 1.85, grossDebtToEquity: 0.62, dailyLiquidity: 132_000_000, revenueGrowth5y: 7.6, change24h: 0.62, change30d: 2.1, change12m: 16.8, change5y: 78.4 },
  { ticker: 'CLSC4', companyName: 'Celesc PN', logoUrl: 'https://icons.brapi.dev/icons/CLSC4.svg', sector: 'Utilidade Pública', subsector: 'Concessões de Serviços Públicos', segment: 'Nível 2', price: 74.5, marketCap: 2_880_000_000, equity: 3_120_000_000, revenue: 10_450_000_000, netIncome: 620_000_000, pl: 4.65, pvp: 0.92, psr: 0.28, dy: 7.8, dy5y: 7.4, roe: 19.8, roic: 14.5, netMargin: 5.9, ebitMargin: 9.2, netDebtToEbitda: 1.15, grossDebtToEquity: 0.45, dailyLiquidity: 4_500_000, revenueGrowth5y: 8.4, change24h: 0.4, change30d: 1.5, change12m: 12.1, change5y: 52.0 },
  { ticker: 'SBSP3', companyName: 'Sabesp', logoUrl: 'https://icons.brapi.dev/icons/SBSP3.svg', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico', segment: 'Novo Mercado', price: 92.5, marketCap: 63_200_000_000, equity: 32_410_000_000, revenue: 25_790_000_000, netIncome: 5_096_000_000, pl: 12.4, pvp: 1.95, psr: 2.45, dy: 2.8, dy5y: 3.1, roe: 15.7, roic: 12.8, netMargin: 19.8, ebitMargin: 29.4, netDebtToEbitda: 1.62, grossDebtToEquity: 0.65, dailyLiquidity: 320_000_000, revenueGrowth5y: 11.4, change24h: 1.4, change30d: 5.2, change12m: 34.8, change5y: 110.2 },
  { ticker: 'SAPR11', companyName: 'Sanepar UNT', logoUrl: 'https://icons.brapi.dev/icons/SAPR11.svg', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico', segment: 'Nível 2', price: 28.4, marketCap: 8_580_000_000, equity: 9_970_000_000, revenue: 6_350_000_000, netIncome: 1_530_000_000, pl: 5.6, pvp: 0.86, psr: 1.35, dy: 6.2, dy5y: 6.5, roe: 15.4, roic: 13.1, netMargin: 24.1, ebitMargin: 35.8, netDebtToEbitda: 1.48, grossDebtToEquity: 0.54, dailyLiquidity: 42_000_000, revenueGrowth5y: 10.1, change24h: 0.55, change30d: 2.3, change12m: 14.9, change5y: 44.0 },
  { ticker: 'CSMG3', companyName: 'Copasa', logoUrl: 'https://icons.brapi.dev/icons/CSMG3.svg', sector: 'Água e Saneamento', subsector: 'Água e Saneamento Básico', segment: 'Novo Mercado', price: 21.8, marketCap: 8_290_000_000, equity: 7_970_000_000, revenue: 7_025_000_000, netIncome: 1_405_000_000, pl: 5.9, pvp: 1.04, psr: 1.18, dy: 8.7, dy5y: 8.1, roe: 17.6, roic: 14.2, netMargin: 20.1, ebitMargin: 28.4, netDebtToEbitda: 1.32, grossDebtToEquity: 0.51, dailyLiquidity: 38_000_000, revenueGrowth5y: 8.9, change24h: 0.78, change30d: 2.8, change12m: 17.2, change5y: 56.4 },
  { ticker: 'BBSE3', companyName: 'BB Seguridade', logoUrl: 'https://icons.brapi.dev/icons/BBSE3.svg', sector: 'Previdência e Seguros', subsector: 'Holdings de Seguros e Previdência', segment: 'Novo Mercado', price: 35.4, marketCap: 68_800_000_000, equity: 10_750_000_000, revenue: 9_550_000_000, netIncome: 8_090_000_000, pl: 8.5, pvp: 6.4, psr: 7.2, dy: 8.9, dy5y: 8.4, roe: 75.2, roic: 68.0, netMargin: 84.5, ebitMargin: 88.0, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 175_000_000, revenueGrowth5y: 13.2, change24h: 0.9, change30d: 3.4, change12m: 16.5, change5y: 62.0 },
  { ticker: 'CXSE3', companyName: 'Caixa Seguridade', logoUrl: 'https://icons.brapi.dev/icons/CXSE3.svg', sector: 'Seguradoras', subsector: 'Seguradoras', segment: 'Novo Mercado', price: 14.8, marketCap: 44_400_000_000, equity: 12_860_000_000, revenue: 4_980_000_000, netIncome: 3_760_000_000, pl: 11.8, pvp: 3.45, psr: 8.9, dy: 7.4, dy5y: 6.9, roe: 29.2, roic: 27.5, netMargin: 75.4, ebitMargin: 80.2, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 68_000_000, revenueGrowth5y: 16.4, change24h: 0.65, change30d: 2.7, change12m: 22.8, change5y: 74.5 },
  { ticker: 'PSSA3', companyName: 'Porto Seguro', logoUrl: 'https://icons.brapi.dev/icons/PSSA3.svg', sector: 'Seguradoras', subsector: 'Seguradoras', segment: 'Novo Mercado', price: 36.8, marketCap: 23_800_000_000, equity: 12_930_000_000, revenue: 33_050_000_000, netIncome: 2_479_000_000, pl: 9.6, pvp: 1.84, psr: 0.72, dy: 5.4, dy5y: 5.1, roe: 19.2, roic: 17.8, netMargin: 7.5, ebitMargin: 11.2, netDebtToEbitda: 0, grossDebtToEquity: 0, dailyLiquidity: 64_000_000, revenueGrowth5y: 14.8, change24h: 0.82, change30d: 3.9, change12m: 26.4, change5y: 69.0 },
  { ticker: 'PRIO3', companyName: 'PRIO (PetroRio)', logoUrl: 'https://icons.brapi.dev/icons/PRIO3.svg', sector: 'Petróleo, Gás e Biocombustíveis', subsector: 'Exploração e Produção', segment: 'Novo Mercado', price: 42.6, marketCap: 37_900_000_000, equity: 17_620_000_000, revenue: 13_290_000_000, netIncome: 4_858_000_000, pl: 7.8, pvp: 2.15, psr: 2.85, dy: 0.4, dy5y: 0.3, roe: 27.5, roic: 21.4, netMargin: 36.5, ebitMargin: 51.2, netDebtToEbitda: 0.85, grossDebtToEquity: 0.68, dailyLiquidity: 420_000_000, revenueGrowth5y: 42.5, change24h: 1.5, change30d: 4.5, change12m: 11.2, change5y: 320.0 },
  { ticker: 'GGBR4', companyName: 'Gerdau PN', logoUrl: 'https://icons.brapi.dev/icons/GGBR4.svg', sector: 'Materiais Básicos', subsector: 'Siderurgia', segment: 'Nível 1', price: 18.9, marketCap: 39_800_000_000, equity: 53_780_000_000, revenue: 68_620_000_000, netIncome: 5_378_000_000, pl: 7.4, pvp: 0.74, psr: 0.58, dy: 5.8, dy5y: 7.9, roe: 10.1, roic: 11.4, netMargin: 7.8, ebitMargin: 11.9, netDebtToEbitda: 0.52, grossDebtToEquity: 0.22, dailyLiquidity: 195_000_000, revenueGrowth5y: 9.2, change24h: -0.3, change30d: 1.1, change12m: 5.4, change5y: 64.0 },
  { ticker: 'KLBN11', companyName: 'Klabin UNT', logoUrl: 'https://icons.brapi.dev/icons/KLBN11.svg', sector: 'Materiais Básicos', subsector: 'Papel e Celulose', segment: 'Nível 2', price: 21.4, marketCap: 24_100_000_000, equity: 10_250_000_000, revenue: 18_250_000_000, netIncome: 1_882_000_000, pl: 12.8, pvp: 2.35, psr: 1.32, dy: 6.1, dy5y: 5.8, roe: 18.4, roic: 11.8, netMargin: 10.3, ebitMargin: 21.5, netDebtToEbitda: 2.85, grossDebtToEquity: 2.45, dailyLiquidity: 115_000_000, revenueGrowth5y: 11.6, change24h: 0.42, change30d: 1.8, change12m: 8.9, change5y: 41.2 },
  { ticker: 'SUZB3', companyName: 'Suzano', logoUrl: 'https://icons.brapi.dev/icons/SUZB3.svg', sector: 'Materiais Básicos', subsector: 'Papel e Celulose', segment: 'Novo Mercado', price: 58.2, marketCap: 73_500_000_000, equity: 39_720_000_000, revenue: 40_380_000_000, netIncome: 5_176_000_000, pl: 14.2, pvp: 1.85, psr: 1.82, dy: 2.6, dy5y: 3.0, roe: 13.0, roic: 10.4, netMargin: 12.8, ebitMargin: 28.4, netDebtToEbitda: 2.92, grossDebtToEquity: 2.12, dailyLiquidity: 280_000_000, revenueGrowth5y: 10.8, change24h: 0.74, change30d: 2.6, change12m: 10.4, change5y: 58.0 },
  { ticker: 'VIVT3', companyName: 'Telefônica Brasil (Vivo)', logoUrl: 'https://icons.brapi.dev/icons/VIVT3.svg', sector: 'Telecomunicações', subsector: 'Telecomunicações', segment: 'Novo Mercado', price: 51.4, marketCap: 84_800_000_000, equity: 69_500_000_000, revenue: 55_060_000_000, netIncome: 5_435_000_000, pl: 15.6, pvp: 1.22, psr: 1.54, dy: 6.3, dy5y: 6.8, roe: 7.8, roic: 8.4, netMargin: 9.9, ebitMargin: 16.8, netDebtToEbitda: 0.62, grossDebtToEquity: 0.28, dailyLiquidity: 125_000_000, revenueGrowth5y: 5.4, change24h: 0.38, change30d: 1.4, change12m: 9.2, change5y: 32.5 },
  { ticker: 'TIMS3', companyName: 'TIM S.A.', logoUrl: 'https://icons.brapi.dev/icons/TIMS3.svg', sector: 'Telecomunicações', subsector: 'Telecomunicações', segment: 'Novo Mercado', price: 17.6, marketCap: 42_600_000_000, equity: 25_810_000_000, revenue: 24_760_000_000, netIncome: 3_086_000_000, pl: 13.8, pvp: 1.65, psr: 1.72, dy: 7.1, dy5y: 5.9, roe: 11.9, roic: 11.2, netMargin: 12.5, ebitMargin: 21.4, netDebtToEbitda: 0.42, grossDebtToEquity: 0.19, dailyLiquidity: 98_000_000, revenueGrowth5y: 8.2, change24h: 0.56, change30d: 2.2, change12m: 14.6, change5y: 45.8 },
  { ticker: 'ABEV3', companyName: 'Ambev', logoUrl: 'https://icons.brapi.dev/icons/ABEV3.svg', sector: 'Consumo Não Cíclico', subsector: 'Cervejas e Refrigerantes', segment: 'Tradicional B3', price: 12.8, marketCap: 201_600_000_000, equity: 92_470_000_000, revenue: 81_290_000_000, netIncome: 15_040_000_000, pl: 13.4, pvp: 2.18, psr: 2.48, dy: 5.9, dy5y: 5.5, roe: 16.2, roic: 18.4, netMargin: 18.5, ebitMargin: 23.1, netDebtToEbitda: -0.58, grossDebtToEquity: 0.04, dailyLiquidity: 340_000_000, revenueGrowth5y: 8.9, change24h: -0.25, change30d: -0.8, change12m: -3.5, change5y: -12.0 },
  { ticker: 'RADL3', companyName: 'Raia Drogasil', logoUrl: 'https://icons.brapi.dev/icons/RADL3.svg', sector: 'Saúde', subsector: 'Comércio de Medicamentos', segment: 'Novo Mercado', price: 25.4, marketCap: 43_600_000_000, equity: 6_410_000_000, revenue: 37_910_000_000, netIncome: 1_204_000_000, pl: 36.2, pvp: 6.8, psr: 1.15, dy: 1.2, dy5y: 1.1, roe: 18.8, roic: 15.4, netMargin: 3.2, ebitMargin: 5.8, netDebtToEbitda: 1.15, grossDebtToEquity: 0.52, dailyLiquidity: 165_000_000, revenueGrowth5y: 17.5, change24h: 0.68, change30d: 2.4, change12m: 8.1, change5y: 36.4 },
  { ticker: 'TOTS3', companyName: 'TOTVS', logoUrl: 'https://icons.brapi.dev/icons/TOTS3.svg', sector: 'Tecnologia', subsector: 'Programas e Serviços', segment: 'Novo Mercado', price: 30.2, marketCap: 18_600_000_000, equity: 4_830_000_000, revenue: 4_960_000_000, netIncome: 759_000_000, pl: 24.5, pvp: 3.85, psr: 3.75, dy: 1.8, dy5y: 1.6, roe: 15.7, roic: 14.9, netMargin: 15.3, ebitMargin: 19.2, netDebtToEbitda: -0.25, grossDebtToEquity: 0.31, dailyLiquidity: 112_000_000, revenueGrowth5y: 18.4, change24h: 1.15, change30d: 3.9, change12m: 12.8, change5y: 68.5 },
  { ticker: 'CURY3', companyName: 'Cury Construtora', logoUrl: 'https://icons.brapi.dev/icons/CURY3.svg', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil', segment: 'Novo Mercado', price: 22.8, marketCap: 6_650_000_000, equity: 1_278_000_000, revenue: 3_590_000_000, netIncome: 639_000_000, pl: 10.4, pvp: 5.2, psr: 1.85, dy: 6.8, dy5y: 6.2, roe: 50.0, roic: 42.1, netMargin: 17.8, ebitMargin: 22.4, netDebtToEbitda: -0.35, grossDebtToEquity: 0.42, dailyLiquidity: 54_000_000, revenueGrowth5y: 28.6, change24h: 1.85, change30d: 6.2, change12m: 38.4, change5y: 195.0 },
  { ticker: 'DIRR3', companyName: 'Direcional Engenharia', logoUrl: 'https://icons.brapi.dev/icons/DIRR3.svg', sector: 'Construção Civil', subsector: 'Incorporações e Construção Civil', segment: 'Novo Mercado', price: 29.4, marketCap: 5_100_000_000, equity: 2_000_000_000, revenue: 2_865_000_000, netIncome: 520_000_000, pl: 9.8, pvp: 2.55, psr: 1.78, dy: 7.1, dy5y: 6.4, roe: 26.0, roic: 21.8, netMargin: 18.2, ebitMargin: 22.9, netDebtToEbitda: 0.18, grossDebtToEquity: 0.56, dailyLiquidity: 48_000_000, revenueGrowth5y: 16.4, change24h: 1.45, change30d: 5.1, change12m: 32.0, change5y: 142.0 },
  { ticker: 'LREN3', companyName: 'Lojas Renner', logoUrl: 'https://icons.brapi.dev/icons/LREN3.svg', sector: 'Consumo Cíclico', subsector: 'Comércio de Vestuário', segment: 'Novo Mercado', price: 17.5, marketCap: 16_800_000_000, equity: 11_580_000_000, revenue: 14_600_000_000, netIncome: 1_312_000_000, pl: 12.8, pvp: 1.45, psr: 1.15, dy: 4.8, dy5y: 4.1, roe: 11.2, roic: 9.8, netMargin: 7.4, ebitMargin: 12.5, netDebtToEbitda: 0.85, grossDebtToEquity: 0.42, dailyLiquidity: 260_000_000, revenueGrowth5y: 8.5, change24h: -0.65, change30d: -1.4, change12m: 4.2, change5y: -38.0 },
  { ticker: 'RENT3', companyName: 'Localiza&Co', logoUrl: 'https://icons.brapi.dev/icons/RENT3.svg', sector: 'Consumo Cíclico', subsector: 'Aluguel de Carros', segment: 'Novo Mercado', price: 42.1, marketCap: 44_800_000_000, equity: 24_210_000_000, revenue: 35_840_000_000, netIncome: 2_731_000_000, pl: 16.4, pvp: 1.85, psr: 1.25, dy: 3.2, dy5y: 2.8, roe: 12.5, roic: 8.9, netMargin: 6.8, ebitMargin: 19.5, netDebtToEbitda: 2.85, grossDebtToEquity: 1.95, dailyLiquidity: 310_000_000, revenueGrowth5y: 22.4, change24h: -0.9, change30d: -2.5, change12m: -14.2, change5y: 12.4 },
  { ticker: 'MGLU3', companyName: 'Magazine Luiza', logoUrl: 'https://icons.brapi.dev/icons/MGLU3.svg', sector: 'Consumo Cíclico', subsector: 'Eletrodomésticos e E-commerce', segment: 'Novo Mercado', price: 9.8, marketCap: 7_250_000_000, equity: 10_060_000_000, revenue: 34_520_000_000, netIncome: -584_000_000, pl: -12.4, pvp: 0.72, psr: 0.21, dy: 0, dy5y: 0.4, roe: -5.8, roic: 4.2, netMargin: -1.7, ebitMargin: 3.8, netDebtToEbitda: 3.85, grossDebtToEquity: 0.92, dailyLiquidity: 185_000_000, revenueGrowth5y: 7.4, change24h: -2.4, change30d: -8.5, change12m: -34.0, change5y: -88.5 },
  { ticker: 'BHIA3', companyName: 'Grupo Casas Bahia', logoUrl: 'https://icons.brapi.dev/icons/BHIA3.svg', sector: 'Consumo Cíclico', subsector: 'Eletrodomésticos e E-commerce', segment: 'Novo Mercado', price: 4.5, marketCap: 428_000_000, equity: 1_528_000_000, revenue: 10_700_000_000, netIncome: -203_000_000, pl: -2.1, pvp: 0.28, psr: 0.04, dy: 0, dy5y: 0, roe: -35.0, roic: -2.4, netMargin: -6.5, ebitMargin: -1.2, netDebtToEbitda: 5.4, grossDebtToEquity: 1.85, dailyLiquidity: 32_000_000, revenueGrowth5y: -3.2, change24h: -3.1, change30d: -12.4, change12m: -56.0, change5y: -95.0 },
];
