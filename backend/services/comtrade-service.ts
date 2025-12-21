import { db } from '../../database/db-sqlite.js';
import { marketData } from '../../shared/shared/schema-sqlite.js';
import { eq, and, desc } from 'drizzle-orm';
import { getM49Code } from '../../shared/shared/iso-m49-map.js';

interface ComtradeResponse {
  data: Array<{
    primaryValue: number; // Trade Value (USD)
    netWgt: number; // Net Weight (kg)
    cmdCode: string; // HS Code
    reporterCode: number; // M49 Reporter
    partnerCode: number; // M49 Partner
    period: number; // Year
  }>;
}

export class ComtradeService {
  private static BASE_URL = 'https://comtradeapi.un.org/data/v1/get/C/A/HS';
  // Note: Without a subscription key, we are rate limited (1 req/sec, few reqs/day).
  // Ideally, we would add 'Ocp-Apim-Subscription-Key': process.env.COMTRADE_KEY here.
  
  static async getImportData(hsCode: string, countryIso: string): Promise<MarketDataResult> {
    const m49Country = getM49Code(countryIso);
    if (!m49Country) {
        console.warn(`[Comtrade] M49 code not found for ${countryIso}, returning estimate.`);
        return this.getEstimate(hsCode, countryIso);
    }

    // 1. Check Cache
    const cached = await this.getFromCache(hsCode, countryIso);
    if (cached) {
      console.log(`[Comtrade] Cache HIT for ${hsCode}->${countryIso}`);
      return cached;
    }

    // 2. Fetch from API
    console.log(`[Comtrade] Fetching API for ${hsCode}->${countryIso} (M49: ${m49Country})`);
    try {
      // Fetch imports (flowCode=M) for the most recent available year (e.g. 2023)
      // reporterCode = country we are analyzing (Importing country)
      // partnerCode = 0 (World)
      const year = new Date().getFullYear() - 1; // Last year
      const url = `${this.BASE_URL}?reporterCode=${m49Country}&period=${year}&partnerCode=0&cmdCode=${hsCode}&flowCode=M`;
      
      const response = await fetch(url, {
          headers: {
              'User-Agent': 'ComexIA-Agent/1.0'
          }
      });
      
      if (!response.ok) {
         if (response.status === 429) console.warn('[Comtrade] Rate limit exceeded');
         throw new Error(`API Error ${response.status}`);
      }

      const json = await response.json() as ComtradeResponse;
      
      if (json.data && json.data.length > 0) {
        const record = json.data[0];
        const result: MarketDataResult = {
            volume: record.netWgt || 0,
            valueUsd: record.primaryValue || 0,
            year: record.period,
            source: 'UN Comtrade'
        };

        // 3. Save to Cache
        await this.saveToCache(hsCode, countryIso, result);
        return result;

      } else {
        console.log('[Comtrade] No data found in API');
        return this.getEstimate(hsCode, countryIso);
      }

    } catch (error) {
      console.error('[Comtrade] Failed to fetch:', error);
      return this.getEstimate(hsCode, countryIso);
    }
  }

  private static async getFromCache(hsCode: string, countryIso: string): Promise<MarketDataResult | null> {
    const results = await db.select()
      .from(marketData)
      .where(and(
        eq(marketData.hsCode, hsCode),
        eq(marketData.destinationCountry, countryIso), // Assuming analysis is for importing country
        eq(marketData.originCountry, 'World') // Partner = World
      ))
      .orderBy(desc(marketData.year))
      .limit(1);

    if (results.length > 0) {
      return {
        volume: results[0].volume || 0,
        valueUsd: results[0].valueUsd || 0,
        year: results[0].year,
        source: 'Cache (UN Comtrade)'
      };
    }
    return null;
  }

  private static async saveToCache(hsCode: string, countryIso: string, data: MarketDataResult) {
    try {
        await db.insert(marketData).values({
            hsCode,
            destinationCountry: countryIso,
            originCountry: 'World', // 0 -> World
            year: data.year,
            volume: data.volume,
            valueUsd: data.valueUsd,
            avgPriceUsd: data.volume > 0 ? data.valueUsd / data.volume : 0,
            activeCompanies: 0 // Not provided by Comtrade
        });
    } catch (e) {
        console.error('[Comtrade] Failed to cache:', e);
    }
  }

  private static getEstimate(hsCode: string, countryIso: string): MarketDataResult {
    // Fallback logic (previously calculateMarketSize)
    const baseSize = {
        'AR': 450000000, 'BR': 1800000000, 'CL': 280000000, 'PE': 220000000, 'UY': 60000000,
        'DE': 3800000000, 'US': 21000000000, 'CN': 14000000000, 'JP': 5000000000
    }[countryIso] || 100000000;
  
    const chapter = hsCode.substring(0, 2);
    const categoryMultiplier = {
        '01': 0.5, '02': 0.8, '09': 1.2, '10': 1.5, '15': 1.3,
        '84': 2.0, '85': 2.5, '87': 1.8
    }[chapter] || 1.0;

    const estimatedValue = Math.round(baseSize * categoryMultiplier / 1000); // Scale down

    return {
        volume: Math.round(estimatedValue / 5), // Rough price $5/kg assumption
        valueUsd: estimatedValue,
        year: 2024,
        source: 'Estimate (Fallback)'
    };
  }
}

export interface MarketDataResult {
  volume: number;
  valueUsd: number;
  year: number;
  source: string;
}
