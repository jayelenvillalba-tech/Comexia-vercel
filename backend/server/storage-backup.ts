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
    // Seed HS Sections
    const sections = [
      { code: "I", number: 1, description: "Animales vivos y productos del reino animal", descriptionEn: "Live animals and animal products", chapterRange: "01-05" },
      { code: "II", number: 2, description: "Productos del reino vegetal", descriptionEn: "Vegetable products", chapterRange: "06-14" },
      { code: "III", number: 3, description: "Grasas y aceites animales o vegetales", descriptionEn: "Animal and vegetable fats and oils", chapterRange: "15" },
      { code: "IV", number: 4, description: "Productos de las industrias alimentarias", descriptionEn: "Prepared foodstuffs", chapterRange: "16-24" },
      { code: "V", number: 5, description: "Productos minerales", descriptionEn: "Mineral products", chapterRange: "25-27" },
      { code: "XVI", number: 16, description: "Máquinas y aparatos mecánicos", descriptionEn: "Machinery and mechanical appliances", chapterRange: "84-85" },
    ];

    sections.forEach(sectionData => {
      const id = randomUUID();
      const section = { id, ...sectionData };
      this.hsSections.set(section.code, section);
    });

    // Seed HS Chapters
    const chapters = [
      { code: "01", description: "Animales vivos", descriptionEn: "Live animals", sectionCode: "I", notes: "Animales destinados a reproducción, cría, engorde o sacrificio" },
      { code: "02", description: "Carnes y despojos comestibles", descriptionEn: "Meat and edible meat offal", sectionCode: "I", notes: "Carnes frescas, refrigeradas o congeladas" },
      { code: "03", description: "Pescados y crustáceos, moluscos y otros invertebrados acuáticos", descriptionEn: "Fish and crustaceans, molluscs and other aquatic invertebrates", sectionCode: "I", notes: "Productos de la pesca y acuicultura" },
      { code: "09", description: "Café, té, yerba mate y especias", descriptionEn: "Coffee, tea, mate and spices", sectionCode: "II", notes: "Productos vegetales para infusión y condimentación" },
      { code: "10", description: "Cereales", descriptionEn: "Cereals", sectionCode: "II", notes: "Granos para alimentación humana y animal" },
      { code: "61", description: "Prendas y complementos de vestir, de punto", descriptionEn: "Articles of apparel and clothing accessories, knitted or crocheted", sectionCode: "XI", notes: "Textiles y prendas de vestir de punto" },
      { code: "62", description: "Prendas y complementos de vestir, excepto los de punto", descriptionEn: "Articles of apparel and clothing accessories, not knitted or crocheted", sectionCode: "XI", notes: "Textiles y prendas de vestir tejidas" },
      { code: "84", description: "Calderas, máquinas, aparatos y artefactos mecánicos", descriptionEn: "Nuclear reactors, boilers, machinery and mechanical appliances", sectionCode: "XVI", notes: "Equipos mecánicos e industriales" },
      { code: "85", description: "Máquinas, aparatos y material eléctrico", descriptionEn: "Electrical machinery and equipment", sectionCode: "XVI", notes: "Equipos electrónicos y eléctricos" },
    ];

    chapters.forEach(chapterData => {
      const id = randomUUID();
      const chapter = { id, ...chapterData };
      this.hsChapters.set(chapter.code, chapter);
    });

    // Seed HS Partidas
    const partidas = [
      { code: "0101", description: "Caballos, asnos, mulos y burdéganos, vivos", descriptionEn: "Live horses, asses, mules and hinnies", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Incluye animales de pura raza" },
      { code: "0102", description: "Animales vivos de la especie bovina", descriptionEn: "Live bovine animals", chapterCode: "01", tariffRate: "0", units: ["u"], notes: "Ganado bovino para cría o sacrificio" },
      { code: "0201", description: "Carne de animales de la especie bovina, fresca o refrigerada", descriptionEn: "Meat of bovine animals, fresh or chilled", chapterCode: "02", tariffRate: "10.5", units: ["kg"], notes: "Cortes de carne bovina premium" },
      { code: "0901", description: "Café, incluso tostado o descafeinado", descriptionEn: "Coffee, whether or not roasted or decaffeinated", chapterCode: "09", tariffRate: "8.0", units: ["kg"], notes: "Granos de café en todas sus formas" },
      { code: "0902", description: "Té", descriptionEn: "Tea", chapterCode: "09", tariffRate: "8.0", units: ["kg"], notes: "Hojas de té para infusión" },
      { code: "1001", description: "Trigo y morcajo (tranquillón)", descriptionEn: "Wheat and meslin", chapterCode: "10", tariffRate: "5.0", units: ["t"], notes: "Trigo duro y blando" },
      { code: "1005", description: "Maíz", descriptionEn: "Maize (corn)", chapterCode: "10", tariffRate: "8.5" },
      { code: "6101", description: "Abrigos, chaquetones, capas y artículos similares, de punto, para hombres", descriptionEn: "Men's or boys' overcoats, knitted or crocheted", chapterCode: "61", tariffRate: "12.0", units: ["u"], notes: "Ropa exterior masculina de punto" },
      { code: "6102", description: "Abrigos, chaquetones, capas y artículos similares, de punto, para mujeres", descriptionEn: "Women's or girls' overcoats, knitted or crocheted", chapterCode: "61", tariffRate: "12.0", units: ["u"], notes: "Ropa exterior femenina de punto" },
      { code: "6201", description: "Abrigos, chaquetones, capas y artículos similares, para hombres", descriptionEn: "Men's or boys' overcoats, not knitted", chapterCode: "62", tariffRate: "14.0", units: ["u"], notes: "Ropa exterior masculina tejida" },
      { code: "8401", description: "Reactores nucleares", descriptionEn: "Nuclear reactors", chapterCode: "84", tariffRate: "0", units: ["u"], notes: "Equipos nucleares especiales" },
      { code: "8517", description: "Aparatos eléctricos de telefonía o telegrafía", descriptionEn: "Telephone sets and other apparatus for transmission", chapterCode: "85", tariffRate: "6.5", units: ["u"], notes: "Equipos de telecomunicaciones" },
      { code: "8528", description: "Monitores y proyectores", descriptionEn: "Monitors and projectors", chapterCode: "85", tariffRate: "8.0", units: ["u"], notes: "Pantallas y equipos de visualización" },
    ];

    partidas.forEach(partida => {
      const id = randomUUID();
      this.hsPartidas.set(id, { id, ...partida });
    });

    // Seed HS Subpartidas
    const subpartidas = [
      {
        code: "090111",
        description: "Café sin descafeinar, sin tostar",
        descriptionEn: "Coffee, not roasted, not decaffeinated",
        partidaCode: "0901",
        chapterCode: "09",
        tariffRate: "8.0",
        units: ["kg"],
        restrictions: [],
        notes: "Café verde para procesamiento industrial",
        notesEn: "Green coffee for industrial processing",
        isActive: true
      },
      {
        code: "090112",
        description: "Café descafeinado, sin tostar",
        descriptionEn: "Coffee, not roasted, decaffeinated",
        partidaCode: "0901",
        chapterCode: "09",
        tariffRate: "8.5",
        units: ["kg"],
        restrictions: [],
        notes: "Café verde descafeinado",
        notesEn: "Green decaffeinated coffee",
        isActive: true
      },
      {
        code: "090121",
        description: "Café sin descafeinar, tostado",
        descriptionEn: "Coffee, roasted, not decaffeinated",
        partidaCode: "0901",
        chapterCode: "09",
        tariffRate: "9.0",
        units: ["kg"],
        restrictions: [],
        notes: "Café tostado para consumo directo",
        notesEn: "Roasted coffee for direct consumption",
        isActive: true
      },
      {
        code: "090122",
        description: "Café descafeinado, tostado",
        descriptionEn: "Coffee, roasted, decaffeinated",
        partidaCode: "0901",
        chapterCode: "09",
        tariffRate: "9.5",
        units: ["kg"],
        restrictions: [],
        notes: "Café tostado descafeinado",
        notesEn: "Roasted decaffeinated coffee",
        isActive: true
      },
      {
        code: "610110",
        description: "Abrigos de punto para hombres, de lana",
        descriptionEn: "Men's overcoats, knitted, of wool",
        partidaCode: "6101",
        chapterCode: "61",
        tariffRate: "12.0",
        units: ["u"],
        restrictions: [],
        notes: "Abrigos masculinos de lana de punto",
        notesEn: "Men's wool knitted overcoats",
        isActive: true
      },
      {
        code: "610120",
        description: "Abrigos de punto para hombres, de algodón",
        descriptionEn: "Men's overcoats, knitted, of cotton",
        partidaCode: "6101",
        chapterCode: "61",
        tariffRate: "12.0",
        units: ["u"],
        restrictions: [],
        notes: "Abrigos masculinos de algodón de punto",
        notesEn: "Men's cotton knitted overcoats",
        isActive: true
      },
      {
        code: "851710",
        description: "Teléfonos para redes celulares o inalámbricas",
        descriptionEn: "Telephone sets for cellular or wireless networks",
        partidaCode: "8517",
        chapterCode: "85",
        tariffRate: "6.5",
        units: ["u"],
        restrictions: [],
        notes: "Teléfonos móviles y smartphones",
        notesEn: "Mobile phones and smartphones",
        isActive: true
      },
      {
        code: "851762",
        description: "Aparatos para recepción, conversión y transmisión de voz, imagen",
        descriptionEn: "Machines for the reception, conversion and transmission of voice, images",
        partidaCode: "8517",
        chapterCode: "85",
        tariffRate: "7.0",
        units: ["u"],
        restrictions: [],
        notes: "Equipos de comunicación electrónica",
        notesEn: "Electronic communication equipment",
        isActive: true
      },
      {
        code: "852812",
        description: "Monitores de color",
        descriptionEn: "Color monitors",
        partidaCode: "8528",
        chapterCode: "85",
        tariffRate: "8.0",
        units: ["u"],
        restrictions: [],
        notes: "Monitores de computadora a color",
        notesEn: "Color computer monitors",
        isActive: true
      },
      {
        code: "852813",
        description: "Monitores monocromo",
        descriptionEn: "Monochrome monitors",
        partidaCode: "8528",
        chapterCode: "85",
        tariffRate: "8.0",
        units: ["u"],
        restrictions: [],
        notes: "Monitores de computadora monocromo",
        notesEn: "Monochrome computer monitors",
        isActive: true
      },
      {
        code: "020110",
        description: "Canales y medias canales de bovino, frescas o refrigeradas",
        descriptionEn: "Carcasses and half-carcasses of bovine animals, fresh or chilled",
        partidaCode: "0201",
        chapterCode: "02",
        tariffRate: "10.0",
        units: ["kg"],
        restrictions: [],
        notes: "Carne de bovino en canal para distribución mayorista",
        notesEn: "Bovine carcass meat for wholesale distribution",
        isActive: true
      },
      {
        code: "020120",
        description: "Cuartos delanteros y trozos de bovino, frescos o refrigerados",
        descriptionEn: "Other cuts with bone in of bovine animals, fresh or chilled",
        partidaCode: "0201",
        chapterCode: "02",
        tariffRate: "10.5",
        units: ["kg"],
        restrictions: [],
        notes: "Cortes de carne bovina con hueso",
        notesEn: "Bovine meat cuts with bone",
        isActive: true
      },
      {
        code: "020130",
        description: "Carne de bovino deshuesada, fresca o refrigerada",
        descriptionEn: "Boneless meat of bovine animals, fresh or chilled",
        partidaCode: "0201",
        chapterCode: "02",
        tariffRate: "11.0",
        units: ["kg"],
        restrictions: [],
        notes: "Carne de bovino sin hueso, cortes premium",
        notesEn: "Boneless bovine meat, premium cuts",
        isActive: true
      },
      {
        code: "100110",
        description: "Trigo duro",
        descriptionEn: "Durum wheat",
        partidaCode: "1001",
        chapterCode: "10",
        tariffRate: "5.0",
        units: ["t"],
        restrictions: [],
        notes: "Trigo para pasta y productos especiales",
        notesEn: "Wheat for pasta and special products",
        isActive: true
      },
      {
        code: "100190",
        description: "Los demás trigos",
        descriptionEn: "Other wheat",
        partidaCode: "1001",
        chapterCode: "10",
        tariffRate: "4.5",
        units: ["t"],
        restrictions: [],
        notes: "Trigo blando para panadería",
        notesEn: "Soft wheat for bakery",
        isActive: true
      },
      {
        code: "100510",
        description: "Maíz para siembra",
        descriptionEn: "Seed corn",
        partidaCode: "1005",
        chapterCode: "10",
        tariffRate: "8.0",
        units: ["kg"],
        restrictions: ["license_required"],
        notes: "Semillas de maíz certificadas para siembra",
        notesEn: "Certified corn seeds for planting",
        isActive: true
      },
      {
        code: "100590",
        description: "Los demás maíces",
        descriptionEn: "Other maize",
        partidaCode: "1005",
        chapterCode: "10",
        tariffRate: "8.5",
        units: ["t"],
        restrictions: [],
        notes: "Maíz para consumo animal e industrial",
        notesEn: "Corn for animal feed and industrial use",
        isActive: true
      }
    ];

    subpartidas.forEach(subpartida => {
      const id = randomUUID();
      this.hsSubpartidas.set(id, { id, ...subpartida });
    });

    // Seed Companies with enhanced data
    const companies = [
      {
        name: "Café Export S.A.",
        legalName: "Cafe Export Sociedade Anônima",
        country: "Brasil",
        type: "exporter",
        products: ["Café Arábica", "Café Robusta", "Azúcar Refinada", "Soja"],
        verified: true,
        contactEmail: "info@cafeexport.com",
        website: "www.cafeexport.com",
        taxId: "12.345.678/0001-90",
        businessType: "corporation",
        establishedYear: 1987,
        employeeCount: 245,
        annualRevenue: "45000000",
        creditRating: "AA",
        riskScore: "15.5",
        paymentTerms: "30 días",
        totalTransactions: 1247,
        averageOrderValue: "125000",
        onTimeDeliveryRate: "96.8",
        certifications: ["ISO 9001", "Fair Trade", "Rainforest Alliance", "HACCP"],
        sanctions: false,
        contactPerson: "João Silva",
        phone: "+55 11 3456-7890",
        address: "Rua do Café, 123, São Paulo, SP, Brasil"
      },
      {
        name: "Tech Import Ltda.",
        legalName: "Tecnología Import Limitada",
        country: "Argentina",
        type: "importer",
        products: ["Smartphones", "Laptops", "Maquinaria Industrial", "Componentes Electrónicos"],
        verified: true,
        contactEmail: "contact@techimport.com",
        website: "www.techimport.com.ar",
        taxId: "30-12345678-9",
        businessType: "llc",
        establishedYear: 2005,
        employeeCount: 89,
        annualRevenue: "18500000",
        creditRating: "A",
        riskScore: "22.1",
        paymentTerms: "45 días",
        totalTransactions: 892,
        averageOrderValue: "85000",
        onTimeDeliveryRate: "94.2",
        certifications: ["ISO 9001", "CE Marking"],
        sanctions: false,
        contactPerson: "María González",
        phone: "+54 11 4567-8901",
        address: "Av. Corrientes 1234, Buenos Aires, Argentina"
      },
      {
        name: "Global Trading Inc.",
        legalName: "Global Trading Incorporated",
        country: "Chile",
        type: "both",
        products: ["Textiles", "Calzado Deportivo", "Ropa de Trabajo"],
        verified: false,
        contactEmail: "sales@globaltrading.com",
        website: "www.globaltrading.cl",
        taxId: "96.789.123-4",
        businessType: "corporation",
        establishedYear: 2012,
        employeeCount: 34,
        annualRevenue: "7200000",
        creditRating: "BBB",
        riskScore: "45.8",
        paymentTerms: "60 días",
        totalTransactions: 324,
        averageOrderValue: "42000",
        onTimeDeliveryRate: "88.5",
        certifications: ["OEKO-TEX", "WRAP"],
        sanctions: false,
        contactPerson: "Carlos Mendoza",
        phone: "+56 2 2345-6789",
        address: "Las Condes 567, Santiago, Chile"
      },
      {
        name: "European Food Distributors GmbH",
        legalName: "European Food Distributors Gesellschaft mit beschränkter Haftung",
        country: "Alemania",
        type: "importer",
        products: ["Café Especializado", "Cacao", "Especias", "Productos Orgánicos"],
        verified: true,
        contactEmail: "procurement@eurofoods.de",
        website: "www.eurofoods.de",
        taxId: "DE123456789",
        businessType: "gmbh",
        establishedYear: 1995,
        employeeCount: 156,
        annualRevenue: "28000000",
        creditRating: "AAA",
        riskScore: "8.2",
        paymentTerms: "30 días",
        totalTransactions: 2156,
        averageOrderValue: "95000",
        onTimeDeliveryRate: "98.7",
        certifications: ["BRC", "IFS", "Bio", "Fair Trade", "ISO 22000"],
        sanctions: false,
        contactPerson: "Hans Mueller",
        phone: "+49 40 1234-5678",
        address: "Speicherstadt 12, 20457 Hamburg, Deutschland"
      },
      {
        name: "Pacific Logistics Solutions",
        legalName: "Pacific Logistics Solutions LLC",
        country: "Estados Unidos",
        type: "both",
        products: ["Servicios de Importación", "Distribución", "Almacenamiento"],
        verified: true,
        contactEmail: "business@pacificlogistics.com",
        website: "www.pacificlogistics.com",
        taxId: "12-3456789",
        businessType: "llc",
        establishedYear: 2008,
        employeeCount: 312,
        annualRevenue: "52000000",
        creditRating: "AA",
        riskScore: "12.7",
        paymentTerms: "30 días",
        totalTransactions: 3487,
        averageOrderValue: "145000",
        onTimeDeliveryRate: "97.3",
        certifications: ["C-TPAT", "ISO 9001", "CTPAT", "HAZMAT"],
        sanctions: false,
        contactPerson: "Jennifer Chang",
        phone: "+1 310 555-0123",
        address: "1234 Harbor Blvd, Los Angeles, CA 90210, USA"
      }
    ];

    companies.forEach(company => {
      const id = randomUUID();
      this.companies.set(id, { 
        id, 
        ...company, 
        lastUpdated: new Date(),
        createdAt: new Date() 
      });
    });

    // Seed Shipments
    const shipments = [
      { trackingNumber: "KRA-2024-001", origin: "São Paulo", destination: "Buenos Aires", status: "in_transit", progress: 65, eta: new Date("2024-12-15"), companyId: null },
      { trackingNumber: "KRA-2024-002", origin: "Santiago", destination: "Lima", status: "customs", progress: 45, eta: null, companyId: null },
    ];

    shipments.forEach(shipment => {
      const id = randomUUID();
      this.shipments.set(id, { id, ...shipment, createdAt: new Date() });
    });

    // Seed Customs Procedures
    const procedures = [
      { name: "Declaración de Importación", nameEn: "Import Declaration", description: "Formulario obligatorio para todas las importaciones", descriptionEn: "Mandatory form for all imports", type: "required", country: "Argentina", documents: {} },
      { name: "Certificado de Origen", nameEn: "Certificate of Origin", description: "Requerido para aplicar preferencias arancelarias", descriptionEn: "Required to apply tariff preferences", type: "optional", country: "Argentina", documents: {} },
    ];

    procedures.forEach(procedure => {
      const id = randomUUID();
      this.customsProcedures.set(id, { id, ...procedure });
    });

    // Seed Country Opportunities for Coffee (HS 0901)
    const countryOpportunities = [
      {
        hsCode: "0901",
        countryCode: "DE",
        countryName: "Alemania",
        opportunityScore: "95.5",
        demandScore: "92.0",
        tariffScore: "85.0",
        logisticsScore: "98.0",
        riskScore: "88.0",
        tradeAgreements: ["UE-Mercosur", "Acuerdo de Libre Comercio UE"],
        avgTariffRate: "7.5",
        importVolumeGrowth: "12.3",
        marketSizeUsd: "2840000000",
        competitionLevel: "medium",
        logisticsComplexity: "simple"
      },
      {
        hsCode: "0901",
        countryCode: "US",
        countryName: "Estados Unidos",
        opportunityScore: "89.2",
        demandScore: "95.0",
        tariffScore: "75.0",
        logisticsScore: "92.0",
        riskScore: "85.0",
        tradeAgreements: ["Sin acuerdos preferenciales"],
        avgTariffRate: "15.2",
        importVolumeGrowth: "8.7",
        marketSizeUsd: "4200000000",
        competitionLevel: "high",
        logisticsComplexity: "moderate"
      },
      {
        hsCode: "0901",
        countryCode: "JP",
        countryName: "Japón",
        opportunityScore: "82.1",
        demandScore: "78.0",
        tariffScore: "90.0",
        logisticsScore: "88.0",
        riskScore: "92.0",
        tradeAgreements: ["TPP-11", "RCEP"],
        avgTariffRate: "6.8",
        importVolumeGrowth: "15.4",
        marketSizeUsd: "1950000000",
        competitionLevel: "medium",
        logisticsComplexity: "moderate"
      },
      {
        hsCode: "0901",
        countryCode: "CN",
        countryName: "China",
        opportunityScore: "78.9",
        demandScore: "85.0",
        tariffScore: "65.0",
        logisticsScore: "82.0",
        riskScore: "75.0",
        tradeAgreements: ["RCEP"],
        avgTariffRate: "18.5",
        importVolumeGrowth: "22.1",
        marketSizeUsd: "3100000000",
        competitionLevel: "high",
        logisticsComplexity: "complex"
      },
      {
        hsCode: "0901",
        countryCode: "CA",
        countryName: "Canadá",
        opportunityScore: "91.3",
        demandScore: "88.0",
        tariffScore: "95.0",
        logisticsScore: "94.0",
        riskScore: "90.0",
        tradeAgreements: ["USMCA", "CPTPP"],
        avgTariffRate: "4.2",
        importVolumeGrowth: "9.8",
        marketSizeUsd: "890000000",
        competitionLevel: "low",
        logisticsComplexity: "simple"
      }
    ];

    countryOpportunities.forEach(opportunity => {
      const id = randomUUID();
      this.countryOpportunities.set(id, { id, ...opportunity });
    });

    // Seed Country Requirements
    const countryRequirements = [
      {
        countryCode: "DE",
        hsCode: "0901",
        requiredDocuments: ["Certificado de Origen", "Factura Comercial", "Lista de Empaque", "Certificado Fitosanitario"],
        technicalStandards: ["EU Regulation 178/2002", "HACCP", "Organic Certification (opcional)"],
        phytosanitaryReqs: ["Libre de plagas específicas", "Análisis de pesticidas"],
        labelingReqs: ["Etiquetado en alemán", "Información nutricional", "Código de barras EAN"],
        packagingReqs: ["Material apto para alimentos", "Peso neto declarado"],
        estimatedProcessingTime: 7,
        additionalFees: {
          "inspection_fee": 150,
          "documentation_fee": 75,
          "handling_fee": 50
        }
      },
      {
        countryCode: "US",
        hsCode: "0901",
        requiredDocuments: ["Commercial Invoice", "Packing List", "Bill of Lading", "FDA Prior Notice"],
        technicalStandards: ["FDA Food Safety Modernization Act", "USDA Organic (opcional)"],
        phytosanitaryReqs: ["Pest free declaration", "Mycotoxin analysis"],
        labelingReqs: ["English labeling", "Nutrition facts", "Country of origin"],
        packagingReqs: ["Food grade packaging", "Net weight declaration"],
        estimatedProcessingTime: 5,
        additionalFees: {
          "fda_registration": 200,
          "customs_fee": 125,
          "inspection_fee": 180
        }
      }
    ];

    countryRequirements.forEach(requirement => {
      const id = randomUUID();
      this.countryRequirements.set(id, { id, ...requirement });
    });
  }

  async getHsSections(): Promise<HsSection[]> {
    return Array.from(this.hsSections.values()).sort((a, b) => a.number - b.number);
  }

  async getHsChapters(sectionCode?: string): Promise<HsChapter[]> {
    const chapters = Array.from(this.hsChapters.values());
    if (sectionCode) {
      return chapters.filter(c => c.sectionCode === sectionCode);
    }
    return chapters;
  }

  async getHsPartidas(chapterCode: string): Promise<HsPartida[]> {
    return Array.from(this.hsPartidas.values()).filter(p => p.chapterCode === chapterCode);
  }

  async searchHsPartidas(query: string): Promise<HsPartida[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.hsPartidas.values()).filter(p => 
      p.description.toLowerCase().includes(lowerQuery) || 
      p.descriptionEn.toLowerCase().includes(lowerQuery) ||
      p.code.includes(lowerQuery)
    );
  }

  async getHsPartidaByCode(code: string): Promise<HsPartida | undefined> {
    return Array.from(this.hsPartidas.values()).find(p => p.code === code);
  }

  async getHsSubpartidas(partidaCode: string): Promise<HsSubpartida[]> {
    return Array.from(this.hsSubpartidas.values())
      .filter(s => s.partidaCode === partidaCode && s.isActive)
      .sort((a, b) => a.code.localeCompare(b.code));
  }

  async getHsSubpartidaByCode(code: string): Promise<HsSubpartida | undefined> {
    return Array.from(this.hsSubpartidas.values()).find(s => s.code === code && s.isActive);
  }

  async searchHsItems(query: string): Promise<{sections: HsSection[], chapters: HsChapter[], partidas: HsPartida[], subpartidas: HsSubpartida[]}> {
    const lowerQuery = query.toLowerCase();
    
    // Enhanced search with common synonyms and translations
    const synonymMap: Record<string, string[]> = {
      'electronics': ['eléctrico', 'electrónico', 'electrical', 'electronic', 'aparatos', 'máquinas', 'equipment'],
      'textiles': ['textile', 'tejido', 'tela', 'ropa', 'vestir', 'prendas', 'clothing', 'apparel', 'fabric'],
      'smartphone': ['teléfono', 'telefono', 'móvil', 'movil', 'celular', 'phone', 'cellular'],
      'phone': ['teléfono', 'telefono', 'móvil', 'movil', 'celular', 'smartphone'],
      'computer': ['computadora', 'ordenador', 'informática', 'informacion'],
      'monitor': ['pantalla', 'display', 'screen'],
      'coffee': ['café', 'cafe'],
      'tea': ['té', 'te'],
      'meat': ['carne', 'carnes'],
      'clothing': ['ropa', 'vestir', 'prendas', 'textiles']
    };
    
    // Create expanded search terms including synonyms
    let searchTerms = lowerQuery.split(/[\s,.-]+/).filter(term => term.length > 1);
    
    // Add synonyms to search terms
    const expandedTerms = [...searchTerms];
    searchTerms.forEach(term => {
      if (synonymMap[term]) {
        expandedTerms.push(...synonymMap[term]);
      }
    });
    
    searchTerms = [...new Set(expandedTerms)]; // Remove duplicates
    
    const sections = Array.from(this.hsSections.values()).filter(s => {
      const searchText = this.normalizeText(`${s.description} ${s.descriptionEn} ${s.code}`);
      return searchTerms.some(term => searchText.includes(this.normalizeText(term))) || searchText.includes(this.normalizeText(lowerQuery));
    });
    
    const chapters = Array.from(this.hsChapters.values()).filter(c => {
      const searchText = this.normalizeText(`${c.description} ${c.descriptionEn} ${c.code}`);
      return searchTerms.some(term => searchText.includes(this.normalizeText(term))) || searchText.includes(this.normalizeText(lowerQuery));
    });
    
    const partidas = Array.from(this.hsPartidas.values()).filter(p => {
      const searchText = this.normalizeText(`${p.description} ${p.descriptionEn} ${p.code}`);
      return searchTerms.some(term => searchText.includes(this.normalizeText(term))) || searchText.includes(this.normalizeText(lowerQuery));
    });
    
    const subpartidas = Array.from(this.hsSubpartidas.values()).filter(s => {
      if (!s.isActive) return false;
      const searchText = this.normalizeText(`${s.description} ${s.descriptionEn} ${s.code}`);
      // Also include units in search for better product matching
      const unitsText = s.units ? s.units.join(' ') : '';
      const fullSearchText = this.normalizeText(`${searchText} ${unitsText}`);
      return searchTerms.some(term => fullSearchText.includes(this.normalizeText(term))) || fullSearchText.includes(this.normalizeText(lowerQuery));
    });
    
    // Add some debug logging
    console.log(`Search for "${query}" found:`, {
      sections: sections.length,
      chapters: chapters.length, 
      partidas: partidas.length,
      subpartidas: subpartidas.length
    });
    
    // If no results found, try even more flexible matching
    if (sections.length === 0 && chapters.length === 0 && partidas.length === 0 && subpartidas.length === 0) {
      console.log('No results found, trying fuzzy search...');
      
      // Try partial word matching
      const partialQuery = this.normalizeText(lowerQuery.substring(0, Math.max(3, Math.floor(lowerQuery.length * 0.7))));
      
      const flexibleSections = Array.from(this.hsSections.values()).filter(s => {
        const text = this.normalizeText(`${s.description} ${s.descriptionEn}`);
        return text.includes(partialQuery);
      });
      
      const flexibleChapters = Array.from(this.hsChapters.values()).filter(c => {
        const text = this.normalizeText(`${c.description} ${c.descriptionEn}`);
        return text.includes(partialQuery);
      });
      
      const flexiblePartidas = Array.from(this.hsPartidas.values()).filter(p => {
        const text = this.normalizeText(`${p.description} ${p.descriptionEn}`);
        return text.includes(partialQuery);
      });
      
      const flexibleSubpartidas = Array.from(this.hsSubpartidas.values()).filter(s => {
        if (!s.isActive) return false;
        const text = this.normalizeText(`${s.description} ${s.descriptionEn}`);
        return text.includes(partialQuery);
      });
      
      console.log('Flexible search found:', {
        sections: flexibleSections.length,
        chapters: flexibleChapters.length,
        partidas: flexiblePartidas.length, 
        subpartidas: flexibleSubpartidas.length
      });
      
      return {
        sections: flexibleSections,
        chapters: flexibleChapters,
        partidas: flexiblePartidas,
        subpartidas: flexibleSubpartidas
      };
    }
    
    return { sections, chapters, partidas, subpartidas };
  }
  
  // Helper function to normalize text (remove accents, convert to lowercase)
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics/accents
      .replace(/[^a-z0-9\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async getHsHierarchy(code: string): Promise<{section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida}> {
    const result: {section?: HsSection, chapter?: HsChapter, partida?: HsPartida, subpartida?: HsSubpartida} = {};
    
    // Try to find as subpartida first (6 digits)
    if (code.length >= 6) {
      const subpartida = await this.getHsSubpartidaByCode(code.substring(0, 6));
      if (subpartida) {
        result.subpartida = subpartida;
        const partida = Array.from(this.hsPartidas.values()).find(p => p.code === subpartida.partidaCode);
        if (partida) {
          result.partida = partida;
          const chapter = Array.from(this.hsChapters.values()).find(c => c.code === partida.chapterCode);
          if (chapter) {
            result.chapter = chapter;
            const section = Array.from(this.hsSections.values()).find(s => s.code === chapter.sectionCode);
            if (section) {
              result.section = section;
            }
          }
        }
        return result;
      }
    }
    
    // Try to find as partida (4 digits)
    if (code.length >= 4) {
      const partida = await this.getHsPartidaByCode(code.substring(0, 4));
      if (partida) {
        result.partida = partida;
        const chapter = Array.from(this.hsChapters.values()).find(c => c.code === partida.chapterCode);
        if (chapter) {
          result.chapter = chapter;
          const section = Array.from(this.hsSections.values()).find(s => s.code === chapter.sectionCode);
          if (section) {
            result.section = section;
          }
        }
        return result;
      }
    }
    
    // Try to find as chapter (2 digits)
    if (code.length >= 2) {
      const chapter = Array.from(this.hsChapters.values()).find(c => c.code === code.substring(0, 2));
      if (chapter) {
        result.chapter = chapter;
        const section = Array.from(this.hsSections.values()).find(s => s.code === chapter.sectionCode);
        if (section) {
          result.section = section;
        }
        return result;
      }
    }
    
    // Try to find as section
    const section = Array.from(this.hsSections.values()).find(s => s.code.toLowerCase() === code.toLowerCase());
    if (section) {
      result.section = section;
    }
    
    return result;
  }

  async getCompanies(type?: string, country?: string): Promise<Company[]> {
    let companies = Array.from(this.companies.values());
    
    if (type) {
      companies = companies.filter(c => c.type === type || c.type === "both");
    }
    
    if (country) {
      companies = companies.filter(c => c.country === country);
    }
    
    return companies;
  }

  async searchCompanies(query: string): Promise<Company[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.companies.values()).filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.country.toLowerCase().includes(lowerQuery) ||
      c.products?.some(p => p.toLowerCase().includes(lowerQuery))
    );
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = { 
      ...insertCompany, 
      id, 
      createdAt: new Date(),
      lastUpdated: new Date(),
      products: insertCompany.products || null,
      verified: insertCompany.verified ?? false,
      contactEmail: insertCompany.contactEmail || null,
      website: insertCompany.website || null,
      legalName: insertCompany.legalName || null,
      taxId: insertCompany.taxId || null,
      businessType: insertCompany.businessType || null,
      establishedYear: insertCompany.establishedYear || null,
      employeeCount: insertCompany.employeeCount || null,
      annualRevenue: insertCompany.annualRevenue || null,
      creditRating: insertCompany.creditRating || null,
      riskScore: insertCompany.riskScore || null,
      paymentTerms: insertCompany.paymentTerms || null,
      totalTransactions: insertCompany.totalTransactions || null,
      averageOrderValue: insertCompany.averageOrderValue || null,
      onTimeDeliveryRate: insertCompany.onTimeDeliveryRate || null,
      certifications: insertCompany.certifications || null,
      sanctions: insertCompany.sanctions ?? false,
      contactPerson: insertCompany.contactPerson || null,
      phone: insertCompany.phone || null,
      address: insertCompany.address || null
    };
    this.companies.set(id, company);
    return company;
  }

  async getMarketData(hsCode: string, originCountry: string, destinationCountry: string): Promise<MarketData[]> {
    // Return mock market data for demonstration
    const id = randomUUID();
    const mockData: MarketData = {
      id,
      hsCode,
      originCountry,
      destinationCountry,
      year: 2024,
      volume: 125450,
      valueUsd: "2100000",
      avgPriceUsd: "16.74",
      activeCompanies: 87
    };
    return [mockData];
  }

  async getShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values());
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    return Array.from(this.shipments.values()).find(s => s.trackingNumber === trackingNumber);
  }

  async createShipment(insertShipment: InsertShipment): Promise<Shipment> {
    const id = randomUUID();
    const shipment: Shipment = { 
      ...insertShipment, 
      id, 
      createdAt: new Date(),
      progress: insertShipment.progress || null,
      eta: insertShipment.eta || null,
      companyId: insertShipment.companyId || null
    };
    this.shipments.set(id, shipment);
    return shipment;
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
    return Array.from(this.customsProcedures.values()).filter(p => p.country === country);
  }

  async getCountryOpportunities(hsCode: string): Promise<CountryOpportunity[]> {
    return Array.from(this.countryOpportunities.values())
      .filter(opportunity => opportunity.hsCode === hsCode)
      .sort((a, b) => parseFloat(b.opportunityScore || "0") - parseFloat(a.opportunityScore || "0"));
  }

  async getCountryRequirements(countryCode: string, hsCode: string): Promise<CountryRequirement | undefined> {
    return Array.from(this.countryRequirements.values())
      .find(req => req.countryCode === countryCode && req.hsCode === hsCode);
  }

  // Intelligence methods
  async getTradeAlerts(active = true): Promise<TradeAlert[]> {
    return Array.from(this.tradeAlerts.values())
      .filter(alert => !active || alert.isActive)
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }

  async getTradeOpportunities(active = true): Promise<TradeOpportunity[]> {
    return Array.from(this.tradeOpportunities.values())
      .filter(opportunity => !active || opportunity.isActive)
      .sort((a, b) => parseFloat(b.confidenceScore || '0') - parseFloat(a.confidenceScore || '0'));
  }

  async getMarketIntelligence(recent = true): Promise<MarketIntelligence[]> {
    const reports = Array.from(this.marketIntelligence.values());
    if (recent) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reports
        .filter(report => new Date(report.publishedAt || '') > thirtyDaysAgo)
        .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
    }
    return reports.sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime());
  }

  async createTradeAlert(alertData: InsertTradeAlert): Promise<TradeAlert> {
    const id = randomUUID();
    const alert: TradeAlert = {
      id,
      ...alertData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tradeAlerts.set(id, alert);
    return alert;
  }

  async createTradeOpportunity(opportunityData: InsertTradeOpportunity): Promise<TradeOpportunity> {
    const id = randomUUID();
    const opportunity: TradeOpportunity = {
      id,
      ...opportunityData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tradeOpportunities.set(id, opportunity);
    return opportunity;
  }

  async createMarketIntelligence(intelligenceData: InsertMarketIntelligence): Promise<MarketIntelligence> {
    const id = randomUUID();
    const intelligence: MarketIntelligence = {
      id,
      ...intelligenceData,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.marketIntelligence.set(id, intelligence);
    return intelligence;
  }

  private seedIntelligenceData() {
    // Seed Trade Alerts
    const alerts = [
      {
        title: "Nueva regulación fitosanitaria en Brasil",
        titleEn: "New phytosanitary regulation in Brazil",
        description: "Brasil implementará nuevos requisitos fitosanitarios para productos agrícolas importados desde marzo 2024.",
        descriptionEn: "Brazil will implement new phytosanitary requirements for imported agricultural products from March 2024.",
        type: "regulatory" as const,
        severity: "high" as const,
        category: "regulatory_change" as const,
        affectedCountries: ["BR", "AR", "UY"],
        affectedProducts: ["0901", "1001", "1507"],
        impactLevel: "85",
        confidence: "92",
        validUntil: new Date('2024-12-31'),
        source: "SENASA Brasil",
        actionRecommendation: "Revisar documentación fitosanitaria y contactar autoridades locales antes de exportar.",
        actionRecommendationEn: "Review phytosanitary documentation and contact local authorities before exporting.",
        relatedLinks: ["https://senasa.br/regulacion2024"],
        metadata: {},
        isActive: true
      },
      {
        title: "Volatilidad en precios del café",
        titleEn: "Coffee price volatility",
        description: "Los precios del café arábica han mostrado alta volatilidad debido a condiciones climáticas adversas.",
        descriptionEn: "Arabica coffee prices have shown high volatility due to adverse weather conditions.",
        type: "price" as const,
        severity: "medium" as const,
        category: "price_volatility" as const,
        affectedCountries: ["CO", "BR", "HN", "GT"],
        affectedProducts: ["0901"],
        impactLevel: "70",
        confidence: "88",
        validUntil: new Date('2024-06-30'),
        source: "ICO - International Coffee Organization",
        actionRecommendation: "Considerar coberturas de precio y revisar contratos a futuro.",
        actionRecommendationEn: "Consider price hedging and review futures contracts.",
        relatedLinks: [],
        metadata: { priceIncrease: 25.5 },
        isActive: true
      }
    ];

    alerts.forEach(alertData => {
      const id = randomUUID();
      const alert = {
        id,
        ...alertData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.tradeAlerts.set(id, alert);
    });

    // Seed Trade Opportunities
    const opportunities = [
      {
        title: "Oportunidad de exportación de quinua a Alemania",
        titleEn: "Quinoa export opportunity to Germany",
        description: "Creciente demanda de superalimentos en Europa crea oportunidad para exportadores de quinua.",
        descriptionEn: "Growing superfood demand in Europe creates opportunity for quinoa exporters.",
        originCountry: "BO",
        targetCountry: "DE",
        hsCode: "1008",
        productName: "Quinua",
        opportunityValue: "2500000",
        growthProjection: "34.5",
        competitionLevel: "medium" as const,
        marketEntryDifficulty: "moderate" as const,
        recommendedAction: "Establecer contactos con importadores alemanes y obtener certificaciones orgánicas.",
        recommendedActionEn: "Establish contacts with German importers and obtain organic certifications.",
        keyBenefits: [
          "Precios premium para quinua orgánica",
          "Mercado en crecimiento del 25% anual",
          "Acuerdo comercial UE-Mercosur facilita acceso"
        ],
        keyBenefitsEn: [
          "Premium prices for organic quinoa",
          "Growing market at 25% annually",
          "EU-Mercosur trade agreement facilitates access"
        ],
        potentialRisks: [
          "Competencia de Perú y Ecuador",
          "Requisitos estrictos de calidad orgánica"
        ],
        potentialRisksEn: [
          "Competition from Peru and Ecuador",
          "Strict organic quality requirements"
        ],
        timeToMarket: 8,
        initialInvestment: "150000",
        roi: "45",
        confidenceScore: "87",
        isActive: true,
        expiresAt: new Date('2024-08-15')
      },
      {
        title: "Oportunidad carne bovina premium en Japón",
        titleEn: "Premium beef opportunity in Japan",
        description: "Japón busca diversificar sus proveedores de carne bovina premium tras acuerdos comerciales.",
        descriptionEn: "Japan seeks to diversify premium beef suppliers following trade agreements.",
        originCountry: "AR",
        targetCountry: "JP",
        hsCode: "0201",
        productName: "Carne Bovina Premium",
        opportunityValue: "15000000",
        growthProjection: "28.2",
        competitionLevel: "high" as const,
        marketEntryDifficulty: "difficult" as const,
        recommendedAction: "Implementar certificación halal y rastreabilidad completa del producto.",
        recommendedActionEn: "Implement halal certification and complete product traceability.",
        keyBenefits: [
          "Precios 40% superiores al mercado local",
          "Demanda constante de carne premium",
          "Relación comercial establecida Argentina-Japón"
        ],
        keyBenefitsEn: [
          "Prices 40% above local market",
          "Consistent demand for premium meat",
          "Established Argentina-Japan trade relationship"
        ],
        potentialRisks: [
          "Regulaciones sanitarias muy estrictas",
          "Alta competencia de Australia y Estados Unidos"
        ],
        potentialRisksEn: [
          "Very strict sanitary regulations",
          "High competition from Australia and United States"
        ],
        timeToMarket: 12,
        initialInvestment: "800000",
        roi: "62",
        confidenceScore: "78",
        isActive: true,
        expiresAt: new Date('2024-09-30')
      }
    ];

    opportunities.forEach(oppData => {
      const id = randomUUID();
      const opportunity = {
        id,
        ...oppData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.tradeOpportunities.set(id, opportunity);
    });

    // Seed Market Intelligence
    const intelligenceReports = [
      {
        title: "Análisis del mercado de commodities Q1 2024",
        titleEn: "Commodities market analysis Q1 2024",
        summary: "Análisis trimestral de tendencias en commodities agrícolas con enfoque en América Latina.",
        summaryEn: "Quarterly analysis of agricultural commodity trends with focus on Latin America.",
        content: "El primer trimestre de 2024 ha mostrado una recuperación gradual en los precios de commodities...",
        contentEn: "The first quarter of 2024 has shown a gradual recovery in commodity prices...",
        type: "market_analysis" as const,
        region: "americas" as const,
        affectedCountries: ["AR", "BR", "CO", "PE"],
        affectedSectors: ["agriculture", "mining"],
        hsCodesImpacted: ["0901", "1001", "1507"],
        keyInsights: [
          "Recuperación del 15% en precios de soja",
          "Volatilidad persistente en mercado cafetero",
          "Nuevas oportunidades en mercados asiáticos"
        ],
        keyInsightsEn: [
          "15% recovery in soybean prices",
          "Persistent volatility in coffee market",
          "New opportunities in Asian markets"
        ],
        dataPoints: {
          soybeanPriceIncrease: 15.2,
          coffeePriceVolatility: 28.5,
          asianDemandGrowth: 22.1
        },
        sources: ["CBOT", "ICE Futures", "Reuters Commodities"],
        reliability: "94",
        relevanceScore: "89",
        publishedAt: new Date(),
        validUntil: new Date('2024-06-30'),
        tags: ["commodities", "agriculture", "prices", "latin-america"],
        author: "Kora Market Intelligence",
        isFeature: true
      }
    ];

    intelligenceReports.forEach(reportData => {
      const id = randomUUID();
      const report = {
        id,
        ...reportData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.marketIntelligence.set(id, report);
    });
  }
}

export const storage = new MemStorage();
