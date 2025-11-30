// APIs públicas oficiales de organizaciones comerciales internacionales
// Integración con datos oficiales de tratados comerciales y organizaciones regionales

export interface TradeOrganizationAPIConfig {
  id: string;
  organization: string;
  organizationEn: string;
  officialWebsite: string;
  publicAPIEndpoint?: string;
  dataPortal?: string;
  tariffDatabase?: string;
  rooDatabase?: string; // Rules of Origin
  customsUnion: boolean;
  commonExternalTariff: boolean;
  isActive: boolean;
  dataAvailability: {
    tariffRates: boolean;
    tradeStatistics: boolean;
    rulesOfOrigin: boolean;
    preferentialTreatment: boolean;
    sanitaryMeasures: boolean;
    technicalBarriers: boolean;
  };
  memberCountries: string[];
  lastUpdate: string;
}

export interface TariffPreference {
  hsCode: string;
  productDescription: string;
  productDescriptionEn: string;
  originCountry: string;
  destinationCountry: string;
  mostFavoredNationRate: number; // Arancel MFN normal
  preferentialRate: number; // Arancel preferencial
  savingsPercentage: number; // Ahorro porcentual
  treatySource: string;
  rulesOfOrigin?: string;
  minimumLocalContent?: number;
  restrictions?: string[];
  effectiveDate: string;
  expirationDate?: string;
}

export interface SanitaryPhytosanitaryMeasure {
  id: string;
  hsCode: string;
  countryCode: string;
  measureType: 'sps' | 'tbt' | 'import_license' | 'quota';
  description: string;
  descriptionEn: string;
  requirements: string[];
  certificationNeeded: boolean;
  inspectionRequired: boolean;
  estimatedDelay: number; // días
  estimatedCost: number; // USD
  lastUpdate: string;
}

// Configuraciones de APIs oficiales por organización
export const TRADE_ORGANIZATION_APIS: Record<string, TradeOrganizationAPIConfig> = {
  // Unión Europea - Sistema TARIC oficial
  'eu': {
    id: 'eu',
    organization: 'Unión Europea',
    organizationEn: 'European Union',
    officialWebsite: 'https://europa.eu',
    publicAPIEndpoint: 'https://ec.europa.eu/taxation_customs/dds2/taric/api',
    dataPortal: 'https://ec.europa.eu/eurostat/data/database',
    tariffDatabase: 'https://ec.europa.eu/taxation_customs/dds2/taric/',
    rooDatabase: 'https://ec.europa.eu/taxation_customs/business/calculation-customs-duties/rules-origin_en',
    customsUnion: true,
    commonExternalTariff: true,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: true,
      technicalBarriers: true
    },
    memberCountries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'],
    lastUpdate: '2025-01-08'
  },

  // ASEAN - Portal oficial de comercio
  'asean': {
    id: 'asean',
    organization: 'ASEAN',
    organizationEn: 'Association of Southeast Asian Nations',
    officialWebsite: 'https://asean.org',
    publicAPIEndpoint: 'https://data.asean.org/api/trade',
    dataPortal: 'https://data.asean.org',
    tariffDatabase: 'https://tariff.asean.org',
    rooDatabase: 'https://rules-of-origin.asean.org',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: true,
      technicalBarriers: false
    },
    memberCountries: ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'],
    lastUpdate: '2025-01-08'
  },

  // MERCOSUR - Sistema oficial SINTIA
  'mercosur': {
    id: 'mercosur',
    organization: 'MERCOSUR',
    organizationEn: 'Southern Common Market',
    officialWebsite: 'https://mercosur.int',
    publicAPIEndpoint: 'https://sintia.mercosur.int/api',
    dataPortal: 'https://estadisticas.mercosur.int',
    tariffDatabase: 'https://sintia.mercosur.int/arancel',
    rooDatabase: 'https://normas.mercosur.int/origen',
    customsUnion: true,
    commonExternalTariff: true,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: true,
      technicalBarriers: true
    },
    memberCountries: ['AR', 'BR', 'PY', 'UY', 'BO'],
    lastUpdate: '2025-01-08'
  },

  // Alianza del Pacífico - Portal oficial
  'pacific_alliance': {
    id: 'pacific_alliance',
    organization: 'Alianza del Pacífico',
    organizationEn: 'Pacific Alliance',
    officialWebsite: 'https://alianzapacifico.net',
    dataPortal: 'https://observatorio.alianzapacifico.net',
    tariffDatabase: 'https://alianzapacifico.net/aranceles',
    rooDatabase: 'https://alianzapacifico.net/reglas-origen',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: false,
      technicalBarriers: false
    },
    memberCountries: ['CL', 'CO', 'MX', 'PE'],
    lastUpdate: '2025-01-08'
  },

  // USMCA - Portal oficial
  'usmca': {
    id: 'usmca',
    organization: 'T-MEC',
    organizationEn: 'USMCA',
    officialWebsite: 'https://usmca.com',
    publicAPIEndpoint: 'https://data.trade.gov/api/usmca',
    dataPortal: 'https://dataweb.usitc.gov',
    tariffDatabase: 'https://hts.usitc.gov',
    rooDatabase: 'https://usmca.com/rules-of-origin',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: true,
      technicalBarriers: true
    },
    memberCountries: ['US', 'CA', 'MX'],
    lastUpdate: '2025-01-08'
  },

  // CPTPP - Portal del acuerdo
  'cptpp': {
    id: 'cptpp',
    organization: 'CPTPP',
    organizationEn: 'Comprehensive and Progressive Trans-Pacific Partnership',
    officialWebsite: 'https://www.international.gc.ca/trade-commerce/trade-agreements-accords-commerciaux/agr-acc/cptpp-ptpgp/index.aspx',
    dataPortal: 'https://www.dfat.gov.au/trade/agreements/in-force/cptpp',
    tariffDatabase: 'https://cptpp-tariff.canada.ca',
    rooDatabase: 'https://cptpp-rules.canada.ca',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: false,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: false,
      technicalBarriers: false
    },
    memberCountries: ['AU', 'BN', 'CA', 'CL', 'JP', 'MY', 'MX', 'NZ', 'PE', 'SG', 'VN', 'UK'],
    lastUpdate: '2025-01-08'
  },

  // AfCFTA - Portal oficial africano
  'afcfta': {
    id: 'afcfta',
    organization: 'AfCFTA',
    organizationEn: 'African Continental Free Trade Area',
    officialWebsite: 'https://au.int/en/ti/afcfta',
    dataPortal: 'https://tradedata.afcfta.au.int',
    tariffDatabase: 'https://tariffs.afcfta.au.int',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: false,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: false,
      technicalBarriers: false
    },
    memberCountries: ['DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ', 'ER', 'SZ', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW', 'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN', 'UG', 'ZM', 'ZW'],
    lastUpdate: '2025-01-08'
  },

  // RCEP - Portal oficial
  'rcep': {
    id: 'rcep',
    organization: 'RCEP',
    organizationEn: 'Regional Comprehensive Economic Partnership',
    officialWebsite: 'https://rcepsec.org',
    dataPortal: 'https://data.rcepsec.org',
    tariffDatabase: 'https://tariff.rcepsec.org',
    rooDatabase: 'https://roo.rcepsec.org',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: false,
      technicalBarriers: false
    },
    memberCountries: ['AU', 'BN', 'KH', 'CN', 'ID', 'JP', 'KR', 'LA', 'MY', 'MM', 'NZ', 'PH', 'SG', 'TH', 'VN'],
    lastUpdate: '2025-01-08'
  },

  // EFTA - Portal oficial
  'efta': {
    id: 'efta',
    organization: 'EFTA',
    organizationEn: 'European Free Trade Association',
    officialWebsite: 'https://efta.int',
    dataPortal: 'https://trade.efta.int',
    tariffDatabase: 'https://tariff.efta.int',
    rooDatabase: 'https://rules.efta.int',
    customsUnion: false,
    commonExternalTariff: false,
    isActive: true,
    dataAvailability: {
      tariffRates: true,
      tradeStatistics: true,
      rulesOfOrigin: true,
      preferentialTreatment: true,
      sanitaryMeasures: false,
      technicalBarriers: false
    },
    memberCountries: ['IS', 'LI', 'NO', 'CH'],
    lastUpdate: '2025-01-08'
  }
};

// Funciones para consultar información oficial de tratados
export interface TradeQueryParams {
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  treatyId?: string;
}

export interface TariffQueryResult {
  success: boolean;
  data?: {
    tariffPreferences: TariffPreference[];
    sanitaryMeasures: SanitaryPhytosanitaryMeasure[];
    estimatedSavings: number;
    estimatedTimeDelay: number;
    additionalCosts: number;
  };
  error?: {
    code: string;
    message: string;
  };
  source: string;
  timestamp: Date;
}

// Mapeo de productos HS a aranceles preferenciales conocidos (datos públicos)
export const KNOWN_PREFERENTIAL_RATES: Record<string, TariffPreference[]> = {
  // MERCOSUR - Automóviles
  '8703': [
    {
      hsCode: '8703',
      productDescription: 'Automóviles de turismo',
      productDescriptionEn: 'Motor cars for transport of persons',
      originCountry: 'BR',
      destinationCountry: 'AR',
      mostFavoredNationRate: 35.0,
      preferentialRate: 0.0,
      savingsPercentage: 100.0,
      treatySource: 'MERCOSUR',
      rulesOfOrigin: 'Mínimo 60% contenido regional',
      minimumLocalContent: 60,
      effectiveDate: '1995-01-01'
    }
  ],
  
  // ASEAN - Productos electrónicos
  '8517': [
    {
      hsCode: '8517',
      productDescription: 'Teléfonos y equipos de telecomunicaciones',
      productDescriptionEn: 'Telephone sets and telecommunications equipment',
      originCountry: 'SG',
      destinationCountry: 'MY',
      mostFavoredNationRate: 10.0,
      preferentialRate: 0.0,
      savingsPercentage: 100.0,
      treatySource: 'ASEAN',
      rulesOfOrigin: 'Mínimo 40% contenido ASEAN',
      minimumLocalContent: 40,
      effectiveDate: '2010-01-01'
    }
  ],

  // Alianza del Pacífico - Productos agrícolas
  '0806': [
    {
      hsCode: '0806',
      productDescription: 'Uvas frescas o secas',
      productDescriptionEn: 'Grapes, fresh or dried',
      originCountry: 'CL',
      destinationCountry: 'PE',
      mostFavoredNationRate: 17.0,
      preferentialRate: 0.0,
      savingsPercentage: 100.0,
      treatySource: 'Pacific Alliance',
      rulesOfOrigin: 'Totalmente producido',
      effectiveDate: '2016-05-01'
    }
  ],

  // USMCA - Maquinaria
  '8483': [
    {
      hsCode: '8483',
      productDescription: 'Árboles de transmisión y manivelas',
      productDescriptionEn: 'Transmission shafts and cranks',
      originCountry: 'MX',
      destinationCountry: 'US',
      mostFavoredNationRate: 2.5,
      preferentialRate: 0.0,
      savingsPercentage: 100.0,
      treatySource: 'USMCA',
      rulesOfOrigin: 'Cambio de clasificación arancelaria',
      effectiveDate: '2020-07-01'
    }
  ]
};

// Función para buscar tratamiento arancelario preferencial
export function findPreferentialTreatment(
  hsCode: string, 
  originCountry: string, 
  destinationCountry: string
): TariffPreference[] {
  const codePreferences = KNOWN_PREFERENTIAL_RATES[hsCode] || [];
  
  return codePreferences.filter(pref => 
    pref.originCountry === originCountry && 
    pref.destinationCountry === destinationCountry
  );
}

// Función para obtener configuración de API por tratado
export function getAPIConfigByTreaty(treatyId: string): TradeOrganizationAPIConfig | null {
  return TRADE_ORGANIZATION_APIS[treatyId] || null;
}

// Función para validar si dos países comparten un tratado con datos disponibles
export function hasDataAvailableForTreaty(
  originCountry: string, 
  destinationCountry: string, 
  treatyId: string
): boolean {
  const config = TRADE_ORGANIZATION_APIS[treatyId];
  if (!config || !config.isActive) return false;
  
  return config.memberCountries.includes(originCountry) && 
         config.memberCountries.includes(destinationCountry) &&
         config.dataAvailability.tariffRates;
}

// URLs oficiales para consulta manual de usuarios
export const OFFICIAL_TRADE_PORTALS = {
  tariffSearch: {
    'EU': 'https://ec.europa.eu/taxation_customs/dds2/taric/taric_consultation.jsp',
    'ASEAN': 'https://tariff.asean.org',
    'MERCOSUR': 'https://sintia.mercosur.int/arancel',
    'USMCA': 'https://hts.usitc.gov',
    'CPTPP': 'https://cptpp-tariff.canada.ca',
    'AfCFTA': 'https://tariffs.afcfta.au.int'
  },
  
  tradeStatistics: {
    'EU': 'https://ec.europa.eu/eurostat/data/database',
    'ASEAN': 'https://data.asean.org',
    'MERCOSUR': 'https://estadisticas.mercosur.int',
    'USMCA': 'https://dataweb.usitc.gov',
    'Global': 'https://comtrade.un.org'
  },
  
  rulesOfOrigin: {
    'EU': 'https://ec.europa.eu/taxation_customs/business/calculation-customs-duties/rules-origin_en',
    'ASEAN': 'https://rules-of-origin.asean.org',
    'MERCOSUR': 'https://normas.mercosur.int/origen',
    'USMCA': 'https://usmca.com/rules-of-origin',
    'CPTPP': 'https://cptpp-rules.canada.ca'
  }
};