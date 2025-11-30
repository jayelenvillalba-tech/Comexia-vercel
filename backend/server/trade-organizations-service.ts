// Servicio de integración con APIs oficiales de organizaciones comerciales
// Utiliza datos públicos de tratados comerciales para mejorar recomendaciones

import { 
  TRADE_ORGANIZATION_APIS, 
  TradeOrganizationAPIConfig,
  TariffPreference,
  TariffQueryResult,
  TradeQueryParams,
  findPreferentialTreatment,
  hasDataAvailableForTreaty
} from '@shared/trade-organizations-apis';
import { tradeTreaties } from '@shared/countries-data';

interface EnhancedCountryRecommendation {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  score: number;
  opportunity: 'high' | 'medium' | 'low';
  tariffSavings?: number;
  preferentialRate?: number;
  normalRate?: number;
  treatyBenefits: string[];
  officialDataSource?: string;
  rulesOfOrigin?: string;
  estimatedTimeDelay?: number;
  additionalRequirements?: string[];
}

class TradeOrganizationsService {
  private cache = new Map<string, { data: any; expiresAt: Date }>();
  private readonly ttl = 4 * 60 * 60 * 1000; // 4 horas

  // Cache para optimizar consultas
  private setCache(key: string, data: any): void {
    const expiresAt = new Date(Date.now() + this.ttl);
    this.cache.set(key, { data, expiresAt });
  }

  private getCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (entry.expiresAt < new Date()) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Consultar tratamiento arancelario oficial
  async queryTariffTreatment(params: TradeQueryParams): Promise<TariffQueryResult> {
    const cacheKey = `tariff:${params.hsCode}:${params.originCountry}:${params.destinationCountry}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    try {
      // Buscar tratados aplicables entre los países
      const applicableTreaties = this.findApplicableTreaties(params.originCountry, params.destinationCountry);
      
      if (applicableTreaties.length === 0) {
        return {
          success: false,
          error: {
            code: 'NO_TREATIES',
            message: 'No hay tratados comerciales aplicables entre estos países'
          },
          source: 'internal',
          timestamp: new Date()
        };
      }

      // Buscar preferencias arancelarias conocidas
      const preferences = findPreferentialTreatment(
        params.hsCode, 
        params.originCountry, 
        params.destinationCountry
      );

      // Calcular beneficios estimados
      let estimatedSavings = 0;
      let estimatedTimeDelay = 0;
      let additionalCosts = 0;

      if (preferences.length > 0) {
        const bestPreference = preferences[0]; // Tomar la mejor opción
        estimatedSavings = bestPreference.mostFavoredNationRate - bestPreference.preferentialRate;
        
        // Estimar costos adicionales por certificación de origen
        if (bestPreference.rulesOfOrigin) {
          additionalCosts = 150; // USD promedio por certificación
          estimatedTimeDelay = 3; // días adicionales
        }
      }

      const result: TariffQueryResult = {
        success: true,
        data: {
          tariffPreferences: preferences,
          sanitaryMeasures: [], // Se podría expandir con datos reales
          estimatedSavings,
          estimatedTimeDelay,
          additionalCosts
        },
        source: preferences.length > 0 ? preferences[0].treatySource : 'calculated',
        timestamp: new Date()
      };

      this.setCache(cacheKey, result);
      return result;

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'QUERY_ERROR',
          message: 'Error al consultar tratamiento arancelario'
        },
        source: 'internal',
        timestamp: new Date()
      };
    }
  }

  // Encontrar tratados aplicables entre dos países
  private findApplicableTreaties(originCountry: string, destinationCountry: string): string[] {
    return tradeTreaties
      .filter(treaty => 
        treaty.members.includes(originCountry) && 
        treaty.members.includes(destinationCountry)
      )
      .map(treaty => treaty.id);
  }

  // Obtener información detallada de un tratado
  getTreatyInfo(treatyId: string): TradeOrganizationAPIConfig | null {
    return TRADE_ORGANIZATION_APIS[treatyId] || null;
  }

  // Mejorar recomendaciones de países con datos oficiales de tratados
  async enhanceCountryRecommendations(
    hsCode: string,
    operation: 'import' | 'export',
    originCountry: string,
    baseRecommendations: any
  ): Promise<EnhancedCountryRecommendation[]> {
    
    const enhanced: EnhancedCountryRecommendation[] = [];

    // Ensure baseRecommendations is an array
    const recommendations = Array.isArray(baseRecommendations) ? baseRecommendations : 
                          (baseRecommendations?.recommended || []);

    for (const recommendation of recommendations) {
      const countryCode = recommendation.countryCode;
      
      // Consultar tratamiento arancelario
      const tariffQuery = await this.queryTariffTreatment({
        hsCode,
        originCountry: operation === 'export' ? originCountry : countryCode,
        destinationCountry: operation === 'export' ? countryCode : originCountry
      });

      // Encontrar tratados compartidos
      const sharedTreaties = this.findApplicableTreaties(originCountry, countryCode);
      const treatyBenefits: string[] = [];

      for (const treatyId of sharedTreaties) {
        const treaty = tradeTreaties.find(t => t.id === treatyId);
        const apiConfig = this.getTreatyInfo(treatyId);
        
        if (treaty) {
          treatyBenefits.push(`${treaty.nameEn}: ${treaty.tariffReduction}% reducción arancelaria`);
          
          if (apiConfig?.customsUnion) {
            treatyBenefits.push('Unión aduanera: procedimientos simplificados');
          }
          
          if (treaty.sectors && treaty.sectors.length > 0) {
            treatyBenefits.push(`Sectores prioritarios: ${treaty.sectors.join(', ')}`);
          }
        }
      }

      // Calcular mejora en el score basada en beneficios arancelarios
      let enhancedScore = recommendation.score;
      let preferentialRate: number | undefined;
      let normalRate: number | undefined;
      let tariffSavings: number | undefined;
      let rulesOfOrigin: string | undefined;
      let officialDataSource: string | undefined;

      if (tariffQuery.success && tariffQuery.data && tariffQuery.data.tariffPreferences.length > 0) {
        const preference = tariffQuery.data.tariffPreferences[0];
        preferentialRate = preference.preferentialRate;
        normalRate = preference.mostFavoredNationRate;
        tariffSavings = preference.savingsPercentage;
        rulesOfOrigin = preference.rulesOfOrigin;
        officialDataSource = preference.treatySource;
        
        // Mejorar score basado en ahorros arancelarios
        const savingsBonus = preference.savingsPercentage / 100 * 20; // Hasta 20 puntos extra
        enhancedScore = Math.min(100, enhancedScore + savingsBonus);
      }

      // Determinar nueva categoría de oportunidad
      let opportunity: 'high' | 'medium' | 'low' = 'low';
      if (enhancedScore >= 85) opportunity = 'high';
      else if (enhancedScore >= 65) opportunity = 'medium';

      enhanced.push({
        countryCode: recommendation.countryCode,
        countryName: recommendation.countryName,
        countryNameEn: recommendation.countryNameEn,
        score: enhancedScore,
        opportunity,
        tariffSavings,
        preferentialRate,
        normalRate,
        treatyBenefits,
        officialDataSource,
        rulesOfOrigin,
        estimatedTimeDelay: tariffQuery.data ? tariffQuery.data.estimatedTimeDelay : undefined,
        additionalRequirements: rulesOfOrigin ? ['Certificado de origen requerido'] : undefined
      });
    }

    // Ordenar por score mejorado
    return enhanced.sort((a, b) => b.score - a.score);
  }

  // Obtener estadísticas de APIs disponibles
  getAvailableAPIs(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [id, config] of Object.entries(TRADE_ORGANIZATION_APIS)) {
      stats[id] = {
        organization: config.organizationEn,
        isActive: config.isActive,
        memberCount: config.memberCountries.length,
        dataAvailable: Object.values(config.dataAvailability).filter(Boolean).length,
        lastUpdate: config.lastUpdate,
        hasAPI: !!config.publicAPIEndpoint,
        customsUnion: config.customsUnion
      };
    }
    
    return stats;
  }

  // Validar si dos países pueden beneficiarse de tratamiento preferencial
  canBenefitFromPreferentialTreatment(
    originCountry: string,
    destinationCountry: string,
    hsCode: string
  ): {
    eligible: boolean;
    treaties: string[];
    estimatedSavings: number;
    requirements: string[];
  } {
    const treaties = this.findApplicableTreaties(originCountry, destinationCountry);
    
    if (treaties.length === 0) {
      return {
        eligible: false,
        treaties: [],
        estimatedSavings: 0,
        requirements: []
      };
    }

    // Buscar beneficios específicos
    const preferences = findPreferentialTreatment(hsCode, originCountry, destinationCountry);
    const estimatedSavings = preferences.length > 0 
      ? preferences[0].savingsPercentage 
      : this.estimateGenericSavings(treaties);

    const requirements: string[] = [];
    if (preferences.length > 0 && preferences[0].rulesOfOrigin) {
      requirements.push(preferences[0].rulesOfOrigin);
    } else {
      requirements.push('Certificado de origen requerido');
    }

    return {
      eligible: true,
      treaties,
      estimatedSavings,
      requirements
    };
  }

  // Estimar ahorros genéricos basados en tipo de tratado
  private estimateGenericSavings(treatyIds: string[]): number {
    let maxSavings = 0;
    
    for (const treatyId of treatyIds) {
      const treaty = tradeTreaties.find(t => t.id === treatyId);
      if (treaty && treaty.tariffReduction > maxSavings) {
        maxSavings = treaty.tariffReduction;
      }
    }
    
    return maxSavings;
  }

  // Obtener información completa de tratados entre países
  getTreatyAnalysis(originCountry: string, destinationCountry: string): {
    sharedTreaties: any[];
    totalBenefits: string[];
    customsSimplification: boolean;
    recommendedActions: string[];
  } {
    const sharedTreatyIds = this.findApplicableTreaties(originCountry, destinationCountry);
    const sharedTreaties = tradeTreaties.filter(t => sharedTreatyIds.includes(t.id));
    
    const totalBenefits: string[] = [];
    let customsSimplification = false;
    const recommendedActions: string[] = [];

    for (const treaty of sharedTreaties) {
      totalBenefits.push(`${treaty.nameEn}: Reducción arancelaria hasta ${treaty.tariffReduction}%`);
      
      if (treaty.type === 'customs_union' || treaty.type === 'common_market') {
        customsSimplification = true;
        totalBenefits.push('Procedimientos aduaneros simplificados');
      }
      
      if (treaty.sectors) {
        totalBenefits.push(`Sectores preferenciales: ${treaty.sectors.join(', ')}`);
      }
    }

    // Recomendaciones específicas
    if (sharedTreaties.length > 0) {
      recommendedActions.push('Obtener certificado de origen para productos elegibles');
      
      if (customsSimplification) {
        recommendedActions.push('Considerar registro como operador económico autorizado (OEA)');
      }
      
      recommendedActions.push('Verificar reglas de origen específicas para el producto');
      recommendedActions.push('Consultar procedimientos preferenciales en aduana de destino');
    }

    return {
      sharedTreaties,
      totalBenefits,
      customsSimplification,
      recommendedActions
    };
  }
}

// Singleton instance
export const tradeOrganizationsService = new TradeOrganizationsService();