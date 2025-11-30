import OpenAI from "openai";
import { countries, tradeTreaties, getTariffReduction, haveTradeTreaty } from "@shared/countries-data";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CountryAnalysis {
  countryCode: string;
  countryName: string;
  countryNameEn: string;
  rank: number;
  score: number;
  opportunity: 'high' | 'medium' | 'low';
  tradeVolume: string;
  growth: string;
  marketSize: string;
  competitiveness: string;
  treaties: string[];
  tariffRate: string;
  advantages: Array<{reason: string, reasonEn: string, impact: string}>;
  disadvantages: Array<{reason: string, reasonEn: string, impact: string}>;
  coordinates: [number, number];
}

export interface MarketIntelligenceReport {
  country: string;
  product: string;
  operation: 'import' | 'export';
  analysis: string;
  opportunities: string[];
  challenges: string[];
  recommendations: string[];
  marketTrends: string[];
  competitiveAnalysis: string;
  riskAssessment: string;
  timeline: string;
  estimatedVolume: string;
  estimatedValue: string;
}

// South American countries with precise coordinates and trade data
const SOUTH_AMERICAN_COUNTRIES = {
  'BR': { name: 'Brasil', nameEn: 'Brazil', coords: [-14.235, -51.9253] as [number, number], gdp: 2055506, population: 215313498 },
  'AR': { name: 'Argentina', nameEn: 'Argentina', coords: [-38.4161, -63.6167] as [number, number], gdp: 487227, population: 45376763 },
  'CO': { name: 'Colombia', nameEn: 'Colombia', coords: [4.5709, -74.2973] as [number, number], gdp: 314464, population: 51265844 },
  'PE': { name: 'Perú', nameEn: 'Peru', coords: [-9.19, -75.0152] as [number, number], gdp: 223249, population: 33050325 },
  'CL': { name: 'Chile', nameEn: 'Chile', coords: [-35.6751, -71.543] as [number, number], gdp: 317058, population: 19458310 },
  'EC': { name: 'Ecuador', nameEn: 'Ecuador', coords: [-1.8312, -78.1834] as [number, number], gdp: 106165, population: 18001000 },
  'BO': { name: 'Bolivia', nameEn: 'Bolivia', coords: [-16.2902, -63.5887] as [number, number], gdp: 40895, population: 11832940 },
  'UY': { name: 'Uruguay', nameEn: 'Uruguay', coords: [-32.5228, -55.7658] as [number, number], gdp: 59319, population: 3485151 },
  'PY': { name: 'Paraguay', nameEn: 'Paraguay', coords: [-23.4425, -58.4438] as [number, number], gdp: 38145, population: 7353038 },
  'VE': { name: 'Venezuela', nameEn: 'Venezuela', coords: [6.4238, -66.5897] as [number, number], gdp: 99300, population: 28704954 },
  'GY': { name: 'Guyana', nameEn: 'Guyana', coords: [4.8604, -58.9302] as [number, number], gdp: 8045, population: 808726 },
  'SR': { name: 'Suriname', nameEn: 'Suriname', coords: [3.9193, -56.0278] as [number, number], gdp: 3821, population: 618040 },
  'GF': { name: 'Guayana Francesa', nameEn: 'French Guiana', coords: [3.9339, -53.1258] as [number, number], gdp: 4900, population: 300000 }
};

// Trade bloc memberships and treaties for South America
const TRADE_BLOCS = {
  'MERCOSUR': ['BR', 'AR', 'UY', 'PY'],
  'PACIFIC_ALLIANCE': ['CL', 'CO', 'PE'],
  'CAN': ['CO', 'PE', 'BO', 'EC'],
  'UNASUR': ['BR', 'AR', 'CO', 'PE', 'CL', 'EC', 'BO', 'UY', 'PY', 'VE', 'GY', 'SR']
};

// Product categories with HS codes for South America
const PRODUCT_CATEGORIES = {
  'agriculture': ['0901', '1201', '1701', '0401', '0603', '1001', '1005'],
  'mining': ['2601', '7203', '2603', '2604', '7108', '2616', '7601', '2606'],
  'energy': ['2709', '2710', '2711'],
  'manufacturing': ['8802', '8803', '8411', '8429', '8431', '8424'],
  'food_processing': ['0201', '0202', '1602', '2101'],
  'textiles': ['5201', '6109', '6203'],
  'chemicals': ['2804', '3901', '3902']
};

export class MarketAnalysisService {
  
  // Generate TOP 10 countries analysis for South America with company integration
  async generateTop10Analysis(
    originCountry: string,
    operation: 'import' | 'export',
    product: string,
    existingCompanies?: Array<{
      name: string;
      country: string;
      type: string;
      products: string[];
      verified: boolean;
      contactEmail?: string;
      website?: string;
    }>
  ): Promise<CountryAnalysis[]> {
    
    const targetCountries = Object.keys(SOUTH_AMERICAN_COUNTRIES)
      .filter(code => code !== originCountry);
    
    const analyses: CountryAnalysis[] = [];
    
    for (const countryCode of targetCountries) {
      const countryData = SOUTH_AMERICAN_COUNTRIES[countryCode as keyof typeof SOUTH_AMERICAN_COUNTRIES];
      if (!countryData) continue;
      
      // Calculate comprehensive score based on multiple factors
      const score = this.calculateTradeScore(originCountry, countryCode, operation, product);
      const opportunity = score > 80 ? 'high' : score > 60 ? 'medium' : 'low';
      
      // Get trade treaties and tariff information
      const treaties = this.getApplicableTreaties(originCountry, countryCode);
      const tariffRate = this.calculateTariffRate(originCountry, countryCode, product);
      
      // Generate advantages and disadvantages
      const { advantages, disadvantages } = this.generateTradeFactors(
        originCountry, countryCode, operation, product, countryData
      );
      
      analyses.push({
        countryCode,
        countryName: countryData.name,
        countryNameEn: countryData.nameEn,
        rank: 0, // Will be set after sorting
        score,
        opportunity,
        tradeVolume: this.estimateTradeVolume(countryData.gdp, operation),
        growth: this.estimateGrowthPotential(countryCode, product),
        marketSize: this.formatMarketSize(countryData.gdp),
        competitiveness: this.assessCompetitiveness(countryCode, product),
        treaties,
        tariffRate,
        advantages,
        disadvantages,
        coordinates: countryData.coords
      });
    }
    
    // Sort by score and assign ranks
    analyses.sort((a, b) => b.score - a.score);
    analyses.forEach((analysis, index) => {
      analysis.rank = index + 1;
    });
    
    return analyses.slice(0, 10); // Return top 10
  }
  
  // Generate exhaustive market analysis using AI
  async generateMarketIntelligence(
    targetCountry: string,
    originCountry: string,
    operation: 'import' | 'export',
    product: string
  ): Promise<MarketIntelligenceReport> {
    
    const targetCountryData = SOUTH_AMERICAN_COUNTRIES[targetCountry as keyof typeof SOUTH_AMERICAN_COUNTRIES];
    const originCountryData = SOUTH_AMERICAN_COUNTRIES[originCountry as keyof typeof SOUTH_AMERICAN_COUNTRIES];
    
    if (!targetCountryData || !originCountryData) {
      throw new Error('Country data not found');
    }
    
    const treaties = this.getApplicableTreaties(originCountry, targetCountry);
    const tariffInfo = this.calculateTariffRate(originCountry, targetCountry, product);
    
    const prompt = `
Analyze the ${operation} opportunity for ${product} from ${originCountryData.nameEn} to ${targetCountryData.nameEn}.

Context:
- Origin: ${originCountryData.nameEn} (GDP: $${originCountryData.gdp}B, Pop: ${originCountryData.population.toLocaleString()})
- Target: ${targetCountryData.nameEn} (GDP: $${targetCountryData.gdp}B, Pop: ${targetCountryData.population.toLocaleString()})
- Operation: ${operation}
- Product: ${product}
- Trade Treaties: ${treaties.join(', ') || 'None'}
- Estimated Tariff: ${tariffInfo}

Provide a comprehensive analysis in JSON format with the following structure:
{
  "analysis": "Detailed market analysis (200-300 words)",
  "opportunities": ["List of 4-6 specific opportunities"],
  "challenges": ["List of 4-6 potential challenges"],
  "recommendations": ["List of 4-6 actionable recommendations"],
  "marketTrends": ["List of 3-5 current market trends"],
  "competitiveAnalysis": "Analysis of competition (100-150 words)",
  "riskAssessment": "Risk evaluation (100-150 words)",
  "timeline": "Recommended timeline for market entry",
  "estimatedVolume": "Estimated trade volume potential",
  "estimatedValue": "Estimated monetary value potential"
}

Focus on:
- South American trade dynamics and regional integration
- MERCOSUR, Pacific Alliance, and CAN implications
- Political and economic stability factors
- Infrastructure and logistics considerations
- Currency exchange and financial aspects
- Cultural and business practice differences
- Regulatory and compliance requirements
`;

    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert international trade analyst specializing in South American markets. Provide detailed, actionable insights based on real economic data and trade relationships. Respond only with valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const aiAnalysis = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        country: targetCountryData.nameEn,
        product,
        operation,
        ...aiAnalysis
      };
      
    } catch (error) {
      console.error('AI Analysis failed:', error);
      // Fallback to structured analysis without AI
      return this.generateFallbackAnalysis(targetCountry, originCountry, operation, product);
    }
  }
  
  private calculateTradeScore(
    originCountry: string,
    targetCountry: string,
    operation: 'import' | 'export',
    product: string
  ): number {
    let score = 50; // Base score
    
    const targetData = SOUTH_AMERICAN_COUNTRIES[targetCountry as keyof typeof SOUTH_AMERICAN_COUNTRIES];
    if (!targetData) return score;
    
    // GDP factor (larger economies = higher score)
    score += Math.min(30, targetData.gdp / 10000);
    
    // Population factor (larger markets = higher score)
    score += Math.min(20, targetData.population / 10000000);
    
    // Trade bloc membership bonus
    const commonBlocs = this.getCommonTradeBlocs(originCountry, targetCountry);
    score += commonBlocs.length * 15;
    
    // Geographic proximity bonus (within South America)
    if (SOUTH_AMERICAN_COUNTRIES[originCountry as keyof typeof SOUTH_AMERICAN_COUNTRIES]) {
      score += 10;
    }
    
    // Product specialization bonus
    const productCategory = this.getProductCategory(product);
    if (this.hasProductSpecialization(targetCountry, productCategory)) {
      score += 15;
    }
    
    return Math.min(100, score);
  }
  
  private getApplicableTreaties(originCountry: string, targetCountry: string): string[] {
    const treaties: string[] = [];
    
    // Check trade bloc memberships
    for (const [bloc, members] of Object.entries(TRADE_BLOCS)) {
      if (members.includes(originCountry) && members.includes(targetCountry)) {
        treaties.push(bloc);
      }
    }
    
    // Add bilateral treaties
    if (haveTradeTreaty(originCountry, targetCountry)) {
      treaties.push('Bilateral Agreement');
    }
    
    return treaties;
  }
  
  private calculateTariffRate(originCountry: string, targetCountry: string, product: string): string {
    const baseTariff = 15; // Default tariff rate
    const reduction = getTariffReduction(originCountry, targetCountry);
    const finalRate = Math.max(0, baseTariff - reduction);
    
    return `${finalRate}%`;
  }
  
  private generateTradeFactors(
    originCountry: string,
    targetCountry: string,
    operation: 'import' | 'export',
    product: string,
    targetData: any
  ) {
    const advantages = [
      {
        reason: `PIB de $${targetData.gdp}B indica mercado sólido`,
        reasonEn: `GDP of $${targetData.gdp}B indicates solid market`,
        impact: 'alto'
      },
      {
        reason: `Población de ${targetData.population.toLocaleString()} consumidores`,
        reasonEn: `Population of ${targetData.population.toLocaleString()} consumers`,
        impact: 'medio'
      }
    ];
    
    const disadvantages = [
      {
        reason: 'Fluctuaciones monetarias regionales',
        reasonEn: 'Regional currency fluctuations',
        impact: 'medio'
      }
    ];
    
    // Add trade bloc advantages
    const commonBlocs = this.getCommonTradeBlocs(originCountry, targetCountry);
    if (commonBlocs.length > 0) {
      advantages.push({
        reason: `Miembro de ${commonBlocs.join(', ')} - aranceles reducidos`,
        reasonEn: `Member of ${commonBlocs.join(', ')} - reduced tariffs`,
        impact: 'alto'
      });
    }
    
    return { advantages, disadvantages };
  }
  
  private getCommonTradeBlocs(country1: string, country2: string): string[] {
    const common: string[] = [];
    for (const [bloc, members] of Object.entries(TRADE_BLOCS)) {
      if (members.includes(country1) && members.includes(country2)) {
        common.push(bloc);
      }
    }
    return common;
  }
  
  private getProductCategory(product: string): string {
    for (const [category, codes] of Object.entries(PRODUCT_CATEGORIES)) {
      if (codes.includes(product) || product.toLowerCase().includes(category)) {
        return category;
      }
    }
    return 'general';
  }
  
  private hasProductSpecialization(country: string, category: string): boolean {
    // Define country specializations
    const specializations: Record<string, string[]> = {
      'BR': ['agriculture', 'mining', 'manufacturing'],
      'AR': ['agriculture', 'food_processing'],
      'CL': ['mining', 'agriculture'],
      'CO': ['agriculture', 'energy'],
      'PE': ['mining', 'agriculture'],
      'EC': ['agriculture', 'energy'],
      'VE': ['energy'],
      'BO': ['mining', 'agriculture'],
      'UY': ['agriculture', 'food_processing'],
      'PY': ['agriculture']
    };
    
    return specializations[country]?.includes(category) || false;
  }
  
  private estimateTradeVolume(gdp: number, operation: 'import' | 'export'): string {
    const volume = gdp * (operation === 'export' ? 0.2 : 0.25); // % of GDP in trade
    if (volume > 1000) return `$${(volume/1000).toFixed(1)}B`;
    return `$${volume.toFixed(0)}M`;
  }
  
  private estimateGrowthPotential(country: string, product: string): string {
    // Simplified growth estimation based on country and product
    const growthRates: Record<string, number> = {
      'BR': 3.5, 'AR': 2.8, 'CO': 4.2, 'PE': 3.9, 'CL': 3.1,
      'EC': 2.5, 'BO': 4.0, 'UY': 2.9, 'PY': 3.7, 'VE': 1.5
    };
    
    const baseGrowth = growthRates[country] || 3.0;
    return `${baseGrowth.toFixed(1)}%`;
  }
  
  private formatMarketSize(gdp: number): string {
    if (gdp > 1000) return `$${(gdp/1000).toFixed(1)}T`;
    return `$${gdp.toFixed(0)}B`;
  }
  
  private assessCompetitiveness(country: string, product: string): string {
    const scores: Record<string, number> = {
      'BR': 85, 'AR': 75, 'CO': 70, 'PE': 65, 'CL': 80,
      'EC': 60, 'BO': 55, 'UY': 72, 'PY': 58, 'VE': 45
    };
    
    const score = scores[country] || 60;
    if (score > 80) return 'Alta';
    if (score > 65) return 'Media-Alta';
    if (score > 50) return 'Media';
    return 'Baja';
  }
  
  private generateFallbackAnalysis(
    targetCountry: string,
    originCountry: string,
    operation: 'import' | 'export',
    product: string
  ): MarketIntelligenceReport {
    const targetData = SOUTH_AMERICAN_COUNTRIES[targetCountry as keyof typeof SOUTH_AMERICAN_COUNTRIES];
    
    return {
      country: targetData?.nameEn || targetCountry,
      product,
      operation,
      analysis: `Análisis del mercado ${operation === 'export' ? 'de exportación' : 'de importación'} para ${product} en ${targetData?.nameEn}. Mercado con PIB de $${targetData?.gdp}B y población de ${targetData?.population.toLocaleString()} habitantes.`,
      opportunities: [
        'Mercado regional en crecimiento',
        'Integración comercial sudamericana',
        'Demanda sostenida del producto'
      ],
      challenges: [
        'Fluctuaciones monetarias',
        'Competencia regional',
        'Regulaciones locales'
      ],
      recommendations: [
        'Estudiar regulaciones específicas',
        'Establecer alianzas locales',
        'Considerar financiamiento en moneda local'
      ],
      marketTrends: [
        'Digitalización del comercio',
        'Sostenibilidad ambiental',
        'Integración logística regional'
      ],
      competitiveAnalysis: 'Competencia moderada con oportunidades para diferenciación mediante calidad y servicio.',
      riskAssessment: 'Riesgo medio con factores políticos y económicos a monitorear.',
      timeline: '6-12 meses para entrada al mercado',
      estimatedVolume: this.estimateTradeVolume(targetData?.gdp || 100, operation),
      estimatedValue: `$${((targetData?.gdp || 100) * 0.1).toFixed(0)}M anuales`
    };
  }

  // Add method that uses the generateTop10Analysis with company integration
  async analyzeSouthAmericanMarket(request: {
    originCountry: string;
    operation: 'import' | 'export';
    product: string;
    includeCoordinates?: boolean;
    existingCompanies?: Array<{
      name: string;
      country: string;
      type: string;
      products: string[];
      verified: boolean;
      contactEmail?: string;
      website?: string;
    }>;
  }): Promise<CountryAnalysis[]> {
    return this.generateTop10Analysis(
      request.originCountry,
      request.operation,
      request.product,
      request.existingCompanies
    );
  }
}

export const marketAnalysisService = new MarketAnalysisService();