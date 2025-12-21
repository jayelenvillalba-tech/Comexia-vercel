import { Request, Response } from 'express';
import { db } from '../../database/db-sqlite.js';
import { countryBaseRequirements, hsSubpartidas, marketData } from '../../shared/shared/schema-sqlite.js';
import { sql } from 'drizzle-orm';

export async function getCoverageStats(req: Request, res: Response) {
  try {
    // 1. Count Countries
    const countriesResult = await db.select({ count: sql<number>`count(*)` }).from(countryBaseRequirements);
    const totalCountries = countriesResult[0].count;

    // 2. Count HS Codes
    const hsCodesResult = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    const totalHsCodes = hsCodesResult[0].count;

    // 3. Count Market Data Points (Comtrade Cache)
    const marketDataResult = await db.select({ count: sql<number>`count(*)` }).from(marketData);
    const dataPoints = marketDataResult[0].count;

    // 4. Get recent additions (mock for now, or query by createdAt if available)
    
    res.json({
        success: true,
        stats: {
            countries: totalCountries,
            hsCodes: totalHsCodes,
            dataPoints,
            lastUpdate: new Date().toISOString()
        }
    });

  } catch (error: any) {
    console.error('Error fetching coverage stats:', error);
    res.status(500).json({ error: error.message });
  }
}
