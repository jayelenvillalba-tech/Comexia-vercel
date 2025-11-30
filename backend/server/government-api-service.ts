// Servicio de integración con APIs gubernamentales para búsqueda de empresas oficiales
// Integra registros públicos de Brasil, Argentina, Chile y USA

import { 
  GovernmentAPIConfig, 
  CompanyGovernmentData, 
  GovernmentAPIResponse, 
  GovernmentAPIError,
  GOVERNMENT_API_CONFIGS,
  validateTaxId,
  normalizeTaxId,
  getSearchTermsForProduct,
  ECONOMIC_ACTIVITY_MAPPING
} from '@shared/government-apis';

// Cache en memoria para optimizar consultas
class APICache {
  private cache = new Map<string, { data: CompanyGovernmentData; expiresAt: Date }>();
  private readonly ttl = 24 * 60 * 60 * 1000; // 24 horas

  set(key: string, data: CompanyGovernmentData): void {
    const expiresAt = new Date(Date.now() + this.ttl);
    this.cache.set(key, { data, expiresAt });
  }

  get(key: string): CompanyGovernmentData | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export class GovernmentAPIService {
  private cache = new APICache();
  private rateLimits = new Map<string, { count: number; resetTime: Date }>();

  // Rate limiting por país
  private checkRateLimit(countryCode: string): boolean {
    const config = GOVERNMENT_API_CONFIGS[countryCode];
    if (!config) return false;

    const now = new Date();
    const limit = this.rateLimits.get(countryCode);

    if (!limit || limit.resetTime < now) {
      // Reset rate limit
      this.rateLimits.set(countryCode, {
        count: 1,
        resetTime: new Date(now.getTime() + 60000) // 1 minuto
      });
      return true;
    }

    if (limit.count >= config.rateLimit.requestsPerMinute) {
      return false;
    }

    limit.count++;
    return true;
  }

  // Brasil - API SERPRO (CNPJ)
  async searchCompaniesBrazil(query: string, productCode?: string): Promise<GovernmentAPIResponse<CompanyGovernmentData[]>> {
    const cacheKey = `BR:${query}:${productCode || 'all'}`;
    
    try {
      if (!this.checkRateLimit('BR')) {
        return {
          success: false,
          error: {
            code: GovernmentAPIError.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded for Brazil SERPRO API'
          },
          source: 'SERPRO-BR',
          timestamp: new Date()
        };
      }

      // En una implementación real, aquí se haría la consulta a la API SERPRO
      // Por ahora simulamos empresas brasileñas relevantes
      const mockBrazilCompanies: CompanyGovernmentData[] = [
        {
          taxId: '33.000.167/0001-01',
          name: 'Petrobras S.A.',
          legalName: 'Petróleo Brasileiro S.A.',
          taxStatus: 'active',
          businessType: 'Sociedade Anônima',
          economicActivities: ['0600-1', '1921-7', '4661-3'],
          address: {
            street: 'Av. República do Chile, 65',
            city: 'Rio de Janeiro',
            state: 'RJ',
            postalCode: '20031-912',
            country: 'BR'
          },
          contactInfo: {
            website: 'https://petrobras.com.br',
            phone: '+55 21 3224-1510'
          },
          capital: {
            amount: 30000000000,
            currency: 'BRL'
          },
          verificationStatus: 'verified',
          lastUpdated: new Date(),
          source: 'SERPRO-CNPJ'
        }
      ];

      // Filtrar por producto si se especifica
      const filteredCompanies = productCode 
        ? mockBrazilCompanies.filter(company => 
            this.matchesProduct(company, productCode, 'BR'))
        : mockBrazilCompanies;

      return {
        success: true,
        data: filteredCompanies,
        source: 'SERPRO-BR',
        timestamp: new Date(),
        rateLimitRemaining: 19
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: GovernmentAPIError.NETWORK_ERROR,
          message: 'Failed to connect to Brazil SERPRO API',
          details: error
        },
        source: 'SERPRO-BR',
        timestamp: new Date()
      };
    }
  }

  // Argentina - API TusFacturasAPP (CUIT)
  async searchCompaniesArgentina(query: string, productCode?: string): Promise<GovernmentAPIResponse<CompanyGovernmentData[]>> {
    const cacheKey = `AR:${query}:${productCode || 'all'}`;
    
    try {
      if (!this.checkRateLimit('AR')) {
        return {
          success: false,
          error: {
            code: GovernmentAPIError.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded for Argentina ARCA API'
          },
          source: 'ARCA-AR',
          timestamp: new Date()
        };
      }

      // Simulación de empresas argentinas del gobierno
      const mockArgentinaCompanies: CompanyGovernmentData[] = [
        {
          taxId: '30-54668197-9',
          name: 'YPF S.A.',
          legalName: 'YPF Sociedad Anónima',
          taxStatus: 'active',
          businessType: 'Sociedad Anónima',
          economicActivities: ['0610', '1920', '4661'],
          address: {
            street: 'Macacha Güemes 515',
            city: 'Buenos Aires',
            state: 'CABA',
            postalCode: 'C1106BKK',
            country: 'AR'
          },
          contactInfo: {
            website: 'https://ypf.com',
            phone: '+54 11 5441-0000'
          },
          verificationStatus: 'verified',
          lastUpdated: new Date(),
          source: 'ARCA-CUIT'
        }
      ];

      const filteredCompanies = productCode 
        ? mockArgentinaCompanies.filter(company => 
            this.matchesProduct(company, productCode, 'AR'))
        : mockArgentinaCompanies;

      return {
        success: true,
        data: filteredCompanies,
        source: 'ARCA-AR',
        timestamp: new Date(),
        rateLimitRemaining: 29
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: GovernmentAPIError.NETWORK_ERROR,
          message: 'Failed to connect to Argentina ARCA API',
          details: error
        },
        source: 'ARCA-AR',
        timestamp: new Date()
      };
    }
  }

  // Chile - API Gateway SII (RUT)
  async searchCompaniesChile(query: string, productCode?: string): Promise<GovernmentAPIResponse<CompanyGovernmentData[]>> {
    const cacheKey = `CL:${query}:${productCode || 'all'}`;
    
    try {
      if (!this.checkRateLimit('CL')) {
        return {
          success: false,
          error: {
            code: GovernmentAPIError.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded for Chile SII API'
          },
          source: 'SII-CL',
          timestamp: new Date()
        };
      }

      // Simulación de empresas chilenas del SII
      const mockChileCompanies: CompanyGovernmentData[] = [
        {
          taxId: '96963440-8',
          name: 'Corporación Nacional del Cobre de Chile',
          legalName: 'CODELCO',
          taxStatus: 'active',
          businessType: 'Empresa Estatal',
          economicActivities: ['071', '072', '073'],
          address: {
            street: 'Huérfanos 1270',
            city: 'Santiago',
            state: 'Región Metropolitana',
            postalCode: '8340518',
            country: 'CL'
          },
          contactInfo: {
            website: 'https://codelco.com',
            phone: '+56 2 2690-3000'
          },
          verificationStatus: 'verified',
          lastUpdated: new Date(),
          source: 'SII-RUT'
        }
      ];

      const filteredCompanies = productCode 
        ? mockChileCompanies.filter(company => 
            this.matchesProduct(company, productCode, 'CL'))
        : mockChileCompanies;

      return {
        success: true,
        data: filteredCompanies,
        source: 'SII-CL',
        timestamp: new Date(),
        rateLimitRemaining: 24
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: GovernmentAPIError.NETWORK_ERROR,
          message: 'Failed to connect to Chile SII API',
          details: error
        },
        source: 'SII-CL',
        timestamp: new Date()
      };
    }
  }

  // USA - SEC EDGAR API (EIN)
  async searchCompaniesUSA(query: string, productCode?: string): Promise<GovernmentAPIResponse<CompanyGovernmentData[]>> {
    const cacheKey = `US:${query}:${productCode || 'all'}`;
    
    try {
      if (!this.checkRateLimit('US')) {
        return {
          success: false,
          error: {
            code: GovernmentAPIError.RATE_LIMIT_EXCEEDED,
            message: 'Rate limit exceeded for USA SEC API'
          },
          source: 'SEC-US',
          timestamp: new Date()
        };
      }

      // Simulación de empresas estadounidenses del SEC
      const mockUSACompanies: CompanyGovernmentData[] = [
        {
          taxId: '91-1144442',
          name: 'Apple Inc.',
          legalName: 'Apple Inc.',
          taxStatus: 'active',
          businessType: 'Corporation',
          economicActivities: ['334', '335'],
          address: {
            street: 'One Apple Park Way',
            city: 'Cupertino',
            state: 'CA',
            postalCode: '95014',
            country: 'US'
          },
          contactInfo: {
            website: 'https://apple.com',
            phone: '+1 408 996-1010'
          },
          verificationStatus: 'verified',
          lastUpdated: new Date(),
          source: 'SEC-EDGAR'
        }
      ];

      const filteredCompanies = productCode 
        ? mockUSACompanies.filter(company => 
            this.matchesProduct(company, productCode, 'US'))
        : mockUSACompanies;

      return {
        success: true,
        data: filteredCompanies,
        source: 'SEC-US',
        timestamp: new Date(),
        rateLimitRemaining: 9
      };

    } catch (error) {
      return {
        success: false,
        error: {
          code: GovernmentAPIError.NETWORK_ERROR,
          message: 'Failed to connect to USA SEC API',
          details: error
        },
        source: 'SEC-US',
        timestamp: new Date()
      };
    }
  }

  // Función principal para buscar empresas por país
  async searchCompaniesGovernment(
    countryCode: string, 
    query: string, 
    productCode?: string,
    companyType?: 'importer' | 'exporter' | 'both'
  ): Promise<GovernmentAPIResponse<CompanyGovernmentData[]>> {
    const config = GOVERNMENT_API_CONFIGS[countryCode];
    
    if (!config || config.status !== 'active') {
      return {
        success: false,
        error: {
          code: GovernmentAPIError.API_UNAVAILABLE,
          message: `Government API not available for country: ${countryCode}`
        },
        source: `${countryCode}-API`,
        timestamp: new Date()
      };
    }

    // Dirigir a la API específica del país
    switch (countryCode) {
      case 'BR':
        return await this.searchCompaniesBrazil(query, productCode);
      case 'AR':
        return await this.searchCompaniesArgentina(query, productCode);
      case 'CL':
        return await this.searchCompaniesChile(query, productCode);
      case 'US':
        return await this.searchCompaniesUSA(query, productCode);
      default:
        return {
          success: false,
          error: {
            code: GovernmentAPIError.API_UNAVAILABLE,
            message: `API integration not implemented for country: ${countryCode}`
          },
          source: `${countryCode}-API`,
          timestamp: new Date()
        };
    }
  }

  // Verificar si una empresa coincide con un código de producto
  private matchesProduct(company: CompanyGovernmentData, productCode: string, countryCode: string): boolean {
    // Buscar en actividades económicas
    const activityMapping = ECONOMIC_ACTIVITY_MAPPING[countryCode];
    if (activityMapping && company.economicActivities) {
      for (const [category, codes] of Object.entries(activityMapping)) {
        if (codes.some(code => company.economicActivities?.includes(code))) {
          // Verificar si el código de producto coincide con la categoría
          const searchTerms = getSearchTermsForProduct(productCode, countryCode);
          if (searchTerms.some(term => category.includes(term.toLowerCase()))) {
            return true;
          }
        }
      }
    }

    // Buscar en nombre de la empresa
    const searchTerms = getSearchTermsForProduct(productCode, countryCode);
    const companyName = company.name.toLowerCase();
    return searchTerms.some(term => companyName.includes(term.toLowerCase()));
  }

  // Obtener estadísticas de uso de APIs
  getAPIStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [countryCode, config] of Object.entries(GOVERNMENT_API_CONFIGS)) {
      const rateLimit = this.rateLimits.get(countryCode);
      stats[countryCode] = {
        agency: config.agency,
        status: config.status,
        isOfficial: config.isOfficial,
        requestsUsed: rateLimit?.count || 0,
        resetTime: rateLimit?.resetTime || null,
        rateLimitPerMinute: config.rateLimit.requestsPerMinute
      };
    }
    
    return stats;
  }

  // Validar ID fiscal
  validateCompanyTaxId(taxId: string, countryCode: string): boolean {
    return validateTaxId(taxId, countryCode);
  }

  // Normalizar ID fiscal
  normalizeCompanyTaxId(taxId: string, countryCode: string): string {
    return normalizeTaxId(taxId, countryCode);
  }
}

// Singleton instance
export const governmentAPIService = new GovernmentAPIService();