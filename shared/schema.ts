import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("consumer"), // consumer, clinic_staff, admin
  organizationName: text("organization_name"),
  organizationType: text("organization_type"),
  contactName: text("contact_name"),
  title: text("title"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // penis_protection, vaginal_protection, anal_protection, multi_anatomical, barrier_dams
  bodyCompatibility: text("body_compatibility").array(), // penis, vagina, anus, front_hole, multi_anatomy
  sizeRange: text("size_range").notNull(), // custom, small, medium, large, extra_large
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const productConfigurations = pgTable("product_configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  anatomyType: text("anatomy_type").notNull(), // penis, vagina, anus, front_hole, multi_anatomy
  lengthMm: integer("length_mm"), // 114-292mm (4.5-11.5 inches) for penis
  girthMm: integer("girth_mm"), // circumference measurements
  widthMm: integer("width_mm"), // for vaginal/anal measurements  
  depthMm: integer("depth_mm"), // for internal anatomy
  customMeasurements: text("custom_measurements"), // JSON string for detailed measurements
  material: text("material").notNull(), // ocean_plastic_hydrogel, natural_blend, bio_silicone
  features: text("features").array(), // enhanced_lubrication, durability_coating, textured_surface, antimicrobial
  culturalTerms: text("cultural_terms").array(), // user-preferred terminology
  languagePreference: text("language_preference").default("en").notNull(),
  status: text("status").default("draft").notNull(), // draft, ordered, in_production, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  clinicId: integer("clinic_id").references(() => users.id),
  configurationId: integer("configuration_id").references(() => productConfigurations.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").default("pending").notNull(), // pending, in_production, shipped, delivered, cancelled
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  brandingPreference: text("branding_preference"),
  multiUseBalance: jsonb("multi_use_balance"), // MultiUseBalance — see schema below
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(), // sti_prevention, inclusive_health, sustainable_health, communication, community_support, research
  tags: text("tags").array(),
  isPublished: boolean("is_published").default(false).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnershipRequests = pgTable("partnership_requests", {
  id: serial("id").primaryKey(),
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type").notNull(),
  contactName: text("contact_name").notNull(),
  title: text("title").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interests: text("interests").array(), // product_distribution, educational_programs, research_collaboration, technology_integration
  additionalInfo: text("additional_info"),
  status: text("status").default("pending").notNull(), // pending, reviewing, approved, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertProductConfigurationSchema = createInsertSchema(productConfigurations).omit({
  id: true,
  createdAt: true,
});

export const contactZoneEnum = z.enum(["oral", "anal", "vaginal", "frontal", "neovaginal"]);
export const roleBalanceEnum = z.enum(["receptive", "penetrative", "versatile"]);
export const procreativeModeEnum = z.enum(["barrier-only", "procreative-permeable", "fertility-only"]);

export const fittingParamValueSchema = z.union([z.number(), z.string(), z.boolean()]);

export const multiUseBalanceSchema = z.object({
  roleBalance: roleBalanceEnum,
  contactZones: z.array(contactZoneEnum),
  procreativeMode: procreativeModeEnum,
  intersexVariations: z.array(z.string()).default([]),
  consultRequiredCount: z.number().int().nonnegative().default(0),
  activeFoldId: z.string().nullable().optional(),
  balanceCode: z.string(),
  brandingPreference: z.string().optional(),
  // Per-variation custom-order parameters: { [variationId]: { [paramId]: value } }
  variationCustomizations: z.record(z.string(), z.record(z.string(), fittingParamValueSchema)).default({}),
});

export type MultiUseBalance = z.infer<typeof multiUseBalanceSchema>;

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  multiUseBalance: multiUseBalanceSchema.optional().nullable(),
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnershipRequestSchema = createInsertSchema(partnershipRequests).omit({
  id: true,
  createdAt: true,
});

export const savedProductConfigurations = pgTable("saved_product_configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  configurationName: text("configuration_name").notNull(),
  configurationData: jsonb("configuration_data").notNull(), // Stores the full ProductConfig object
  shareCode: text("share_code").notNull().unique(), // Unique code for sharing
  isPublic: boolean("is_public").default(false).notNull(), // Whether it can be accessed via share link
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSavedProductConfigurationSchema = createInsertSchema(savedProductConfigurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductConfiguration = z.infer<typeof insertProductConfigurationSchema>;
export type ProductConfiguration = typeof productConfigurations.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;
export type InsertPartnershipRequest = z.infer<typeof insertPartnershipRequestSchema>;
export type PartnershipRequest = typeof partnershipRequests.$inferSelect;

// STI Analytics and Public Health Tables
export const stiData = pgTable("sti_data", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  county: text("county").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("US"),
  populationDensity: integer("population_density"),
  stiType: text("sti_type").notNull(),
  caseCount: integer("case_count").notNull(),
  ratePerHundredThousand: decimal("rate_per_hundred_thousand", { precision: 10, scale: 2 }),
  ageGroup: text("age_group"),
  demographicCategory: text("demographic_category"),
  reportingPeriod: text("reporting_period").notNull(),
  dataSource: text("data_source").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const publicHealthInterventions = pgTable("public_health_interventions", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  interventionType: text("intervention_type").notNull(),
  targetStiTypes: text("target_sti_types").array(),
  interventionName: text("intervention_name").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  reachEstimate: integer("reach_estimate"),
  effectivenessScore: decimal("effectiveness_score", { precision: 5, scale: 2 }),
  partnerOrganizations: text("partner_organizations").array(),
  status: text("status").notNull().default("planned"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Custom Sexual Health Products
export const customLubricants = pgTable("custom_lubricants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  formulationType: text("formulation_type").notNull(),
  activeIngredients: text("active_ingredients").array(),
  targetConditions: text("target_conditions").array(),
  phLevel: decimal("ph_level", { precision: 3, scale: 1 }),
  osmolality: integer("osmolality"),
  viscosity: text("viscosity"),
  compatibleWithLatex: boolean("compatible_with_latex").default(true),
  compatibleWithSilicone: boolean("compatible_with_silicone").default(true),
  antimicrobialProperties: text("antimicrobial_properties").array(),
  customFormulation: text("custom_formulation"),
  prescriptionRequired: boolean("prescription_required").default(false),
  regulatoryStatus: text("regulatory_status").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const medicalTreatments = pgTable("medical_treatments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  treatmentType: text("treatment_type").notNull(),
  targetConditions: text("target_conditions").array(),
  activeIngredients: text("active_ingredients").array(),
  dosageForm: text("dosage_form"),
  strength: text("strength"),
  applicationMethod: text("application_method"),
  treatmentDuration: text("treatment_duration"),
  sideEffects: text("side_effects").array(),
  contraindications: text("contraindications").array(),
  prescriptionRequired: boolean("prescription_required").default(true),
  controlledSubstance: boolean("controlled_substance").default(false),
  regulatoryStatus: text("regulatory_status").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Clinic Inventory Management
export const clinicInventory = pgTable("clinic_inventory", {
  id: serial("id").primaryKey(),
  clinicId: integer("clinic_id").notNull(),
  productType: text("product_type").notNull(),
  productId: integer("product_id").notNull(),
  currentStock: integer("current_stock").notNull().default(0),
  minimumStock: integer("minimum_stock").notNull().default(10),
  maximumStock: integer("maximum_stock").notNull().default(100),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
  supplierInfo: text("supplier_info"),
  expirationDate: timestamp("expiration_date"),
  batchNumber: text("batch_number"),
  storageRequirements: text("storage_requirements"),
  lastRestocked: timestamp("last_restocked"),
  autoReorderEnabled: boolean("auto_reorder_enabled").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Multi-language Support Including Native American Languages
export const languageSupport = pgTable("language_support", {
  id: serial("id").primaryKey(),
  languageCode: text("language_code").notNull(),
  languageName: text("language_name").notNull(),
  nativeName: text("native_name"),
  languageFamily: text("language_family"),
  region: text("region"),
  speakerCount: integer("speaker_count"),
  isIndigenous: boolean("is_indigenous").default(false),
  hasWrittenForm: boolean("has_written_form").default(true),
  translationStatus: text("translation_status").notNull().default("pending"),
  culturalNotes: text("cultural_notes"),
  translatorCredits: text("translator_credits").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const termTranslations = pgTable("term_translations", {
  id: serial("id").primaryKey(),
  termId: text("term_id").notNull(),
  languageCode: text("language_code").notNull(),
  translation: text("translation").notNull(),
  alternativeTranslations: text("alternative_translations").array(),
  culturalContext: text("cultural_context"),
  usageNotes: text("usage_notes"),
  respectfulUsage: boolean("respectful_usage").default(true),
  communityApproved: boolean("community_approved").default(false),
  translatorId: integer("translator_id"),
  reviewerId: integer("reviewer_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 3D Printing Integration
export const printingServices = pgTable("printing_services", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(),
  location: text("location").notNull(),
  serviceType: text("service_type").notNull(),
  capabilities: text("capabilities").array(),
  certifications: text("certifications").array(),
  materialOptions: text("material_options").array(),
  maxPrintVolume: text("max_print_volume"),
  layerResolution: decimal("layer_resolution", { precision: 5, scale: 3 }),
  turnaroundTime: text("turnaround_time"),
  qualityStandards: text("quality_standards").array(),
  contactInfo: text("contact_info"),
  apiEndpoint: text("api_endpoint"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const printJobs = pgTable("print_jobs", {
  id: serial("id").primaryKey(),
  configurationId: integer("configuration_id").notNull(),
  printingServiceId: integer("printing_service_id").notNull(),
  jobNumber: text("job_number").notNull(),
  materialUsed: text("material_used").notNull(),
  printTime: integer("print_time"),
  qualityChecks: text("quality_checks").array(),
  status: text("status").notNull().default("queued"),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  qualityScore: decimal("quality_score", { precision: 3, scale: 2 }),
  notes: text("notes"),
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// BAD Co-op Integration Tables
export const badCoopIntegration = pgTable("bad_coop_integration", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badCoopUserId: text("bad_coop_user_id"),
  integrationStatus: text("integration_status").notNull().default("pending"),
  consentForDataSharing: boolean("consent_for_data_sharing").default(false),
  advanceDirectivesLinked: boolean("advance_directives_linked").default(false),
  healthPlanningConnected: boolean("health_planning_connected").default(false),
  sexualHealthPreferences: text("sexual_health_preferences"),
  communicationPreferences: text("communication_preferences"),
  emergencyContacts: text("emergency_contacts").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Matchmaking System following Alovoa model
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  displayName: text("display_name").notNull(),
  age: integer("age"),
  location: text("location"),
  profileImageUrl: text("profile_image_url"), // Non-pornographic profile photo
  lookingFor: text("looking_for").array(),
  interests: text("interests").array(),
  cooperativePrinciples: text("cooperative_principles").array(),
  values: text("values").array(),
  bio: text("bio"),
  verificationStatus: text("verification_status").default("unverified"),
  privacySettings: text("privacy_settings"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const matchingPreferences = pgTable("matching_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ageRangeMin: integer("age_range_min"),
  ageRangeMax: integer("age_range_max"),
  maxDistance: integer("max_distance"),
  lookingForTypes: text("looking_for_types").array(),
  requiredValues: text("required_values").array(),
  dealBreakers: text("deal_breakers").array(),
  cooperativePrincipleImportance: integer("cooperative_principle_importance").default(5),
  communityInvolvement: text("community_involvement"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  user1Id: integer("user1_id").notNull(),
  user2Id: integer("user2_id").notNull(),
  matchType: text("match_type").notNull(),
  compatibilityScore: decimal("compatibility_score", { precision: 5, scale: 2 }),
  cooperativePrincipleAlignment: integer("cooperative_principle_alignment"),
  mutualInterest: boolean("mutual_interest").default(false),
  connectionStatus: text("connection_status").default("potential"),
  matchedAt: timestamp("matched_at").notNull().defaultNow(),
  connectedAt: timestamp("connected_at"),
});

// Insert schemas for new tables
export const insertStiDataSchema = createInsertSchema(stiData).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertPublicHealthInterventionSchema = createInsertSchema(publicHealthInterventions).omit({
  id: true,
  createdAt: true,
});

export const insertCustomLubricantSchema = createInsertSchema(customLubricants).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalTreatmentSchema = createInsertSchema(medicalTreatments).omit({
  id: true,
  createdAt: true,
});

export const insertClinicInventorySchema = createInsertSchema(clinicInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLanguageSupportSchema = createInsertSchema(languageSupport).omit({
  id: true,
  createdAt: true,
});

export const insertTermTranslationSchema = createInsertSchema(termTranslations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPrintingServiceSchema = createInsertSchema(printingServices).omit({
  id: true,
  createdAt: true,
});

export const insertPrintJobSchema = createInsertSchema(printJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBadCoopIntegrationSchema = createInsertSchema(badCoopIntegration).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMatchingPreferencesSchema = createInsertSchema(matchingPreferences).omit({
  id: true,
  updatedAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  matchedAt: true,
});

// Additional types for new tables
export type InsertStiData = z.infer<typeof insertStiDataSchema>;
export type StiData = typeof stiData.$inferSelect;

export type InsertPublicHealthIntervention = z.infer<typeof insertPublicHealthInterventionSchema>;
export type PublicHealthIntervention = typeof publicHealthInterventions.$inferSelect;

export type InsertCustomLubricant = z.infer<typeof insertCustomLubricantSchema>;
export type CustomLubricant = typeof customLubricants.$inferSelect;

export type InsertMedicalTreatment = z.infer<typeof insertMedicalTreatmentSchema>;
export type MedicalTreatment = typeof medicalTreatments.$inferSelect;

export type InsertClinicInventory = z.infer<typeof insertClinicInventorySchema>;
export type ClinicInventory = typeof clinicInventory.$inferSelect;

export type InsertLanguageSupport = z.infer<typeof insertLanguageSupportSchema>;
export type LanguageSupport = typeof languageSupport.$inferSelect;

export type InsertTermTranslation = z.infer<typeof insertTermTranslationSchema>;
export type TermTranslation = typeof termTranslations.$inferSelect;

export type InsertPrintingService = z.infer<typeof insertPrintingServiceSchema>;
export type PrintingService = typeof printingServices.$inferSelect;

export type InsertPrintJob = z.infer<typeof insertPrintJobSchema>;
export type PrintJob = typeof printJobs.$inferSelect;

export type InsertBadCoopIntegration = z.infer<typeof insertBadCoopIntegrationSchema>;
export type BadCoopIntegration = typeof badCoopIntegration.$inferSelect;

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export type InsertMatchingPreferences = z.infer<typeof insertMatchingPreferencesSchema>;
export type MatchingPreferences = typeof matchingPreferences.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

// Financial Management Tables
export const financialRecords = pgTable("financial_records", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(), // "income" or "expense"
  status: text("status").notNull().default("pending"), // "confirmed", "pending", "projected"
  transactionHash: text("transaction_hash"),
  approvedBy: integer("approved_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  requestedAmount: decimal("requested_amount", { precision: 10, scale: 2 }).notNull(),
  allocatedAmount: decimal("allocated_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  votes: integer("votes").default(0).notNull(),
  priority: text("priority").notNull().default("medium"), // "high", "medium", "low"
  status: text("status").notNull().default("voting"), // "voting", "approved", "funded", "completed"
  proposedBy: text("proposed_by").notNull(),
  deadline: text("deadline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const budgetVotes = pgTable("budget_votes", {
  id: serial("id").primaryKey(),
  budgetItemId: integer("budget_item_id").references(() => budgetItems.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  voteType: text("vote_type").notNull(), // "for", "against", "abstain"
  votingPower: integer("voting_power").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityDividends = pgTable("community_dividends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull(), // "2024-Q4", "2024-12", etc.
  contributionHours: decimal("contribution_hours", { precision: 8, scale: 2 }).default("0").notNull(),
  equityMultiplier: decimal("equity_multiplier", { precision: 4, scale: 2 }).default("1.0").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "paid", "cancelled"
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation
export const insertFinancialRecordSchema = createInsertSchema(financialRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({
  id: true,
  votes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBudgetVoteSchema = createInsertSchema(budgetVotes).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityDividendSchema = createInsertSchema(communityDividends).omit({
  id: true,
  paidAt: true,
  createdAt: true,
});

// Types
export type InsertFinancialRecord = z.infer<typeof insertFinancialRecordSchema>;
export type FinancialRecord = typeof financialRecords.$inferSelect;

export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;

export type InsertBudgetVote = z.infer<typeof insertBudgetVoteSchema>;
export type BudgetVote = typeof budgetVotes.$inferSelect;

export type InsertCommunityDividend = z.infer<typeof insertCommunityDividendSchema>;
export type CommunityDividend = typeof communityDividends.$inferSelect;

// Mood and Wellness Logging Tables
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  moodEmoji: text("mood_emoji").notNull(), // 😊, 😔, 😡, etc.
  energyLevel: integer("energy_level").notNull(), // 1-5 scale
  stressLevel: integer("stress_level").notNull(), // 1-5 scale
  sleepQuality: integer("sleep_quality"), // 1-5 scale
  physicalSymptoms: text("physical_symptoms").array(), // headache, fatigue, etc.
  emotionalState: text("emotional_state").array(), // anxious, happy, sad, etc.
  notes: text("notes"),
  tags: text("tags").array(), // work, relationship, health, etc.
  isPrivate: boolean("is_private").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const wellnessGoals = pgTable("wellness_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // mental_health, physical_health, sexual_health, etc.
  targetEmoji: text("target_emoji"), // Goal mood emoji
  targetValue: integer("target_value"), // Target score for metrics
  frequency: text("frequency").notNull(), // daily, weekly, monthly
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  status: text("status").default("active").notNull(), // active, paused, completed
  reminderTime: text("reminder_time"), // HH:MM format
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const moodInsights = pgTable("mood_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  insightType: text("insight_type").notNull(), // pattern, trend, correlation
  title: text("title").notNull(),
  description: text("description").notNull(),
  dataPoints: text("data_points").array(), // Referenced mood entry IDs or dates
  confidence: integer("confidence").notNull(), // 1-100 percentage
  isPositive: boolean("is_positive"), // Whether it's a positive or concerning insight
  suggestedActions: text("suggested_actions").array(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  isAcknowledged: boolean("is_acknowledged").default(false).notNull(),
});

// Schema validation
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWellnessGoalSchema = createInsertSchema(wellnessGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMoodInsightSchema = createInsertSchema(moodInsights).omit({
  id: true,
  generatedAt: true,
});

// Types
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

export type InsertWellnessGoal = z.infer<typeof insertWellnessGoalSchema>;
export type WellnessGoal = typeof wellnessGoals.$inferSelect;

export type InsertMoodInsight = z.infer<typeof insertMoodInsightSchema>;
export type MoodInsight = typeof moodInsights.$inferSelect;

// Time Management Tables - "Wise Time TriSexs" Creative Commons System
export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time"), // HH:MM format, null if still running
  duration: integer("duration_minutes"), // calculated duration in minutes
  category: text("category").notNull(), // work, wellness, personal, creative, etc.
  project: text("project"), // specific project or activity name
  description: text("description"),
  energyBefore: integer("energy_before"), // 1-5 scale
  energyAfter: integer("energy_after"), // 1-5 scale
  focusQuality: integer("focus_quality"), // 1-5 scale
  satisfaction: integer("satisfaction"), // 1-5 scale
  tags: text("tags").array(), // productivity, flow_state, distracted, etc.
  timeWisdom: text("time_wisdom"), // personal reflection on time use
  isCreativeCommons: boolean("is_creative_commons").default(false), // if work can be shared
  wiseTimeTriSex: text("wise_time_TriSex"), // personal mantra or insight
  // Calendar Integration Fields
  calendarEventId: text("calendar_event_id"), // Google Calendar/iCal event ID
  calendarType: text("calendar_type"), // google, ical, outlook, pureos
  syncStatus: text("sync_status").default("pending"), // pending, synced, failed
  lastSynced: timestamp("last_synced"),
  isCalendarBlocked: boolean("is_calendar_blocked").default(false), // creates calendar block
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const timeGoals = pgTable("time_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // same categories as time entries
  targetHoursDaily: integer("target_hours_daily"), // daily target in hours
  targetHoursWeekly: integer("target_hours_weekly"), // weekly target in hours
  targetHoursMonthly: integer("target_hours_monthly"), // monthly target in hours
  priority: text("priority").default("medium").notNull(), // high, medium, low
  reminderTime: text("reminder_time"), // HH:MM format
  status: text("status").default("active").notNull(), // active, paused, completed, cancelled
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const timeInsights = pgTable("time_insights", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  insightType: text("insight_type").notNull(), // pattern, productivity_peak, time_waste, balance
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"), // which time category this insight relates to
  timePattern: text("time_pattern"), // morning_person, night_owl, afternoon_slump, etc.
  recommendation: text("recommendation"), // suggested improvements
  wiseTimeTriSex: text("wise_time_TriSex"), // wisdom gained about time management
  confidence: integer("confidence").notNull(), // 1-100 percentage
  dataPoints: text("data_points").array(), // referenced time entry IDs
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  isAcknowledged: boolean("is_acknowledged").default(false).notNull(),
});

// Schema validation for time management
export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeGoalSchema = createInsertSchema(timeGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeInsightSchema = createInsertSchema(timeInsights).omit({
  id: true,
  generatedAt: true,
});

// Types for time management
export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

export type InsertTimeGoal = z.infer<typeof insertTimeGoalSchema>;
export type TimeGoal = typeof timeGoals.$inferSelect;

export type InsertTimeInsight = z.infer<typeof insertTimeInsightSchema>;
export type TimeInsight = typeof timeInsights.$inferSelect;

// Calendar Integration Tables
export const calendarConnections = pgTable("calendar_connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  calendarType: text("calendar_type").notNull(), // google, ical, outlook, pureos, caldav
  connectionName: text("connection_name").notNull(), // user-defined name
  accessToken: text("access_token"), // encrypted OAuth token
  refreshToken: text("refresh_token"), // encrypted refresh token
  calendarUrl: text("calendar_url"), // iCal/CalDAV URL
  calendarId: text("calendar_id"), // specific calendar within service
  syncEnabled: boolean("sync_enabled").default(true),
  autoCreateBlocks: boolean("auto_create_blocks").default(false), // auto-create calendar blocks
  syncDirection: text("sync_direction").default("bidirectional"), // import, export, bidirectional
  lastSyncTime: timestamp("last_sync_time"),
  syncErrors: text("sync_errors").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const scheduledTasks = pgTable("scheduled_tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledStartTime: text("scheduled_start_time"), // HH:MM format
  scheduledEndTime: text("scheduled_end_time"), // HH:MM format
  estimatedDuration: integer("estimated_duration_minutes"),
  priority: text("priority").default("medium"), // high, medium, low
  status: text("status").default("scheduled"), // scheduled, in_progress, completed, cancelled
  linkedTimeEntryId: integer("linked_time_entry_id").references(() => timeEntries.id),
  calendarEventId: text("calendar_event_id"),
  calendarConnectionId: integer("calendar_connection_id").references(() => calendarConnections.id),
  recurrenceRule: text("recurrence_rule"), // iCal RRULE format
  reminderMinutes: integer("reminder_minutes").array(), // [15, 60] for 15min and 1hr reminders
  wiseTimePrep: text("wise_time_prep"), // preparation wisdom for the task
  energyRequirement: integer("energy_requirement"), // 1-5 scale of energy needed
  focusRequirement: integer("focus_requirement"), // 1-5 scale of focus needed
  isCreativeCommons: boolean("is_creative_commons").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taskTemplates = pgTable("task_templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  defaultDuration: integer("default_duration_minutes"),
  defaultEnergyRequirement: integer("default_energy_requirement"),
  defaultFocusRequirement: integer("default_focus_requirement"),
  defaultTags: text("default_tags").array(),
  wiseTimeTemplate: text("wise_time_template"), // template wisdom for this type of task
  isPublic: boolean("is_public").default(false), // shareable under Creative Commons
  timesUsed: integer("times_used").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schema validation for calendar integration
export const insertCalendarConnectionSchema = createInsertSchema(calendarConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduledTaskSchema = createInsertSchema(scheduledTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskTemplateSchema = createInsertSchema(taskTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for calendar integration
export type InsertCalendarConnection = z.infer<typeof insertCalendarConnectionSchema>;
export type CalendarConnection = typeof calendarConnections.$inferSelect;

export type InsertScheduledTask = z.infer<typeof insertScheduledTaskSchema>;
export type ScheduledTask = typeof scheduledTasks.$inferSelect;

export type InsertTaskTemplate = z.infer<typeof insertTaskTemplateSchema>;
export type TaskTemplate = typeof taskTemplates.$inferSelect;

// Notification Sync System
export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // 'web', 'mobile', 'desktop', 'email', 'sms'
  isEnabled: boolean("is_enabled").default(true),
  endpoint: text("endpoint"), // push endpoint for web notifications
  authKey: text("auth_key"),
  p256dhKey: text("p256dh_key"),
  deviceToken: text("device_token"), // for mobile notifications
  preferences: jsonb("preferences").default({}), // notification type preferences
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crossPlatformNotifications = pgTable("cross_platform_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  type: text("type").notNull(), // 'break_reminder', 'task_reminder', 'rest_suggestion', 'time_wisdom'
  priority: text("priority").default("normal"), // 'low', 'normal', 'high', 'urgent'
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  platforms: jsonb("platforms").default([]), // platforms this was sent to
  metadata: jsonb("metadata").default({}), // additional data for the notification
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Smart Break and Rest System
export const breakPatterns = pgTable("break_patterns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  patternName: text("pattern_name").notNull(),
  workDuration: integer("work_duration").notNull(), // minutes
  shortBreakDuration: integer("short_break_duration").notNull(), // minutes
  longBreakDuration: integer("long_break_duration").notNull(), // minutes
  longBreakInterval: integer("long_break_interval").default(4), // after how many short breaks
  isActive: boolean("is_active").default(false),
  customizations: jsonb("customizations").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const restSuggestions = pgTable("rest_suggestions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  suggestionType: text("suggestion_type").notNull(), // 'micro_break', 'active_break', 'rest_period', 'energy_boost'
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: integer("duration"), // suggested duration in minutes
  energyLevel: integer("energy_level"), // 1-5, what energy level this helps with
  stressLevel: integer("stress_level"), // 1-5, what stress level this addresses
  activity: text("activity"), // specific activity suggestion
  isPersonalized: boolean("is_personalized").default(false),
  triggerConditions: jsonb("trigger_conditions").default({}), // when to suggest this
  effectiveness: integer("effectiveness").default(0), // user feedback on effectiveness
  timesUsed: integer("times_used").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const smartBreakSessions = pgTable("smart_break_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  breakType: text("break_type").notNull(), // 'micro', 'short', 'long', 'rest'
  plannedDuration: integer("planned_duration").notNull(), // minutes
  actualDuration: integer("actual_duration"), // minutes
  suggestion: text("suggestion"),
  activity: text("activity"),
  energyBefore: integer("energy_before"), // 1-5 scale
  energyAfter: integer("energy_after"), // 1-5 scale
  stressBefore: integer("stress_before"), // 1-5 scale
  stressAfter: integer("stress_after"), // 1-5 scale
  effectiveness: integer("effectiveness"), // 1-5 user rating
  notes: text("notes"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation schemas for notification system
export const insertNotificationSettingsSchema = createInsertSchema(notificationSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrossPlatformNotificationSchema = createInsertSchema(crossPlatformNotifications).omit({
  id: true,
  createdAt: true,
});

// Validation schemas for break system
export const insertBreakPatternSchema = createInsertSchema(breakPatterns).omit({
  id: true,
  createdAt: true,
});

export const insertRestSuggestionSchema = createInsertSchema(restSuggestions).omit({
  id: true,
  createdAt: true,
});

export const insertSmartBreakSessionSchema = createInsertSchema(smartBreakSessions).omit({
  id: true,
  createdAt: true,
});

// Types for notification system
export type InsertNotificationSettings = z.infer<typeof insertNotificationSettingsSchema>;
export type NotificationSettings = typeof notificationSettings.$inferSelect;

export type InsertCrossPlatformNotification = z.infer<typeof insertCrossPlatformNotificationSchema>;
export type CrossPlatformNotification = typeof crossPlatformNotifications.$inferSelect;

// Types for break system
export type InsertBreakPattern = z.infer<typeof insertBreakPatternSchema>;
export type BreakPattern = typeof breakPatterns.$inferSelect;

export type InsertRestSuggestion = z.infer<typeof insertRestSuggestionSchema>;
export type RestSuggestion = typeof restSuggestions.$inferSelect;

export type InsertSmartBreakSession = z.infer<typeof insertSmartBreakSessionSchema>;
export type SmartBreakSession = typeof smartBreakSessions.$inferSelect;

// Messaging Platform Integration
export const messagingIntegrations = pgTable("messaging_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // 'imessage', 'google_messages', 'facebook_messenger', 'whatsapp', 'signal'
  platformUserId: text("platform_user_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").default(true),
  encryptionKey: text("encryption_key"), // for end-to-end encryption
  preferences: jsonb("preferences").default({}),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Healthcare System Integration
export const healthcareIntegrations = pgTable("healthcare_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  system: text("system").notNull(), // 'mychart', 'apple_health', 'openehr', 'epic', 'cerner', 'allscripts'
  systemUserId: text("system_user_id"),
  apiKey: text("api_key"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  facilityId: text("facility_id"),
  patientId: text("patient_id"),
  isActive: boolean("is_active").default(true),
  dataPermissions: jsonb("data_permissions").default([]), // what data types are accessible
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accessibility & Translation Features
export const accessibilitySettings = pgTable("accessibility_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  brailleEnabled: boolean("braille_enabled").default(false),
  brailleGrade: text("braille_grade").default("grade2"), // 'grade1', 'grade2', 'grade3'
  signLanguageEnabled: boolean("sign_language_enabled").default(false),
  signLanguageType: text("sign_language_type").default("asl"), // 'asl', 'bsl', 'auslan', 'psl'
  speechToTextEnabled: boolean("speech_to_text_enabled").default(false),
  textToSpeechEnabled: boolean("text_to_speech_enabled").default(false),
  voiceSettings: jsonb("voice_settings").default({}), // speed, pitch, voice type
  highContrastMode: boolean("high_contrast_mode").default(false),
  largeFontMode: boolean("large_font_mode").default(false),
  screenReaderCompatible: boolean("screen_reader_compatible").default(false),
  keyboardNavigationOnly: boolean("keyboard_navigation_only").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mentor & Facilitator Co-editing Sessions
export const coEditingSessions = pgTable("co_editing_sessions", {
  id: serial("id").primaryKey(),
  initiatorId: integer("initiator_id").references(() => users.id).notNull(),
  mentorId: integer("mentor_id").references(() => users.id),
  facilitatorId: integer("facilitator_id").references(() => users.id),
  sessionType: text("session_type").notNull(), // 'peer_mentoring', 'health_guidance', 'accessibility_support'
  documentId: text("document_id"), // ID of document being co-edited
  messagingPlatform: text("messaging_platform"), // which platform to use for communication
  healthcareContext: text("healthcare_context"), // related health data context
  accessibilityMode: text("accessibility_mode"), // 'braille', 'sign_language', 'voice_only', 'text_only'
  isActive: boolean("is_active").default(true),
  sessionData: jsonb("session_data").default({}), // real-time editing state
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time Messages for Co-editing
export const coEditingMessages = pgTable("co_editing_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").references(() => coEditingSessions.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  messageType: text("message_type").notNull(), // 'text', 'voice', 'braille', 'sign_language', 'health_data'
  content: text("content").notNull(),
  brailleTranslation: text("braille_translation"),
  signLanguageTranslation: text("sign_language_translation"),
  voiceTranscript: text("voice_transcript"),
  healthDataReference: jsonb("health_data_reference").default({}),
  platformDeliveryStatus: jsonb("platform_delivery_status").default({}), // delivery status per platform
  isTranslated: boolean("is_translated").default(false),
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Translation & Accessibility Services
export const translationServices = pgTable("translation_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sourceText: text("source_text").notNull(),
  targetFormat: text("target_format").notNull(), // 'braille', 'sign_language', 'simplified_text', 'audio'
  translatedContent: text("translated_content"),
  qualityScore: integer("quality_score"), // 1-5 translation quality
  isHumanVerified: boolean("is_human_verified").default(false),
  verifiedBy: integer("verified_by").references(() => users.id),
  serviceProvider: text("service_provider"), // 'internal_ai', 'human_translator', 'certified_interpreter'
  createdAt: timestamp("created_at").defaultNow(),
});

// Health Data Sync Records
export const healthDataSync = pgTable("health_data_sync", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sourceSystem: text("source_system").notNull(),
  dataType: text("data_type").notNull(), // 'vitals', 'medications', 'appointments', 'lab_results', 'notes'
  syncStatus: text("sync_status").default("pending"), // 'pending', 'synced', 'failed', 'partial'
  dataPayload: jsonb("data_payload").default({}),
  encryptedData: text("encrypted_data"), // HIPAA-compliant encrypted health data
  lastModified: timestamp("last_modified"),
  syncedAt: timestamp("synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation schemas for messaging integration
export const insertMessagingIntegrationSchema = createInsertSchema(messagingIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHealthcareIntegrationSchema = createInsertSchema(healthcareIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccessibilitySettingsSchema = createInsertSchema(accessibilitySettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCoEditingSessionSchema = createInsertSchema(coEditingSessions).omit({
  id: true,
  createdAt: true,
});

export const insertCoEditingMessageSchema = createInsertSchema(coEditingMessages).omit({
  id: true,
  createdAt: true,
});

export const insertTranslationServiceSchema = createInsertSchema(translationServices).omit({
  id: true,
  createdAt: true,
});

export const insertHealthDataSyncSchema = createInsertSchema(healthDataSync).omit({
  id: true,
  createdAt: true,
});

// Types for messaging and healthcare integration
export type InsertMessagingIntegration = z.infer<typeof insertMessagingIntegrationSchema>;
export type MessagingIntegration = typeof messagingIntegrations.$inferSelect;

export type InsertHealthcareIntegration = z.infer<typeof insertHealthcareIntegrationSchema>;
export type HealthcareIntegration = typeof healthcareIntegrations.$inferSelect;

export type InsertAccessibilitySettings = z.infer<typeof insertAccessibilitySettingsSchema>;
export type AccessibilitySettings = typeof accessibilitySettings.$inferSelect;

export type InsertCoEditingSession = z.infer<typeof insertCoEditingSessionSchema>;
export type CoEditingSession = typeof coEditingSessions.$inferSelect;

export type InsertCoEditingMessage = z.infer<typeof insertCoEditingMessageSchema>;
export type CoEditingMessage = typeof coEditingMessages.$inferSelect;

export type InsertTranslationService = z.infer<typeof insertTranslationServiceSchema>;
export type TranslationService = typeof translationServices.$inferSelect;

export type InsertHealthDataSync = z.infer<typeof insertHealthDataSyncSchema>;
export type HealthDataSync = typeof healthDataSync.$inferSelect;

// Sexual Partner Networks for 4D STI Tracking
export const partnerNetworks = pgTable("partner_networks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  networkName: text("network_name"), // optional name for the network
  isActive: boolean("is_active").default(true),
  privacyLevel: text("privacy_level").default("private"), // 'private', 'network_only', 'anonymous_data'
  consentGiven: boolean("consent_given").default(false),
  dataRetentionDays: integer("data_retention_days").default(90), // how long to keep sensitive data
  emergencyContactId: integer("emergency_contact_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const partnerConnections = pgTable("partner_connections", {
  id: serial("id").primaryKey(),
  networkId: integer("network_id").references(() => partnerNetworks.id).notNull(),
  partnerUserId: integer("partner_user_id").references(() => users.id),
  partnerAnonymousId: text("partner_anonymous_id"), // for privacy protection
  connectionType: text("connection_type").notNull(), // 'sexual_partner', 'testing_partner', 'emergency_contact'
  relationshipStatus: text("relationship_status"), // 'current', 'past', 'casual', 'regular'
  mutualConsent: boolean("mutual_consent").default(false),
  notificationPreferences: jsonb("notification_preferences").default({}),
  lastContact: timestamp("last_contact"),
  connectionStrength: integer("connection_strength").default(1), // 1-5 scale for contact frequency/intimacy
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 4D STI Tracking (Time, Space, Severity, Network)
export const stiTrackingEvents = pgTable("sti_tracking_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  networkId: integer("network_id").references(() => partnerNetworks.id),
  eventType: text("event_type").notNull(), // 'test_result', 'symptom_report', 'exposure_alert', 'treatment_start', 'treatment_complete'
  stiType: text("sti_type"), // 'chlamydia', 'gonorrhea', 'syphilis', 'hiv', 'herpes', 'hpv', etc.
  testResult: text("test_result"), // 'positive', 'negative', 'inconclusive', 'pending'
  severityLevel: integer("severity_level"), // 1-5 scale
  symptomsReported: jsonb("symptoms_reported").default([]),
  treatmentProtocol: text("treatment_protocol"),
  testingLocation: text("testing_location"),
  geographicArea: text("geographic_area"), // for epidemiological tracking
  exposureTimeframe: jsonb("exposure_timeframe").default({}), // start and end dates
  partnerNotificationStatus: text("partner_notification_status").default("pending"), // 'pending', 'notified', 'declined'
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  isAnonymized: boolean("is_anonymized").default(false),
  publicHealthReported: boolean("public_health_reported").default(false),
  eventDate: timestamp("event_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Sexual Product Customization with Partner Compatibility
export const sexualProductCustomizations = pgTable("sexual_product_customizations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  partnerNetworkId: integer("partner_network_id").references(() => partnerNetworks.id),
  customizationName: text("customization_name").notNull(),
  bodyCompatibility: jsonb("body_compatibility").default({}), // size, anatomy considerations
  materialPreferences: jsonb("material_preferences").default({}), // latex-free, vegan, etc.
  protectionLevel: text("protection_level"), // 'standard', 'enhanced', 'ultra', 'specialized'
  partnerCompatibility: jsonb("partner_compatibility").default({}), // fit for multiple partners
  naturalSensesProfile: jsonb("natural_senses_profile").default({}), // based on greensong principles
  texturePreferences: jsonb("texture_preferences").default({}),
  flavorProfile: text("flavor_profile"),
  aromaProfile: text("aroma_profile"),
  temperatureSensitivity: text("temperature_sensitivity"), // 'warming', 'cooling', 'neutral'
  durationOptimization: text("duration_optimization"), // 'extended', 'standard', 'quick'
  sensitivityLevel: text("sensitivity_level"), // 'high', 'medium', 'low'
  accessibilityFeatures: jsonb("accessibility_features").default([]), // for users with disabilities
  sustainabilityRating: integer("sustainability_rating"), // 1-5 eco-friendliness
  sharedWithPartners: boolean("shared_with_partners").default(false),
  partnerFeedback: jsonb("partner_feedback").default([]),
  effectivenessRating: integer("effectiveness_rating"), // 1-5 user satisfaction
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Natural Senses Integration (inspired by greensong.info)
export const naturalSensesProfiles = pgTable("natural_senses_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  visualSensitivity: integer("visual_sensitivity").default(3), // 1-5 scale
  auditoryPreferences: jsonb("auditory_preferences").default({}),
  tactileSensitivity: integer("tactile_sensitivity").default(3),
  olfactoryPreferences: jsonb("olfactory_preferences").default({}),
  gustatory: jsonb("gustatory").default({}),
  vestibularNeeds: jsonb("vestibular_needs").default({}), // balance and spatial orientation
  proprioceptiveNeeds: jsonb("proprioceptive_needs").default({}), // body awareness
  interocetptiveAwareness: integer("interoceptive_awareness").default(3), // internal body signals
  environmentalFactors: jsonb("environmental_factors").default({}), // lighting, temperature, etc.
  rhythmAndTiming: jsonb("rhythm_and_timing").default({}),
  socialSensoryNeeds: jsonb("social_sensory_needs").default({}),
  stressResponsePatterns: jsonb("stress_response_patterns").default({}),
  regulationStrategies: jsonb("regulation_strategies").default([]),
  sensorySeekingBehaviors: jsonb("sensory_seeking_behaviors").default([]),
  sensoryAvoidanceBehaviors: jsonb("sensory_avoiding_behaviors").default([]),
  optimalArousalLevel: text("optimal_arousal_level"), // 'low', 'moderate', 'high'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Partner Notification System for STI Alerts
export const partnerNotifications = pgTable("partner_notifications", {
  id: serial("id").primaryKey(),
  stiEventId: integer("sti_event_id").references(() => stiTrackingEvents.id).notNull(),
  partnerConnectionId: integer("partner_connection_id").references(() => partnerConnections.id).notNull(),
  notificationType: text("notification_type").notNull(), // 'exposure_alert', 'test_recommendation', 'follow_up'
  message: text("message").notNull(),
  isAnonymous: boolean("is_anonymous").default(true),
  urgencyLevel: text("urgency_level").default("medium"), // 'low', 'medium', 'high', 'urgent'
  deliveryMethod: text("delivery_method"), // 'app', 'sms', 'email', 'secure_message'
  deliveryStatus: text("delivery_status").default("pending"), // 'pending', 'sent', 'delivered', 'read'
  responseReceived: boolean("response_received").default(false),
  followUpRequired: boolean("follow_up_required").default(false),
  expiresAt: timestamp("expires_at"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Effectiveness Tracking with Partner Data
export const productEffectivenessReports = pgTable("product_effectiveness_reports", {
  id: serial("id").primaryKey(),
  customizationId: integer("customization_id").references(() => sexualProductCustomizations.id).notNull(),
  partnerConnectionId: integer("partner_connection_id").references(() => partnerConnections.id),
  usageDate: timestamp("usage_date").notNull(),
  protectionEffectiveness: integer("protection_effectiveness"), // 1-5 scale
  comfortLevel: integer("comfort_level"), // 1-5 scale
  partnerComfortLevel: integer("partner_comfort_level"), // 1-5 scale
  naturalFeelRating: integer("natural_feel_rating"), // 1-5 scale
  durationRating: integer("duration_rating"), // 1-5 scale
  sensoryExperience: jsonb("sensory_experience").default({}),
  unexpectedIssues: jsonb("unexpected_issues").default([]),
  improvementSuggestions: text("improvement_suggestions"),
  wouldRecommend: boolean("would_recommend").default(true),
  reorderIntention: boolean("reorder_intention").default(true),
  partnerFeedbackIncluded: boolean("partner_feedback_included").default(false),
  anonymizedForResearch: boolean("anonymized_for_research").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Validation schemas
export const insertPartnerNetworkSchema = createInsertSchema(partnerNetworks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerConnectionSchema = createInsertSchema(partnerConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStiTrackingEventSchema = createInsertSchema(stiTrackingEvents).omit({
  id: true,
  createdAt: true,
});

export const insertSexualProductCustomizationSchema = createInsertSchema(sexualProductCustomizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNaturalSensesProfileSchema = createInsertSchema(naturalSensesProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerNotificationSchema = createInsertSchema(partnerNotifications).omit({
  id: true,
  createdAt: true,
});

export const insertProductEffectivenessReportSchema = createInsertSchema(productEffectivenessReports).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertPartnerNetwork = z.infer<typeof insertPartnerNetworkSchema>;
export type PartnerNetwork = typeof partnerNetworks.$inferSelect;

export type InsertPartnerConnection = z.infer<typeof insertPartnerConnectionSchema>;
export type PartnerConnection = typeof partnerConnections.$inferSelect;

export type InsertStiTrackingEvent = z.infer<typeof insertStiTrackingEventSchema>;
export type StiTrackingEvent = typeof stiTrackingEvents.$inferSelect;

export type InsertSexualProductCustomization = z.infer<typeof insertSexualProductCustomizationSchema>;
export type SexualProductCustomization = typeof sexualProductCustomizations.$inferSelect;

export type InsertNaturalSensesProfile = z.infer<typeof insertNaturalSensesProfileSchema>;
export type NaturalSensesProfile = typeof naturalSensesProfiles.$inferSelect;

export type InsertPartnerNotification = z.infer<typeof insertPartnerNotificationSchema>;
export type PartnerNotification = typeof partnerNotifications.$inferSelect;

export type InsertProductEffectivenessReport = z.infer<typeof insertProductEffectivenessReportSchema>;
export type ProductEffectivenessReport = typeof productEffectivenessReports.$inferSelect;

export type InsertSavedProductConfiguration = z.infer<typeof insertSavedProductConfigurationSchema>;
export type SavedProductConfiguration = typeof savedProductConfigurations.$inferSelect;

// Community Forum Tables
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").default("MessageCircle"),
  color: text("color").default("purple"),
  isModerated: boolean("is_moderated").default(true),
  requiresVerification: boolean("requires_verification").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  tags: text("tags").array(),
  contentWarning: text("content_warning"),
  isApproved: boolean("is_approved").default(true),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  parentReplyId: integer("parent_reply_id"),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  likeCount: integer("like_count").default(0),
  isApproved: boolean("is_approved").default(true),
  isSolution: boolean("is_solution").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumLikes = pgTable("forum_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => forumPosts.id),
  replyId: integer("reply_id").references(() => forumReplies.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumBookmarks = pgTable("forum_bookmarks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Forum validation schemas
export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
  createdAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  viewCount: true,
  likeCount: true,
  replyCount: true,
  lastActivityAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  likeCount: true,
  createdAt: true,
  updatedAt: true,
});

// Forum types
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;
export type ForumCategory = typeof forumCategories.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

export type ForumLike = typeof forumLikes.$inferSelect;
export type ForumBookmark = typeof forumBookmarks.$inferSelect;

export const wikiContributions = pgTable("wiki_contributions", {
  id: serial("id").primaryKey(),
  articleId: text("article_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const wikiVotes = pgTable("wiki_votes", {
  id: serial("id").primaryKey(),
  articleId: text("article_id").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contributionId: integer("contribution_id").references(() => wikiContributions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWikiContributionSchema = createInsertSchema(wikiContributions).omit({
  id: true,
  createdAt: true,
});

export const insertWikiVoteSchema = createInsertSchema(wikiVotes).omit({
  id: true,
  createdAt: true,
});

export type InsertWikiContribution = z.infer<typeof insertWikiContributionSchema>;
export type WikiContribution = typeof wikiContributions.$inferSelect;
export type InsertWikiVote = z.infer<typeof insertWikiVoteSchema>;
export type WikiVote = typeof wikiVotes.$inferSelect;

export const filingDocuments = pgTable("filing_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  formType: text("form_type").notNull(),
  entityName: text("entity_name").notNull(),
  status: text("status").notNull().default("drafted"),
  documentBody: text("document_body").notNull(),
  payload: text("payload"),
  taxYear: integer("tax_year"),
  jurisdiction: text("jurisdiction"),
  confirmationNumber: text("confirmation_number"),
  agencyResponse: text("agency_response"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  notes: text("notes"),
});

export const insertFilingDocumentSchema = createInsertSchema(filingDocuments).omit({
  id: true,
  documentBody: true,
  generatedAt: true,
  submittedAt: true,
  acknowledgedAt: true,
  confirmationNumber: true,
  agencyResponse: true,
  status: true,
});

export type InsertFilingDocument = z.infer<typeof insertFilingDocumentSchema>;
export type FilingDocument = typeof filingDocuments.$inferSelect;

export const boundaryCheckConsents = pgTable("boundary_check_consents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(),
  handle: text("handle").notNull(),
  scope: text("scope").notNull(),
  purpose: text("purpose"),
  consentStatement: text("consent_statement").notNull(),
  consentedAt: timestamp("consented_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"),
});

export const insertBoundaryCheckConsentSchema = createInsertSchema(boundaryCheckConsents).omit({
  id: true,
  consentedAt: true,
  revokedAt: true,
});

export type InsertBoundaryCheckConsent = z.infer<typeof insertBoundaryCheckConsentSchema>;
export type BoundaryCheckConsent = typeof boundaryCheckConsents.$inferSelect;

export const blueskyShareAttestations = pgTable("bluesky_share_attestations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  blueskyHandle: text("bluesky_handle").notNull(),
  adultContentDisabled: boolean("adult_content_disabled").notNull().default(false),
  attestationStatement: text("attestation_statement").notNull(),
  attestedAt: timestamp("attested_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const insertBlueskyShareAttestationSchema = createInsertSchema(blueskyShareAttestations).omit({
  id: true,
  attestedAt: true,
  revokedAt: true,
});

export type InsertBlueskyShareAttestation = z.infer<typeof insertBlueskyShareAttestationSchema>;
export type BlueskyShareAttestation = typeof blueskyShareAttestations.$inferSelect;

export const metaLensScans = pgTable("meta_lens_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sourceDevice: text("source_device").notNull().default("ray-ban-meta"), // ray-ban-meta, meta-view-app, oakley-meta, manual-meta-ai
  anatomyType: text("anatomy_type").notNull(), // penis, vagina, anus, front_hole, multi_anatomy
  capturedAt: timestamp("captured_at").notNull(),
  lengthMm: integer("length_mm"),
  girthMm: integer("girth_mm"),
  widthMm: integer("width_mm"),
  depthMm: integer("depth_mm"),
  rawTranscript: text("raw_transcript"), // what the user got from Meta AI verbatim
  scanImageRef: text("scan_image_ref"), // optional uploaded reference image URL
  measurementMethod: text("measurement_method").notNull(), // meta-ai-verbal, meta-ai-photo-tape, manual-tape-via-glasses
  confidenceLevel: text("confidence_level").notNull().default("medium"), // low, medium, high
  notes: text("notes"),
  generatedConfigId: integer("generated_config_id").references(() => productConfigurations.id),
  status: text("status").notNull().default("imported"), // imported, configured, ordered, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMetaLensScanSchema = createInsertSchema(metaLensScans).omit({
  id: true,
  generatedConfigId: true,
  createdAt: true,
});

export type InsertMetaLensScan = z.infer<typeof insertMetaLensScanSchema>;
export type MetaLensScan = typeof metaLensScans.$inferSelect;

export const xCoopPricingInterest = pgTable("x_coop_pricing_interest", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull().default("x"),
  xHandle: text("x_handle").notNull(),
  isXPremium: boolean("is_x_premium").notNull().default(false),
  pornOptOut: boolean("porn_opt_out").notNull().default(true),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const insertXCoopPricingInterestSchema = createInsertSchema(xCoopPricingInterest).omit({
  id: true,
  registeredAt: true,
});

export type InsertXCoopPricingInterest = z.infer<typeof insertXCoopPricingInterestSchema>;
export type XCoopPricingInterest = typeof xCoopPricingInterest.$inferSelect;

export const herbalKnowledgeEntries = pgTable("herbal_knowledge_entries", {
  id: serial("id").primaryKey(),
  commonName: text("common_name").notNull(),
  latinName: text("latin_name").notNull(),
  partUsed: text("part_used").notNull(),
  category: text("category").notNull(),
  traditionalUses: text("traditional_uses").notNull(),
  foragingNotes: text("foraging_notes").notNull(),
  safetyWarnings: text("safety_warnings").notNull(),
  sustainabilityNotes: text("sustainability_notes").notNull(),
  ahgScopeNote: text("ahg_scope_note").notNull(),
  requiresRhConsult: boolean("requires_rh_consult").notNull().default(false),
  contributorId: integer("contributor_id").references(() => users.id),
  citationUrl: text("citation_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertHerbalKnowledgeEntrySchema = createInsertSchema(herbalKnowledgeEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertHerbalKnowledgeEntry = z.infer<typeof insertHerbalKnowledgeEntrySchema>;
export type HerbalKnowledgeEntry = typeof herbalKnowledgeEntries.$inferSelect;

export const xShareAttestations = pgTable("x_share_attestations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  xHandle: text("x_handle").notNull(),
  adultContentDisabled: boolean("adult_content_disabled").notNull().default(false),
  usesQoolNftStudio: boolean("uses_qool_nft_studio").notNull().default(false),
  qoolStudioHandle: text("qool_studio_handle"),
  attestationStatement: text("attestation_statement").notNull(),
  attestedAt: timestamp("attested_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const insertXShareAttestationSchema = createInsertSchema(xShareAttestations).omit({
  id: true,
  attestedAt: true,
  revokedAt: true,
});

export type InsertXShareAttestation = z.infer<typeof insertXShareAttestationSchema>;
export type XShareAttestation = typeof xShareAttestations.$inferSelect;

export const platformCompensationAttestations = pgTable("platform_compensation_attestations", {
  id: serial("id").primaryKey(),
  platformName: text("platform_name").notNull(),
  proprietorEntity: text("proprietor_entity"),
  compensationActive: boolean("compensation_active").notNull().default(false),
  compensationProgramUrl: text("compensation_program_url"),
  verifiedBy: text("verified_by"),
  evidenceNotes: text("evidence_notes"),
  affectedPersonRegistryUrl: text("affected_person_registry_url"),
  lastReviewed: timestamp("last_reviewed").defaultNow().notNull(),
  updatedById: integer("updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPlatformCompensationAttestationSchema = createInsertSchema(platformCompensationAttestations).omit({
  id: true,
  createdAt: true,
  lastReviewed: true,
});

export type InsertPlatformCompensationAttestation = z.infer<typeof insertPlatformCompensationAttestationSchema>;
export type PlatformCompensationAttestation = typeof platformCompensationAttestations.$inferSelect;

export const trisexportPartnerSlots = pgTable("trisexport_partner_slots", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  pseudonym: text("pseudonym").notNull(),
  encounterDate: timestamp("encounter_date").notNull(),
  barrierUsage: text("barrier_usage").notNull(),
  consentQuality: text("consent_quality").notNull(),
  diseaseVectorStatus: text("disease_vector_status").notNull(),
  partnerLastTestDate: timestamp("partner_last_test_date"),
  partnerAnonymousHandle: text("partner_anonymous_handle"),
  fluidBondedFlag: boolean("fluid_bonded_flag").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrisexportPartnerSlotSchema = createInsertSchema(trisexportPartnerSlots).omit({
  id: true,
  createdAt: true,
});

export type InsertTrisexportPartnerSlot = z.infer<typeof insertTrisexportPartnerSlotSchema>;
export type TrisexportPartnerSlot = typeof trisexportPartnerSlots.$inferSelect;
