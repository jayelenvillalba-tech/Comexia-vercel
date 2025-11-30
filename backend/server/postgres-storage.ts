import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  companies, 
  marketData, 
  shipments, 
  customsProcedures,
  hsSections,
  hsChapters,
  hsPartidas,
  hsSubpartidas,
  countryOpportunities,
  countryRequirements,
  tradeAlerts,
  tradeOpportunities,
  marketIntelligence
} from "@shared/schema";
import { 
  type Company, 
  type MarketData, 
  type Shipment, 
  type CustomsProcedure,
  type HsSection,
  type HsChapter,
  type HsPartida,
  type HsSubpartida,
  type CountryOpportunity,
  type CountryRequirement,
  type TradeAlert,
  type TradeOpportunity,
  type MarketIntelligence,
  type InsertCompany,
  type InsertShipment,
  type InsertTradeAlert,
  type InsertTradeOpportunity,
  type InsertMarketIntelligence
} from "@shared/schema";
import { type IStorage } from "./storage";
import { eq, ilike, and, or } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const connection = neon(process.env.DATABASE_URL);
const db = drizzle(connection);

export class PostgresStorage implements IStorage {
  
  // HS Code methods
  async getHsSections(): Promise<HsSection[]> {
    return await db.select().from(hsSections).orderBy(hsSections.number);
  }

  async getHsChapters(sectionCode?: string): Promise<HsChapter[]> {
    if (sectionCode) {
      return await db.select().from(hsChapters).where(eq(hsChapters.sectionCode, sectionCode));
    }
    return await db.select().from(hsChapters).orderBy(hsChapters.code);
  }

  async getHsPartidas(chapterCode: string): Promise<HsPartida[]> {
    return await db.select().from(hsPartidas).where(eq(hsPartidas.chapterCode, chapterCode));
  }

  async getHsSubpartidas(partidaCode: string): Promise<HsSubpartida[]> {
    return await db.select().from(hsSubpartidas).where(eq(hsSubpartidas.partidaCode, partidaCode));
  }

  async searchHsItems(query: string, country?: string, operation?: string): Promise<{sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]}> {
    const lowerQuery = query.toLowerCase();
    
    // Enhanced continental-based synonyms using global business intelligence (same as MemStorage)
    const synonymMap: Record<string, string[]> = {
      'electronics': ['eléctrico', 'electrónico', 'electrical', 'electronic', 'aparatos', 'máquinas', 'equipment', '8523', '8471', '8517'],
      'smartphone': ['teléfono', 'telefono', 'móvil', 'movil', 'celular', 'phone', 'cellular', 'mobile', '8517'],
      'phone': ['teléfono', 'telefono', 'móvil', 'movil', 'celular', 'smartphone', 'cellular', 'mobile', '8517'],
      'computer': ['computadora', 'ordenador', 'informática', 'informacion', 'laptop', 'pc', '8471'],
      'laptop': ['computadora', 'ordenador', 'computer', 'portátil', 'notebook', '8471'],
      'maiz': ['maíz', 'corn', 'maize', 'milho', 'elote', 'choclo', '1005'],
      'soja': ['soybean', 'soy', 'soya', 'frijol', '1201'],
      'coffee': ['café', 'cafe', 'kaffee', '0901'],
      'cacao': ['cocoa', 'chocolate', 'cacau', '1801'],
      'vino': ['wine', 'vin', 'wein', 'vinho', '2204'],
      'petroleo': ['petroleum', 'oil', 'crude', 'petróleo', 'aceite', '2709'],
      'oro': ['gold', 'precious metals', 'aurum', '7108'],
      'meat': ['carne', 'carnes', 'beef', 'pork', 'viande', '0203'],
      'leche': ['milk', 'dairy', 'lait', 'latte', '0401'],
      'textiles': ['textile', 'tejido', 'tela', 'ropa', 'vestir', 'prendas', 'clothing', 'apparel', 'fabric', '6203', '6204'],
      'auto': ['car', 'coche', 'automóvil', 'vehicle', 'vehículo', '8703'],
      'telefono': ['8517', 'teléfono', 'phone', 'smartphone'],
      'computadora': ['8471', 'computer', 'laptop', 'ordenador'],
      'cafe': ['0901', 'coffee', 'café'],
      'petroleo': ['2709', 'petroleum', 'oil']
    };

    // Create expanded search terms including synonyms
    let searchTerms = lowerQuery.split(/[\s,.-]+/).filter(term => term.length > 1);
    
    const expandedTerms = [...searchTerms];
    searchTerms.forEach(term => {
      if (synonymMap[term]) {
        expandedTerms.push(...synonymMap[term]);
      }
      if (term.match(/^\d{4}$/)) {
        expandedTerms.push(term);
      }
    });
    
    searchTerms = Array.from(new Set(expandedTerms));

    // Check if HS data exists in database, if not, return fallback results
    const hsCount = await db.select().from(hsPartidas).limit(1);
    
    if (hsCount.length === 0) {
      // Database is empty, return sample results based on query
      console.log(`⚠️  HS database is empty, providing sample results for "${query}"`);
      
      const sampleResults = this.generateSampleHsResults(query, searchTerms, country);
      return sampleResults;
    }

    // Build dynamic search conditions
    const searchConditions = searchTerms.map(term => {
      const searchTerm = `%${term}%`;
      return [
        ilike(hsSections.description, searchTerm),
        ilike(hsSections.descriptionEn, searchTerm),
        ilike(hsSections.code, searchTerm)
      ];
    }).flat();

    const chapterConditions = searchTerms.map(term => {
      const searchTerm = `%${term}%`;
      return [
        ilike(hsChapters.description, searchTerm),
        ilike(hsChapters.descriptionEn, searchTerm),
        ilike(hsChapters.code, searchTerm)
      ];
    }).flat();

    const partidaConditions = searchTerms.map(term => {
      const searchTerm = `%${term}%`;
      return [
        ilike(hsPartidas.description, searchTerm),
        ilike(hsPartidas.descriptionEn, searchTerm),
        ilike(hsPartidas.code, searchTerm)
      ];
    }).flat();

    const [sectionsResults, chaptersResults, partidasResults, subpartidasResults] = await Promise.all([
      db.select().from(hsSections).where(or(...searchConditions)).limit(10),
      db.select().from(hsChapters).where(or(...chapterConditions)).limit(20),
      db.select().from(hsPartidas).where(or(...partidaConditions)).limit(50),
      db.select().from(hsSubpartidas).where(
        or(
          ...searchTerms.map(term => {
            const searchTerm = `%${term}%`;
            return [
              ilike(hsSubpartidas.description, searchTerm),
              ilike(hsSubpartidas.descriptionEn, searchTerm),
              ilike(hsSubpartidas.code, searchTerm)
            ];
          }).flat()
        )
      ).limit(100)
    ]);

    console.log(`🔍 Enhanced search for "${query}"${country ? ` (country: ${country})` : ''} found:`, {
      sections: sectionsResults.length,
      chapters: chaptersResults.length,
      partidas: partidasResults.length,
      subpartidas: subpartidasResults.length,
      searchTerms: searchTerms.length
    });

    return {
      sections: sectionsResults,
      chapters: chaptersResults,
      partidas: partidasResults,
      subpartidas: subpartidasResults
    };
  }

  // Generate sample HS results when database is empty
  private generateSampleHsResults(query: string, searchTerms: string[], country?: string): {sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]} {
    const samplePartidas: HsPartida[] = [];
    
    // Technology products
    if (searchTerms.some(term => ['smartphone', 'phone', 'telefono', '8517'].includes(term))) {
      samplePartidas.push({
        id: "sample-8517",
        code: "8517",
        description: "Teléfonos, incluidos los teléfonos móviles (celulares)",
        descriptionEn: "Telephones, including mobile (cellular) phones",
        chapterCode: "85",
        tariffRate: "0",
        units: ["U", "No."],
        notes: "Equipos de telecomunicaciones",
        notesEn: "Telecommunications equipment"
      });
    }

    if (searchTerms.some(term => ['computer', 'laptop', 'computadora', '8471'].includes(term))) {
      samplePartidas.push({
        id: "sample-8471",
        code: "8471",
        description: "Máquinas automáticas para tratamiento o procesamiento de datos",
        descriptionEn: "Automatic data processing machines and units thereof",
        chapterCode: "84",
        tariffRate: "0",
        units: ["U", "No."],
        notes: "Computadoras y equipos informáticos",
        notesEn: "Computers and computer equipment"
      });
    }

    // Agricultural products
    if (searchTerms.some(term => ['coffee', 'cafe', '0901'].includes(term))) {
      samplePartidas.push({
        id: "sample-0901",
        code: "0901",
        description: "Café, incluso tostado o descafeinado",
        descriptionEn: "Coffee, whether or not roasted or decaffeinated",
        chapterCode: "09",
        tariffRate: "0",
        units: ["KG"],
        notes: "Café en grano o molido",
        notesEn: "Coffee beans or ground"
      });
    }

    if (searchTerms.some(term => ['maiz', 'corn', 'maize', '1005'].includes(term))) {
      samplePartidas.push({
        id: "sample-1005",
        code: "1005",
        description: "Maíz",
        descriptionEn: "Maize (corn)",
        chapterCode: "10",
        tariffRate: "0",
        units: ["KG", "TN"],
        notes: "Cereales para alimentación",
        notesEn: "Cereals for food"
      });
    }

    // Energy products
    if (searchTerms.some(term => ['oil', 'petroleum', 'petroleo', '2709'].includes(term))) {
      samplePartidas.push({
        id: "sample-2709",
        code: "2709",
        description: "Aceites crudos de petróleo o de mineral bituminoso",
        descriptionEn: "Petroleum oils and oils obtained from bituminous minerals, crude",
        chapterCode: "27",
        tariffRate: "0",
        units: ["LT", "BL"],
        notes: "Combustibles fósiles",
        notesEn: "Fossil fuels"
      });
    }

    // Sample chapters
    const sampleChapters: HsChapter[] = [];
    if (samplePartidas.length > 0) {
      const uniqueChapters = [...new Set(samplePartidas.map(p => p.chapterCode))];
      uniqueChapters.forEach(chapterCode => {
        if (chapterCode === "85") {
          sampleChapters.push({
            id: "sample-85",
            code: "85",
            description: "Máquinas, aparatos y material eléctrico",
            descriptionEn: "Electrical machinery and equipment",
            sectionCode: "XVI",
            notes: "Equipos eléctricos y electrónicos",
            notesEn: "Electrical and electronic equipment"
          });
        } else if (chapterCode === "84") {
          sampleChapters.push({
            id: "sample-84",
            code: "84",
            description: "Reactores nucleares, calderas, máquinas",
            descriptionEn: "Nuclear reactors, boilers, machinery",
            sectionCode: "XVI",
            notes: "Maquinaria y equipos mecánicos",
            notesEn: "Machinery and mechanical appliances"
          });
        }
      });
    }

    console.log(`📝 Generated ${samplePartidas.length} sample HS codes for query "${query}"`);
    
    return {
      sections: [],
      chapters: sampleChapters,
      partidas: samplePartidas,
      subpartidas: []
    };
  }

  async getHsPartidaByCode(code: string): Promise<HsPartida | undefined> {
    const results = await db.select().from(hsPartidas).where(eq(hsPartidas.code, code)).limit(1);
    return results[0];
  }

  async getHsSubpartidaByCode(code: string): Promise<HsSubpartida | undefined> {
    const results = await db.select().from(hsSubpartidas).where(eq(hsSubpartidas.code, code)).limit(1);
    return results[0];
  }

  async getHsHierarchy(code: string): Promise<{section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida}> {
    const result: any = {};
    
    if (code.length >= 6) {
      // It's a subpartida
      const subpartida = await this.getHsSubpartidaByCode(code);
      if (subpartida) {
        result.subpartida = subpartida;
        code = subpartida.partidaCode;
      }
    }
    
    if (code.length >= 4) {
      // It's a partida
      const partida = await this.getHsPartidaByCode(code);
      if (partida) {
        result.partida = partida;
        code = partida.chapterCode;
      }
    }
    
    if (code.length >= 2) {
      // It's a chapter
      const chapterResults = await db.select().from(hsChapters).where(eq(hsChapters.code, code)).limit(1);
      if (chapterResults[0]) {
        result.chapter = chapterResults[0];
        code = chapterResults[0].sectionCode;
      }
    }
    
    // Get section
    const sectionResults = await db.select().from(hsSections).where(eq(hsSections.code, code)).limit(1);
    if (sectionResults[0]) {
      result.section = sectionResults[0];
    }
    
    return result;
  }

  // Company methods
  async getCompanies(type?: string, country?: string): Promise<Company[]> {
    if (type && country) {
      return await db.select().from(companies).where(and(eq(companies.type, type), eq(companies.country, country))).orderBy(companies.name);
    } else if (type) {
      return await db.select().from(companies).where(eq(companies.type, type)).orderBy(companies.name);
    } else if (country) {
      return await db.select().from(companies).where(eq(companies.country, country)).orderBy(companies.name);
    }
    
    return await db.select().from(companies).orderBy(companies.name);
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(companies).where(
      or(
        ilike(companies.name, searchTerm),
        ilike(companies.country, searchTerm),
        ilike(companies.type, searchTerm)
      )
    ).orderBy(companies.name);
  }

  async createCompany(companyData: InsertCompany): Promise<Company> {
    const results = await db.insert(companies).values(companyData).returning();
    return results[0];
  }

  // Market data methods
  async getMarketData(hsCode: string, originCountry: string, destinationCountry: string): Promise<MarketData[]> {
    return await db.select().from(marketData).where(
      and(
        eq(marketData.hsCode, hsCode),
        eq(marketData.originCountry, originCountry),
        eq(marketData.destinationCountry, destinationCountry)
      )
    ).orderBy(marketData.year);
  }

  // Country opportunities methods
  async getCountryOpportunities(hsCode: string): Promise<CountryOpportunity[]> {
    return await db.select().from(countryOpportunities)
      .where(eq(countryOpportunities.hsCode, hsCode))
      .orderBy(countryOpportunities.opportunityScore);
  }

  async getCountryRequirements(countryCode: string, hsCode: string): Promise<CountryRequirement | undefined> {
    const results = await db.select().from(countryRequirements).where(
      and(
        eq(countryRequirements.countryCode, countryCode),
        eq(countryRequirements.hsCode, hsCode)
      )
    ).limit(1);
    return results[0];
  }

  // Shipment methods
  async getShipments(): Promise<Shipment[]> {
    return await db.select().from(shipments).orderBy(shipments.createdAt);
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const results = await db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber)).limit(1);
    return results[0];
  }

  async createShipment(shipmentData: InsertShipment): Promise<Shipment> {
    const results = await db.insert(shipments).values(shipmentData).returning();
    return results[0];
  }

  async updateShipmentStatus(id: string, status: string, progress?: number): Promise<Shipment | undefined> {
    const updateData: any = { status, updatedAt: new Date() };
    if (progress !== undefined) {
      updateData.progress = progress;
    }
    
    const results = await db.update(shipments)
      .set(updateData)
      .where(eq(shipments.id, id))
      .returning();
    return results[0];
  }

  // Customs procedures methods
  async getCustomsProcedures(country: string): Promise<CustomsProcedure[]> {
    return await db.select().from(customsProcedures).where(eq(customsProcedures.country, country));
  }

  // Intelligence methods
  async getTradeAlerts(active?: boolean): Promise<TradeAlert[]> {
    if (active !== undefined) {
      return await db.select().from(tradeAlerts).where(eq(tradeAlerts.isActive, active)).orderBy(tradeAlerts.createdAt);
    }
    
    return await db.select().from(tradeAlerts).orderBy(tradeAlerts.createdAt);
  }

  async getTradeOpportunities(active?: boolean): Promise<TradeOpportunity[]> {
    if (active !== undefined) {
      return await db.select().from(tradeOpportunities).where(eq(tradeOpportunities.isActive, active)).orderBy(tradeOpportunities.createdAt);
    }
    
    return await db.select().from(tradeOpportunities).orderBy(tradeOpportunities.createdAt);
  }

  async getMarketIntelligence(recent?: boolean): Promise<MarketIntelligence[]> {
    if (recent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return await db.select().from(marketIntelligence).where(sql`${marketIntelligence.publishedAt} >= ${thirtyDaysAgo}`).orderBy(marketIntelligence.publishedAt);
    }
    
    return await db.select().from(marketIntelligence).orderBy(marketIntelligence.publishedAt);
  }

  async createTradeAlert(alertData: InsertTradeAlert): Promise<TradeAlert> {
    const results = await db.insert(tradeAlerts).values(alertData).returning();
    return results[0];
  }

  async createTradeOpportunity(opportunityData: InsertTradeOpportunity): Promise<TradeOpportunity> {
    const results = await db.insert(tradeOpportunities).values(opportunityData).returning();
    return results[0];
  }

  async createMarketIntelligence(intelligenceData: InsertMarketIntelligence): Promise<MarketIntelligence> {
    const results = await db.insert(marketIntelligence).values(intelligenceData).returning();
    return results[0];
  }
}