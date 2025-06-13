import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
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

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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
