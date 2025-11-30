import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hsSections = pgTable("hs_sections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // I, II, III, etc.
  number: integer("number").notNull(), // 1, 2, 3, etc.
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  chapterRange: text("chapter_range").notNull(), // "01-05"
});

export const hsChapters = pgTable("hs_chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  sectionCode: text("section_code").notNull(),
  notes: text("notes"),
  notesEn: text("notes_en"),
});

export const hsPartidas = pgTable("hs_partidas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // 4-digit code
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  chapterCode: text("chapter_code").notNull(),
  tariffRate: decimal("tariff_rate", { precision: 5, scale: 2 }),
  units: text("units").array(), // kg, l, u, m2, etc.
  notes: text("notes"),
  notesEn: text("notes_en"),
});

export const hsSubpartidas = pgTable("hs_subpartidas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(), // 6-digit code
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  partidaCode: text("partida_code").notNull(), // 4-digit parent
  chapterCode: text("chapter_code").notNull(),
  tariffRate: decimal("tariff_rate", { precision: 5, scale: 2 }),
  specialTariffRate: decimal("special_tariff_rate", { precision: 5, scale: 2 }),
  units: text("units").array(),
  restrictions: text("restrictions").array(), // licenses, quotas, etc.
  notes: text("notes"),
  notesEn: text("notes_en"),
  isActive: boolean("is_active").default(true),
});

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  type: text("type").notNull(), // "importer", "exporter", "both"
  products: text("products").array(),
  verified: boolean("verified").default(false),
  contactEmail: text("contact_email"),
  website: text("website"),
  // Enhanced business information
  legalName: text("legal_name"),
  taxId: text("tax_id"),
  businessType: text("business_type"), // "corporation", "llc", "partnership", etc.
  establishedYear: integer("established_year"),
  employeeCount: integer("employee_count"),
  annualRevenue: decimal("annual_revenue", { precision: 15, scale: 2 }),
  // Risk assessment
  creditRating: text("credit_rating"), // "AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D"
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }), // 0-100
  paymentTerms: text("payment_terms"),
  // Trade history
  totalTransactions: integer("total_transactions"),
  averageOrderValue: decimal("average_order_value", { precision: 12, scale: 2 }),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }),
  // Compliance and certifications
  certifications: text("certifications").array(),
  sanctions: boolean("sanctions").default(false),
  // Contact details
  contactPerson: text("contact_person"),
  phone: text("phone"),
  address: text("address"),
  // Metadata
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hsCode: text("hs_code").notNull(),
  originCountry: text("origin_country").notNull(),
  destinationCountry: text("destination_country").notNull(),
  year: integer("year").notNull(),
  volume: integer("volume"), // in tons
  valueUsd: decimal("value_usd", { precision: 15, scale: 2 }),
  avgPriceUsd: decimal("avg_price_usd", { precision: 10, scale: 2 }),
  activeCompanies: integer("active_companies"),
});

export const countryOpportunities = pgTable("country_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hsCode: text("hs_code").notNull(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  opportunityScore: decimal("opportunity_score", { precision: 5, scale: 2 }),
  demandScore: decimal("demand_score", { precision: 5, scale: 2 }),
  tariffScore: decimal("tariff_score", { precision: 5, scale: 2 }),
  logisticsScore: decimal("logistics_score", { precision: 5, scale: 2 }),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }),
  tradeAgreements: text("trade_agreements").array(),
  avgTariffRate: decimal("avg_tariff_rate", { precision: 5, scale: 2 }),
  importVolumeGrowth: decimal("import_volume_growth", { precision: 5, scale: 2 }),
  marketSizeUsd: decimal("market_size_usd", { precision: 15, scale: 2 }),
  competitionLevel: text("competition_level"), // "low", "medium", "high"
  logisticsComplexity: text("logistics_complexity"), // "simple", "moderate", "complex"
});

export const countryRequirements = pgTable("country_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  countryCode: text("country_code").notNull(),
  hsCode: text("hs_code").notNull(),
  requiredDocuments: text("required_documents").array(),
  technicalStandards: text("technical_standards").array(),
  phytosanitaryReqs: text("phytosanitary_reqs").array(),
  labelingReqs: text("labeling_reqs").array(),
  packagingReqs: text("packaging_reqs").array(),
  estimatedProcessingTime: integer("estimated_processing_time"), // in days
  additionalFees: jsonb("additional_fees"),
});

export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingNumber: text("tracking_number").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  status: text("status").notNull(), // "in_transit", "customs", "delivered", "delayed"
  progress: integer("progress"), // percentage 0-100
  eta: timestamp("eta"),
  createdAt: timestamp("created_at").defaultNow(),
  companyId: varchar("company_id"),
});

export const customsProcedures = pgTable("customs_procedures", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(), // "required", "optional", "special"
  documents: jsonb("documents"),
  country: text("country").notNull(),
});

export const tradeAlerts = pgTable("trade_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(), // "opportunity", "risk", "regulatory", "market", "price"
  severity: text("severity").notNull(), // "low", "medium", "high", "critical"
  category: text("category").notNull(), // "trade_war", "regulatory_change", "market_shift", "price_volatility", "supply_chain"
  affectedCountries: text("affected_countries").array(),
  affectedProducts: text("affected_products").array(), // HS codes
  impactLevel: decimal("impact_level", { precision: 5, scale: 2 }), // 0-100
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // 0-100
  validUntil: timestamp("valid_until"),
  source: text("source"),
  actionRecommendation: text("action_recommendation"),
  actionRecommendationEn: text("action_recommendation_en"),
  relatedLinks: text("related_links").array(),
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradeOpportunities = pgTable("trade_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  originCountry: text("origin_country").notNull(),
  targetCountry: text("target_country").notNull(),
  hsCode: text("hs_code").notNull(),
  productName: text("product_name").notNull(),
  opportunityValue: decimal("opportunity_value", { precision: 15, scale: 2 }), // USD
  growthProjection: decimal("growth_projection", { precision: 5, scale: 2 }), // %
  competitionLevel: text("competition_level").notNull(), // "low", "medium", "high"
  marketEntryDifficulty: text("market_entry_difficulty").notNull(), // "easy", "moderate", "difficult"
  recommendedAction: text("recommended_action"),
  recommendedActionEn: text("recommended_action_en"),
  keyBenefits: text("key_benefits").array(),
  keyBenefitsEn: text("key_benefits_en").array(),
  potentialRisks: text("potential_risks").array(),
  potentialRisksEn: text("potential_risks_en").array(),
  timeToMarket: integer("time_to_market"), // months
  initialInvestment: decimal("initial_investment", { precision: 12, scale: 2 }), // USD
  roi: decimal("roi", { precision: 5, scale: 2 }), // %
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }), // 0-100
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketIntelligence = pgTable("market_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  summary: text("summary").notNull(),
  summaryEn: text("summary_en").notNull(),
  content: text("content").notNull(),
  contentEn: text("content_en").notNull(),
  type: text("type").notNull(), // "market_analysis", "competitor_analysis", "regulatory_update", "economic_forecast", "supply_chain_intel"
  region: text("region"), // "global", "americas", "europe", "asia", "africa", etc.
  affectedCountries: text("affected_countries").array(),
  affectedSectors: text("affected_sectors").array(),
  hsCodesImpacted: text("hs_codes_impacted").array(),
  keyInsights: text("key_insights").array(),
  keyInsightsEn: text("key_insights_en").array(),
  dataPoints: jsonb("data_points"),
  sources: text("sources").array(),
  reliability: decimal("reliability", { precision: 5, scale: 2 }), // 0-100
  relevanceScore: decimal("relevance_score", { precision: 5, scale: 2 }), // 0-100
  publishedAt: timestamp("published_at").defaultNow(),
  validUntil: timestamp("valid_until"),
  tags: text("tags").array(),
  author: text("author"),
  isFeature: boolean("is_feature").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHsSectionSchema = createInsertSchema(hsSections).omit({
  id: true,
});

export const insertHsChapterSchema = createInsertSchema(hsChapters).omit({
  id: true,
});

export const insertHsPartidaSchema = createInsertSchema(hsPartidas).omit({
  id: true,
});

export const insertHsSubpartidaSchema = createInsertSchema(hsSubpartidas).omit({
  id: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
});

export const insertCountryOpportunitySchema = createInsertSchema(countryOpportunities).omit({
  id: true,
});

export const insertCountryRequirementSchema = createInsertSchema(countryRequirements).omit({
  id: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
});

export const insertCustomsProcedureSchema = createInsertSchema(customsProcedures).omit({
  id: true,
});

export const insertTradeAlertSchema = createInsertSchema(tradeAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTradeOpportunitySchema = createInsertSchema(tradeOpportunities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketIntelligenceSchema = createInsertSchema(marketIntelligence).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
});

export type HsSection = typeof hsSections.$inferSelect;
export type HsChapter = typeof hsChapters.$inferSelect;
export type HsPartida = typeof hsPartidas.$inferSelect;
export type HsSubpartida = typeof hsSubpartidas.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type CountryOpportunity = typeof countryOpportunities.$inferSelect;
export type CountryRequirement = typeof countryRequirements.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;
export type CustomsProcedure = typeof customsProcedures.$inferSelect;
export type TradeAlert = typeof tradeAlerts.$inferSelect;
export type TradeOpportunity = typeof tradeOpportunities.$inferSelect;
export type MarketIntelligence = typeof marketIntelligence.$inferSelect;

export type InsertHsSection = z.infer<typeof insertHsSectionSchema>;
export type InsertHsChapter = z.infer<typeof insertHsChapterSchema>;
export type InsertHsPartida = z.infer<typeof insertHsPartidaSchema>;
export type InsertHsSubpartida = z.infer<typeof insertHsSubpartidaSchema>;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type InsertCountryOpportunity = z.infer<typeof insertCountryOpportunitySchema>;
export type InsertCountryRequirement = z.infer<typeof insertCountryRequirementSchema>;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type InsertCustomsProcedure = z.infer<typeof insertCustomsProcedureSchema>;
export type InsertTradeAlert = z.infer<typeof insertTradeAlertSchema>;
export type InsertTradeOpportunity = z.infer<typeof insertTradeOpportunitySchema>;
export type InsertMarketIntelligence = z.infer<typeof insertMarketIntelligenceSchema>;
