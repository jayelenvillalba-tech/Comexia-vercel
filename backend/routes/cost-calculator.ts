import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite';
import { hsSubpartidas } from '../../shared/shared/schema-sqlite';
import { eq } from 'drizzle-orm';
import { countries, getCountryTreaties, getTariffReduction } from '../../shared/shared/countries-data';

interface CostCalculationRequest {
  fobValue: number;
  weight: number;
  volume?: number;
  destination: string;
  origin: string;
  transport: 'maritime' | 'air' | 'road';
  hsCode: string;
  incoterm: string;
  urgency: 'standard' | 'express' | 'urgent';
}

interface CostBreakdown {
  fob: number;
  freight: number;
  insurance: number;
  cif: number;
  tariff: number;
  vat: number;
  statistics: number;
  clearance: number;
  portHandling: number;
  documentation: number;
  inspection: number;
  storage: number;
  localTransport: number;
  brokerFees: number;
  bankCharges: number;
  contingency: number;
  total: number;
  perUnit: number;
  costAnalysis: {
    logisticsCosts: number;
    taxesAndDuties: number;
    regulatoryCosts: number;
    serviceFees: number;
  };
  savingsOpportunities?: {
    tradeAgreementSavings: number;
    volumeDiscounts: number;
    alternativeRoutes: number;
  };
}

// Freight rates per kg by transport type
const FREIGHT_RATES = {
  maritime: {
    standard: 0.50,  // USD per kg
    express: 0.75,
    urgent: 1.00
  },
  air: {
    standard: 3.50,
    express: 5.00,
    urgent: 7.50
  },
  road: {
    standard: 1.20,
    express: 1.80,
    urgent: 2.50
  }
};

// Distance multipliers by route (simplified)
const DISTANCE_MULTIPLIERS: { [key: string]: number } = {
  'santos-buenos-aires': 0.8,
  'santos-sao-paulo': 0.5,
  'santos-valparaiso': 1.2,
  'santos-lima': 1.5,
  'buenos-aires-sao-paulo': 0.9,
  'buenos-aires-valparaiso': 1.0,
  'buenos-aires-hamburg': 2.5,
  'buenos-aires-los-angeles': 2.8,
  'montevideo-buenos-aires': 0.6,
  'valparaiso-lima': 0.9,
  'default': 1.0
};

export async function calculateCosts(req: Request, res: Response) {
  try {
    const {
      fobValue,
      weight,
      volume = 0,
      destination,
      origin,
      transport,
      hsCode,
      incoterm,
      urgency
    } = req.body as CostCalculationRequest;

    // Validate required fields
    if (!fobValue || !weight || !destination || !origin || !hsCode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fobValue, weight, destination, origin, hsCode'
      });
    }

    // Get HS code data for tariff information
    const hsCodeData = await db.query.hsSubpartidas.findFirst({
      where: eq(hsSubpartidas.code, hsCode)
    });

    if (!hsCodeData) {
      return res.status(404).json({
        success: false,
        error: `HS code ${hsCode} not found`
      });
    }

    // Get destination country code
    const destinationCountry = getCountryCodeFromPort(destination);
    const originCountryCode = getCountryCodeFromPort(origin);

    // Calculate base tariff rate
    let baseTariffRate = hsCodeData.tariffRate || 10; // Default 10% if not specified

    // Check for trade agreement reductions
    const destinationCountryData = countries.find(c => c.code === destinationCountry);
    const originCountryData = countries.find(c => c.code === originCountryCode);
    
    let tariffReduction = 0;
    let tradeAgreementSavings = 0;

    if (destinationCountryData && originCountryData) {
      const treaties = getCountryTreaties(destinationCountry);
      tariffReduction = getTariffReduction(hsCode, destinationCountry, treaties);
      
      // Calculate savings from trade agreements
      const originalTariff = fobValue * (baseTariffRate / 100);
      const reducedTariff = fobValue * ((baseTariffRate - tariffReduction) / 100);
      tradeAgreementSavings = originalTariff - reducedTariff;
    }

    // Apply tariff reduction
    const effectiveTariffRate = Math.max(0, baseTariffRate - tariffReduction);

    // Calculate distance multiplier
    const routeKey = `${origin}-${destination}`;
    const distanceMultiplier = DISTANCE_MULTIPLIERS[routeKey] || DISTANCE_MULTIPLIERS['default'];

    // 1. FOB Value (base value)
    const fob = fobValue;

    // 2. Freight (based on weight, transport type, urgency, and distance)
    const baseFreightRate = FREIGHT_RATES[transport][urgency];
    const freight = weight * baseFreightRate * distanceMultiplier;

    // 3. Insurance (0.5% of FOB + Freight)
    const insurance = (fob + freight) * 0.005;

    // 4. CIF Value (Cost, Insurance, Freight)
    const cif = fob + freight + insurance;

    // 5. Import Tariff (based on CIF and effective tariff rate)
    const tariff = cif * (effectiveTariffRate / 100);

    // 6. VAT (21% on CIF + Tariff) - Argentina standard
    const vat = (cif + tariff) * 0.21;

    // 7. Statistical Tax (3% on CIF)
    const statistics = cif * 0.03;

    // 8. Customs Clearance (fixed fee + percentage)
    const clearance = 200 + (cif * 0.005);

    // 9. Port Handling (based on weight and volume)
    const portHandling = Math.max(weight * 0.15, volume * 50);

    // 10. Documentation fees
    const documentation = 150;

    // 11. Inspection fees (if applicable)
    const inspection = hsCodeData.restrictions && hsCodeData.restrictions.length > 0 ? 300 : 0;

    // 12. Storage (based on urgency)
    const storageDays = urgency === 'urgent' ? 2 : urgency === 'express' ? 5 : 10;
    const storage = storageDays * 25;

    // 13. Local transport (from port to warehouse)
    const localTransport = 250 + (weight * 0.08);

    // 14. Broker fees
    const brokerFees = cif * 0.015;

    // 15. Bank charges
    const bankCharges = 100;

    // 16. Contingency (2% of total costs so far)
    const subtotal = fob + freight + insurance + tariff + vat + statistics + 
                     clearance + portHandling + documentation + inspection + 
                     storage + localTransport + brokerFees + bankCharges;
    const contingency = subtotal * 0.02;

    // Total cost
    const total = subtotal + contingency;

    // Per unit cost
    const perUnit = total / weight;

    // Cost analysis breakdown
    const logisticsCosts = freight + portHandling + storage + localTransport;
    const taxesAndDuties = tariff + vat + statistics;
    const regulatoryCosts = clearance + documentation + inspection;
    const serviceFees = brokerFees + bankCharges + contingency;

    // Calculate additional savings opportunities
    const volumeDiscounts = weight > 1000 ? freight * 0.15 : 0; // 15% discount for >1 ton
    const alternativeRoutes = freight * 0.10; // Estimated 10% savings with alternative route

    const breakdown: CostBreakdown = {
      fob,
      freight,
      insurance,
      cif,
      tariff,
      vat,
      statistics,
      clearance,
      portHandling,
      documentation,
      inspection,
      storage,
      localTransport,
      brokerFees,
      bankCharges,
      contingency,
      total,
      perUnit,
      costAnalysis: {
        logisticsCosts,
        taxesAndDuties,
        regulatoryCosts,
        serviceFees
      },
      savingsOpportunities: {
        tradeAgreementSavings,
        volumeDiscounts,
        alternativeRoutes
      }
    };

    res.json({
      success: true,
      breakdown,
      metadata: {
        hsCode,
        hsCodeDescription: hsCodeData.description,
        origin,
        destination,
        transport,
        urgency,
        baseTariffRate,
        effectiveTariffRate,
        tariffReduction,
        treaties: destinationCountryData?.treaties || []
      }
    });

  } catch (error: any) {
    console.error('Cost calculation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate costs',
      details: error.message
    });
  }
}

// Helper function to extract country code from port name
function getCountryCodeFromPort(port: string): string {
  const portCountryMap: { [key: string]: string } = {
    'buenos-aires': 'AR',
    'sao-paulo': 'BR',
    'santos': 'BR',
    'valparaiso': 'CL',
    'lima': 'PE',
    'montevideo': 'UY',
    'hamburg': 'DE',
    'los-angeles': 'US',
    'rotterdam': 'NL'
  };

  return portCountryMap[port] || 'AR'; // Default to Argentina
}
