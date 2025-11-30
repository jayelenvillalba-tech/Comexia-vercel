import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../database/db';
import { companies, hsSubpartidas, hsPartidas, hsChapters, hsSections } from '../shared/shared/schema-sqlite';
import { eq, like, or, and, sql, desc } from 'drizzle-orm';
import { countries, getCountryTreaties, getTariffReduction } from '../shared/shared/countries-data';
import { getCountryCoordinates } from '../shared/shared/continental-coordinates';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ========== API Routes ==========

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const hsCodesCount = await db.select({ count: sql<number>`count(*)` }).from(hsSubpartidas);
    const companiesCount = await db.select({ count: sql<number>`count(*)` }).from(companies);
    
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        hsCodes: hsCodesCount[0].count,
        companies: companiesCount[0].count,
        countries: countries.length
      }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ========== HS Codes API ==========

// Search HS codes
app.get('/api/hs-codes/search', async (req, res) => {
  try {
    const query = req.query.q as string || '';
    const section = req.query.section as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    let conditions = [];
    if (query) {
        const searchPattern = `%${query}%`;
        conditions.push(or(
            like(hsSubpartidas.code, searchPattern),
            like(hsSubpartidas.description, searchPattern),
            like(hsSubpartidas.descriptionEn, searchPattern)
        ));
    }
    
    // Note: Filtering by section would require joining with chapters and sections, 
    // which is a bit more complex. For now, we'll focus on text search.
    // If section is needed, we'd need to fetch chapter codes for that section first.

    const results = await db.select()
        .from(hsSubpartidas)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);
    
    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(hsSubpartidas)
        .where(and(...conditions));

    res.json({
      success: true,
      total: totalResult[0].count,
      limit,
      offset,
      results
    });
  } catch (error: any) {
    console.error('Error searching HS codes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error searching HS codes',
      details: error.message
    });
  }
});

// Get HS code by code
app.get('/api/hs-codes/:code', async (req, res) => {
  try {
    const code = req.params.code;
    
    // Try subpartidas first (6 digits)
    let hsCode = await db.query.hsSubpartidas.findFirst({
        where: eq(hsSubpartidas.code, code)
    });

    // If not found, try partidas (4 digits)
    if (!hsCode) {
        const partida = await db.query.hsPartidas.findFirst({
            where: eq(hsPartidas.code, code)
        });
        if (partida) {
             // Map to similar structure
             hsCode = {
                 ...partida,
                 partidaCode: '',
                 specialTariffRate: null,
                 restrictions: null,
                 isActive: true
             } as any;
        }
    }

    if (!hsCode) {
      return res.status(404).json({
        success: false,
        error: 'HS code not found'
      });
    }

    // Fetch parent chapter to get section (if needed for frontend compatibility)
    // For now returning as is
    
    // Compatibility mapping
    const responseData = {
        ...hsCode,
        baseTariff: hsCode.tariffRate || 0,
        section: '', // TODO: Fetch from chapter -> section
        specializations: [] // TODO: Add specializations table or column
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error: any) {
    console.error('Error getting HS code:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error getting HS code',
      details: error.message
    });
  }
});

// ========== Country Recommendations API ==========

app.get('/api/country-recommendations', async (req, res) => {
  try {
    const hsCode = req.query.hsCode as string;
    const operation = req.query.operation as string || 'export';
    const originCountry = req.query.originCountry as string;

    if (!hsCode) {
      return res.status(400).json({
        success: false,
        error: 'hsCode parameter is required'
      });
    }

    // Get HS code details from DB
    const hsCodeData = await db.query.hsSubpartidas.findFirst({
        where: eq(hsSubpartidas.code, hsCode)
    });

    if (!hsCodeData) {
      return res.status(404).json({
        success: false,
        error: 'HS code not found'
      });
    }

    // Get origin country data
    const originCountryData = originCountry ? countries.find(c => c.code === originCountry) : null;

    // Calculate recommendations for each country
    // Note: This logic is still largely based on static data for treaties/distance
    // but uses DB for HS code info and potentially company counts
    
    const recommendations = await Promise.all(countries
      .filter(country => country.code !== originCountry)
      .map(async country => {
        // Calculate score components
        let treatyScore = 0;
        let distanceScore = 0;
        let specializationScore = 0;
        let volumeScore = 50;

        // 1. Treaty benefits
        if (originCountryData) {
          const sharedTreaties = country.treaties.filter(t => 
            originCountryData.treaties.includes(t)
          );
          
          if (sharedTreaties.length > 0) {
            if (sharedTreaties.some(t => ['mercosur', 'eu', 'usmca'].includes(t.toLowerCase()))) {
              treatyScore = 95;
            } else if (sharedTreaties.some(t => ['cptpp', 'rcep', 'asean'].includes(t.toLowerCase()))) {
              treatyScore = 75;
            } else {
              treatyScore = 50;
            }
          } else {
            treatyScore = 20;
          }
        } else {
          treatyScore = 50;
        }

        // 2. Geographic distance
        if (originCountryData) {
          const originCoords = getCountryCoordinates(originCountry);
          const targetCoords = getCountryCoordinates(country.code);
          
          if (originCoords && targetCoords) {
            const distance = Math.sqrt(
              Math.pow(originCoords[0] - targetCoords[0], 2) +
              Math.pow(originCoords[1] - targetCoords[1], 2)
            );
            distanceScore = Math.max(0, 100 - (distance * 0.5));
          } else {
            distanceScore = 50;
          }
        } else {
          distanceScore = 50;
        }

        // 3. Specialization (Placeholder as we don't have this in DB yet)
        specializationScore = 50;

        // 4. Trade volume - check companies in DB
        const companyCount = await db.select({ count: sql<number>`count(*)` })
            .from(companies)
            .where(and(
                eq(companies.country, country.code),
                like(companies.products, `%${hsCode}%`)
            ));
        
        const hasCompanies = companyCount[0].count > 0;
        volumeScore = hasCompanies ? 80 : 40;

        const finalScore = (
          treatyScore * 0.4 +
          distanceScore * 0.2 +
          specializationScore * 0.3 +
          volumeScore * 0.1
        );

        let opportunity: 'high' | 'medium' | 'low';
        if (finalScore >= 70) opportunity = 'high';
        else if (finalScore >= 45) opportunity = 'medium';
        else opportunity = 'low';

        const coordinates = getCountryCoordinates(country.code) || [0, 0];

        const treatyBenefits = originCountryData 
          ? getCountryTreaties(country.code)
              .filter(treaty => originCountryData.treaties.includes(treaty.id))
              .map(treaty => `${treaty.name}: ${treaty.tariffReduction}% reducción arancelaria`)
          : [];

        const baseTariff = hsCodeData.tariffRate || 0;
        const tariffReduction = originCountryData ? getTariffReduction(country.code, hsCode) : 0;
        const effectiveTariff = Math.max(0, baseTariff - (baseTariff * tariffReduction / 100));

        return {
          countryCode: country.code,
          countryName: country.name,
          countryNameEn: country.nameEn,
          score: Math.round(finalScore),
          opportunity,
          coordinates: coordinates as [number, number],
          treatyBenefits,
          baseTariff,
          effectiveTariff: Math.round(effectiveTariff * 10) / 10,
          tariffSavings: Math.round((baseTariff - effectiveTariff) * 10) / 10,
          specialization: false, // TODO
          companyCount: companyCount[0].count,
          advantages: [
            ...(treatyBenefits.length > 0 ? [{
              reason: `Miembro de ${treatyBenefits.length} tratado(s) comercial(es)`,
              reasonEn: `Member of ${treatyBenefits.length} trade agreement(s)`,
              impact: 'high'
            }] : [])
          ],
          restrictions: country.restrictions || []
        };
      }));

    const sortedRecommendations = recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    res.json({
      success: true,
      hsCode,
      operation,
      originCountry: originCountry || null,
      total: sortedRecommendations.length,
      recommended: sortedRecommendations
    });
  } catch (error: any) {
    console.error('Error generating country recommendations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error generating country recommendations',
      details: error.message
    });
  }
});

// ========== Companies API ==========

app.get('/api/companies', async (req, res) => {
  try {
    const country = req.query.country as string;
    const type = req.query.type as 'importer' | 'exporter' | 'both';
    const search = req.query.search as string; // Can be HS code or company name
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    let conditions = [];
    
    if (country) {
        conditions.push(eq(companies.country, country));
    }
    
    if (type && type !== 'both') {
        conditions.push(eq(companies.type, type));
    }
    
    if (search) {
        conditions.push(or(
            like(companies.name, `%${search}%`),
            like(companies.products, `%${search}%`)
        ));
    }

    const results = await db.select()
        .from(companies)
        .where(and(...conditions))
        .limit(limit)
        .offset(offset);

    const totalResult = await db.select({ count: sql<number>`count(*)` })
        .from(companies)
        .where(and(...conditions));

    res.json({
      success: true,
      total: totalResult[0].count,
      limit,
      offset,
      source: 'database',
      companies: results
    });
  } catch (error: any) {
    console.error('Error searching companies:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error searching companies',
      details: error.message
    });
  }
});

// Get company by ID
app.get('/api/companies/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const company = await db.query.companies.findFirst({
        where: eq(companies.id, id)
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error: any) {
    console.error('Error getting company:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error getting company',
      details: error.message
    });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 ComexIA Server running on http://localhost:${PORT}`);
  console.log(`📁 SQLite Database connected`);
});
