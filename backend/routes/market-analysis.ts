import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite';
import { hsSubpartidas, companies } from '../../shared/shared/schema-sqlite';
import { eq, like, and, sql } from 'drizzle-orm';
import { countries, getCountryTreaties } from '../../shared/shared/countries-data';

interface MarketAnalysisRequest {
  hsCode: string;
  country: string;
  operation: 'import' | 'export';
}

interface MarketAnalysis {
  country: string;
  countryName: string;
  hsCode: string;
  productName: string;
  operation: string;
  
  // Market Size
  marketSize: {
    estimated: number; // USD millions
    trend: 'growing' | 'stable' | 'declining';
    growthRate: number; // percentage
    confidence: 'high' | 'medium' | 'low';
  };
  
  // Competition Analysis
  competition: {
    level: 'high' | 'medium' | 'low';
    activeCompanies: number;
    topCompetitors: Array<{
      name: string;
      marketShare: number;
      type: string;
    }>;
    entryBarrier: 'high' | 'medium' | 'low';
  };
  
  // Trade Dynamics
  tradeDynamics: {
    mainSuppliers: string[];
    mainBuyers: string[];
    tradeBalance: 'surplus' | 'deficit' | 'balanced';
    seasonality: string;
  };
  
  // Regulatory Environment
  regulatory: {
    complexity: 'high' | 'medium' | 'low';
    tariffRate: number;
    effectiveTariffRate: number;
    treaties: string[];
    restrictions: string[];
    certifications: string[];
  };
  
  // Opportunities & Risks
  opportunities: Array<{
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  
  risks: Array<{
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  
  // Recommendations
  recommendations: Array<{
    action: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
  }>;
  
  // Overall Score
  overallScore: number; // 0-100
  viability: 'excellent' | 'good' | 'moderate' | 'challenging';
}

export async function analyzeMarket(req: Request, res: Response) {
  try {
    const { hsCode, country, operation } = req.query as unknown as MarketAnalysisRequest;

    if (!hsCode || !country || !operation) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: hsCode, country, operation'
      });
    }

    // Get HS code data
    const hsCodeData = await db.query.hsSubpartidas.findFirst({
      where: eq(hsSubpartidas.code, hsCode)
    });

    if (!hsCodeData) {
      return res.status(404).json({
        success: false,
        error: `HS code ${hsCode} not found`
      });
    }

    // Get country data
    const countryData = countries.find(c => c.code === country);
    if (!countryData) {
      return res.status(404).json({
        success: false,
        error: `Country ${country} not found`
      });
    }

    // Get companies in this country for this product
    const companiesInMarket = await db.select()
      .from(companies)
      .where(and(
        eq(companies.country, country),
        like(companies.products, `%${hsCode}%`)
      ));

    // Calculate market size (simplified estimation)
    const baseMarketSize = calculateMarketSize(hsCode, country, countryData);
    const growthRate = calculateGrowthRate(hsCode, country);
    const trend = growthRate > 3 ? 'growing' : growthRate < -2 ? 'declining' : 'stable';

    // Competition analysis
    const competitionLevel = companiesInMarket.length > 10 ? 'high' : 
                            companiesInMarket.length > 3 ? 'medium' : 'low';
    
    const topCompetitors = companiesInMarket
      .slice(0, 5)
      .map((company, index) => ({
        name: company.name,
        marketShare: Math.round((100 / companiesInMarket.length) * (5 - index)),
        type: company.type
      }));

    const entryBarrier = calculateEntryBarrier(competitionLevel, hsCodeData, countryData);

    // Regulatory analysis
    const treaties = getCountryTreaties(country);
    const baseTariff = hsCodeData.tariffRate || 10;
    const tariffReduction = treaties.reduce((acc, treaty) => acc + (treaty.tariffReduction || 0), 0) / Math.max(treaties.length, 1);
    const effectiveTariff = Math.max(0, baseTariff - tariffReduction);

    // Trade dynamics
    const tradeDynamics = analyzeTradeDynamics(hsCode, country, operation);

    // Opportunities
    const opportunities = identifyOpportunities(
      hsCodeData,
      countryData,
      treaties,
      competitionLevel,
      trend
    );

    // Risks
    const risks = identifyRisks(
      hsCodeData,
      countryData,
      competitionLevel,
      effectiveTariff
    );

    // Recommendations
    const recommendations = generateRecommendations(
      opportunities,
      risks,
      competitionLevel,
      entryBarrier
    );

    // Calculate overall score
    const overallScore = calculateOverallScore(
      trend,
      competitionLevel,
      entryBarrier,
      effectiveTariff,
      treaties.length
    );

    const viability = overallScore >= 75 ? 'excellent' :
                     overallScore >= 60 ? 'good' :
                     overallScore >= 40 ? 'moderate' : 'challenging';

    const analysis: MarketAnalysis = {
      country,
      countryName: countryData.name,
      hsCode,
      productName: hsCodeData.description,
      operation,
      marketSize: {
        estimated: baseMarketSize,
        trend,
        growthRate,
        confidence: companiesInMarket.length > 5 ? 'high' : companiesInMarket.length > 2 ? 'medium' : 'low'
      },
      competition: {
        level: competitionLevel,
        activeCompanies: companiesInMarket.length,
        topCompetitors,
        entryBarrier
      },
      tradeDynamics,
      regulatory: {
        complexity: hsCodeData.restrictions && hsCodeData.restrictions.length > 2 ? 'high' : 
                   hsCodeData.restrictions && hsCodeData.restrictions.length > 0 ? 'medium' : 'low',
        tariffRate: baseTariff,
        effectiveTariffRate: effectiveTariff,
        treaties: treaties.map(t => t.name),
        restrictions: hsCodeData.restrictions || [],
        certifications: determineCertifications(hsCode)
      },
      opportunities,
      risks,
      recommendations,
      overallScore,
      viability
    };

    res.json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('Market analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze market',
      details: error.message
    });
  }
}

// Helper functions

function calculateMarketSize(hsCode: string, country: string, countryData: any): number {
  // Simplified market size estimation based on country GDP and product category
  const baseSize = {
    'AR': 450, 'BR': 1800, 'CL': 280, 'PE': 220, 'UY': 60,
    'DE': 3800, 'US': 21000, 'CN': 14000, 'JP': 5000
  }[country] || 100;

  // Adjust by product category (first 2 digits of HS code)
  const chapter = hsCode.substring(0, 2);
  const categoryMultiplier = {
    '01': 0.5, '02': 0.8, '09': 1.2, '10': 1.5, '15': 1.3,
    '84': 2.0, '85': 2.5, '87': 1.8
  }[chapter] || 1.0;

  return Math.round(baseSize * categoryMultiplier);
}

function calculateGrowthRate(hsCode: string, country: string): number {
  // Simplified growth rate estimation
  const chapter = hsCode.substring(0, 2);
  const techProducts = ['84', '85', '90'];
  const agriProducts = ['01', '02', '03', '04', '09', '10'];
  
  if (techProducts.includes(chapter)) return 5.5;
  if (agriProducts.includes(chapter)) return 3.2;
  return 2.8;
}

function calculateEntryBarrier(competition: string, hsCodeData: any, countryData: any): 'high' | 'medium' | 'low' {
  let barrierScore = 0;
  
  if (competition === 'high') barrierScore += 3;
  else if (competition === 'medium') barrierScore += 2;
  else barrierScore += 1;
  
  if (hsCodeData.restrictions && hsCodeData.restrictions.length > 2) barrierScore += 2;
  if (countryData.easeOfDoingBusiness && countryData.easeOfDoingBusiness < 50) barrierScore += 2;
  
  return barrierScore >= 5 ? 'high' : barrierScore >= 3 ? 'medium' : 'low';
}

function analyzeTradeDynamics(hsCode: string, country: string, operation: string) {
  const chapter = hsCode.substring(0, 2);
  const agriProducts = ['01', '02', '03', '04', '09', '10'];
  
  return {
    mainSuppliers: ['Brasil', 'Argentina', 'Uruguay'],
    mainBuyers: ['China', 'Estados Unidos', 'Unión Europea'],
    tradeBalance: operation === 'export' ? 'surplus' : 'deficit' as 'surplus' | 'deficit' | 'balanced',
    seasonality: agriProducts.includes(chapter) ? 'Alta estacionalidad (cosecha)' : 'Baja estacionalidad'
  };
}

function identifyOpportunities(hsCodeData: any, countryData: any, treaties: any[], competition: string, trend: string) {
  const opportunities = [];

  if (treaties.length > 0) {
    opportunities.push({
      title: 'Preferencias Arancelarias',
      description: `Acceso a ${treaties.length} tratado(s) comercial(es) con reducción de aranceles`,
      impact: 'high' as 'high' | 'medium' | 'low'
    });
  }

  if (competition === 'low') {
    opportunities.push({
      title: 'Mercado Poco Saturado',
      description: 'Baja competencia permite establecer presencia con mayor facilidad',
      impact: 'high' as 'high' | 'medium' | 'low'
    });
  }

  if (trend === 'growing') {
    opportunities.push({
      title: 'Mercado en Crecimiento',
      description: 'Demanda creciente ofrece oportunidades de expansión',
      impact: 'high' as 'high' | 'medium' | 'low'
    });
  }

  opportunities.push({
    title: 'Proximidad Geográfica',
    description: 'Costos logísticos reducidos por cercanía regional',
    impact: 'medium' as 'high' | 'medium' | 'low'
  });

  return opportunities;
}

function identifyRisks(hsCodeData: any, countryData: any, competition: string, tariff: number) {
  const risks = [];

  if (competition === 'high') {
    risks.push({
      title: 'Alta Competencia',
      description: 'Mercado saturado requiere diferenciación clara',
      severity: 'high' as 'high' | 'medium' | 'low'
    });
  }

  if (tariff > 10) {
    risks.push({
      title: 'Aranceles Elevados',
      description: `Arancel efectivo de ${tariff}% impacta competitividad`,
      severity: 'medium' as 'high' | 'medium' | 'low'
    });
  }

  if (hsCodeData.restrictions && hsCodeData.restrictions.length > 0) {
    risks.push({
      title: 'Restricciones Regulatorias',
      description: 'Cumplimiento de normativas específicas requerido',
      severity: 'medium' as 'high' | 'medium' | 'low'
    });
  }

  risks.push({
    title: 'Volatilidad Cambiaria',
    description: 'Fluctuaciones de tipo de cambio pueden afectar márgenes',
    severity: 'low' as 'high' | 'medium' | 'low'
  });

  return risks;
}

function generateRecommendations(opportunities: any[], risks: any[], competition: string, entryBarrier: string) {
  const recommendations = [];

  if (opportunities.some(o => o.title.includes('Arancelarias'))) {
    recommendations.push({
      action: 'Obtener certificado de origen para aprovechar preferencias arancelarias',
      priority: 'high' as 'high' | 'medium' | 'low',
      timeframe: '1-2 meses'
    });
  }

  if (competition === 'high') {
    recommendations.push({
      action: 'Desarrollar propuesta de valor diferenciada (calidad, servicio, precio)',
      priority: 'high' as 'high' | 'medium' | 'low',
      timeframe: '2-3 meses'
    });
  }

  if (entryBarrier === 'low') {
    recommendations.push({
      action: 'Iniciar con pedido piloto para validar mercado',
      priority: 'high' as 'high' | 'medium' | 'low',
      timeframe: 'Inmediato'
    });
  } else {
    recommendations.push({
      action: 'Establecer alianza estratégica con distribuidor local',
      priority: 'high' as 'high' | 'medium' | 'low',
      timeframe: '3-6 meses'
    });
  }

  recommendations.push({
    action: 'Realizar estudio de mercado detallado con datos locales',
    priority: 'medium' as 'high' | 'medium' | 'low',
    timeframe: '1-2 meses'
  });

  return recommendations;
}

function calculateOverallScore(trend: string, competition: string, entryBarrier: string, tariff: number, treatyCount: number): number {
  let score = 50; // Base score

  // Trend impact
  if (trend === 'growing') score += 15;
  else if (trend === 'declining') score -= 15;

  // Competition impact
  if (competition === 'low') score += 15;
  else if (competition === 'high') score -= 10;

  // Entry barrier impact
  if (entryBarrier === 'low') score += 10;
  else if (entryBarrier === 'high') score -= 15;

  // Tariff impact
  score -= tariff * 0.5;

  // Treaty impact
  score += treatyCount * 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}

function determineCertifications(hsCode: string): string[] {
  const chapter = hsCode.substring(0, 2);
  const certifications = [];

  if (['01', '02', '03', '04'].includes(chapter)) {
    certifications.push('Certificado Sanitario', 'SENASA');
  }
  if (['09', '10'].includes(chapter)) {
    certifications.push('Certificado Fitosanitario');
  }
  if (['84', '85'].includes(chapter)) {
    certifications.push('CE Marking', 'Certificado de Conformidad');
  }

  certifications.push('Certificado de Origen');

  return certifications;
}
