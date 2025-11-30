// Configuración para futura integración con UN Comtrade API
// UN Comtrade es la base de datos de estadísticas comerciales de las Naciones Unidas

export interface UnComtradeConfig {
  baseUrl: string;
  endpoints: {
    classifications: string;
    tradeData: string;
    countries: string;
    commodities: string;
  };
  limits: {
    maxRecordsPerCall: number;
    callsPerHour: number;
    callsPerDay: number;
  };
}

export const UN_COMTRADE_CONFIG: UnComtradeConfig = {
  baseUrl: 'https://comtradeapi.un.org/public/v1',
  endpoints: {
    classifications: '/metadata/classifications',
    tradeData: '/get',
    countries: '/metadata/reporters',
    commodities: '/metadata/commodities'
  },
  limits: {
    maxRecordsPerCall: 100000,
    callsPerHour: 100,
    callsPerDay: 2500
  }
};

// Parámetros para consultas a UN Comtrade
export interface ComtradeQueryParams {
  reporterCode?: string;  // País que reporta
  partnerCode?: string;   // País socio comercial
  cmdCode?: string;       // Código de commodity (HS)
  flowCode?: string;      // 1=Import, 2=Export
  period?: string;        // YYYY or YYYY-MM
  customsCode?: string;   // C=Customs, S=Special Trade
  motCode?: string;       // Modo de transporte
  freq?: 'A' | 'M';      // Annual o Monthly
  fmt?: 'json' | 'csv';  // Formato de respuesta
}

// Tipos para respuestas de UN Comtrade
export interface ComtradeTradeRecord {
  period: number;
  periodDesc: string;
  aggrLevel: number;
  isLeaf: number;
  tradeFlowCode: number;
  tradeFlowDesc: string;
  reporterCode: number;
  reporterDesc: string;
  reporterISO: string;
  partnerCode: number;
  partnerDesc: string;
  partnerISO: string;
  cmdCode: string;
  cmdDesc: string;
  tradeValue: number;
  qty: number;
  qtyUnitCode: number;
  qtyUnitDesc: string;
  estCode: number;
}

export interface ComtradeResponse {
  elapsedTime: number;
  results: ComtradeTradeRecord[];
  count: number;
}

// Función para construir URLs de consulta
export function buildComtradeUrl(params: ComtradeQueryParams): string {
  const url = new URL(UN_COMTRADE_CONFIG.baseUrl + UN_COMTRADE_CONFIG.endpoints.tradeData);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  
  return url.toString();
}

// Mapeo de códigos de países ISO a códigos de UN Comtrade
export const COUNTRY_CODE_MAPPING: Record<string, string> = {
  'AR': '32',   // Argentina
  'BR': '76',   // Brazil
  'CL': '152',  // Chile
  'CO': '170',  // Colombia
  'UY': '858',  // Uruguay
  'PY': '600',  // Paraguay
  'PE': '604',  // Peru
  'EC': '218',  // Ecuador
  'BO': '68',   // Bolivia
  'VE': '862',  // Venezuela
  'US': '842',  // United States
  'CA': '124',  // Canada
  'MX': '484',  // Mexico
  'DE': '276',  // Germany
  'FR': '250',  // France
  'IT': '380',  // Italy
  'ES': '724',  // Spain
  'UK': '826',  // United Kingdom
  'NL': '528',  // Netherlands
  'BE': '56',   // Belgium
  'CH': '756',  // Switzerland
  'CN': '156',  // China
  'JP': '392',  // Japan
  'KR': '410',  // South Korea
  'IN': '356',  // India
  'SG': '702',  // Singapore
  'MY': '458',  // Malaysia
  'TH': '764',  // Thailand
  'VN': '704',  // Vietnam
  'ID': '360',  // Indonesia
  'PH': '608',  // Philippines
  'AU': '36',   // Australia
  'NZ': '554'   // New Zealand
};

// Función de utilidad para obtener código UN Comtrade
export function getComtradeCountryCode(isoCode: string): string | undefined {
  return COUNTRY_CODE_MAPPING[isoCode];
}

// Función para mapear códigos HS a códigos de commodity de UN Comtrade
export function hsToComtradeCode(hsCode: string): string {
  // UN Comtrade usa códigos HS de 6 dígitos principalmente
  if (hsCode.length >= 6) {
    return hsCode.substring(0, 6);
  }
  return hsCode.padEnd(6, '0');
}

// Estructura para cache de datos comerciales
export interface TradeDataCache {
  key: string;
  data: ComtradeTradeRecord[];
  timestamp: Date;
  expiryHours: number;
}

// Configuración de cache para optimizar llamadas a la API
export const CACHE_CONFIG = {
  defaultExpiryHours: 24, // Los datos comerciales se actualizan diariamente
  maxCacheSize: 1000,     // Máximo número de entradas en cache
  cleanupIntervalHours: 6 // Limpiar cache cada 6 horas
};

// Funciones de utilidad para manejar límites de API
export class ComtrateRateLimiter {
  private hourlyCount = 0;
  private dailyCount = 0;
  private lastHourReset = new Date();
  private lastDayReset = new Date();

  canMakeCall(): boolean {
    this.updateCounters();
    return this.hourlyCount < UN_COMTRADE_CONFIG.limits.callsPerHour &&
           this.dailyCount < UN_COMTRADE_CONFIG.limits.callsPerDay;
  }

  recordCall(): void {
    this.updateCounters();
    this.hourlyCount++;
    this.dailyCount++;
  }

  private updateCounters(): void {
    const now = new Date();
    
    // Reset hourly counter
    if (now.getTime() - this.lastHourReset.getTime() >= 3600000) {
      this.hourlyCount = 0;
      this.lastHourReset = now;
    }
    
    // Reset daily counter
    if (now.getTime() - this.lastDayReset.getTime() >= 86400000) {
      this.dailyCount = 0;
      this.lastDayReset = now;
    }
  }

  getRemainingCalls(): { hourly: number; daily: number } {
    this.updateCounters();
    return {
      hourly: UN_COMTRADE_CONFIG.limits.callsPerHour - this.hourlyCount,
      daily: UN_COMTRADE_CONFIG.limits.callsPerDay - this.dailyCount
    };
  }
}

// Ejemplo de uso futuro:
/*
const rateLimiter = new ComtrateRateLimiter();

async function fetchTradeData(params: ComtradeQueryParams): Promise<ComtradeResponse | null> {
  if (!rateLimiter.canMakeCall()) {
    console.warn('API rate limit reached');
    return null;
  }

  try {
    const url = buildComtradeUrl(params);
    const response = await fetch(url);
    rateLimiter.recordCall();
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Comtrade data:', error);
    return null;
  }
}
*/