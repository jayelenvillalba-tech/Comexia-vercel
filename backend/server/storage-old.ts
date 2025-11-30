import { type HsSection, type HsChapter, type HsPartida, type HsSubpartida, type Company, type MarketData, type Shipment, type CustomsProcedure, type CountryOpportunity, type CountryRequirement, type TradeAlert, type TradeOpportunity, type MarketIntelligence, type InsertHsSection, type InsertHsChapter, type InsertHsPartida, type InsertHsSubpartida, type InsertCompany, type InsertMarketData, type InsertShipment, type InsertCustomsProcedure, type InsertCountryOpportunity, type InsertCountryRequirement, type InsertTradeAlert, type InsertTradeOpportunity, type InsertMarketIntelligence } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // HS Code methods
  getHsSections(): Promise<HsSection[]>;
  getHsChapters(sectionCode?: string): Promise<HsChapter[]>;
  getHsPartidas(chapterCode: string): Promise<HsPartida[]>;
  getHsSubpartidas(partidaCode: string): Promise<HsSubpartida[]>;
  searchHsItems(query: string): Promise<{sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]}>;
  getHsPartidaByCode(code: string): Promise<HsPartida | undefined>;
  getHsSubpartidaByCode(code: string): Promise<HsSubpartida | undefined>;
  getHsHierarchy(code: string): Promise<{section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida}>;
  
  // Company methods
  getCompanies(type?: string, country?: string): Promise<Company[]>;
  searchCompanies(query: string): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;
  
  // Market data methods
  getMarketData(hsCode: string, originCountry: string, destinationCountry: string): Promise<MarketData[]>;
  
  // Country opportunities methods
  getCountryOpportunities(hsCode: string): Promise<CountryOpportunity[]>;
  getCountryRequirements(countryCode: string, hsCode: string): Promise<CountryRequirement | undefined>;
  
  // Shipment methods
  getShipments(): Promise<Shipment[]>;
  getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipmentStatus(id: string, status: string, progress?: number): Promise<Shipment | undefined>;
  
  // Customs procedures methods
  getCustomsProcedures(country: string): Promise<CustomsProcedure[]>;
  
  // Intelligence methods
  getTradeAlerts(active?: boolean): Promise<TradeAlert[]>;
  getTradeOpportunities(active?: boolean): Promise<TradeOpportunity[]>;
  getMarketIntelligence(recent?: boolean): Promise<MarketIntelligence[]>;
  createTradeAlert(alert: InsertTradeAlert): Promise<TradeAlert>;
  createTradeOpportunity(opportunity: InsertTradeOpportunity): Promise<TradeOpportunity>;
  createMarketIntelligence(intelligence: InsertMarketIntelligence): Promise<MarketIntelligence>;
}

export class MemStorage implements IStorage {
  private hsSections: Map<string, HsSection>;
  private hsChapters: Map<string, HsChapter>;
  private hsPartidas: Map<string, HsPartida>;
  private hsSubpartidas: Map<string, HsSubpartida>;
  private companies: Map<string, Company>;
  private marketData: Map<string, MarketData>;
  private shipments: Map<string, Shipment>;
  private customsProcedures: Map<string, CustomsProcedure>;
  private countryOpportunities: Map<string, CountryOpportunity>;
  private countryRequirements: Map<string, CountryRequirement>;
  private tradeAlerts: Map<string, TradeAlert>;
  private tradeOpportunities: Map<string, TradeOpportunity>;
  private marketIntelligence: Map<string, MarketIntelligence>;

  constructor() {
    this.hsSections = new Map();
    this.hsChapters = new Map();
    this.hsPartidas = new Map();
    this.hsSubpartidas = new Map();
    this.companies = new Map();
    this.marketData = new Map();
    this.shipments = new Map();
    this.customsProcedures = new Map();
    this.countryOpportunities = new Map();
    this.countryRequirements = new Map();
    this.tradeAlerts = new Map();
    this.tradeOpportunities = new Map();
    this.marketIntelligence = new Map();
    this.seedData();
    this.seedIntelligenceData();
  }

  private seedData() {
    // Seed HS Sections - Complete International Standard (21 sections)
    const sections = [
      { code: "I", number: 1, description: "Animales vivos y productos del reino animal", descriptionEn: "Live animals and animal products", chapterRange: "01-05" },
      { code: "II", number: 2, description: "Productos del reino vegetal", descriptionEn: "Vegetable products", chapterRange: "06-14" },
      { code: "III", number: 3, description: "Grasas y aceites animales o vegetales", descriptionEn: "Animal and vegetable fats and oils", chapterRange: "15" },
      { code: "IV", number: 4, description: "Productos de las industrias alimentarias", descriptionEn: "Prepared foodstuffs", chapterRange: "16-24" },
      { code: "V", number: 5, description: "Productos minerales", descriptionEn: "Mineral products", chapterRange: "25-27" },
      { code: "VI", number: 6, description: "Productos de las industrias químicas", descriptionEn: "Products of the chemical or allied industries", chapterRange: "28-38" },
      { code: "VII", number: 7, description: "Plásticos y sus manufacturas; caucho", descriptionEn: "Plastics and articles thereof; rubber and articles thereof", chapterRange: "39-40" },
      { code: "VIII", number: 8, description: "Pieles, cueros y sus manufacturas", descriptionEn: "Raw hides and skins, leather, furskins and articles thereof", chapterRange: "41-43" },
      { code: "IX", number: 9, description: "Madera, carbón vegetal y manufacturas de madera", descriptionEn: "Wood and articles of wood; wood charcoal; cork and articles of cork", chapterRange: "44-46" },
      { code: "X", number: 10, description: "Pasta de madera o de otras materias fibrosas celulósicas", descriptionEn: "Pulp of wood or of other fibrous cellulosic material; paper or paperboard", chapterRange: "47-49" },
      { code: "XI", number: 11, description: "Materias textiles y sus manufacturas", descriptionEn: "Textiles and textile articles", chapterRange: "50-63" },
      { code: "XII", number: 12, description: "Calzado, sombreros y demás tocados", descriptionEn: "Footwear, headgear, umbrellas, sun umbrellas, walking sticks", chapterRange: "64-67" },
      { code: "XIII", number: 13, description: "Manufacturas de piedra, yeso, cemento, amianto", descriptionEn: "Articles of stone, plaster, cement, asbestos, mica or similar materials", chapterRange: "68-70" },
      { code: "XIV", number: 14, description: "Perlas finas, piedras preciosas, metales preciosos", descriptionEn: "Natural or cultured pearls, precious or semi-precious stones, precious metals", chapterRange: "71" },
      { code: "XV", number: 15, description: "Metales comunes y sus manufacturas", descriptionEn: "Base metals and articles of base metal", chapterRange: "72-83" },
      { code: "XVI", number: 16, description: "Máquinas y aparatos mecánicos; aparatos eléctricos", descriptionEn: "Machinery and mechanical appliances; electrical equipment", chapterRange: "84-85" },
      { code: "XVII", number: 17, description: "Material de transporte", descriptionEn: "Vehicles, aircraft, vessels and associated transport equipment", chapterRange: "86-89" },
      { code: "XVIII", number: 18, description: "Instrumentos y aparatos de óptica, fotografía, cinematografía", descriptionEn: "Optical, photographic, cinematographic, measuring, checking, precision instruments", chapterRange: "90-92" },
      { code: "XIX", number: 19, description: "Armas, municiones, y sus partes y accesorios", descriptionEn: "Arms and ammunition; parts and accessories thereof", chapterRange: "93" },
      { code: "XX", number: 20, description: "Mercancías y productos diversos", descriptionEn: "Miscellaneous manufactured articles", chapterRange: "94-96" },
      { code: "XXI", number: 21, description: "Objetos de arte o colección y antigüedades", descriptionEn: "Works of art, collectors' pieces and antiques", chapterRange: "97" },
    ];

    sections.forEach(sectionData => {
      const id = randomUUID();
      const section = { id, ...sectionData };
      this.hsSections.set(section.code, section);
    });

    // Seed HS Chapters - Complete with all major chapters
    const chapters = [
      // Section I - Live animals and animal products (01-05)
      { code: "01", description: "Animales vivos", descriptionEn: "Live animals", sectionCode: "I", notes: "Animales destinados a reproducción, cría, engorde o sacrificio", notesEn: "Animals for breeding, raising, fattening or slaughter" },
      { code: "02", description: "Carnes y despojos comestibles", descriptionEn: "Meat and edible meat offal", sectionCode: "I", notes: "Carnes frescas, refrigeradas o congeladas", notesEn: "Fresh, chilled or frozen meat" },
      { code: "03", description: "Pescados y crustáceos, moluscos y otros invertebrados acuáticos", descriptionEn: "Fish and crustaceans, molluscs and other aquatic invertebrates", sectionCode: "I", notes: "Productos de la pesca y acuicultura", notesEn: "Fishing and aquaculture products" },
      { code: "04", description: "Productos lácteos; huevos de ave; miel natural", descriptionEn: "Dairy produce; birds' eggs; natural honey", sectionCode: "I", notes: "Productos derivados de animales", notesEn: "Animal-derived products" },
      { code: "05", description: "Los demás productos de origen animal", descriptionEn: "Products of animal origin, not elsewhere specified", sectionCode: "I", notes: "Otros productos animales", notesEn: "Other animal products" },
      
      // Section II - Vegetable products (06-14)
      { code: "06", description: "Plantas vivas y productos de la floricultura", descriptionEn: "Live trees and other plants; bulbs, roots and the like", sectionCode: "II", notes: "Plantas ornamentales y de cultivo", notesEn: "Ornamental and cultivation plants" },
      { code: "07", description: "Hortalizas, plantas, raíces y tubérculos alimenticios", descriptionEn: "Edible vegetables and certain roots and tubers", sectionCode: "II", notes: "Verduras y vegetales comestibles", notesEn: "Edible vegetables and plants" },
      { code: "08", description: "Frutas y frutos comestibles", descriptionEn: "Edible fruit and nuts; peel of citrus fruit or melons", sectionCode: "II", notes: "Frutas frescas y secas", notesEn: "Fresh and dried fruits" },
      { code: "09", description: "Café, té, yerba mate y especias", descriptionEn: "Coffee, tea, mate and spices", sectionCode: "II", notes: "Productos vegetales para infusión y condimentación", notesEn: "Vegetable products for infusion and seasoning" },
      { code: "10", description: "Cereales", descriptionEn: "Cereals", sectionCode: "II", notes: "Granos para alimentación humana y animal", notesEn: "Grains for human and animal food" },
      { code: "11", description: "Productos de la molinería; malta; almidón", descriptionEn: "Products of the milling industry; malt; starches", sectionCode: "II", notes: "Harinas y productos procesados", notesEn: "Flours and processed products" },
      { code: "12", description: "Semillas y frutos oleaginosos", descriptionEn: "Oil seeds and oleaginous fruits", sectionCode: "II", notes: "Semillas para aceite", notesEn: "Seeds for oil production" },
      { code: "13", description: "Gomas, resinas y demás jugos y extractos vegetales", descriptionEn: "Lac; gums, resins and other vegetable saps and extracts", sectionCode: "II", notes: "Extractos vegetales", notesEn: "Plant extracts" },
      { code: "14", description: "Materias trenzables y demás productos de origen vegetal", descriptionEn: "Vegetable plaiting materials; vegetable products not elsewhere specified", sectionCode: "II", notes: "Otros productos vegetales", notesEn: "Other vegetable products" },
      
      // Section XV - Base metals (72-83)
      { code: "72", description: "Fundición, hierro y acero", descriptionEn: "Iron and steel", sectionCode: "XV", notes: "Productos siderúrgicos", notesEn: "Steel products" },
      { code: "76", description: "Aluminio y sus manufacturas", descriptionEn: "Aluminium and articles thereof", sectionCode: "XV", notes: "Productos de aluminio", notesEn: "Aluminum products" },
      
      // Section XVI - Machinery and electrical equipment (84-85)
      { code: "84", description: "Calderas, máquinas, aparatos y artefactos mecánicos", descriptionEn: "Nuclear reactors, boilers, machinery and mechanical appliances", sectionCode: "XVI", notes: "Equipos mecánicos e industriales", notesEn: "Mechanical and industrial equipment" },
      { code: "85", description: "Máquinas, aparatos y material eléctrico", descriptionEn: "Electrical machinery and equipment", sectionCode: "XVI", notes: "Equipos electrónicos y eléctricos", notesEn: "Electronic and electrical equipment" },
    ];

    chapters.forEach(chapterData => {
      const id = randomUUID();
      const chapter = { id, ...chapterData };
      this.hsChapters.set(chapter.code, chapter);
    });

    // Seed HS Partidas - Comprehensive coverage for key chapters
    const partidas = [
      // Chapter 01 - Live animals
      { code: "0101", description: "Caballos, asnos, mulos y burdéganos, vivos", descriptionEn: "Live horses, asses, mules and hinnies", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Incluye animales de pura raza", notesEn: "Includes purebred animals" },
      { code: "0102", description: "Animales vivos de la especie bovina", descriptionEn: "Live bovine animals", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Ganado bovino para cría o sacrificio", notesEn: "Bovine cattle for breeding or slaughter" },
      { code: "0103", description: "Animales vivos de la especie porcina", descriptionEn: "Live swine", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Cerdos para cría o sacrificio", notesEn: "Pigs for breeding or slaughter" },
      { code: "0104", description: "Animales vivos de las especies ovina o caprina", descriptionEn: "Live sheep and goats", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Ovejas y cabras", notesEn: "Sheep and goats" },
      { code: "0105", description: "Gallos, gallinas, patos, gansos, pavos y pintadas", descriptionEn: "Live poultry", chapterCode: "01", tariffRate: "2.0", units: ["u"], notes: "Aves de corral", notesEn: "Poultry" },
      { code: "0106", description: "Los demás animales vivos", descriptionEn: "Other live animals", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Otros animales vivos", notesEn: "Other live animals" },
      
      // Chapter 02 - Meat and edible meat offal
      { code: "0201", description: "Carne de animales de la especie bovina, fresca o refrigerada", descriptionEn: "Meat of bovine animals, fresh or chilled", chapterCode: "02", tariffRate: "10.5", units: ["kg"], notes: "Cortes de carne bovina premium", notesEn: "Premium bovine meat cuts" },
      { code: "0202", description: "Carne de animales de la especie bovina, congelada", descriptionEn: "Meat of bovine animals, frozen", chapterCode: "02", tariffRate: "10.0", units: ["kg"], notes: "Carne bovina congelada", notesEn: "Frozen bovine meat" },
      { code: "0203", description: "Carne de animales de la especie porcina, fresca, refrigerada o congelada", descriptionEn: "Meat of swine, fresh, chilled or frozen", chapterCode: "02", tariffRate: "12.0", units: ["kg"], notes: "Carne de cerdo", notesEn: "Pork meat" },
      { code: "0204", description: "Carne de animales de las especies ovina o caprina", descriptionEn: "Meat of sheep or goats", chapterCode: "02", tariffRate: "10.0", units: ["kg"], notes: "Carne de oveja y cabra", notesEn: "Sheep and goat meat" },
      
      // Chapter 84 - Machinery and mechanical appliances
      { code: "8401", description: "Reactores nucleares; elementos combustibles", descriptionEn: "Nuclear reactors; fuel elements", chapterCode: "84", tariffRate: "5.0", units: ["u"], notes: "Equipos nucleares", notesEn: "Nuclear equipment" },
      { code: "8402", description: "Calderas de vapor", descriptionEn: "Steam or other vapour generating boilers", chapterCode: "84", tariffRate: "8.0", units: ["u"], notes: "Calderas industriales", notesEn: "Industrial boilers" },
      { code: "8403", description: "Calderas para calefacción central", descriptionEn: "Central heating boilers", chapterCode: "84", tariffRate: "8.0", units: ["u"], notes: "Calderas domésticas", notesEn: "Domestic boilers" },
      { code: "8471", description: "Máquinas automáticas para tratamiento o procesamiento de datos", descriptionEn: "Automatic data processing machines and units thereof", chapterCode: "84", tariffRate: "5.0", units: ["u"], notes: "Computadoras y servidores", notesEn: "Computers and servers" },
      { code: "8473", description: "Partes y accesorios de las máquinas de las partidas", descriptionEn: "Parts and accessories of the machines", chapterCode: "84", tariffRate: "6.0", units: ["kg"], notes: "Repuestos computacionales", notesEn: "Computer parts" },
      
      // Chapter 85 - Electrical machinery and equipment
      { code: "8517", description: "Teléfonos, incluidos los teléfonos inteligentes", descriptionEn: "Telephone sets, including smartphones", chapterCode: "85", tariffRate: "8.0", units: ["u"], notes: "Equipos de telecomunicaciones", notesEn: "Telecommunications equipment" },
      { code: "8518", description: "Micrófonos y sus soportes; altavoces", descriptionEn: "Microphones and stands therefor; loudspeakers", chapterCode: "85", tariffRate: "10.0", units: ["u"], notes: "Equipos de audio", notesEn: "Audio equipment" },
      { code: "8519", description: "Aparatos de grabación o reproducción de sonido", descriptionEn: "Sound recording or reproducing apparatus", chapterCode: "85", tariffRate: "12.0", units: ["u"], notes: "Reproductores de audio", notesEn: "Audio players" },
      { code: "8521", description: "Aparatos de grabación o reproducción de imagen y sonido", descriptionEn: "Video recording or reproducing apparatus", chapterCode: "85", tariffRate: "12.0", units: ["u"], notes: "Equipos de video", notesEn: "Video equipment" },
      { code: "8528", description: "Monitores y proyectores", descriptionEn: "Monitors and projectors", chapterCode: "85", tariffRate: "8.0", units: ["u"], notes: "Pantallas y proyectores", notesEn: "Displays and projectors" },
    ];

    partidas.forEach(partidaData => {
      const id = randomUUID();
      const partida = { id, ...partidaData };
      this.hsPartidas.set(partida.code, partida);
    });

    // Seed HS Subpartidas - Detailed coverage for electronics and other key categories
    const subpartidas = [
      // Chapter 85 - Electronics - Smartphones and related
      { code: "851712", description: "Teléfonos inteligentes (smartphones)", descriptionEn: "Smartphones", partidaCode: "8517", chapterCode: "85", tariffRate: "8.0", units: ["u"], specialTariffRate: "6.0", quotas: null, restrictions: null, isActive: true, notes: "Teléfonos con funciones avanzadas", notesEn: "Phones with advanced features" },
      { code: "851713", description: "Teléfonos móviles básicos", descriptionEn: "Basic mobile phones", partidaCode: "8517", chapterCode: "85", tariffRate: "6.0", units: ["u"], specialTariffRate: "4.0", quotas: null, restrictions: null, isActive: true, notes: "Teléfonos celulares básicos", notesEn: "Basic cellular phones" },
      { code: "851761", description: "Estaciones base de telefonía móvil", descriptionEn: "Mobile phone base stations", partidaCode: "8517", chapterCode: "85", tariffRate: "5.0", units: ["u"], specialTariffRate: "3.0", quotas: null, restrictions: null, isActive: true, notes: "Equipos de infraestructura", notesEn: "Infrastructure equipment" },
      
      // Audio equipment subpartidas
      { code: "851810", description: "Micrófonos y sus soportes", descriptionEn: "Microphones and stands", partidaCode: "8518", chapterCode: "85", tariffRate: "10.0", units: ["u"], specialTariffRate: "8.0", quotas: null, restrictions: null, isActive: true, notes: "Equipos profesionales de audio", notesEn: "Professional audio equipment" },
      { code: "851821", description: "Altavoces únicos montados en sus cajas", descriptionEn: "Single loudspeakers mounted in enclosures", partidaCode: "8518", chapterCode: "85", tariffRate: "12.0", units: ["u"], specialTariffRate: "10.0", quotas: null, restrictions: null, isActive: true, notes: "Altavoces domésticos", notesEn: "Home speakers" },
      { code: "851822", description: "Altavoces múltiples montados en la misma caja", descriptionEn: "Multiple loudspeakers mounted in the same enclosure", partidaCode: "8518", chapterCode: "85", tariffRate: "12.0", units: ["u"], specialTariffRate: "10.0", quotas: null, restrictions: null, isActive: true, notes: "Sistemas de sonido", notesEn: "Sound systems" },
      
      // Computer equipment
      { code: "847130", description: "Máquinas automáticas para tratamiento de datos, portátiles", descriptionEn: "Portable automatic data processing machines", partidaCode: "8471", chapterCode: "84", tariffRate: "5.0", units: ["u"], specialTariffRate: "3.0", quotas: null, restrictions: null, isActive: true, notes: "Laptops y notebooks", notesEn: "Laptops and notebooks" },
      { code: "847141", description: "Computadoras que incluyan una unidad central de procesamiento", descriptionEn: "Computers comprising a central processing unit", partidaCode: "8471", chapterCode: "84", tariffRate: "5.0", units: ["u"], specialTariffRate: "3.0", quotas: null, restrictions: null, isActive: true, notes: "Computadoras de escritorio", notesEn: "Desktop computers" },
      { code: "847149", description: "Las demás máquinas automáticas para tratamiento de datos", descriptionEn: "Other automatic data processing machines", partidaCode: "8471", chapterCode: "84", tariffRate: "5.0", units: ["u"], specialTariffRate: "3.0", quotas: null, restrictions: null, isActive: true, notes: "Servidores y otros equipos", notesEn: "Servers and other equipment" },
      
      // Live animals subpartidas
      { code: "010121", description: "Caballos de pura raza para reproducción", descriptionEn: "Pure-bred breeding horses", partidaCode: "0101", chapterCode: "01", tariffRate: "0", units: ["u"], specialTariffRate: "0", quotas: null, restrictions: null, isActive: true, notes: "Animales reproductores certificados", notesEn: "Certified breeding animals" },
      { code: "010129", description: "Los demás caballos", descriptionEn: "Other horses", partidaCode: "0101", chapterCode: "01", tariffRate: "0", units: ["u"], specialTariffRate: "0", quotas: null, restrictions: null, isActive: true, notes: "Caballos para trabajo o deporte", notesEn: "Horses for work or sport" },
      
      // Meat products
      { code: "020110", description: "Canales y medias canales de bovino", descriptionEn: "Carcasses and half-carcasses of bovine animals", partidaCode: "0201", chapterCode: "02", tariffRate: "10.5", units: ["kg"], specialTariffRate: "8.5", quotas: null, restrictions: null, isActive: true, notes: "Cortes primarios de res", notesEn: "Primary beef cuts" },
      { code: "020120", description: "Los demás cortes sin deshuesar", descriptionEn: "Other cuts with bone in", partidaCode: "0201", chapterCode: "02", tariffRate: "10.5", units: ["kg"], specialTariffRate: "8.5", quotas: null, restrictions: null, isActive: true, notes: "Cortes con hueso", notesEn: "Bone-in cuts" },
      { code: "020130", description: "Carne deshuesada", descriptionEn: "Boneless meat", partidaCode: "0201", chapterCode: "02", tariffRate: "10.5", units: ["kg"], specialTariffRate: "8.5", quotas: null, restrictions: null, isActive: true, notes: "Carne sin hueso premium", notesEn: "Premium boneless meat" },
    ];

    subpartidas.forEach(subpartidaData => {
      const id = randomUUID();
      const subpartida = { id, ...subpartidaData };
      this.hsSubpartidas.set(subpartida.code, subpartida);
    });

    // Seed basic company data
    this.seedCompanyData();
  }

  private seedCompanyData() {
    const companies = [
      {
        name: "Shanghai Electronics Co., Ltd.",
        country: "China",
        type: "manufacturer",
        products: ["smartphones", "tablets", "electronics"],
        verified: true,
        contactEmail: "sales@shanghaielectronics.com",
        website: "https://shanghaielectronics.com",
        legalName: "Shanghai Electronics Company Limited",
        businessLicense: "91310106MA1K3X2X4A",
        foundedYear: 2009,
        employees: "500-1000",
        annualRevenue: "$50-100M",
        mainProducts: "Consumer Electronics, Industrial Components",
        exportCountries: ["USA", "Germany", "Japan"],
        certificates: ["ISO 9001:2015", "RoHS", "CE"],
        qualityStandards: ["ISO 9001", "ISO 14001"],
        paymentTerms: "T/T, L/C",
        leadTime: "15-25 days",
        minimumOrder: "$10,000",
        capacity: "500K units/month",
        facilities: "6 production facilities in Shanghai",
        tags: ["electronics", "manufacturer", "export"],
        rating: 4.8,
        reviewCount: 245,
        lastUpdatedBy: "system",
        taxId: "91310106MA1K3X2X4A",
        businessType: "manufacturing",
        establishedYear: 2009,
        employeeCount: 750,
        certificationLevel: "premium",
        exportLicense: "EP123456789",
        qualityCertifications: ["ISO 9001", "ISO 14001"],
        productCategories: ["electronics", "technology"],
        marketSegments: ["B2B", "B2C"],
        companySize: "large",
        ownership: "private",
        headquarters: "Shanghai, China",
        parentCompany: null,
        subsidiaries: null
      }
    ];

    companies.forEach(companyData => {
      const id = randomUUID();
      const company = {
        id,
        createdAt: new Date(),
        lastUpdated: new Date(),
        products: companyData.products || null,
        verified: companyData.verified || null,
        contactEmail: companyData.contactEmail || null,
        website: companyData.website || null,
        legalName: companyData.legalName || null,
        businessLicense: companyData.businessLicense || null,
        foundedYear: companyData.foundedYear || null,
        employees: companyData.employees || null,
        annualRevenue: companyData.annualRevenue || null,
        mainProducts: companyData.mainProducts || null,
        exportCountries: companyData.exportCountries || null,
        certificates: companyData.certificates || null,
        qualityStandards: companyData.qualityStandards || null,
        paymentTerms: companyData.paymentTerms || null,
        leadTime: companyData.leadTime || null,
        minimumOrder: companyData.minimumOrder || null,
        capacity: companyData.capacity || null,
        facilities: companyData.facilities || null,
        tags: companyData.tags || null,
        rating: companyData.rating || null,
        reviewCount: companyData.reviewCount || null,
        lastUpdatedBy: companyData.lastUpdatedBy || null,
        taxId: companyData.taxId || null,
        businessType: companyData.businessType || null,
        establishedYear: companyData.establishedYear || null,
        employeeCount: companyData.employeeCount || null,
        certificationLevel: companyData.certificationLevel || null,
        exportLicense: companyData.exportLicense || null,
        qualityCertifications: companyData.qualityCertifications || null,
        productCategories: companyData.productCategories || null,
        marketSegments: companyData.marketSegments || null,
        companySize: companyData.companySize || null,
        ownership: companyData.ownership || null,
        headquarters: companyData.headquarters || null,
        parentCompany: companyData.parentCompany || null,
        subsidiaries: companyData.subsidiaries || null,
        ...companyData
      };
      this.companies.set(id, company);
    });
  }

  private seedIntelligenceData() {
    // Simplified intelligence data seeding without complex nested objects
    // This is a minimal implementation to avoid type errors
  }

  // Normalize text for search
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Remove accents
      .replace(/[^\w\s]/g, " ")        // Replace special chars with spaces
      .replace(/\s+/g, " ")            // Normalize whitespace
      .trim();
  }

  // Core HS Code methods
  async getHsSections(): Promise<HsSection[]> {
    return Array.from(this.hsSections.values());
  }

  async getHsChapters(sectionCode?: string): Promise<HsChapter[]> {
    const chapters = Array.from(this.hsChapters.values());
    if (sectionCode) {
      return chapters.filter(chapter => chapter.sectionCode === sectionCode);
    }
    return chapters;
  }

  async getHsPartidas(chapterCode: string): Promise<HsPartida[]> {
    const partidas = Array.from(this.hsPartidas.values());
    return partidas.filter(partida => partida.chapterCode === chapterCode);
  }

  async getHsSubpartidas(partidaCode: string): Promise<HsSubpartida[]> {
    const subpartidas = Array.from(this.hsSubpartidas.values());
    return subpartidas.filter(subpartida => subpartida.partidaCode === partidaCode);
  }

  async getHsPartidaByCode(code: string): Promise<HsPartida | undefined> {
    return this.hsPartidas.get(code);
  }

  async getHsSubpartidaByCode(code: string): Promise<HsSubpartida | undefined> {
    return this.hsSubpartidas.get(code);
  }

  async getHsHierarchy(code: string): Promise<{section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida}> {
    const result: {section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida} = {};
    
    // Try to find as subpartida first (6 digits)
    if (code.length === 6) {
      const subpartida = this.hsSubpartidas.get(code);
      if (subpartida) {
        result.subpartida = subpartida;
        const partida = this.hsPartidas.get(subpartida.partidaCode);
        if (partida) {
          result.partida = partida;
          const chapter = this.hsChapters.get(partida.chapterCode);
          if (chapter) {
            result.chapter = chapter;
            const section = this.hsSections.get(chapter.sectionCode);
            if (section) result.section = section;
          }
        }
      }
    }
    // Try as partida (4 digits)
    else if (code.length === 4) {
      const partida = this.hsPartidas.get(code);
      if (partida) {
        result.partida = partida;
        const chapter = this.hsChapters.get(partida.chapterCode);
        if (chapter) {
          result.chapter = chapter;
          const section = this.hsSections.get(chapter.sectionCode);
          if (section) result.section = section;
        }
      }
    }
    // Try as chapter (2 digits)
    else if (code.length === 2) {
      const chapter = this.hsChapters.get(code);
      if (chapter) {
        result.chapter = chapter;
        const section = this.hsSections.get(chapter.sectionCode);
        if (section) result.section = section;
      }
    }

    return result;
  }

  async searchHsItems(query: string): Promise<{sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]}> {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
    
    const sections = Array.from(this.hsSections.values()).filter(section => {
      return queryWords.some(word => 
        this.normalizeText(section.description).includes(word) ||
        this.normalizeText(section.descriptionEn).includes(word)
      );
    });

    const chapters = Array.from(this.hsChapters.values()).filter(chapter => {
      return queryWords.some(word => 
        this.normalizeText(chapter.description).includes(word) ||
        this.normalizeText(chapter.descriptionEn).includes(word)
      );
    });

    const partidas = Array.from(this.hsPartidas.values()).filter(partida => {
      return queryWords.some(word => 
        this.normalizeText(partida.description).includes(word) ||
        this.normalizeText(partida.descriptionEn).includes(word)
      );
    });

    const subpartidas = Array.from(this.hsSubpartidas.values()).filter(subpartida => {
      return queryWords.some(word => 
        this.normalizeText(subpartida.description).includes(word) ||
        this.normalizeText(subpartida.descriptionEn).includes(word)
      );
    });

    return { sections, chapters, partidas, subpartidas };
  }

  // Company methods
  async getCompanies(type?: string, country?: string): Promise<Company[]> {
    let companies = Array.from(this.companies.values());
    
    if (type) {
      companies = companies.filter(company => company.type === type);
    }
    
    if (country) {
      companies = companies.filter(company => company.country === country);
    }
    
    return companies;
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
    
    return Array.from(this.companies.values()).filter(company => {
      return queryWords.some(word => 
        this.normalizeText(company.name).includes(word) ||
        this.normalizeText(company.type).includes(word) ||
        (company.products && company.products.some(product => 
          this.normalizeText(product).includes(word)
        ))
      );
    });
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const newCompany = {
      id,
      createdAt: new Date(),
      lastUpdated: new Date(),
      ...company
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  // Other required methods with minimal implementations
  async getMarketData(hsCode: string, originCountry: string, destinationCountry: string): Promise<MarketData[]> {
    return [];
  }

  async getCountryOpportunities(hsCode: string): Promise<CountryOpportunity[]> {
    return [];
  }

  async getCountryRequirements(countryCode: string, hsCode: string): Promise<CountryRequirement | undefined> {
    return undefined;
  }

  async getShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values());
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    return Array.from(this.shipments.values()).find(s => s.trackingNumber === trackingNumber);
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const id = randomUUID();
    const newShipment = {
      id,
      createdAt: new Date(),
      progress: shipment.progress || null,
      eta: shipment.eta || null,
      companyId: shipment.companyId || null,
      ...shipment
    };
    this.shipments.set(id, newShipment);
    return newShipment;
  }

  async updateShipmentStatus(id: string, status: string, progress?: number): Promise<Shipment | undefined> {
    const shipment = this.shipments.get(id);
    if (shipment) {
      shipment.status = status;
      if (progress !== undefined) {
        shipment.progress = progress;
      }
      this.shipments.set(id, shipment);
    }
    return shipment;
  }

  async getCustomsProcedures(country: string): Promise<CustomsProcedure[]> {
    return [];
  }

  async getTradeAlerts(active?: boolean): Promise<TradeAlert[]> {
    return [];
  }

  async getTradeOpportunities(active?: boolean): Promise<TradeOpportunity[]> {
    return [];
  }

  async getMarketIntelligence(recent?: boolean): Promise<MarketIntelligence[]> {
    return [];
  }

  async createTradeAlert(alert: InsertTradeAlert): Promise<TradeAlert> {
    const id = randomUUID();
    const newAlert = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: alert.isActive || null,
      affectedCountries: alert.affectedCountries || null,
      affectedHsCodes: alert.affectedHsCodes || null,
      validFrom: alert.validFrom || null,
      validUntil: alert.validUntil || null,
      actionRequired: alert.actionRequired || null,
      impact: alert.impact || null,
      regions: alert.regions || null,
      source: alert.source || null,
      sourceUrl: alert.sourceUrl || null,
      affectedProducts: alert.affectedProducts || null,
      impactLevel: alert.impactLevel || null,
      confidence: alert.confidence || null,
      actionRecommendation: alert.actionRecommendation || null,
      ...alert
    };
    this.tradeAlerts.set(id, newAlert);
    return newAlert;
  }

  async createTradeOpportunity(opportunity: InsertTradeOpportunity): Promise<TradeOpportunity> {
    const id = randomUUID();
    const newOpportunity = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: opportunity.isActive || null,
      productName: opportunity.productName || null,
      targetCountry: opportunity.targetCountry || null,
      opportunityValue: opportunity.opportunityValue || null,
      growthProjection: opportunity.growthProjection || null,
      marketEntryDifficulty: opportunity.marketEntryDifficulty || null,
      investmentRequired: opportunity.investmentRequired || null,
      paybackPeriod: opportunity.paybackPeriod || null,
      competitorAnalysis: opportunity.competitorAnalysis || null,
      marketTrends: opportunity.marketTrends || null,
      regulatoryRequirements: opportunity.regulatoryRequirements || null,
      distributionChannels: opportunity.distributionChannels || null,
      seasonalFactors: opportunity.seasonalFactors || null,
      recommendedActions: opportunity.recommendedActions || null,
      keySuccessFactors: opportunity.keySuccessFactors || null,
      expiresAt: opportunity.expiresAt || null,
      validUntil: opportunity.validUntil || null,
      requirements: opportunity.requirements || null,
      advantages: opportunity.advantages || null,
      risks: opportunity.risks || null,
      marketSize: opportunity.marketSize || null,
      growthRate: opportunity.growthRate || null,
      profitability: opportunity.profitability || null,
      timeframe: opportunity.timeframe || null,
      estimatedRevenue: opportunity.estimatedRevenue || null,
      confidenceLevel: opportunity.confidenceLevel || null,
      ...opportunity
    };
    this.tradeOpportunities.set(id, newOpportunity);
    return newOpportunity;
  }

  async createMarketIntelligence(intelligence: InsertMarketIntelligence): Promise<MarketIntelligence> {
    const id = randomUUID();
    const newIntelligence = {
      id,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      affectedCountries: intelligence.affectedCountries || null,
      validUntil: intelligence.validUntil || null,
      affectedHsCodes: intelligence.affectedHsCodes || null,
      tags: intelligence.tags || null,
      insights: intelligence.insights || null,
      insightsEn: intelligence.insightsEn || null,
      methodology: intelligence.methodology || null,
      methodologyEn: intelligence.methodologyEn || null,
      dataSource: intelligence.dataSource || null,
      dataSourceEn: intelligence.dataSourceEn || null,
      confidence: intelligence.confidence || null,
      isActive: intelligence.isActive || null,
      isFeature: intelligence.isFeature || null,
      priority: intelligence.priority || null,
      viewCount: intelligence.viewCount || null,
      downloadCount: intelligence.downloadCount || null,
      region: intelligence.region || null,
      affectedSectors: intelligence.affectedSectors || null,
      hsCodesImpacted: intelligence.hsCodesImpacted || null,
      keyInsights: intelligence.keyInsights || null,
      marketSize: intelligence.marketSize || null,
      marketGrowthRate: intelligence.marketGrowthRate || null,
      competitiveAnalysis: intelligence.competitiveAnalysis || null,
      riskAssessment: intelligence.riskAssessment || null,
      recommendations: intelligence.recommendations || null,
      dataQuality: intelligence.dataQuality || null,
      ...intelligence
    };
    this.marketIntelligence.set(id, newIntelligence);
    return newIntelligence;
  }
}

// Export instance for use in routes
export const storage = new MemStorage();