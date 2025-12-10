import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hsSections = sqliteTable("hs_sections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // I, II, III, etc.
  number: integer("number").notNull(), // 1, 2, 3, etc.
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  chapterRange: text("chapter_range").notNull(), // "01-05"
});

export const hsChapters = sqliteTable("hs_chapters", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  sectionCode: text("section_code").notNull(),
  notes: text("notes"),
  notesEn: text("notes_en"),
});

export const hsPartidas = sqliteTable("hs_partidas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // 4-digit code
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  chapterCode: text("chapter_code").notNull(),
  tariffRate: real("tariff_rate"),
  units: text("units"), // JSON string array
  keywords: text("keywords"), // JSON string array or comma separated
  notes: text("notes"),
  notesEn: text("notes_en"),
});

export const hsSubpartidas = sqliteTable("hs_subpartidas", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // 6-digit code
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  partidaCode: text("partida_code").notNull(), // 4-digit parent
  chapterCode: text("chapter_code").notNull(),
  tariffRate: real("tariff_rate"),
  specialTariffRate: real("special_tariff_rate"),
  units: text("units"), // JSON string array
  restrictions: text("restrictions"), // JSON string array
  keywords: text("keywords"), // JSON string array or comma separated
  notes: text("notes"),
  notesEn: text("notes_en"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const companies = sqliteTable("companies", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  country: text("country").notNull(),
  type: text("type").notNull(), // "importer", "exporter", "both"
  products: text("products"), // JSON string array
  verified: integer("verified", { mode: "boolean" }).default(false),
  contactEmail: text("contact_email"),
  website: text("website"),
  // Enhanced business information
  legalName: text("legal_name"),
  taxId: text("tax_id"),
  businessType: text("business_type"),
  establishedYear: integer("established_year"),
  employeeCount: integer("employee_count"),
  annualRevenue: real("annual_revenue"),
  // Risk assessment
  creditRating: text("credit_rating"),
  riskScore: real("risk_score"),
  paymentTerms: text("payment_terms"),
  // Trade history
  totalTransactions: integer("total_transactions"),
  averageOrderValue: real("average_order_value"),
  onTimeDeliveryRate: real("on_time_delivery_rate"),
  // Compliance and certifications
  certifications: text("certifications"), // JSON string array
  sanctions: integer("sanctions", { mode: "boolean" }).default(false),
  // Contact details
  contactPerson: text("contact_person"),
  phone: text("phone"),
  address: text("address"),
  coordinates: text("coordinates", { mode: "json" }),
  // Metadata
  lastUpdated: integer("last_updated", { mode: "timestamp" }).$defaultFn(() => new Date()),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const marketData = sqliteTable("market_data", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  hsCode: text("hs_code").notNull(),
  originCountry: text("origin_country").notNull(),
  destinationCountry: text("destination_country").notNull(),
  year: integer("year").notNull(),
  volume: integer("volume"),
  valueUsd: real("value_usd"),
  avgPriceUsd: real("avg_price_usd"),
  activeCompanies: integer("active_companies"),
});

export const countryOpportunities = sqliteTable("country_opportunities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  hsCode: text("hs_code").notNull(),
  countryCode: text("country_code").notNull(),
  countryName: text("country_name").notNull(),
  opportunityScore: real("opportunity_score"),
  demandScore: real("demand_score"),
  tariffScore: real("tariff_score"),
  logisticsScore: real("logistics_score"),
  riskScore: real("risk_score"),
  tradeAgreements: text("trade_agreements"), // JSON string array
  avgTariffRate: real("avg_tariff_rate"),
  importVolumeGrowth: real("import_volume_growth"),
  marketSizeUsd: real("market_size_usd"),
  competitionLevel: text("competition_level"),
  logisticsComplexity: text("logistics_complexity"),
});

export const countryRequirements = sqliteTable("country_requirements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  countryCode: text("country_code").notNull(),
  hsCode: text("hs_code").notNull(),
  requiredDocuments: text("required_documents"), // JSON string array
  technicalStandards: text("technical_standards"), // JSON string array
  phytosanitaryReqs: text("phytosanitary_reqs"), // JSON string array
  labelingReqs: text("labeling_reqs"), // JSON string array
  packagingReqs: text("packaging_reqs"), // JSON string array
  estimatedProcessingTime: integer("estimated_processing_time"),
  additionalFees: text("additional_fees"), // JSON string
});

export const countryBaseRequirements = sqliteTable("country_base_requirements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  countryCode: text("country_code").notNull().unique(),
  tradeBloc: text("trade_bloc"), // EU, MERCOSUR, USMCA, ASEAN, etc.
  baseDocuments: text("base_documents"), // JSON string array of standard docs
  generalCustomsProcess: text("general_customs_process"),
});

export const shipments = sqliteTable("shipments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackingNumber: text("tracking_number").notNull().unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  status: text("status").notNull(),
  progress: integer("progress"),
  eta: integer("eta", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  companyId: text("company_id"),
});

export const customsProcedures = sqliteTable("customs_procedures", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(),
  documents: text("documents"), // JSON string
  country: text("country").notNull(),
});

export const tradeAlerts = sqliteTable("trade_alerts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  affectedCountries: text("affected_countries"), // JSON string array
  affectedProducts: text("affected_products"), // JSON string array
  impactLevel: real("impact_level"),
  confidence: real("confidence"),
  validUntil: integer("valid_until", { mode: "timestamp" }),
  source: text("source"),
  actionRecommendation: text("action_recommendation"),
  actionRecommendationEn: text("action_recommendation_en"),
  relatedLinks: text("related_links"), // JSON string array
  metadata: text("metadata"), // JSON string
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const tradeOpportunities = sqliteTable("trade_opportunities", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  originCountry: text("origin_country").notNull(),
  targetCountry: text("target_country").notNull(),
  hsCode: text("hs_code").notNull(),
  productName: text("product_name").notNull(),
  opportunityValue: real("opportunity_value"),
  growthProjection: real("growth_projection"),
  competitionLevel: text("competition_level").notNull(),
  marketEntryDifficulty: text("market_entry_difficulty").notNull(),
  recommendedAction: text("recommended_action"),
  recommendedActionEn: text("recommended_action_en"),
  keyBenefits: text("key_benefits"), // JSON string array
  keyBenefitsEn: text("key_benefits_en"), // JSON string array
  potentialRisks: text("potential_risks"), // JSON string array
  potentialRisksEn: text("potential_risks_en"), // JSON string array
  timeToMarket: integer("time_to_market"),
  initialInvestment: real("initial_investment"),
  roi: real("roi"),
  confidenceScore: real("confidence_score"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const marketIntelligence = sqliteTable("market_intelligence", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull(),
  summary: text("summary").notNull(),
  summaryEn: text("summary_en").notNull(),
  content: text("content").notNull(),
  contentEn: text("content_en").notNull(),
  type: text("type").notNull(),
  region: text("region"),
  affectedCountries: text("affected_countries"), // JSON string array
  affectedSectors: text("affected_sectors"), // JSON string array
  hsCodesImpacted: text("hs_codes_impacted"), // JSON string array
  keyInsights: text("key_insights"), // JSON string array
  keyInsightsEn: text("key_insights_en"), // JSON string array
  dataPoints: text("data_points"), // JSON string
  sources: text("sources"), // JSON string array
  reliability: real("reliability"),
  relevanceScore: real("relevance_score"),
  publishedAt: integer("published_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  validUntil: integer("valid_until", { mode: "timestamp" }),
  tags: text("tags"), // JSON string array
  author: text("author"),
  isFeature: integer("is_feature", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Insert schemas
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

// ========== MARKETPLACE TABLES ==========

// Users table for marketplace
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").references(() => companies.id),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role"), // "Director", "Manager", etc.
  primaryRole: text("primary_role").default("tecnico"), // 'tecnico' | 'compras' | 'logistica' | 'admin'
  verified: integer("verified", { mode: "boolean" }).default(false),
  phone: text("phone"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastActive: integer("last_active", { mode: "timestamp" }),
});

// Conversation Participants
export const conversationParticipants = sqliteTable("conversation_participants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id),
  userId: text("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // 'tecnico' | 'compras' | 'logistica'
  accessLevel: text("access_level").default("full"), // 'full' | 'limited'
  addedBy: text("added_by").references(() => users.id),
  addedAt: integer("added_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

// Chat Invites for External Agencies
export const chatInvites = sqliteTable("chat_invites", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id),
  createdBy: text("created_by").notNull().references(() => users.id),
  token: text("token").notNull().unique().$defaultFn(() => crypto.randomUUID()),
  role: text("role").notNull(), // Role for the invited person
  accessLevel: text("access_level").default("limited"), // 'full' | 'limited'
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  status: text("status").default("pending"), // 'pending' | 'used' | 'expired'
  usedBy: text("used_by").references(() => users.id),
  usedAt: integer("used_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Marketplace posts (buy/sell)
export const marketplacePosts = sqliteTable("marketplace_posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'buy' | 'sell'
  hsCode: text("hs_code").notNull(),
  productName: text("product_name").notNull(),
  quantity: text("quantity"),
  originCountry: text("origin_country"),
  destinationCountry: text("destination_country"),
  deadlineDays: integer("deadline_days"),
  requirements: text("requirements"), // JSON array
  certifications: text("certifications"), // JSON array
  status: text("status").default("active"), // 'active' | 'closed'
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

// Subscriptions
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  companyId: text("company_id").notNull().references(() => companies.id),
  planType: text("plan_type").notNull(), // 'pyme' | 'multinacional'
  status: text("status").default("active"), // 'active' | 'cancelled' | 'expired'
  maxEmployees: integer("max_employees").notNull(),
  currentEmployees: integer("current_employees").default(0),
  monthlyPrice: real("monthly_price").notNull(),
  startDate: integer("start_date", { mode: "timestamp" }).$defaultFn(() => new Date()),
  endDate: integer("end_date", { mode: "timestamp" }),
  nextBillingDate: integer("next_billing_date", { mode: "timestamp" }),
});

// Conversations for chat
export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  postId: text("post_id").references(() => marketplacePosts.id),
  company1Id: text("company_1_id").notNull().references(() => companies.id),
  company2Id: text("company_2_id").notNull().references(() => companies.id),
  status: text("status").default("active"), // 'active' | 'archived'
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
});

// Messages
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id),
  senderId: text("sender_id").notNull().references(() => users.id),
  messageType: text("message_type").default("text"), // 'text' | 'quote' | 'document'
  content: text("content"),
  metadata: text("metadata"), // JSON for quotes, documents, etc.
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  readAt: integer("read_at", { mode: "timestamp" }),
});

// Verifications
export const verifications = sqliteTable("verifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityType: text("entity_type").notNull(), // 'company' | 'employee'
  entityId: text("entity_id").notNull(),
  verificationType: text("verification_type").notNull(),
  status: text("status").default("pending"), // 'pending' | 'approved' | 'rejected'
  documents: text("documents"), // JSON array of document URLs
  submittedAt: integer("submitted_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  reviewedAt: integer("reviewed_at", { mode: "timestamp" }),
  reviewedBy: text("reviewed_by"),
  notes: text("notes"),
});

// Type exports
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

// Marketplace type exports
export type User = typeof users.$inferSelect;
export type MarketplacePost = typeof marketplacePosts.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Verification = typeof verifications.$inferSelect;

// Marketplace insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertMarketplacePostSchema = createInsertSchema(marketplacePosts);
export const insertSubscriptionSchema = createInsertSchema(subscriptions);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
export const insertVerificationSchema = createInsertSchema(verifications);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMarketplacePost = z.infer<typeof insertMarketplacePostSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
