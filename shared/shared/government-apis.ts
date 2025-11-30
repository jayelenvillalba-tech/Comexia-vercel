// Configuración de APIs gubernamentales para búsqueda de empresas oficiales
// Integra registros públicos de diferentes países para datos empresariales verificados

export interface GovernmentAPIConfig {
  country: string;
  countryCode: string;
  agency: string;
  agencyCode: string;
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay: number;
  };
  taxIdFormat: string;
  taxIdName: string;
  isOfficial: boolean;
  requiresAuth: boolean;
  status: 'active' | 'inactive' | 'deprecated';
}

export interface CompanyGovernmentData {
  taxId: string;
  name: string;
  legalName?: string;
  registrationDate?: string;
  taxStatus: 'active' | 'inactive' | 'suspended';
  businessType?: string;
  economicActivities?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  officers?: Array<{
    name: string;
    position: string;
    document?: string;
  }>;
  capital?: {
    amount?: number;
    currency?: string;
  };
  verificationStatus: 'verified' | 'pending' | 'failed';
  lastUpdated: Date;
  source: string;
}

// Configuraciones de APIs gubernamentales por país
export const GOVERNMENT_API_CONFIGS: Record<string, GovernmentAPIConfig> = {
  // Brasil - API SERPRO oficial (Receita Federal)
  'BR': {
    country: 'Brasil',
    countryCode: 'BR',
    agency: 'Receita Federal - SERPRO',
    agencyCode: 'SERPRO',
    baseUrl: 'https://apicenter.estaleiro.serpro.gov.br/consulta-cnpj/v2',
    rateLimit: {
      requestsPerMinute: 20,
      requestsPerDay: 1000
    },
    taxIdFormat: 'XX.XXX.XXX/XXXX-XX',
    taxIdName: 'CNPJ',
    isOfficial: true,
    requiresAuth: true,
    status: 'active'
  },

  // Argentina - API TusFacturasAPP (AFIP/ARCA)
  'AR': {
    country: 'Argentina',
    countryCode: 'AR',
    agency: 'ARCA - TusFacturasAPP',
    agencyCode: 'ARCA',
    baseUrl: 'https://api.tusfacturas.app/v1',
    rateLimit: {
      requestsPerMinute: 30,
      requestsPerDay: 2000
    },
    taxIdFormat: 'NN-NNNNNNNN-N',
    taxIdName: 'CUIT',
    isOfficial: false, // Third-party but reliable
    requiresAuth: true,
    status: 'active'
  },

  // Chile - API Gateway SII
  'CL': {
    country: 'Chile',
    countryCode: 'CL',
    agency: 'SII - API Gateway',
    agencyCode: 'SII',
    baseUrl: 'https://www.apigateway.cl/api/v1',
    rateLimit: {
      requestsPerMinute: 25,
      requestsPerDay: 1500
    },
    taxIdFormat: 'XXXXXXXX-Z',
    taxIdName: 'RUT',
    isOfficial: false, // Third-party service
    requiresAuth: true,
    status: 'active'
  },

  // Estados Unidos - SEC EDGAR API
  'US': {
    country: 'United States',
    countryCode: 'US',
    agency: 'SEC - EDGAR Database',
    agencyCode: 'SEC',
    baseUrl: 'https://data.sec.gov/submissions',
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000
    },
    taxIdFormat: 'NN-NNNNNNN',
    taxIdName: 'EIN',
    isOfficial: true,
    requiresAuth: false, // Free but with rate limits
    status: 'active'
  },

  // Alemania - Handelsregister (para referencia futura)
  'DE': {
    country: 'Germany',
    countryCode: 'DE',
    agency: 'Handelsregister',
    agencyCode: 'HR',
    baseUrl: 'https://www.handelsregister.de/rp_web/api',
    rateLimit: {
      requestsPerMinute: 15,
      requestsPerDay: 500
    },
    taxIdFormat: 'DE XXXXXXXXX',
    taxIdName: 'Steuernummer',
    isOfficial: true,
    requiresAuth: true,
    status: 'inactive' // No implementado aún
  },

  // China - SAMR (para referencia futura)
  'CN': {
    country: 'China',
    countryCode: 'CN',
    agency: 'SAMR - National Enterprise Credit',
    agencyCode: 'SAMR',
    baseUrl: 'http://www.gsxt.gov.cn/api',
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 200
    },
    taxIdFormat: 'XXXXXXXXXXXXXXXXXX',
    taxIdName: 'USCI',
    isOfficial: true,
    requiresAuth: false,
    status: 'inactive' // Acceso limitado para extranjeros
  }
};

// Mapeo de productos a códigos de actividad económica por país
export const ECONOMIC_ACTIVITY_MAPPING: Record<string, Record<string, string[]>> = {
  'BR': {
    // CNAE - Classificação Nacional de Atividades Econômicas
    'agriculture': ['0111-3', '0112-1', '0113-0', '0115-6'],
    'mining': ['0500-0', '0710-4', '0722-8', '0729-5'],
    'manufacturing': ['1000-1', '1500-1', '2000-6', '3000-1'],
    'electronics': ['2610-2', '2620-9', '2630-6', '2640-3'],
    'automotive': ['2910-7', '2920-4', '2930-1', '2940-9'],
    'textiles': ['1310-1', '1321-7', '1322-5', '1330-6'],
    'food': ['1011-2', '1012-1', '1020-1', '1030-9']
  },
  'AR': {
    // CIIU - Clasificación Industrial Internacional Uniforme
    'agriculture': ['0111', '0112', '0113', '0115'],
    'mining': ['0500', '0710', '0722', '0729'],
    'manufacturing': ['1000', '1500', '2000', '3000'],
    'electronics': ['2610', '2620', '2630', '2640'],
    'automotive': ['2910', '2920', '2930', '2940'],
    'textiles': ['1310', '1321', '1322', '1330'],
    'food': ['1011', '1012', '1020', '1030']
  },
  'CL': {
    // CIIU adaptado para Chile
    'agriculture': ['011', '012', '013', '015'],
    'mining': ['050', '071', '072', '073'],
    'manufacturing': ['100', '150', '200', '300'],
    'electronics': ['261', '262', '263', '264'],
    'automotive': ['291', '292', '293', '294'],
    'textiles': ['131', '132', '133', '134'],
    'food': ['101', '102', '103', '104']
  },
  'US': {
    // NAICS - North American Industry Classification System
    'agriculture': ['111', '112', '113', '115'],
    'mining': ['211', '212', '213'],
    'manufacturing': ['311', '312', '313', '314'],
    'electronics': ['334', '335', '336'],
    'automotive': ['3361', '3362', '3363'],
    'textiles': ['313', '314', '315', '316'],
    'food': ['311', '312']
  }
};

// Tipos de errores específicos de APIs gubernamentales
export enum GovernmentAPIError {
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TAX_ID = 'INVALID_TAX_ID',
  COMPANY_NOT_FOUND = 'COMPANY_NOT_FOUND',
  API_UNAVAILABLE = 'API_UNAVAILABLE',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface GovernmentAPIResponse<T = CompanyGovernmentData> {
  success: boolean;
  data?: T;
  error?: {
    code: GovernmentAPIError;
    message: string;
    details?: any;
  };
  source: string;
  timestamp: Date;
  rateLimitRemaining?: number;
}

// Configuración de cache para optimizar consultas
export interface APICache {
  key: string;
  data: CompanyGovernmentData;
  expiresAt: Date;
  country: string;
}

export const CACHE_CONFIG = {
  defaultTTL: 24 * 60 * 60 * 1000, // 24 horas
  maxEntries: 1000,
  cleanupInterval: 6 * 60 * 60 * 1000 // 6 horas
};

// Función de utilidad para validar formato de ID fiscal por país
export function validateTaxId(taxId: string, countryCode: string): boolean {
  const config = GOVERNMENT_API_CONFIGS[countryCode];
  if (!config) return false;

  const patterns: Record<string, RegExp> = {
    'BR': /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, // CNPJ: XX.XXX.XXX/XXXX-XX
    'AR': /^\d{2}-\d{8}-\d$/, // CUIT: NN-NNNNNNNN-N
    'CL': /^\d{7,8}-[\dK]$/, // RUT: XXXXXXXX-Z
    'US': /^\d{2}-\d{7}$/, // EIN: NN-NNNNNNN
    'DE': /^DE\d{9}$/, // German tax number
    'CN': /^\d{18}$/ // Chinese USCI
  };

  const pattern = patterns[countryCode];
  return pattern ? pattern.test(taxId) : false;
}

// Función para normalizar ID fiscal
export function normalizeTaxId(taxId: string, countryCode: string): string {
  switch (countryCode) {
    case 'BR':
      // Remove dots and slashes, keep only numbers and dash
      return taxId.replace(/[^\d\/\-]/g, '');
    case 'AR':
      // Ensure format NN-NNNNNNNN-N
      return taxId.replace(/[^\d\-]/g, '');
    case 'CL':
      // Remove dots, keep numbers and dash/K
      return taxId.replace(/[^\dK\-]/g, '').toUpperCase();
    case 'US':
      // Ensure format NN-NNNNNNN
      return taxId.replace(/[^\d\-]/g, '');
    default:
      return taxId.trim();
  }
}

// Mapeo de productos a términos de búsqueda por país
export function getSearchTermsForProduct(productCode: string, countryCode: string): string[] {
  const productMappings: Record<string, Record<string, string[]>> = {
    'BR': {
      '8517': ['telecomunicações', 'telefonia', 'equipamentos de comunicação'],
      '8703': ['veículos', 'automóveis', 'carros'],
      '2603': ['minério de cobre', 'cobre', 'mineração'],
      '1201': ['soja', 'grãos', 'oleaginosas'],
      '0201': ['carne bovina', 'carne', 'frigorífico']
    },
    'AR': {
      '8517': ['telecomunicaciones', 'equipos de comunicación'],
      '8703': ['vehículos', 'automóviles'],
      '2603': ['cobre', 'minería'],
      '1201': ['soja', 'granos'],
      '0201': ['carne', 'frigorífico', 'exportación cárnica']
    },
    'CL': {
      '8517': ['telecomunicaciones', 'equipos comunicación'],
      '8703': ['vehículos', 'automóviles'],
      '2603': ['cobre', 'minería', 'exportación minera'],
      '2204': ['vino', 'viticultura', 'exportación vino']
    }
  };

  const countryMapping = productMappings[countryCode];
  return countryMapping?.[productCode] || [productCode];
}