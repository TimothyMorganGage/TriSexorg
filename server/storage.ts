import { eq, and, or, desc, sql, ilike } from "drizzle-orm";
import { db } from "./db";
import { 
  users, products, productConfigurations, orders, educationalContent, partnershipRequests,
  financialRecords, budgetItems, budgetVotes, communityDividends,
  moodEntries, wellnessGoals, moodInsights, timeEntries, timeGoals, timeInsights,
  calendarConnections, scheduledTasks, taskTemplates, savedProductConfigurations,
  forumCategories, forumPosts, forumReplies, forumLikes, forumBookmarks,
  wikiContributions, wikiVotes,
  constellationProfiles,
  type ConstellationProfile,
  type InsertConstellationProfile,
  constellationContactRequests,
  type ConstellationContactRequest,
  type InsertConstellationContactRequest,
  type WikiContribution, type InsertWikiContribution,
  type WikiVote, type InsertWikiVote,
  boundaryCheckConsents, xCoopPricingInterest, metaLensScans,
  blueskyShareAttestations,
  type User, type InsertUser, type Product, type InsertProduct,
  type ProductConfiguration, type InsertProductConfiguration,
  type Order, type InsertOrder, type EducationalContent, type InsertEducationalContent,
  type PartnershipRequest, type InsertPartnershipRequest,
  type FinancialRecord, type InsertFinancialRecord,
  type BudgetItem, type InsertBudgetItem,
  type BudgetVote, type InsertBudgetVote,
  type CommunityDividend, type InsertCommunityDividend,
  type MoodEntry, type InsertMoodEntry,
  type WellnessGoal, type InsertWellnessGoal,
  type MoodInsight, type InsertMoodInsight,
  type TimeEntry, type InsertTimeEntry,
  type TimeGoal, type InsertTimeGoal,
  type TimeInsight, type InsertTimeInsight,
  type CalendarConnection, type InsertCalendarConnection,
  type ScheduledTask, type InsertScheduledTask,
  type TaskTemplate, type InsertTaskTemplate,
  type SavedProductConfiguration, type InsertSavedProductConfiguration,
  type ForumCategory, type InsertForumCategory,
  type ForumPost, type InsertForumPost,
  type ForumReply, type InsertForumReply,
  type ForumLike, type ForumBookmark,
  type BoundaryCheckConsent, type InsertBoundaryCheckConsent,
  type XCoopPricingInterest, type InsertXCoopPricingInterest,
  type MetaLensScan, type InsertMetaLensScan,
  type BlueskyShareAttestation, type InsertBlueskyShareAttestation,
  type HerbalKnowledgeEntry, type InsertHerbalKnowledgeEntry,
  herbalKnowledgeEntries,
  type XShareAttestation, type InsertXShareAttestation,
  xShareAttestations,
  type PlatformCompensationAttestation, type InsertPlatformCompensationAttestation,
  platformCompensationAttestations,
  type TrisexportPartnerSlot, type InsertTrisexportPartnerSlot,
  trisexportPartnerSlots,
  type InclusiveOrderingAdopter, type InsertInclusiveOrderingAdopter,
  inclusiveOrderingAdopters,
  type JointProtectionOrder, type InsertJointProtectionOrder,
  jointProtectionOrders,
  type PasskeyCredential, type InsertPasskeyCredential,
  passkeyCredentials,
  type DigitalIdVerification, type InsertDigitalIdVerification,
  digitalIdVerifications,
  manufacturingPartners,
  type ManufacturingPartner,
  type InsertManufacturingPartner,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByRole(role: string): Promise<User[]>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Product Configuration methods
  getProductConfigurations(userId: number): Promise<ProductConfiguration[]>;
  getProductConfiguration(id: number): Promise<ProductConfiguration | undefined>;
  createProductConfiguration(config: InsertProductConfiguration): Promise<ProductConfiguration>;
  updateProductConfigurationStatus(id: number, status: string): Promise<ProductConfiguration | undefined>;

  // Saved Product Configuration methods
  getSavedProductConfigurations(userId: number): Promise<SavedProductConfiguration[]>;
  getSavedProductConfiguration(id: number): Promise<SavedProductConfiguration | undefined>;
  getSavedProductConfigurationByShareCode(shareCode: string): Promise<SavedProductConfiguration | undefined>;
  createSavedProductConfiguration(config: InsertSavedProductConfiguration): Promise<SavedProductConfiguration>;
  updateSavedProductConfiguration(id: number, config: Partial<InsertSavedProductConfiguration>): Promise<SavedProductConfiguration | undefined>;
  deleteSavedProductConfiguration(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrdersByClinic(clinicId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Educational Content methods
  getEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContentByCategory(category: string): Promise<EducationalContent[]>;
  getEducationalContentBySlug(slug: string): Promise<EducationalContent | undefined>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;

  // Partnership Request methods
  getPartnershipRequests(): Promise<PartnershipRequest[]>;
  createPartnershipRequest(request: InsertPartnershipRequest): Promise<PartnershipRequest>;
  updatePartnershipRequestStatus(id: number, status: string): Promise<PartnershipRequest | undefined>;

  // Analytics methods
  getOrderStats(): Promise<{
    totalOrders: number;
    activeOrders: number;
    monthlyOrders: number;
    completedOrders: number;
  }>;

  // Financial Management methods
  getFinancialRecords(): Promise<FinancialRecord[]>;
  getFinancialRecordsByPeriod(period: string): Promise<FinancialRecord[]>;
  createFinancialRecord(record: InsertFinancialRecord): Promise<FinancialRecord>;
  
  getBudgetItems(): Promise<BudgetItem[]>;
  getBudgetItem(id: number): Promise<BudgetItem | undefined>;
  createBudgetItem(item: InsertBudgetItem): Promise<BudgetItem>;
  updateBudgetItemStatus(id: number, status: string): Promise<BudgetItem | undefined>;
  
  getBudgetVotes(budgetItemId: number): Promise<BudgetVote[]>;
  createBudgetVote(vote: InsertBudgetVote): Promise<BudgetVote>;
  
  getCommunityDividends(): Promise<CommunityDividend[]>;
  getCommunityDividendsByUser(userId: number): Promise<CommunityDividend[]>;
  createCommunityDividend(dividend: InsertCommunityDividend): Promise<CommunityDividend>;

  // Mood and Wellness Logging methods
  getMoodEntries(userId: number): Promise<MoodEntry[]>;
  getMoodEntry(id: number): Promise<MoodEntry | undefined>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  updateMoodEntry(id: number, entry: Partial<InsertMoodEntry>): Promise<MoodEntry | undefined>;
  deleteMoodEntry(id: number): Promise<boolean>;
  getMoodEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<MoodEntry[]>;
  
  getWellnessGoals(userId: number): Promise<WellnessGoal[]>;
  getWellnessGoal(id: number): Promise<WellnessGoal | undefined>;
  createWellnessGoal(goal: InsertWellnessGoal): Promise<WellnessGoal>;
  updateWellnessGoal(id: number, goal: Partial<InsertWellnessGoal>): Promise<WellnessGoal | undefined>;
  deleteWellnessGoal(id: number): Promise<boolean>;
  
  getMoodInsights(userId: number): Promise<MoodInsight[]>;
  createMoodInsight(insight: InsertMoodInsight): Promise<MoodInsight>;
  acknowledgeMoodInsight(id: number): Promise<MoodInsight | undefined>;

  // Time Management methods - "Wise Time TriSexs" system
  getTimeEntries(userId: number): Promise<TimeEntry[]>;
  getTimeEntry(id: number): Promise<TimeEntry | undefined>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: number, entry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  deleteTimeEntry(id: number): Promise<boolean>;
  getTimeEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<TimeEntry[]>;
  getActiveTimeEntry(userId: number): Promise<TimeEntry | undefined>;
  
  getTimeGoals(userId: number): Promise<TimeGoal[]>;
  getTimeGoal(id: number): Promise<TimeGoal | undefined>;
  createTimeGoal(goal: InsertTimeGoal): Promise<TimeGoal>;
  updateTimeGoal(id: number, goal: Partial<InsertTimeGoal>): Promise<TimeGoal | undefined>;
  deleteTimeGoal(id: number): Promise<boolean>;
  
  getTimeInsights(userId: number): Promise<TimeInsight[]>;
  createTimeInsight(insight: InsertTimeInsight): Promise<TimeInsight>;
  acknowledgeTimeInsight(id: number): Promise<TimeInsight | undefined>;

  // Calendar Integration methods
  getCalendarConnections(userId: number): Promise<CalendarConnection[]>;
  getCalendarConnection(id: number): Promise<CalendarConnection | undefined>;
  createCalendarConnection(connection: InsertCalendarConnection): Promise<CalendarConnection>;
  updateCalendarConnection(id: number, connection: Partial<InsertCalendarConnection>): Promise<CalendarConnection | undefined>;
  deleteCalendarConnection(id: number): Promise<boolean>;
  
  getScheduledTasks(userId: number): Promise<ScheduledTask[]>;
  getScheduledTask(id: number): Promise<ScheduledTask | undefined>;
  createScheduledTask(task: InsertScheduledTask): Promise<ScheduledTask>;
  updateScheduledTask(id: number, task: Partial<InsertScheduledTask>): Promise<ScheduledTask | undefined>;
  deleteScheduledTask(id: number): Promise<boolean>;
  getScheduledTasksByDateRange(userId: number, startDate: string, endDate: string): Promise<ScheduledTask[]>;
  
  getTaskTemplates(userId: number): Promise<TaskTemplate[]>;
  getPublicTaskTemplates(): Promise<TaskTemplate[]>;
  getTaskTemplate(id: number): Promise<TaskTemplate | undefined>;
  createTaskTemplate(template: InsertTaskTemplate): Promise<TaskTemplate>;
  updateTaskTemplate(id: number, template: Partial<InsertTaskTemplate>): Promise<TaskTemplate | undefined>;
  deleteTaskTemplate(id: number): Promise<boolean>;
  incrementTemplateUsage(id: number): Promise<TaskTemplate | undefined>;

  // Forum methods
  getForumCategories(): Promise<ForumCategory[]>;
  getForumCategory(id: number): Promise<ForumCategory | undefined>;
  createForumCategory(category: InsertForumCategory): Promise<ForumCategory>;
  getForumPosts(categoryId?: number, limit?: number, offset?: number): Promise<ForumPost[]>;
  getForumPost(id: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  updateForumPost(id: number, data: Partial<InsertForumPost>): Promise<ForumPost | undefined>;
  incrementPostViewCount(id: number): Promise<void>;
  getForumReplies(postId: number): Promise<ForumReply[]>;
  createForumReply(reply: InsertForumReply): Promise<ForumReply>;
  toggleForumLike(userId: number, postId?: number, replyId?: number): Promise<boolean>;
  getForumLikes(userId: number): Promise<ForumLike[]>;
  getForumBookmarks(userId: number): Promise<ForumBookmark[]>;
  toggleForumBookmark(userId: number, postId: number): Promise<boolean>;
  searchForumPosts(query: string): Promise<ForumPost[]>;
  getTrendingForumPosts(limit?: number): Promise<ForumPost[]>;

  // Boundary background-check consent methods
  getBoundaryCheckConsents(userId: number): Promise<BoundaryCheckConsent[]>;
  createBoundaryCheckConsent(data: InsertBoundaryCheckConsent): Promise<BoundaryCheckConsent>;
  revokeBoundaryCheckConsent(id: number, userId: number): Promise<boolean>;

  // X cooperative-pricing interest registry
  getXCoopPricingInterest(userId: number, platform?: string): Promise<XCoopPricingInterest | undefined>;
  getAllXCoopPricingInterestForUser(userId: number): Promise<XCoopPricingInterest[]>;
  upsertXCoopPricingInterest(data: InsertXCoopPricingInterest): Promise<XCoopPricingInterest>;
  countXCoopPricingInterest(): Promise<{ total: number; premium: number; pornOptOut: number; byPlatform: Record<string, { total: number; premium: number }> }>;

  // Meta Lens scan import
  getMetaLensScansByUser(userId: number): Promise<MetaLensScan[]>;
  getMetaLensScan(id: number): Promise<MetaLensScan | undefined>;
  createMetaLensScan(data: InsertMetaLensScan): Promise<MetaLensScan>;
  linkMetaLensScanToConfig(scanId: number, configId: number): Promise<MetaLensScan | undefined>;
  deleteMetaLensScan(id: number, userId: number): Promise<boolean>;

  // Bluesky share attestation (ethics gate)
  getActiveBlueskyAttestation(userId: number): Promise<BlueskyShareAttestation | undefined>;
  createBlueskyAttestation(data: InsertBlueskyShareAttestation): Promise<BlueskyShareAttestation>;
  revokeBlueskyAttestation(id: number, userId: number): Promise<boolean>;

  // Herbal knowledge base (American Herbalists Guild framework)
  listHerbalEntries(category?: string): Promise<HerbalKnowledgeEntry[]>;
  getHerbalEntry(id: number): Promise<HerbalKnowledgeEntry | undefined>;
  createHerbalEntry(data: InsertHerbalKnowledgeEntry): Promise<HerbalKnowledgeEntry>;

  // Wiki dynamic dates — co-operator contributions and upvotes
  listWikiActivity(): Promise<Array<{ articleId: string; lastContributedAt: string | null; lastVotedAt: string | null; contributionCount: number; voteCount: number }>>;
  listWikiContributions(articleId: string): Promise<WikiContribution[]>;
  recordWikiContribution(data: InsertWikiContribution): Promise<WikiContribution>;
  recordWikiVote(articleId: string, userId: number, contributionId?: number | null): Promise<{ vote: WikiVote; alreadyVoted: boolean }>;
  hasUserVotedWiki(articleId: string, userId: number): Promise<boolean>;

  // X (Twitter) share attestation (ethics gate, mirrors Bluesky)
  getActiveXAttestation(userId: number): Promise<XShareAttestation | undefined>;
  createXAttestation(data: InsertXShareAttestation): Promise<XShareAttestation>;
  revokeXAttestation(id: number, userId: number): Promise<boolean>;

  // Inbound platform-access compensation gate (Sniffies, etc.)
  listPlatformCompensation(): Promise<PlatformCompensationAttestation[]>;
  getPlatformCompensation(platformName: string): Promise<PlatformCompensationAttestation | undefined>;
  upsertPlatformCompensation(data: InsertPlatformCompensationAttestation): Promise<PlatformCompensationAttestation>;

  // TriSexPort recent-6 partner mapping
  listTrisexportSlots(userId: number): Promise<TrisexportPartnerSlot[]>;
  addTrisexportSlot(data: InsertTrisexportPartnerSlot): Promise<TrisexportPartnerSlot>;
  deleteTrisexportSlot(id: number, userId: number): Promise<boolean>;

  // Inclusive Ordering framework adopters (self-reported registry)
  listConstellationProfiles(): Promise<ConstellationProfile[]>;
  createConstellationProfile(data: InsertConstellationProfile): Promise<ConstellationProfile>;
  getConstellationProfileById(id: number): Promise<ConstellationProfile | undefined>;
  getConstellationProfileByManageToken(token: string): Promise<ConstellationProfile | undefined>;
  createConstellationContactRequest(data: InsertConstellationContactRequest & { requesterToken: string }): Promise<ConstellationContactRequest>;
  listConstellationContactRequestsForProfile(profileId: number): Promise<ConstellationContactRequest[]>;
  getConstellationContactRequestById(id: number): Promise<ConstellationContactRequest | undefined>;
  getConstellationContactRequestByRequesterToken(token: string): Promise<ConstellationContactRequest | undefined>;
  updateConstellationContactRequestStatus(id: number, status: "accepted" | "declined"): Promise<ConstellationContactRequest | undefined>;
  listInclusiveOrderingAdopters(): Promise<InclusiveOrderingAdopter[]>;
  createInclusiveOrderingAdopter(data: InsertInclusiveOrderingAdopter): Promise<InclusiveOrderingAdopter>;
  countInclusiveOrderingAdopters(): Promise<{ verified: number; pending: number; ourNameForks: number }>;
  createJointProtectionOrder(data: InsertJointProtectionOrder): Promise<JointProtectionOrder>;
  countJointProtectionOrders(): Promise<number>;

  // Passkey (WebAuthn) OS-side verification
  getPasskeyCredentialsByUser(userId: number): Promise<PasskeyCredential[]>;
  getPasskeyCredentialById(credentialId: string): Promise<PasskeyCredential | undefined>;
  createPasskeyCredential(data: InsertPasskeyCredential): Promise<PasskeyCredential>;
  updatePasskeyCounter(credentialId: string, counter: number): Promise<void>;

  // Digital-ID (mDL) age verification
  getDigitalIdVerificationByUser(userId: number): Promise<DigitalIdVerification | undefined>;
  createDigitalIdVerification(data: InsertDigitalIdVerification): Promise<DigitalIdVerification>;
  upgradeDigitalIdVerification(id: number, data: Partial<InsertDigitalIdVerification>): Promise<DigitalIdVerification>;

  // Manufacturing partners (self-reported registry of candidate / signed factories)
  listManufacturingPartners(): Promise<ManufacturingPartner[]>;
  createManufacturingPartner(data: InsertManufacturingPartner): Promise<ManufacturingPartner>;

  // Clinic Inventory methods
  getClinicInventory(): Promise<any[]>;
  updateInventoryStock(itemId: number, quantity: number, notes?: string): Promise<any>;
  getStockAlerts(): Promise<any[]>;
  acknowledgeStockAlert(alertId: number): Promise<any>;
  getRestockOrders(): Promise<any[]>;
  createRestockOrder(orderData: { items: { itemId: number; quantity: number }[]; supplier: string }): Promise<any>;

  // Notification System methods
  getNotificationSettings(userId: number): Promise<any[]>;
  createNotificationSettings(settings: any): Promise<any>;
  updateNotificationSettings(id: number, settings: any): Promise<any>;
  createCrossPlatformNotification(notification: any): Promise<any>;
  markNotificationAsSent(id: number): Promise<void>;
  getNotifications(userId: number): Promise<any[]>;
  getUnreadNotifications(userId: number): Promise<any[]>;
  markNotificationAsRead(id: number): Promise<boolean>;

  // Smart Break System methods
  getBreakPatterns(userId: number): Promise<any[]>;
  createBreakPattern(pattern: any): Promise<any>;
  activateBreakPattern(userId: number, patternId: number): Promise<any>;
  getRestSuggestions(userId: number, filters?: any): Promise<any[]>;
  createRestSuggestion(suggestion: any): Promise<any>;
  createSmartBreakSession(session: any): Promise<any>;
  completeSmartBreakSession(sessionId: number, completionData: any): Promise<any>;
  getSmartBreakSessionsByDateRange(userId: number, startDate: string, endDate: string): Promise<any[]>;
  getRecentSmartBreakSessions(userId: number): Promise<any[]>;
  generateSmartBreakSuggestion(userId: number, context: any): Promise<any>;
  scheduleBreakReminders(userId: number, patternId: number, startTime: string): Promise<any[]>;

  // Messaging Platform Integration methods
  getMessagingIntegrations(userId: number): Promise<any[]>;
  createMessagingIntegration(integration: any): Promise<any>;
  updateMessagingIntegration(id: number, integration: any): Promise<any>;
  syncMessagingPlatform(integrationId: number): Promise<any>;

  // Healthcare System Integration methods
  getHealthcareIntegrations(userId: number): Promise<any[]>;
  createHealthcareIntegration(integration: any): Promise<any>;
  updateHealthcareIntegration(id: number, integration: any): Promise<any>;
  syncHealthcareData(integrationId: number, dataTypes: string[]): Promise<any>;

  // Accessibility Settings methods
  getAccessibilitySettings(userId: number): Promise<any>;
  createAccessibilitySettings(settings: any): Promise<any>;
  updateAccessibilitySettings(id: number, settings: any): Promise<any>;

  // Co-editing Session methods
  createCoEditingSession(session: any): Promise<any>;
  getCoEditingSessions(userId: number): Promise<any[]>;
  getActiveCoEditingSessions(userId: number): Promise<any[]>;
  updateCoEditingSession(sessionId: number, updates: any): Promise<any>;
  endCoEditingSession(sessionId: number): Promise<any>;

  // Co-editing Message methods
  createCoEditingMessage(message: any): Promise<any>;
  getCoEditingMessages(sessionId: number): Promise<any[]>;
  processMessageTranslation(messageId: number): Promise<any>;
  deliverToPlatforms(messageId: number): Promise<any>;

  // Translation Service methods
  requestTranslation(request: any): Promise<any>;
  getTranslations(userId: number, filters?: any): Promise<any[]>;
  verifyTranslation(translationId: number, verifierId: number): Promise<any>;

  // Health Data Sync methods
  getHealthDataSync(userId: number, filters?: any): Promise<any[]>;
  triggerHealthDataSync(userId: number, systems: string[], dataTypes: string[]): Promise<any>;
  getHealthDataByType(userId: number, dataType: string): Promise<any[]>;

  // Real-time WebSocket methods
  generateWebSocketToken(userId: number, sessionId: number): Promise<string>;
  validateWebSocketToken(token: string): Promise<any>;

  // Shared Health Circle methods (implicit one circle per user)
  getOrCreateHealthCircle(userId: number): Promise<any>;
  getHealthCircleContacts(userId: number): Promise<any[]>;
  getPartnerConnection(id: number): Promise<any | undefined>;

  // Partner Network methods
  getPartnerNetworks(userId: number): Promise<any[]>;
  createPartnerNetwork(network: any): Promise<any>;
  updatePartnerNetwork(id: number, network: any): Promise<any>;
  deletePartnerNetwork(id: number): Promise<boolean>;

  // Partner Connection methods
  getPartnerConnections(networkId: number): Promise<any[]>;
  createPartnerConnection(connection: any): Promise<any>;
  updatePartnerConnection(id: number, connection: any): Promise<any>;
  removePartnerConnection(id: number): Promise<boolean>;

  // 4D STI Tracking methods
  getStiTrackingEvents(userId: number, filters?: any): Promise<any[]>;
  getStiTrackingEvent(id: number): Promise<any | undefined>;
  createStiTrackingEvent(event: any): Promise<any>;
  updateStiTrackingEvent(id: number, event: any): Promise<any>;
  generatePartnerNotifications(eventId: number): Promise<any[]>;
  enforceHealthDataRetention(): Promise<{ eventsAnonymized: number; notificationsPurged: number }>;
  getNetworkExposureAnalysis(networkId: number, stiType: string): Promise<any>;

  // Sexual Product Customization methods
  getSexualProductCustomizations(userId: number): Promise<any[]>;
  createSexualProductCustomization(customization: any): Promise<any>;
  updateSexualProductCustomization(id: number, customization: any): Promise<any>;
  getPartnerCompatibleProducts(networkId: number): Promise<any[]>;
  
  // Natural Senses Profile methods
  getNaturalSensesProfile(userId: number): Promise<any>;
  createNaturalSensesProfile(profile: any): Promise<any>;
  updateNaturalSensesProfile(id: number, profile: any): Promise<any>;
  getOptimalProductRecommendations(userId: number): Promise<any[]>;

  // Product Effectiveness methods
  getProductEffectivenessReports(customizationId: number): Promise<any[]>;
  createProductEffectivenessReport(report: any): Promise<any>;
  getNetworkEffectivenessAnalysis(networkId: number): Promise<any>;

  // Partner Notification methods
  getPartnerNotifications(userId: number): Promise<any[]>;
  sendPartnerNotification(notification: any): Promise<any>;
  respondToNotification(notificationId: number, response: any): Promise<any>;

}

export class MemStorage implements IStorage {
  // NOTE: user accounts are persisted in PostgreSQL (see User methods below),
  // not in an in-memory map, so members survive restarts.
  private products: Map<number, Product>;
  private productConfigurations: Map<number, ProductConfiguration>;
  private orders: Map<number, Order>;
  private educationalContent: Map<number, EducationalContent>;
  private partnershipRequests: Map<number, PartnershipRequest>;
  private financialRecords: Map<number, FinancialRecord>;
  private budgetItems: Map<number, BudgetItem>;
  private budgetVotes: Map<number, BudgetVote>;
  private communityDividends: Map<number, CommunityDividend>;
  private moodEntries: Map<number, MoodEntry>;
  private wellnessGoals: Map<number, WellnessGoal>;
  private moodInsights: Map<number, MoodInsight>;
  private timeEntries: Map<number, TimeEntry>;
  private timeGoals: Map<number, TimeGoal>;
  private timeInsights: Map<number, TimeInsight>;
  private calendarConnections: Map<number, CalendarConnection>;
  private scheduledTasks: Map<number, ScheduledTask>;
  private taskTemplates: Map<number, TaskTemplate>;
  private currentProductId: number;
  private currentConfigId: number;
  private currentOrderId: number;
  private currentContentId: number;
  private currentRequestId: number;
  private currentFinancialRecordId: number;
  private currentBudgetItemId: number;
  private currentBudgetVoteId: number;
  private currentCommunityDividendId: number;
  private currentMoodEntryId: number;
  private currentWellnessGoalId: number;
  private currentMoodInsightId: number;
  private currentTimeEntryId: number;
  private currentTimeGoalId: number;
  private currentTimeInsightId: number;
  private currentCalendarConnectionId: number;
  private currentScheduledTaskId: number;
  private currentTaskTemplateId: number;
  private clinicInventory: Map<number, any>;
  private stockAlerts: Map<number, any>;
  private restockOrders: Map<number, any>;
  private currentInventoryId: number;
  private currentAlertId: number;
  private currentRestockOrderId: number;
  private savedProductConfigurations: Map<number, SavedProductConfiguration>;
  private currentSavedConfigId: number;
  // Shared Health Circle / partner-network state (in-memory, wiped on restart)
  private partnerNetworksMap: Map<number, any>;
  private partnerConnectionsMap: Map<number, any>;
  private stiTrackingEventsMap: Map<number, any>;
  private currentPartnerNetworkId: number;
  private currentPartnerConnectionId: number;
  private currentStiEventId: number;

  constructor() {
    this.products = new Map();
    this.productConfigurations = new Map();
    this.orders = new Map();
    this.educationalContent = new Map();
    this.partnershipRequests = new Map();
    this.financialRecords = new Map();
    this.budgetItems = new Map();
    this.budgetVotes = new Map();
    this.communityDividends = new Map();
    this.moodEntries = new Map();
    this.wellnessGoals = new Map();
    this.moodInsights = new Map();
    this.timeEntries = new Map();
    this.timeGoals = new Map();
    this.timeInsights = new Map();
    this.calendarConnections = new Map();
    this.scheduledTasks = new Map();
    this.taskTemplates = new Map();
    this.currentProductId = 1;
    this.currentConfigId = 1;
    this.currentOrderId = 1;
    this.currentContentId = 1;
    this.currentRequestId = 1;
    this.currentFinancialRecordId = 1;
    this.currentBudgetItemId = 1;
    this.currentBudgetVoteId = 1;
    this.currentCommunityDividendId = 1;
    this.currentMoodEntryId = 1;
    this.currentWellnessGoalId = 1;
    this.currentMoodInsightId = 1;
    this.currentTimeEntryId = 1;
    this.currentTimeGoalId = 1;
    this.currentTimeInsightId = 1;
    this.currentCalendarConnectionId = 1;
    this.currentScheduledTaskId = 1;
    this.currentTaskTemplateId = 1;
    this.clinicInventory = new Map();
    this.stockAlerts = new Map();
    this.restockOrders = new Map();
    this.currentInventoryId = 1;
    this.currentAlertId = 1;
    this.currentRestockOrderId = 1;
    this.savedProductConfigurations = new Map();
    this.currentSavedConfigId = 1;
    this.partnerNetworksMap = new Map();
    this.partnerConnectionsMap = new Map();
    this.stiTrackingEventsMap = new Map();
    this.currentPartnerNetworkId = 1;
    this.currentPartnerConnectionId = 1;
    this.currentStiEventId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Create default products
    const defaultProducts: InsertProduct[] = [
      {
        name: "TriSex External Protection - Ocean Plastic",
        description: "3D-printed TriSex Perfect Protection for external anatomy, made from recycled ocean plastic and hydrogel. Fits penis anatomy 4.5-11.5 inches.",
        category: "penis_protection",
        bodyCompatibility: ["penis"],
        sizeRange: "custom",
        basePrice: "29.99",
        isActive: true,
      },
      {
        name: "TriSex Internal Protection - Natural Blend",
        description: "3D-printed TriSex Perfect Protection for internal anatomy, made from natural plant-based materials. Compatible with vaginal and anal anatomy.",
        category: "multi_anatomical",
        bodyCompatibility: ["vagina", "anus", "front_hole"],
        sizeRange: "custom",
        basePrice: "34.99",
        isActive: true,
      },
      {
        name: "TriSex Multi-Anatomy Kit - Bio Silicone",
        description: "Complete kit for intersex and trans bodies. Includes external, internal, and barrier protection options.",
        category: "multi_anatomical",
        bodyCompatibility: ["penis", "vagina", "anus", "front_hole", "multi_anatomy"],
        sizeRange: "custom",
        basePrice: "49.99",
        isActive: true,
      },
      {
        name: "TriSex Barrier Dams - Ocean Plastic",
        description: "Custom-sized dental dams and barrier sheets made from recycled ocean plastic.",
        category: "barrier_dams",
        bodyCompatibility: ["vagina", "anus", "front_hole"],
        sizeRange: "custom",
        basePrice: "19.99",
        isActive: true,
      },
    ];

    defaultProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { 
        ...product, 
        id,
        bodyCompatibility: product.bodyCompatibility || null,
        isActive: product.isActive ?? true 
      });
    });

    // Create sample educational content — full 2SLGBTIQA+ articles (CC BY-SA 4.0)
    const defaultContent: InsertEducationalContent[] = [
      {
        title: "STI Prevention for the 2SLGBTIQA+ Community",
        slug: "sti-prevention-2slgbtiqa",
        content: `## Why 2SLGBTIQA+-centred STI prevention matters

Two-Spirit, lesbian, gay, bisexual, transgender, intersex, queer/questioning, asexual, and all expansive community members have been chronically under-served by mainstream sexual-health guidance written for cisgender, dyadic, heteronormative bodies. This article centres the actual mix of anatomies, partner configurations, and contact zones our co-operators report — without collapsing anyone into a "high-risk group" label.

## The contact-zone framework (not the "identity" framework)

Risk attaches to specific contact zones, not to identities. The same person may engage receptive oral, insertive frontal, and shared-toy contact within a single encounter. Prevention planning therefore lives at the act level, not the label level.

- Oral contact (giving or receiving) — barrier options: external condoms, oral dams, Gaynal-style cut barriers, internal condoms repurposed as dams.
- Frontal/vaginal/neovaginal contact — barrier options: internal or external condoms sized to the receptive partner, fingercots for manual.
- Anal contact — barrier options: thicker external or internal condoms, plus generous water- or silicone-based lubricant; never numbing lube as it masks tissue tears.
- Shared toys — barrier change between partners and between zones, or single-user toys per partner.

## Testing cadences our co-operators commit to

- Every 3 months: sexually active with multiple partners, on PrEP, or in a polycule with ongoing new contacts.
- Every 6 months: sexually active with one or two regular partners outside a closed agreement.
- Every 12 months: in a closed monogamous or polyfidelitous agreement with documented mutual baseline testing.
- After each new partner: a small-but-meaningful posture common among members with multiple partners.

A full panel for most 2SLGBTIQA+ co-operators includes HIV, syphilis, gonorrhoea + chlamydia (throat + rectal + frontal swabs, not urine alone), hepatitis B and C, plus HPV-related cervical or anal screening where anatomically relevant. Trichomoniasis and mycoplasma genitalium are worth requesting when symptomatic.

## Pre- and post-exposure tools

- PrEP (oral or injectable) for HIV prevention — accessible to anyone with HIV-negative status, regardless of gender or assignment at birth.
- DoxyPEP (doxycycline taken within 72 hours of condomless sex) reduces bacterial STI acquisition for many MSM and trans-feminine co-operators; discuss with a clinician.
- PEP within 72 hours of a suspected HIV exposure.
- HPV and hepatitis B vaccination through age 45.

## Intersex-centred fitting reduces breakage

Condom and barrier breakage is a prevention failure. Our inclusive-ordering framework treats 86 named intersex variations as the anatomical baseline, which means fit is matched to the body, not the body forced to a stock size. Better fit = fewer slips, fewer tears, more consistent protection.

## What this article does not pretend

We do not have a manufacturing partner yet (see /manufacturing for the honest status). Orders captured today become open-source CC BY-SA 4.0 design specifications. Prevention guidance here is grounded in WHO, CDC, and BASHH public guidelines as of 2026; verify with your local clinician for your jurisdiction.`,
        excerpt: "Contact-zone-based STI prevention written for Two-Spirit, lesbian, gay, bisexual, transgender, intersex, queer, asexual, and expansive co-operators — testing cadences, barriers, PrEP/PEP/DoxyPEP, and intersex-fitted protection.",
        category: "sti_prevention",
        tags: ["2slgbtiqa", "prep", "doxypep", "testing-cadence", "barriers"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Inclusive Health: Trans, Intersex, and Non-binary Embodiment",
        slug: "inclusive-health-trans-intersex-nonbinary",
        content: `## Centring intersex anatomy as the baseline

TriSex.org treats intersex anatomy as the universal baseline rather than a footnote. Sex-marker assignment (AMAB, AFAB, AXAB) describes what was recorded at birth — it does not describe anatomy, gender, or who you are. Across the 2SLGBTIQA+ community, the same recorded marker can correspond to a wide range of bodies, hormones, and surgical histories.

## Trans-affirming sexual-health care

- Hormonal context matters: oestradiol, testosterone, GnRH agonists, spironolactone, and progesterone each shift tissue elasticity, lubrication, and bleeding patterns. Plan barriers and lube accordingly.
- Post-op anatomy (vaginoplasty, phalloplasty, metoidioplasty, mastectomy, orchiectomy, hysterectomy) deserves its own fitting conversation. Our inclusive-ordering configurator includes neovaginal contact-zone selection and post-surgical fitting overrides.
- "Pre-op", "post-op", and "non-op" are equally valid. None require disclosure to access care here.

## Intersex co-operators are not a monolith

The 86 named intersex variations in our catalogue map to specific fitting implications — for example, hypospadias shifts urethral landmarks relevant to internal-condom seating; MRKH or Swyer syndrome affects neovaginal versus natal vaginal selection; CAH may correlate with clitoromegaly relevant to external-barrier choice. Each variation in the configurator has its own fitting notes and, where appropriate, a consultation flag.

## Non-binary, agender, genderqueer, two-spirit framings

Gender does not predict anatomy and anatomy does not predict gender. Our forms ask for the data we actually need (contact zones, fitting parameters, testing cadence) and not for gender as a proxy. Two-Spirit co-operators may carry ceremonial and kinship roles that mainstream forms erase; the platform respects that those roles are not ours to translate.

## What inclusive health looks like in practice

- Forms ask zone-of-contact, not "what kind of sex do gay people have".
- Defaults assume nothing about partners' genders or numbers.
- Pronoun and name fields are editable any time and never required to access care content.
- Sex-marker filters on the variations catalogue are honest: markers describe recorded birth assignment, not anatomy.

## Where to go next

- /inclusive-ordering — the configurator built on these principles.
- /anatomy-scanning and /meta-lens-scan — for body-measurement import (always optional).
- /accessibility — ASL/BSL, braille, and screen-reader support.`,
        excerpt: "How TriSex.org centres trans, intersex, non-binary, agender, and Two-Spirit embodiment — hormonal context, post-op anatomy, the 86-variation intersex baseline, and forms that ask for data not identity.",
        category: "inclusive_health",
        tags: ["trans-health", "intersex", "non-binary", "two-spirit", "86-variations"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Sustainable Sexual Health: Materials, Reuse, and Upcycling",
        slug: "sustainable-sexual-health-materials",
        content: `## Why sustainability is a 2SLGBTIQA+ issue

Disposable protection products generate substantial waste, and the 2SLGBTIQA+ community uses a wider range of barriers (dams, internal condoms, finger cots, gloves, dental cuts) than mainstream guidance assumes. Sustainable design means barriers that fit the actual mix of acts our co-operators have.

## Material families we work with

- Natural rubber latex — biodegradable in industrial composting, but allergenic for many co-operators.
- Polyisoprene — synthetic, latex-free, recyclable in specialised streams only.
- Polyurethane — thinner, conducts heat well, not biodegradable.
- Nitrile (gloves, some dams) — latex-free, durable, not biodegradable.
- Lambskin — porous to viruses; only suitable for pregnancy prevention, not STI prevention.

## The multi-use fold framework

Our inclusive-ordering origami fold sequence lets a single unit serve multiple acts through defined fold states. This is documented in the multi-use balance schema and is intentionally honest about its limits: a barrier folded for oral after frontal is not safe; fold states are designed for sequential acts that share zone and partner.

## The expired-product upcycling programme

When latex and polyisoprene barriers reach expiry without being used, they can be redirected into:
- Material-science research samples for the open-source materials database.
- Educational dissection kits for clinician training.
- Industrial composting (latex only) where regional facilities exist.

This is an opt-in programme, not an obligation, and no co-operator data travels with the upcycled material.

## What "sustainable" does not mean

It does not mean reusing single-use barriers between encounters or between partners. It does not mean skipping barriers to reduce waste. Prevention always comes first; sustainability is the design constraint, never the override.`,
        excerpt: "Material choices, multi-use fold sequences, and the expired-product upcycling programme — sustainability framed around the wider mix of barriers 2SLGBTIQA+ co-operators actually use.",
        category: "sustainable_health",
        tags: ["materials", "upcycling", "multi-use-fold", "cc-by-sa"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Communication, Consent, and Disclosure Across the 2SLGBTIQA+ Community",
        slug: "communication-consent-disclosure",
        content: `## Consent is layered, not binary

Affirmative, ongoing, informed, specific, and revocable — five layers our co-operators agree on. Each layer is a conversation, not a checkbox. The platform's Boundaries Background-Check Consent surface (/boundaries-background-check) operationalises this for sexual-boundaries conflict review, opt-in via WhatsApp or Signal.

## STI disclosure conversations

- Disclose before contact, not after. Distress about disclosure timing is real; defaulting to "before" protects both parties.
- Lead with the cadence of your testing, not just the result. "I tested two weeks ago, here is what I tested for" is more informative than "I am clean" (a phrase to retire).
- Status is a snapshot. PrEP, undetectable HIV viral load, vaccination history, and last-test date all add context.

## Polycule and metamour disclosure postures

Four common metamour disclosure postures:
- Kitchen-table: metamours know each other and may share space.
- Parallel: metamours acknowledge each other's existence but do not interact.
- Garden-party: occasional shared events, otherwise parallel.
- DADT (don't ask don't tell): no information shared; this posture is honest but raises specific STI-cadence considerations.

## Outing is never consent

Disclosing a partner's gender, trans or intersex status, HIV status, kink, or relationship structure to a third party without their explicit consent is outing. Our community standards treat outing as a serious harm. The Good People surface includes an explicit no-outing attestation enforced at profile creation.

## Communication tools we recommend

- Signal or WhatsApp for end-to-end-encrypted boundary conversations.
- Shared documents (Cryptpad, Standard Notes) for polycule agreements that need versioning.
- The community forum (/community-forum) Cooperative & Governance category for participatory budgeting, LETS mutual-credit, and cooperative decisions — not for outing or callouts.`,
        excerpt: "Five-layer consent, retiring \"I'm clean\", four metamour-disclosure postures, and no-outing as community standard — communication scripts for the 2SLGBTIQA+ co-operator community.",
        category: "communication",
        tags: ["consent", "disclosure", "metamours", "no-outing"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Community Support and Peer Mentoring for 2SLGBTIQA+ Co-operators",
        slug: "community-support-peer-mentoring",
        content: `## What "co-operator" means here

A co-operator is anyone using the platform — there are no "users" being mined for engagement. The community-support surfaces are designed around mutual aid, not influencer dynamics.

## Peer mentor and facilitator co-editing

The /peer-mentor and /mentor-facilitator surfaces let a co-operator invite a mentor to co-edit their fitting profile, testing log, or polycule agreement. Mentors are themselves co-operators who have completed onboarding and accepted explicit non-disclosure commitments. Co-editing is logged and revocable at any time.

## Healthcare-system bridges (always opt-in)

Where regionally available, the platform can connect with MyChart, Apple Health, and similar systems to import test results and immunisation history. The default is disconnected. Connecting requires the co-operator's own credentials; no broker, no resold data.

## Community forum categories

The community forum (/community-forum) hosts:
- Sexual Health Q&A — questions about STI testing, prevention, treatment.
- Product Reviews & Sizing — fit feedback that loops back into the open-source design specs.
- Peer Support — connection and shared experience.
- Intersex & Gender Diversity — discussions centring intersex anatomy and gender-diverse experiences.
- Relationships & Communication — partner conversations.
- Cooperative & Governance — participatory budgeting, LETS mutual-credit, and cooperative decisions.
- NanoHeal & Naturopathic — biomaterials and naturopathic STI research.
- Accessibility & Inclusion — ASL/BSL, braille, screen reader.

## Crisis and high-acuity support

The platform is not a crisis line. For mental-health crisis, please reach a regional resource: 988 in the US/Canada (Suicide & Crisis Lifeline), Trans Lifeline (877-565-8860 US / 877-330-6366 Canada), The Trevor Project for under-25 2SLGBTIQA+ youth, and Switchboard LGBT+ in the UK. The community forum does not replace these services.`,
        excerpt: "Co-operator-not-user framing, peer mentor co-editing, healthcare-system bridges, and the eight community-forum categories — how the 2SLGBTIQA+ peer-support stack is structured.",
        category: "community_support",
        tags: ["peer-mentoring", "co-operator", "community-forum", "mutual-aid"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Research and Science: Open-source Sexual Health for the 2SLGBTIQA+ Community",
        slug: "research-science-open-source",
        content: `## Why open-source

Every fitting parameter, every variation override, every order spec captured through /inclusive-ordering is published under CC BY-SA 4.0. Closed-source sexual-health products have historically excluded 2SLGBTIQA+ bodies — open-source design specs make exclusion visible and correctable in public.

## The 86-named-variation evidence base

The intersex variation catalogue (shared/inclusive-ordering/) draws on intersex-community-authored resources, peer-reviewed urology and gynaecology literature, and the InterACT advocacy framework. Each variation entry cites its evidence and surfaces its fitting implications.

## Materials-science research

The /materials-science surface tracks ongoing research on:
- Latex, polyisoprene, polyurethane, nitrile barrier performance.
- NanoHeal lubricant candidates (peer-reviewed sources only; the surface is honest that no NanoHeal product has shipped).
- Biomaterials for the expired-product upcycling programme.

## Naturopathic and herbal knowledge

The /herbal-knowledge surface lets co-operators contribute peer-reviewed entries on foraging and co-crafting protection materials, grounded in the American Herbalists Guild (AHG) framework. Entries require citation and steward review before publication.

## Honest limits of our research surface

- No clinical trials have been conducted by TriSex.org.
- No manufacturing partner has signed on (see /manufacturing).
- No NanoHeal product has shipped.
- Test cadence and PrEP recommendations follow WHO, CDC, and BASHH guidance as of 2026; we do not generate clinical guidelines.

## Fork the framework

The /fork-the-framework page documents the public API of the inclusive-ordering framework v1.0.0 — adopters can re-use the catalogue, marker derivation, fitting parameters, multi-use balance schema, and fold sequence under CC BY-SA 4.0. The /inclusive-ordering-registry tracks real adopters as they self-report.`,
        excerpt: "Open-source design specs, the 86-variation evidence base, materials-science and naturopathic research surfaces, and the honest limits of what TriSex.org research does and does not claim.",
        category: "research",
        tags: ["open-source", "cc-by-sa", "materials-science", "86-variations", "herbalism"],
        isPublished: true,
        authorId: 1,
      },
    ];

    defaultContent.forEach(content => {
      const id = this.currentContentId++;
      const now = new Date();
      this.educationalContent.set(id, { 
        ...content, 
        id, 
        tags: content.tags || null,
        isPublished: content.isPublished ?? true,
        createdAt: now,
        updatedAt: now 
      });
    });
  }

  // User methods
  // Accounts are persisted in PostgreSQL so members (and their logins) survive
  // restarts. The rest of MemStorage stays in-memory by design.
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        // Unified account model: every member is an equal "cooperator".
        role: "cooperator",
      })
      .returning();
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isActive);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      bodyCompatibility: insertProduct.bodyCompatibility || null,
      isActive: insertProduct.isActive ?? true
    };
    this.products.set(id, product);
    return product;
  }

  // Product Configuration methods
  async getProductConfigurations(userId: number): Promise<ProductConfiguration[]> {
    return Array.from(this.productConfigurations.values())
      .filter(config => config.userId === userId);
  }

  async getProductConfiguration(id: number): Promise<ProductConfiguration | undefined> {
    return this.productConfigurations.get(id);
  }

  async createProductConfiguration(insertConfig: InsertProductConfiguration): Promise<ProductConfiguration> {
    const id = this.currentConfigId++;
    const config: ProductConfiguration = { 
      ...insertConfig, 
      id,
      lengthMm: insertConfig.lengthMm || null,
      girthMm: insertConfig.girthMm || null,
      widthMm: insertConfig.widthMm || null,
      depthMm: insertConfig.depthMm || null,
      customMeasurements: insertConfig.customMeasurements || null,
      features: insertConfig.features || null,
      culturalTerms: insertConfig.culturalTerms || null,
      languagePreference: insertConfig.languagePreference || "en",
      status: insertConfig.status || "draft",
      createdAt: new Date() 
    };
    this.productConfigurations.set(id, config);
    return config;
  }

  async updateProductConfigurationStatus(id: number, status: string): Promise<ProductConfiguration | undefined> {
    const config = this.productConfigurations.get(id);
    if (config) {
      const updatedConfig = { ...config, status };
      this.productConfigurations.set(id, updatedConfig);
      return updatedConfig;
    }
    return undefined;
  }

  // Saved Product Configuration methods
  async getSavedProductConfigurations(userId: number): Promise<SavedProductConfiguration[]> {
    return Array.from(this.savedProductConfigurations.values())
      .filter(config => config.userId === userId);
  }

  async getSavedProductConfiguration(id: number): Promise<SavedProductConfiguration | undefined> {
    return this.savedProductConfigurations.get(id);
  }

  async getSavedProductConfigurationByShareCode(shareCode: string): Promise<SavedProductConfiguration | undefined> {
    return Array.from(this.savedProductConfigurations.values())
      .find(config => config.shareCode === shareCode && config.isPublic);
  }

  async createSavedProductConfiguration(insertConfig: InsertSavedProductConfiguration): Promise<SavedProductConfiguration> {
    const id = this.currentSavedConfigId++;
    const now = new Date();
    const config: SavedProductConfiguration = {
      ...insertConfig,
      id,
      isPublic: insertConfig.isPublic ?? false,
      createdAt: now,
      updatedAt: now
    };
    this.savedProductConfigurations.set(id, config);
    return config;
  }

  async updateSavedProductConfiguration(id: number, updates: Partial<InsertSavedProductConfiguration>): Promise<SavedProductConfiguration | undefined> {
    const config = this.savedProductConfigurations.get(id);
    if (config) {
      const updatedConfig = {
        ...config,
        ...updates,
        updatedAt: new Date()
      };
      this.savedProductConfigurations.set(id, updatedConfig);
      return updatedConfig;
    }
    return undefined;
  }

  async deleteSavedProductConfiguration(id: number): Promise<boolean> {
    return this.savedProductConfigurations.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async getOrdersByClinic(clinicId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.clinicId === clinicId);
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const orderNumber = `FLK-${new Date().getFullYear()}-${String(id).padStart(4, '0')}`;
    const now = new Date();
    const order: Order = { 
      ...insertOrder, 
      id, 
      orderNumber,
      status: insertOrder.status || "pending",
      clinicId: insertOrder.clinicId || null,
      shippingAddress: insertOrder.shippingAddress || null,
      notes: insertOrder.notes || null,
      createdAt: now,
      updatedAt: now 
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status, updatedAt: new Date() };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Educational Content methods
  async getEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values())
      .filter(content => content.isPublished);
  }

  async getEducationalContentByCategory(category: string): Promise<EducationalContent[]> {
    return Array.from(this.educationalContent.values())
      .filter(content => content.category === category && content.isPublished);
  }

  async getEducationalContentBySlug(slug: string): Promise<EducationalContent | undefined> {
    return Array.from(this.educationalContent.values())
      .find(content => content.slug === slug && content.isPublished);
  }

  async createEducationalContent(insertContent: InsertEducationalContent): Promise<EducationalContent> {
    const id = this.currentContentId++;
    const now = new Date();
    const content: EducationalContent = { 
      ...insertContent, 
      id,
      tags: insertContent.tags || null,
      isPublished: insertContent.isPublished ?? false,
      createdAt: now,
      updatedAt: now 
    };
    this.educationalContent.set(id, content);
    return content;
  }

  // Partnership Request methods
  async getPartnershipRequests(): Promise<PartnershipRequest[]> {
    return Array.from(this.partnershipRequests.values());
  }

  async createPartnershipRequest(insertRequest: InsertPartnershipRequest): Promise<PartnershipRequest> {
    const id = this.currentRequestId++;
    const request: PartnershipRequest = { 
      ...insertRequest, 
      id,
      phone: insertRequest.phone || null,
      status: insertRequest.status || "pending",
      interests: insertRequest.interests || null,
      additionalInfo: insertRequest.additionalInfo || null,
      createdAt: new Date() 
    };
    this.partnershipRequests.set(id, request);
    return request;
  }

  async updatePartnershipRequestStatus(id: number, status: string): Promise<PartnershipRequest | undefined> {
    const request = this.partnershipRequests.get(id);
    if (request) {
      const updatedRequest = { ...request, status };
      this.partnershipRequests.set(id, updatedRequest);
      return updatedRequest;
    }
    return undefined;
  }

  // Analytics methods
  async getOrderStats(): Promise<{
    totalOrders: number;
    activeOrders: number;
    monthlyOrders: number;
    completedOrders: number;
  }> {
    const orders = Array.from(this.orders.values());
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(order => 
        ['pending', 'in_production', 'shipped'].includes(order.status)
      ).length,
      monthlyOrders: orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }).length,
      completedOrders: orders.filter(order => order.status === 'delivered').length,
    };
  }

  // Financial Management methods
  async getFinancialRecords(): Promise<FinancialRecord[]> {
    return Array.from(this.financialRecords.values());
  }

  async getFinancialRecordsByPeriod(period: string): Promise<FinancialRecord[]> {
    return Array.from(this.financialRecords.values()).filter(record => {
      // Simple period matching - in real implementation would parse period more robustly
      return record.date.includes(period);
    });
  }

  async createFinancialRecord(insertRecord: InsertFinancialRecord): Promise<FinancialRecord> {
    const id = this.currentFinancialRecordId++;
    const record: FinancialRecord = { 
      id, 
      status: "pending",
      transactionHash: null,
      approvedBy: null,
      ...insertRecord,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.financialRecords.set(id, record);
    return record;
  }

  async getBudgetItems(): Promise<BudgetItem[]> {
    return Array.from(this.budgetItems.values());
  }

  async getBudgetItem(id: number): Promise<BudgetItem | undefined> {
    return this.budgetItems.get(id);
  }

  async createBudgetItem(insertItem: InsertBudgetItem): Promise<BudgetItem> {
    const id = this.currentBudgetItemId++;
    const item: BudgetItem = { 
      id, 
      status: "voting",
      allocatedAmount: "0",
      priority: "medium",
      votes: 0,
      ...insertItem,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.budgetItems.set(id, item);
    return item;
  }

  async updateBudgetItemStatus(id: number, status: string): Promise<BudgetItem | undefined> {
    const item = this.budgetItems.get(id);
    if (item) {
      const updatedItem = { ...item, status, updatedAt: new Date() };
      this.budgetItems.set(id, updatedItem);
      return updatedItem;
    }
    return undefined;
  }

  async getBudgetVotes(budgetItemId: number): Promise<BudgetVote[]> {
    return Array.from(this.budgetVotes.values()).filter(vote => vote.budgetItemId === budgetItemId);
  }

  async createBudgetVote(insertVote: InsertBudgetVote): Promise<BudgetVote> {
    const id = this.currentBudgetVoteId++;
    const vote: BudgetVote = { 
      id, 
      votingPower: 1,
      ...insertVote,
      createdAt: new Date()
    };
    this.budgetVotes.set(id, vote);
    
    // Update vote count on budget item
    const budgetItem = this.budgetItems.get(insertVote.budgetItemId);
    if (budgetItem) {
      budgetItem.votes += insertVote.votingPower || 1;
      this.budgetItems.set(insertVote.budgetItemId, budgetItem);
    }
    
    return vote;
  }

  async getCommunityDividends(): Promise<CommunityDividend[]> {
    return Array.from(this.communityDividends.values());
  }

  async getCommunityDividendsByUser(userId: number): Promise<CommunityDividend[]> {
    return Array.from(this.communityDividends.values()).filter(dividend => dividend.userId === userId);
  }

  async createCommunityDividend(insertDividend: InsertCommunityDividend): Promise<CommunityDividend> {
    const id = this.currentCommunityDividendId++;
    const dividend: CommunityDividend = { 
      id, 
      ...insertDividend,
      createdAt: new Date(),
      status: insertDividend.status || "pending",
      contributionHours: insertDividend.contributionHours || "0",
      equityMultiplier: insertDividend.equityMultiplier || "1.0",
      paidAt: null
    };
    this.communityDividends.set(id, dividend);
    return dividend;
  }

  // Clinic Inventory Management methods
  async getClinicInventory(): Promise<any[]> {
    // No sample/seed data: this dashboard is not connected to any real clinic
    // inventory system yet, so it returns only genuinely recorded stock (empty
    // until a real clinic's data is added). Nothing here is fabricated.
    return Array.from(this.clinicInventory.values());
  }

  async updateInventoryStock(itemId: number, quantity: number, notes?: string): Promise<any> {
    const item = this.clinicInventory.get(itemId);
    if (!item) return null;

    item.currentStock = quantity;
    
    // Update status based on stock levels
    if (quantity === 0) {
      item.status = "out_of_stock";
    } else if (quantity <= item.minimumThreshold) {
      item.status = "low_stock";
    } else {
      item.status = "in_stock";
    }

    this.clinicInventory.set(itemId, item);

    // Generate new alerts if needed
    this.generateStockAlerts();

    return item;
  }

  async getStockAlerts(): Promise<any[]> {
    return Array.from(this.stockAlerts.values());
  }

  async acknowledgeStockAlert(alertId: number): Promise<any> {
    const alert = this.stockAlerts.get(alertId);
    if (!alert) return null;

    alert.acknowledged = true;
    this.stockAlerts.set(alertId, alert);
    return alert;
  }

  async getRestockOrders(): Promise<any[]> {
    // No sample/seed data: restock orders are only those genuinely created
    // through createRestockOrder (empty until a real order is placed).
    return Array.from(this.restockOrders.values());
  }

  async createRestockOrder(orderData: { items: { itemId: number; quantity: number }[]; supplier: string }): Promise<any> {
    const id = this.currentRestockOrderId++;
    
    // Calculate order details
    const items = orderData.items.map(item => {
      const inventoryItem = this.clinicInventory.get(item.itemId);
      return {
        itemId: item.itemId,
        itemName: inventoryItem?.productName || "Unknown Item",
        quantity: item.quantity,
        unitCost: inventoryItem?.unitCost || 0
      };
    });

    const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

    const order = {
      id,
      items,
      supplier: orderData.supplier,
      orderDate: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      totalCost
    };

    this.restockOrders.set(id, order);
    return order;
  }

  // Mood and Wellness Logging methods
  async getMoodEntries(userId: number): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).filter(entry => entry.userId === userId);
  }

  async getMoodEntry(id: number): Promise<MoodEntry | undefined> {
    return this.moodEntries.get(id);
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const newEntry: MoodEntry = {
      sleepQuality: null,
      physicalSymptoms: null,
      emotionalState: null,
      notes: null,
      tags: null,
      isPrivate: true,
      ...entry,
      id: this.currentMoodEntryId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.moodEntries.set(newEntry.id, newEntry);
    return newEntry;
  }

  async updateMoodEntry(id: number, entry: Partial<InsertMoodEntry>): Promise<MoodEntry | undefined> {
    const existing = this.moodEntries.get(id);
    if (!existing) return undefined;
    
    const updated: MoodEntry = {
      ...existing,
      ...entry,
      updatedAt: new Date(),
    };
    this.moodEntries.set(id, updated);
    return updated;
  }

  async deleteMoodEntry(id: number): Promise<boolean> {
    return this.moodEntries.delete(id);
  }

  async getMoodEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).filter(entry => 
      entry.userId === userId && 
      entry.date >= startDate && 
      entry.date <= endDate
    );
  }

  async getWellnessGoals(userId: number): Promise<WellnessGoal[]> {
    return Array.from(this.wellnessGoals.values()).filter(goal => goal.userId === userId);
  }

  async getWellnessGoal(id: number): Promise<WellnessGoal | undefined> {
    return this.wellnessGoals.get(id);
  }

  async createWellnessGoal(goal: InsertWellnessGoal): Promise<WellnessGoal> {
    const newGoal: WellnessGoal = {
      description: null,
      targetEmoji: null,
      targetValue: null,
      endDate: null,
      status: "active",
      reminderTime: null,
      isActive: true,
      ...goal,
      id: this.currentWellnessGoalId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.wellnessGoals.set(newGoal.id, newGoal);
    return newGoal;
  }

  async updateWellnessGoal(id: number, goal: Partial<InsertWellnessGoal>): Promise<WellnessGoal | undefined> {
    const existing = this.wellnessGoals.get(id);
    if (!existing) return undefined;
    
    const updated: WellnessGoal = {
      ...existing,
      ...goal,
      updatedAt: new Date(),
    };
    this.wellnessGoals.set(id, updated);
    return updated;
  }

  async deleteWellnessGoal(id: number): Promise<boolean> {
    return this.wellnessGoals.delete(id);
  }

  async getMoodInsights(userId: number): Promise<MoodInsight[]> {
    return Array.from(this.moodInsights.values()).filter(insight => insight.userId === userId);
  }

  async createMoodInsight(insight: InsertMoodInsight): Promise<MoodInsight> {
    const newInsight: MoodInsight = {
      dataPoints: null,
      isPositive: null,
      suggestedActions: null,
      acknowledgedAt: null,
      isAcknowledged: false,
      ...insight,
      id: this.currentMoodInsightId++,
      generatedAt: new Date(),
    };
    this.moodInsights.set(newInsight.id, newInsight);
    return newInsight;
  }

  async acknowledgeMoodInsight(id: number): Promise<MoodInsight | undefined> {
    const existing = this.moodInsights.get(id);
    if (!existing) return undefined;
    
    const updated: MoodInsight = {
      ...existing,
      isAcknowledged: true,
      acknowledgedAt: new Date(),
    };
    this.moodInsights.set(id, updated);
    return updated;
  }

  // Time Management methods - "Wise Time TriSexs" system
  async getTimeEntries(userId: number): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.userId === userId);
  }

  async getTimeEntry(id: number): Promise<TimeEntry | undefined> {
    return this.timeEntries.get(id);
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const newEntry: TimeEntry = {
      endTime: null,
      duration: null,
      project: null,
      description: null,
      energyBefore: null,
      energyAfter: null,
      focusQuality: null,
      satisfaction: null,
      tags: null,
      timeWisdom: null,
      isCreativeCommons: null,
      wiseTimeTriSex: null,
      calendarEventId: null,
      calendarType: null,
      syncStatus: null,
      lastSynced: null,
      isCalendarBlocked: null,
      ...entry,
      id: this.currentTimeEntryId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.timeEntries.set(newEntry.id, newEntry);
    return newEntry;
  }

  async updateTimeEntry(id: number, entry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const existing = this.timeEntries.get(id);
    if (!existing) return undefined;
    
    const updated: TimeEntry = {
      ...existing,
      ...entry,
      updatedAt: new Date(),
    };
    this.timeEntries.set(id, updated);
    return updated;
  }

  async deleteTimeEntry(id: number): Promise<boolean> {
    return this.timeEntries.delete(id);
  }

  async getTimeEntriesByDateRange(userId: number, startDate: string, endDate: string): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => 
      entry.userId === userId && 
      entry.date >= startDate && 
      entry.date <= endDate
    );
  }

  async getActiveTimeEntry(userId: number): Promise<TimeEntry | undefined> {
    return Array.from(this.timeEntries.values()).find(entry => 
      entry.userId === userId && entry.endTime === null
    );
  }

  async getTimeGoals(userId: number): Promise<TimeGoal[]> {
    return Array.from(this.timeGoals.values()).filter(goal => goal.userId === userId);
  }

  async getTimeGoal(id: number): Promise<TimeGoal | undefined> {
    return this.timeGoals.get(id);
  }

  async createTimeGoal(goal: InsertTimeGoal): Promise<TimeGoal> {
    const newGoal: TimeGoal = {
      description: null,
      targetHoursDaily: null,
      targetHoursWeekly: null,
      targetHoursMonthly: null,
      reminderTime: null,
      endDate: null,
      status: "active",
      priority: "medium",
      ...goal,
      id: this.currentTimeGoalId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.timeGoals.set(newGoal.id, newGoal);
    return newGoal;
  }

  async updateTimeGoal(id: number, goal: Partial<InsertTimeGoal>): Promise<TimeGoal | undefined> {
    const existing = this.timeGoals.get(id);
    if (!existing) return undefined;
    
    const updated: TimeGoal = {
      ...existing,
      ...goal,
      updatedAt: new Date(),
    };
    this.timeGoals.set(id, updated);
    return updated;
  }

  async deleteTimeGoal(id: number): Promise<boolean> {
    return this.timeGoals.delete(id);
  }

  async getTimeInsights(userId: number): Promise<TimeInsight[]> {
    return Array.from(this.timeInsights.values()).filter(insight => insight.userId === userId);
  }

  async createTimeInsight(insight: InsertTimeInsight): Promise<TimeInsight> {
    const newInsight: TimeInsight = {
      category: null,
      timePattern: null,
      recommendation: null,
      wiseTimeTriSex: null,
      dataPoints: null,
      acknowledgedAt: null,
      isAcknowledged: false,
      ...insight,
      id: this.currentTimeInsightId++,
      generatedAt: new Date(),
    };
    this.timeInsights.set(newInsight.id, newInsight);
    return newInsight;
  }

  async acknowledgeTimeInsight(id: number): Promise<TimeInsight | undefined> {
    const existing = this.timeInsights.get(id);
    if (!existing) return undefined;
    
    const updated: TimeInsight = {
      ...existing,
      isAcknowledged: true,
      acknowledgedAt: new Date(),
    };
    this.timeInsights.set(id, updated);
    return updated;
  }

  // Calendar Integration methods
  async getCalendarConnections(userId: number): Promise<CalendarConnection[]> {
    return Array.from(this.calendarConnections.values()).filter(conn => conn.userId === userId);
  }

  async getCalendarConnection(id: number): Promise<CalendarConnection | undefined> {
    return this.calendarConnections.get(id);
  }

  async createCalendarConnection(connection: InsertCalendarConnection): Promise<CalendarConnection> {
    const newConnection: CalendarConnection = {
      accessToken: null,
      refreshToken: null,
      calendarUrl: null,
      calendarId: null,
      syncEnabled: true,
      autoCreateBlocks: false,
      syncDirection: "bidirectional",
      lastSyncTime: null,
      syncErrors: null,
      isActive: true,
      ...connection,
      id: this.currentCalendarConnectionId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.calendarConnections.set(newConnection.id, newConnection);
    return newConnection;
  }

  async updateCalendarConnection(id: number, connection: Partial<InsertCalendarConnection>): Promise<CalendarConnection | undefined> {
    const existing = this.calendarConnections.get(id);
    if (!existing) return undefined;
    
    const updated: CalendarConnection = {
      ...existing,
      ...connection,
      updatedAt: new Date(),
    };
    this.calendarConnections.set(id, updated);
    return updated;
  }

  async deleteCalendarConnection(id: number): Promise<boolean> {
    return this.calendarConnections.delete(id);
  }

  async getScheduledTasks(userId: number): Promise<ScheduledTask[]> {
    return Array.from(this.scheduledTasks.values()).filter(task => task.userId === userId);
  }

  async getScheduledTask(id: number): Promise<ScheduledTask | undefined> {
    return this.scheduledTasks.get(id);
  }

  async createScheduledTask(task: InsertScheduledTask): Promise<ScheduledTask> {
    const newTask: ScheduledTask = {
      description: null,
      scheduledStartTime: null,
      scheduledEndTime: null,
      estimatedDuration: null,
      priority: "medium",
      status: "scheduled",
      linkedTimeEntryId: null,
      calendarEventId: null,
      calendarConnectionId: null,
      recurrenceRule: null,
      reminderMinutes: null,
      wiseTimePrep: null,
      energyRequirement: null,
      focusRequirement: null,
      isCreativeCommons: false,
      ...task,
      id: this.currentScheduledTaskId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.scheduledTasks.set(newTask.id, newTask);
    return newTask;
  }

  async updateScheduledTask(id: number, task: Partial<InsertScheduledTask>): Promise<ScheduledTask | undefined> {
    const existing = this.scheduledTasks.get(id);
    if (!existing) return undefined;
    
    const updated: ScheduledTask = {
      ...existing,
      ...task,
      updatedAt: new Date(),
    };
    this.scheduledTasks.set(id, updated);
    return updated;
  }

  async deleteScheduledTask(id: number): Promise<boolean> {
    return this.scheduledTasks.delete(id);
  }

  async getScheduledTasksByDateRange(userId: number, startDate: string, endDate: string): Promise<ScheduledTask[]> {
    return Array.from(this.scheduledTasks.values()).filter(task => 
      task.userId === userId && 
      task.scheduledDate >= startDate && 
      task.scheduledDate <= endDate
    );
  }

  async getTaskTemplates(userId: number): Promise<TaskTemplate[]> {
    return Array.from(this.taskTemplates.values()).filter(template => template.userId === userId);
  }

  async getPublicTaskTemplates(): Promise<TaskTemplate[]> {
    return Array.from(this.taskTemplates.values()).filter(template => template.isPublic);
  }

  async getTaskTemplate(id: number): Promise<TaskTemplate | undefined> {
    return this.taskTemplates.get(id);
  }

  async createTaskTemplate(template: InsertTaskTemplate): Promise<TaskTemplate> {
    const newTemplate: TaskTemplate = {
      description: null,
      defaultDuration: null,
      defaultEnergyRequirement: null,
      defaultFocusRequirement: null,
      defaultTags: null,
      wiseTimeTemplate: null,
      isPublic: false,
      timesUsed: 0,
      ...template,
      id: this.currentTaskTemplateId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.taskTemplates.set(newTemplate.id, newTemplate);
    return newTemplate;
  }

  async updateTaskTemplate(id: number, template: Partial<InsertTaskTemplate>): Promise<TaskTemplate | undefined> {
    const existing = this.taskTemplates.get(id);
    if (!existing) return undefined;
    
    const updated: TaskTemplate = {
      ...existing,
      ...template,
      updatedAt: new Date(),
    };
    this.taskTemplates.set(id, updated);
    return updated;
  }

  async deleteTaskTemplate(id: number): Promise<boolean> {
    return this.taskTemplates.delete(id);
  }

  async incrementTemplateUsage(id: number): Promise<TaskTemplate | undefined> {
    const existing = this.taskTemplates.get(id);
    if (!existing) return undefined;
    
    const updated: TaskTemplate = {
      ...existing,
      timesUsed: (existing.timesUsed || 0) + 1,
      updatedAt: new Date(),
    };
    this.taskTemplates.set(id, updated);
    return updated;
  }

  private generateStockAlerts(): void {
    // Clear existing alerts
    this.stockAlerts.clear();
    this.currentAlertId = 1;

    Array.from(this.clinicInventory.values()).forEach(item => {
      if (item.status === "out_of_stock") {
        const alert = {
          id: this.currentAlertId++,
          itemId: item.id,
          itemName: item.productName,
          alertType: "reorder_needed",
          severity: "critical",
          message: `${item.productName} is completely out of stock. Immediate reorder required.`,
          createdAt: new Date().toISOString(),
          acknowledged: false
        };
        this.stockAlerts.set(alert.id, alert);
      } else if (item.status === "low_stock") {
        const alert = {
          id: this.currentAlertId++,
          itemId: item.id,
          itemName: item.productName,
          alertType: "low_stock",
          severity: "high",
          message: `${item.productName} is running low (${item.currentStock} remaining, minimum: ${item.minimumThreshold}).`,
          createdAt: new Date().toISOString(),
          acknowledged: false
        };
        this.stockAlerts.set(alert.id, alert);
      }

      // Check for expiring items (within 30 days)
      if (item.expirationDate) {
        const daysUntilExpiry = Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          const alert = {
            id: this.currentAlertId++,
            itemId: item.id,
            itemName: item.productName,
            alertType: "expiring",
            severity: daysUntilExpiry <= 7 ? "high" : "medium",
            message: `${item.productName} expires in ${daysUntilExpiry} days (Batch: ${item.batchNumber}).`,
            createdAt: new Date().toISOString(),
            acknowledged: false
          };
          this.stockAlerts.set(alert.id, alert);
        }
      }
    });
  }

  // Notification System methods (stub implementations)
  async getNotificationSettings(userId: number): Promise<any[]> {
    return [];
  }

  async createNotificationSettings(settings: any): Promise<any> {
    return { id: 1, ...settings, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateNotificationSettings(id: number, settings: any): Promise<any> {
    return { id, ...settings, updatedAt: new Date() };
  }

  async createCrossPlatformNotification(notification: any): Promise<any> {
    return { id: 1, ...notification, createdAt: new Date() };
  }

  async markNotificationAsSent(id: number): Promise<void> {
    // stub implementation
  }

  async getNotifications(userId: number): Promise<any[]> {
    return [];
  }

  async getUnreadNotifications(userId: number): Promise<any[]> {
    return [];
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    return true;
  }

  // Smart Break System methods (stub implementations)
  async getBreakPatterns(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        patternName: "Pomodoro Technique",
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        isActive: false,
        customizations: {},
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        patternName: "Extended Focus",
        workDuration: 90,
        shortBreakDuration: 15,
        longBreakDuration: 30,
        longBreakInterval: 2,
        isActive: false,
        customizations: {},
        createdAt: new Date(),
      }
    ];
  }

  async createBreakPattern(pattern: any): Promise<any> {
    return { id: Date.now(), ...pattern, createdAt: new Date() };
  }

  async activateBreakPattern(userId: number, patternId: number): Promise<any> {
    return { id: patternId, isActive: true, updatedAt: new Date() };
  }

  async getRestSuggestions(userId: number, filters?: any): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        suggestionType: "micro_break",
        title: "Eye Rest Break",
        description: "Look away from your screen and focus on something 20 feet away for 20 seconds",
        duration: 1,
        energyLevel: 3,
        stressLevel: 2,
        activity: "20-20-20 eye exercise",
        isPersonalized: false,
        triggerConditions: { screenTime: "> 30min" },
        effectiveness: 4,
        timesUsed: 12,
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        suggestionType: "active_break",
        title: "Quick Stretch",
        description: "Stand up and do light stretching to relieve muscle tension",
        duration: 5,
        energyLevel: 2,
        stressLevel: 3,
        activity: "Neck, shoulder, and back stretches",
        isPersonalized: false,
        triggerConditions: { sittingTime: "> 60min" },
        effectiveness: 4,
        timesUsed: 8,
        createdAt: new Date(),
      },
      {
        id: 3,
        userId,
        suggestionType: "rest_period",
        title: "Mindful Breathing",
        description: "Take a few minutes to practice deep breathing and center yourself",
        duration: 10,
        energyLevel: 4,
        stressLevel: 4,
        activity: "4-7-8 breathing technique",
        isPersonalized: true,
        triggerConditions: { stressLevel: "> 3" },
        effectiveness: 5,
        timesUsed: 15,
        createdAt: new Date(),
      }
    ];
  }

  async createRestSuggestion(suggestion: any): Promise<any> {
    return { id: Date.now(), ...suggestion, createdAt: new Date() };
  }

  async createSmartBreakSession(session: any): Promise<any> {
    return { id: Date.now(), ...session, startedAt: new Date(), createdAt: new Date() };
  }

  async completeSmartBreakSession(sessionId: number, completionData: any): Promise<any> {
    return { id: sessionId, ...completionData, completedAt: new Date() };
  }

  async getSmartBreakSessionsByDateRange(userId: number, startDate: string, endDate: string): Promise<any[]> {
    return [];
  }

  async getRecentSmartBreakSessions(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        breakType: "short",
        plannedDuration: 5,
        actualDuration: 6,
        suggestion: "Take a quick walk around the room",
        activity: "Light walking",
        energyBefore: 3,
        energyAfter: 4,
        stressBefore: 4,
        stressAfter: 2,
        effectiveness: 4,
        notes: "Felt refreshed and ready to continue",
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 6 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 2,
        userId,
        breakType: "micro",
        plannedDuration: 2,
        actualDuration: 2,
        suggestion: "Close your eyes and take deep breaths",
        activity: "Deep breathing",
        energyBefore: 2,
        energyAfter: 3,
        stressBefore: 3,
        stressAfter: 2,
        effectiveness: 3,
        notes: "Quick refresh",
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 2 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      }
    ];
  }

  async generateSmartBreakSuggestion(userId: number, context: any): Promise<any> {
    const { currentEnergy, currentStress, workDuration } = context;
    
    // Simple AI logic for break suggestions
    if (currentEnergy <= 2) {
      return {
        type: "energy_boost",
        duration: 10,
        suggestion: "Take an energizing break with light movement or hydration. Consider stepping outside for fresh air or doing some jumping jacks.",
        priority: "high"
      };
    } else if (currentStress >= 4) {
      return {
        type: "rest_period",
        duration: 15,
        suggestion: "Take a stress-relief break with deep breathing or meditation. Find a quiet space and practice mindful breathing.",
        priority: "high"
      };
    } else if (workDuration >= 90) {
      return {
        type: "long",
        duration: 20,
        suggestion: "You've been focused for a while! Take a longer break to recharge. Consider a walk, stretch session, or healthy snack.",
        priority: "medium"
      };
    } else {
      return {
        type: "short",
        duration: 5,
        suggestion: "Perfect time for a quick refresh! Try the 20-20-20 rule or a brief stretch to maintain your energy.",
        priority: "normal"
      };
    }
  }

  async scheduleBreakReminders(userId: number, patternId: number, startTime: string): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        patternId,
        reminderType: "work_session_start",
        scheduledAt: startTime,
        message: "Time to start your focused work session!",
        platforms: ["web", "desktop"],
      },
      {
        id: 2,
        userId,
        patternId,
        reminderType: "break_reminder",
        scheduledAt: new Date(new Date(startTime).getTime() + 25 * 60 * 1000).toISOString(),
        message: "Time for a short break! You've earned it.",
        platforms: ["web", "desktop", "mobile"],
      }
    ];
  }

  // Messaging Platform Integration methods
  async getMessagingIntegrations(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        platform: "imessage",
        platformUserId: "user@icloud.com",
        isActive: true,
        preferences: { notifications: true, encryption: true },
        lastSyncAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        platform: "whatsapp",
        platformUserId: "+1234567890",
        isActive: true,
        preferences: { notifications: true, businessAccount: false },
        lastSyncAt: new Date(),
        createdAt: new Date(),
      }
    ];
  }

  async createMessagingIntegration(integration: any): Promise<any> {
    return { id: Date.now(), ...integration, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateMessagingIntegration(id: number, integration: any): Promise<any> {
    return { id, ...integration, updatedAt: new Date() };
  }

  async syncMessagingPlatform(integrationId: number): Promise<any> {
    return { 
      integrationId, 
      status: "synced", 
      messagesSynced: 25, 
      lastSyncAt: new Date() 
    };
  }

  // Healthcare System Integration methods
  async getHealthcareIntegrations(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        system: "mychart",
        systemUserId: "patient123",
        facilityId: "hospital_network_1",
        patientId: "P123456",
        isActive: true,
        dataPermissions: ["vitals", "medications", "appointments", "lab_results"],
        lastSyncAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        system: "apple_health",
        systemUserId: "health_user_id",
        isActive: true,
        dataPermissions: ["heart_rate", "steps", "sleep", "workout_data"],
        lastSyncAt: new Date(),
        createdAt: new Date(),
      }
    ];
  }

  async createHealthcareIntegration(integration: any): Promise<any> {
    return { id: Date.now(), ...integration, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateHealthcareIntegration(id: number, integration: any): Promise<any> {
    return { id, ...integration, updatedAt: new Date() };
  }

  async syncHealthcareData(integrationId: number, dataTypes: string[]): Promise<any> {
    return {
      integrationId,
      syncedDataTypes: dataTypes,
      recordsProcessed: 127,
      status: "completed",
      syncedAt: new Date()
    };
  }

  // Accessibility Settings methods
  async getAccessibilitySettings(userId: number): Promise<any> {
    return {
      id: 1,
      userId,
      brailleEnabled: false,
      brailleGrade: "grade2",
      signLanguageEnabled: false,
      signLanguageType: "asl",
      speechToTextEnabled: false,
      textToSpeechEnabled: false,
      voiceSettings: { speed: 1.0, pitch: 1.0, voice: "natural" },
      highContrastMode: false,
      largeFontMode: false,
      screenReaderCompatible: false,
      keyboardNavigationOnly: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createAccessibilitySettings(settings: any): Promise<any> {
    return { id: Date.now(), ...settings, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateAccessibilitySettings(id: number, settings: any): Promise<any> {
    return { id, ...settings, updatedAt: new Date() };
  }

  // Co-editing Session methods
  async createCoEditingSession(session: any): Promise<any> {
    return { 
      id: Date.now(), 
      ...session, 
      isActive: true,
      sessionData: { participants: [], currentEdit: null },
      startedAt: new Date(),
      createdAt: new Date() 
    };
  }

  async getCoEditingSessions(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        initiatorId: userId,
        mentorId: 2,
        facilitatorId: 3,
        sessionType: "peer_mentoring",
        documentId: "health_plan_v1",
        messagingPlatform: "whatsapp",
        healthcareContext: "reproductive_health",
        accessibilityMode: "text_only",
        isActive: true,
        sessionData: { 
          participants: [userId, 2, 3],
          currentEdit: { section: "goals", lastModified: new Date() }
        },
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      }
    ];
  }

  async getActiveCoEditingSessions(userId: number): Promise<any[]> {
    const allSessions = await this.getCoEditingSessions(userId);
    return allSessions.filter(session => session.isActive);
  }

  async updateCoEditingSession(sessionId: number, updates: any): Promise<any> {
    return { id: sessionId, ...updates, updatedAt: new Date() };
  }

  async endCoEditingSession(sessionId: number): Promise<any> {
    return { id: sessionId, isActive: false, endedAt: new Date() };
  }

  // Co-editing Message methods
  async createCoEditingMessage(message: any): Promise<any> {
    return { 
      id: Date.now(), 
      ...message,
      platformDeliveryStatus: {},
      isTranslated: false,
      sentAt: new Date(),
      createdAt: new Date() 
    };
  }

  async getCoEditingMessages(sessionId: number): Promise<any[]> {
    return [
      {
        id: 1,
        sessionId,
        senderId: 1,
        messageType: "text",
        content: "Let's review the health goals section together",
        brailleTranslation: null,
        signLanguageTranslation: null,
        voiceTranscript: null,
        healthDataReference: {},
        platformDeliveryStatus: { whatsapp: "delivered", imessage: "sent" },
        isTranslated: false,
        sentAt: new Date(Date.now() - 10 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        id: 2,
        sessionId,
        senderId: 2,
        messageType: "health_data",
        content: "I've shared my latest vitals data for context",
        healthDataReference: { 
          dataType: "vitals", 
          source: "mychart",
          timestamp: new Date(),
          values: { heartRate: 72, bloodPressure: "120/80" }
        },
        platformDeliveryStatus: { whatsapp: "delivered" },
        isTranslated: false,
        sentAt: new Date(Date.now() - 5 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
      }
    ];
  }

  async processMessageTranslation(messageId: number): Promise<any> {
    return {
      messageId,
      translationsGenerated: ["braille", "sign_language"],
      processingTime: 1.2,
      status: "completed"
    };
  }

  async deliverToPlatforms(messageId: number): Promise<any> {
    return {
      messageId,
      platforms: ["whatsapp", "imessage", "facebook_messenger"],
      deliveryStatus: {
        whatsapp: "delivered",
        imessage: "sent",
        facebook_messenger: "pending"
      },
      deliveredAt: new Date()
    };
  }

  // Translation Service methods
  async requestTranslation(request: any): Promise<any> {
    const { sourceText, targetFormat } = request;
    
    let translatedContent = "";
    switch (targetFormat) {
      case "braille":
        translatedContent = this.convertToBraille(sourceText);
        break;
      case "sign_language":
        translatedContent = this.convertToSignLanguage(sourceText);
        break;
      case "simplified_text":
        translatedContent = this.simplifyText(sourceText);
        break;
      case "audio":
        translatedContent = this.convertToAudioDescription(sourceText);
        break;
      default:
        translatedContent = sourceText;
    }
    
    return {
      id: Date.now(),
      ...request,
      translatedContent,
      qualityScore: 4,
      isHumanVerified: false,
      serviceProvider: "internal_ai",
      createdAt: new Date()
    };
  }

  async getTranslations(userId: number, filters?: any): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        sourceText: "Your appointment is scheduled for tomorrow at 2 PM",
        targetFormat: "braille",
        translatedContent: "⠠⠽⠕⠥⠗ ⠁⠏⠏⠕⠊⠝⠞⠍⠢⠞ ⠊⠎ ⠎⠉⠓⠑⠙⠥⠇⠫ ⠿ ⠞⠕⠍⠕⠗⠗⠕⠺ ⠁⠞ ⠼⠃ ⠠⠏⠍",
        qualityScore: 5,
        isHumanVerified: true,
        verifiedBy: 2,
        serviceProvider: "certified_interpreter",
        createdAt: new Date(),
      }
    ];
  }

  async verifyTranslation(translationId: number, verifierId: number): Promise<any> {
    return {
      translationId,
      verifierId,
      isHumanVerified: true,
      verificationScore: 5,
      verifiedAt: new Date()
    };
  }

  // Health Data Sync methods
  async getHealthDataSync(userId: number, filters?: any): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        sourceSystem: "mychart",
        dataType: "vitals",
        syncStatus: "synced",
        dataPayload: {
          heartRate: 72,
          bloodPressure: "120/80",
          temperature: 98.6,
          weight: 150,
          recordedAt: new Date()
        },
        lastModified: new Date(),
        syncedAt: new Date(),
        createdAt: new Date(),
      },
      {
        id: 2,
        userId,
        sourceSystem: "apple_health",
        dataType: "activity",
        syncStatus: "synced",
        dataPayload: {
          steps: 8542,
          activeMinutes: 45,
          caloriesBurned: 320,
          distance: 4.2,
          recordedAt: new Date()
        },
        lastModified: new Date(),
        syncedAt: new Date(),
        createdAt: new Date(),
      }
    ];
  }

  async triggerHealthDataSync(userId: number, systems: string[], dataTypes: string[]): Promise<any> {
    return {
      userId,
      systems,
      dataTypes,
      syncJobs: systems.map(system => ({
        system,
        status: "initiated",
        estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000)
      })),
      initiatedAt: new Date()
    };
  }

  async getHealthDataByType(userId: number, dataType: string): Promise<any[]> {
    const allData = await this.getHealthDataSync(userId);
    return allData.filter(record => record.dataType === dataType);
  }

  // Real-time WebSocket methods
  async generateWebSocketToken(userId: number, sessionId: number): Promise<string> {
    const token = `ws_token_${userId}_${sessionId}_${Date.now()}`;
    return token;
  }

  async validateWebSocketToken(token: string): Promise<any> {
    return {
      valid: true,
      userId: 1,
      sessionId: 1,
      permissions: ["read", "write", "translate", "healthcare_access"]
    };
  }

  // Helper methods for translation
  private convertToBraille(text: string): string {
    // Simplified braille conversion for demo
    return text.replace(/[a-zA-Z]/g, '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'[Math.floor(Math.random() * 26)]);
  }

  private convertToSignLanguage(text: string): string {
    // Simplified ASL description for demo
    return `[ASL] ${text.split(' ').map(word => `${word.toUpperCase()}-SIGN`).join(' ')}`;
  }

  private simplifyText(text: string): string {
    return text
      .replace(/appointment/g, 'meeting')
      .replace(/scheduled/g, 'planned')
      .replace(/tomorrow/g, 'next day');
  }

  private convertToAudioDescription(text: string): string {
    return `[AUDIO] Spoken message: "${text}" - Duration: ${Math.ceil(text.length / 10)} seconds`;
  }

  // Shared Health Circle methods (implicit one circle per user)
  async getOrCreateHealthCircle(userId: number): Promise<any> {
    const existing = Array.from(this.partnerNetworksMap.values()).find(
      (n) => n.userId === userId && n.isActive,
    );
    if (existing) {
      // Older circles predate the reminders flag; default to enabled (opt-out model)
      if (existing.remindersEnabled === undefined) existing.remindersEnabled = true;
      return existing;
    }
    return this.createPartnerNetwork({
      userId,
      networkName: "My Health Circle",
      isActive: true,
      privacyLevel: "private",
      consentGiven: true,
      dataRetentionDays: 90,
      remindersEnabled: true,
    });
  }

  async getHealthCircleContacts(userId: number): Promise<any[]> {
    const circle = await this.getOrCreateHealthCircle(userId);
    return this.getPartnerConnections(circle.id);
  }

  async getPartnerConnection(id: number): Promise<any | undefined> {
    return this.partnerConnectionsMap.get(id);
  }

  // Partner Network methods
  async getPartnerNetworks(userId: number): Promise<any[]> {
    return Array.from(this.partnerNetworksMap.values()).filter((n) => n.userId === userId);
  }

  async createPartnerNetwork(network: any): Promise<any> {
    const id = this.currentPartnerNetworkId++;
    const record = {
      isActive: true,
      privacyLevel: "private",
      consentGiven: false,
      dataRetentionDays: 90,
      emergencyContactId: null,
      networkName: null,
      ...network,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.partnerNetworksMap.set(id, record);
    return record;
  }

  async updatePartnerNetwork(id: number, network: any): Promise<any> {
    const existing = this.partnerNetworksMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...network, id, updatedAt: new Date() };
    this.partnerNetworksMap.set(id, updated);
    return updated;
  }

  async deletePartnerNetwork(id: number): Promise<boolean> {
    return this.partnerNetworksMap.delete(id);
  }

  // Partner Connection methods
  async getPartnerConnections(networkId: number): Promise<any[]> {
    return Array.from(this.partnerConnectionsMap.values()).filter(
      (c) => c.networkId === networkId,
    );
  }

  async createPartnerConnection(connection: any): Promise<any> {
    const id = this.currentPartnerConnectionId++;
    const record = {
      partnerUserId: null,
      partnerAnonymousId: null,
      relationshipStatus: null,
      mutualConsent: false,
      notificationPreferences: {},
      lastContact: null,
      connectionStrength: 1,
      isBlocked: false,
      contactLabel: null,
      contactNickname: null,
      contactKind: null,
      barrierPosture: null,
      cadenceCommitment: null,
      lastTestDate: null,
      ...connection,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.partnerConnectionsMap.set(id, record);
    return record;
  }

  async updatePartnerConnection(id: number, connection: any): Promise<any> {
    const existing = this.partnerConnectionsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...connection, id, updatedAt: new Date() };
    this.partnerConnectionsMap.set(id, updated);
    return updated;
  }

  async removePartnerConnection(id: number): Promise<boolean> {
    return this.partnerConnectionsMap.delete(id);
  }

  // 4D STI Tracking methods
  async getStiTrackingEvents(userId: number, filters?: any): Promise<any[]> {
    let events = Array.from(this.stiTrackingEventsMap.values()).filter(
      (e) => e.userId === userId,
    );
    if (filters?.stiType) {
      events = events.filter((e) => e.stiType === filters.stiType);
    }
    if (filters?.startDate) {
      const start = new Date(filters.startDate);
      events = events.filter((e) => new Date(e.eventDate) >= start);
    }
    if (filters?.endDate) {
      const end = new Date(filters.endDate);
      events = events.filter((e) => new Date(e.eventDate) <= end);
    }
    return events.sort(
      (a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime(),
    );
  }

  async getStiTrackingEvent(id: number): Promise<any | undefined> {
    return this.stiTrackingEventsMap.get(id);
  }

  async createStiTrackingEvent(event: any): Promise<any> {
    const id = this.currentStiEventId++;
    const record = {
      networkId: null,
      stiType: null,
      testResult: null,
      severityLevel: null,
      symptomsReported: [],
      treatmentProtocol: null,
      testingLocation: null,
      geographicArea: null,
      exposureTimeframe: {},
      partnerNotificationStatus: "pending",
      followUpRequired: false,
      followUpDate: null,
      isAnonymized: false,
      publicHealthReported: false,
      ...event,
      eventDate: event.eventDate ? new Date(event.eventDate) : new Date(),
      id,
      createdAt: new Date(),
    };
    this.stiTrackingEventsMap.set(id, record);
    return record;
  }

  async updateStiTrackingEvent(id: number, event: any): Promise<any> {
    const existing = this.stiTrackingEventsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event, id, updatedAt: new Date() };
    this.stiTrackingEventsMap.set(id, updated);
    return updated;
  }

  // Retention enforcement for sensitive partner-health data.
  // Each user's circle carries dataRetentionDays (default 90). STI events older
  // than that window are anonymized in place: every sensitive detail (STI type,
  // result, symptoms, treatment, location, exposure window) is stripped, keeping
  // only the bare recency signal (eventType + eventDate) that testing-cadence
  // status derivation needs. Expired partner notifications are deleted outright.
  async enforceHealthDataRetention(): Promise<{ eventsAnonymized: number; notificationsPurged: number }> {
    const now = Date.now();
    const DEFAULT_RETENTION_DAYS = 90;

    // Per-user retention window: the shortest retention across their circles.
    const retentionByUser = new Map<number, number>();
    for (const network of Array.from(this.partnerNetworksMap.values())) {
      const days = network.dataRetentionDays ?? DEFAULT_RETENTION_DAYS;
      const existing = retentionByUser.get(network.userId);
      retentionByUser.set(network.userId, existing === undefined ? days : Math.min(existing, days));
    }

    let eventsAnonymized = 0;
    for (const [id, event] of Array.from(this.stiTrackingEventsMap.entries())) {
      if (event.isAnonymized) continue;
      const days = retentionByUser.get(event.userId) ?? DEFAULT_RETENTION_DAYS;
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      const eventTime = new Date(event.eventDate ?? event.createdAt).getTime();
      if (eventTime < cutoff) {
        this.stiTrackingEventsMap.set(id, {
          id: event.id,
          userId: event.userId,
          networkId: event.networkId ?? null,
          eventType: event.eventType,
          stiType: null,
          testResult: null,
          severityLevel: null,
          symptomsReported: [],
          treatmentProtocol: null,
          testingLocation: null,
          geographicArea: null,
          exposureTimeframe: {},
          partnerNotificationStatus: "expired",
          followUpRequired: false,
          followUpDate: null,
          isAnonymized: true,
          publicHealthReported: event.publicHealthReported ?? false,
          eventDate: event.eventDate,
          createdAt: event.createdAt,
          updatedAt: new Date(),
        });
        eventsAnonymized++;
      }
    }

    // Purge expired partner notifications (they carry exposure messaging).
    let notificationsPurged = 0;
    const notificationsMap: Map<number, any> | undefined = (this as any).partnerNotificationsMap;
    if (notificationsMap) {
      for (const [id, n] of Array.from(notificationsMap.entries())) {
        if (n.expiresAt && new Date(n.expiresAt).getTime() < now) {
          notificationsMap.delete(id);
          notificationsPurged++;
        }
      }
    }

    return { eventsAnonymized, notificationsPurged };
  }

  async generatePartnerNotifications(eventId: number): Promise<any[]> {
    return [
      {
        id: 1,
        stiEventId: eventId,
        partnerConnectionId: 1,
        notificationType: "exposure_alert",
        message: "A partner in your network has reported a positive STI test. Consider getting tested.",
        isAnonymous: true,
        urgencyLevel: "high",
        deliveryMethod: "app",
        deliveryStatus: "pending",
        responseReceived: false,
        followUpRequired: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sentAt: null,
        readAt: null,
        createdAt: new Date(),
      }
    ];
  }

  async getNetworkExposureAnalysis(networkId: number, stiType: string): Promise<any> {
    return {
      networkId,
      stiType,
      totalConnections: 5,
      recentExposures: 1,
      riskLevel: "medium",
      recommendedActions: [
        "Schedule STI testing within 2 weeks",
        "Inform recent partners",
        "Consider temporary protection upgrades"
      ],
      timeframe: {
        analysisStart: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        analysisEnd: new Date()
      },
      geographicCluster: false,
      trends: {
        increasing: false,
        stable: true,
        decreasing: false
      }
    };
  }

  // Sexual Product Customization methods
  async getSexualProductCustomizations(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        productId: 1,
        partnerNetworkId: 1,
        customizationName: "Enhanced Protection Plus",
        bodyCompatibility: {
          size: "medium",
          anatomyType: "standard",
          sensitivityLevel: "normal"
        },
        materialPreferences: {
          latexFree: false,
          vegan: true,
          hypoallergenic: true,
          biodegradable: true
        },
        protectionLevel: "enhanced",
        partnerCompatibility: {
          multiPartnerFit: true,
          variableSizing: true,
          comfortRating: 4
        },
        naturalSensesProfile: {
          tactileSensitivity: 3,
          temperaturePreference: "warming",
          texturePreference: "smooth",
          aromaProfile: "subtle_natural"
        },
        texturePreferences: {
          surface: "smooth",
          thickness: "standard",
          flexibility: "high"
        },
        flavorProfile: "unflavored",
        aromaProfile: "natural",
        temperatureSensitivity: "warming",
        durationOptimization: "extended",
        sensitivityLevel: "medium",
        accessibilityFeatures: [],
        sustainabilityRating: 4,
        sharedWithPartners: true,
        partnerFeedback: [
          {
            partnerId: 2,
            comfort: 4,
            effectiveness: 5,
            naturalFeel: 4,
            notes: "Very comfortable, great protection"
          }
        ],
        effectivenessRating: 5,
        isActive: true,
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  async createSexualProductCustomization(customization: any): Promise<any> {
    return { id: Date.now(), ...customization, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateSexualProductCustomization(id: number, customization: any): Promise<any> {
    return { id, ...customization, updatedAt: new Date() };
  }

  async getPartnerCompatibleProducts(networkId: number): Promise<any[]> {
    return [
      {
        customizationId: 1,
        productName: "Enhanced Protection Plus",
        compatibilityScore: 4.8,
        sharedByPartners: 3,
        averageEffectiveness: 4.7,
        networkApprovalRating: 4.9,
        lastUsedInNetwork: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  // Natural Senses Profile methods
  async getNaturalSensesProfile(userId: number): Promise<any> {
    return {
      id: 1,
      userId,
      visualSensitivity: 3,
      auditoryPreferences: {
        volume: "moderate",
        soundTypes: ["nature", "ambient"],
        silencePreference: false
      },
      tactileSensitivity: 4,
      olfactoryPreferences: {
        intensityLevel: "subtle",
        preferredScents: ["vanilla", "natural"],
        avoidedScents: ["artificial", "strong_chemical"]
      },
      gustatory: {
        sensitivityLevel: "normal",
        preferredFlavors: ["natural", "unflavored"],
        avoidedFlavors: ["artificial", "very_sweet"]
      },
      vestibularNeeds: {
        motionSensitivity: "low",
        positionPreferences: ["stable", "gradual_changes"]
      },
      proprioceptiveNeeds: {
        bodyAwareness: "high",
        pressurePreference: "moderate",
        positionFeedback: "important"
      },
      interocetptiveAwareness: 4,
      environmentalFactors: {
        lightingPreference: "dim_warm",
        temperatureRange: "warm",
        noiseLevel: "quiet"
      },
      rhythmAndTiming: {
        pacePreference: "gradual",
        consistencyImportance: "high",
        spontaneityTolerance: "moderate"
      },
      socialSensoryNeeds: {
        touchCommunication: "important",
        eyeContact: "comfortable",
        personalSpace: "moderate"
      },
      stressResponsePatterns: {
        triggers: ["sudden_changes", "loud_noises"],
        calming_strategies: ["deep_breathing", "gentle_touch"]
      },
      regulationStrategies: [
        "progressive_muscle_relaxation",
        "sensory_grounding",
        "controlled_breathing"
      ],
      sensorySeekingBehaviors: [
        "gentle_pressure",
        "consistent_rhythm",
        "warm_temperatures"
      ],
      sensoryAvoidanceBehaviors: [
        "sudden_temperature_changes",
        "rough_textures",
        "bright_lights"
      ],
      optimalArousalLevel: "moderate",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createNaturalSensesProfile(profile: any): Promise<any> {
    return { id: Date.now(), ...profile, createdAt: new Date(), updatedAt: new Date() };
  }

  async updateNaturalSensesProfile(id: number, profile: any): Promise<any> {
    return { id, ...profile, updatedAt: new Date() };
  }

  async getOptimalProductRecommendations(userId: number): Promise<any[]> {
    return [
      {
        productId: 1,
        productName: "Sensory-Optimized Protection",
        matchScore: 95,
        naturalSensesAlignment: {
          tactile: "excellent",
          temperature: "perfect",
          texture: "ideal",
          aroma: "compatible"
        },
        customizationSuggestions: {
          materialType: "organic_latex",
          thickness: "ultra_thin",
          surfaceTexture: "smooth",
          temperatureControl: "warming"
        },
        partnerCompatibility: "high",
        sustainabilityScore: 5,
        reason: "Perfectly aligned with your tactile sensitivity and temperature preferences"
      }
    ];
  }

  // Product Effectiveness methods
  async getProductEffectivenessReports(customizationId: number): Promise<any[]> {
    return [
      {
        id: 1,
        customizationId,
        partnerConnectionId: 1,
        usageDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        protectionEffectiveness: 5,
        comfortLevel: 4,
        partnerComfortLevel: 5,
        naturalFeelRating: 4,
        durationRating: 5,
        sensoryExperience: {
          tactile: "excellent",
          temperature: "perfect",
          naturalness: "very_high"
        },
        unexpectedIssues: [],
        improvementSuggestions: "None - perfect as is",
        wouldRecommend: true,
        reorderIntention: true,
        partnerFeedbackIncluded: true,
        anonymizedForResearch: true,
        createdAt: new Date(),
      }
    ];
  }

  async createProductEffectivenessReport(report: any): Promise<any> {
    return { id: Date.now(), ...report, createdAt: new Date() };
  }

  async getNetworkEffectivenessAnalysis(networkId: number): Promise<any> {
    return {
      networkId,
      averageProtectionEffectiveness: 4.7,
      averageComfortLevel: 4.5,
      averageNaturalFeelRating: 4.3,
      topPerformingCustomizations: [
        {
          customizationId: 1,
          name: "Enhanced Protection Plus",
          networkRating: 4.8,
          usageFrequency: "high"
        }
      ],
      improvementAreas: [
        "Consider softer materials for increased comfort",
        "Explore warming features for better sensory experience"
      ],
      partnerSatisfactionRate: 92,
      reorderRate: 89,
      totalReports: 47,
      timeframe: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        end: new Date()
      }
    };
  }

  // Partner Notification methods
  async getPartnerNotifications(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        stiEventId: 1,
        partnerConnectionId: 1,
        notificationType: "test_recommendation",
        message: "It's been 3 months since your last STI screening. Consider scheduling a test for optimal health.",
        isAnonymous: false,
        urgencyLevel: "medium",
        deliveryMethod: "app",
        deliveryStatus: "delivered",
        responseReceived: false,
        followUpRequired: true,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        readAt: null,
        createdAt: new Date(),
      }
    ];
  }

  async sendPartnerNotification(notification: any): Promise<any> {
    return { 
      id: Date.now(), 
      ...notification, 
      sentAt: new Date(),
      deliveryStatus: "sent",
      createdAt: new Date() 
    };
  }

  async respondToNotification(notificationId: number, response: any): Promise<any> {
    return { 
      notificationId, 
      response, 
      responseReceived: true,
      respondedAt: new Date() 
    };
  }

  // Forum methods
  async getForumCategories(): Promise<ForumCategory[]> {
    return await db.select().from(forumCategories).orderBy(forumCategories.sortOrder);
  }

  async getForumCategory(id: number): Promise<ForumCategory | undefined> {
    const [category] = await db.select().from(forumCategories).where(eq(forumCategories.id, id));
    return category;
  }

  async createForumCategory(category: InsertForumCategory): Promise<ForumCategory> {
    const [created] = await db.insert(forumCategories).values(category).returning();
    return created;
  }

  async getForumPosts(categoryId?: number, limit = 50, offset = 0): Promise<ForumPost[]> {
    if (categoryId) {
      return await db.select().from(forumPosts)
        .where(eq(forumPosts.categoryId, categoryId))
        .orderBy(desc(forumPosts.isPinned), desc(forumPosts.lastActivityAt))
        .limit(limit).offset(offset);
    }
    return await db.select().from(forumPosts)
      .orderBy(desc(forumPosts.isPinned), desc(forumPosts.lastActivityAt))
      .limit(limit).offset(offset);
  }

  async getForumPost(id: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, id));
    return post;
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [created] = await db.insert(forumPosts).values(post).returning();
    return created;
  }

  async updateForumPost(id: number, data: Partial<InsertForumPost>): Promise<ForumPost | undefined> {
    const [updated] = await db.update(forumPosts).set({ ...data, updatedAt: new Date() }).where(eq(forumPosts.id, id)).returning();
    return updated;
  }

  async incrementPostViewCount(id: number): Promise<void> {
    await db.update(forumPosts).set({ viewCount: sql`${forumPosts.viewCount} + 1` }).where(eq(forumPosts.id, id));
  }

  async getForumReplies(postId: number): Promise<ForumReply[]> {
    return await db.select().from(forumReplies)
      .where(eq(forumReplies.postId, postId))
      .orderBy(forumReplies.createdAt);
  }

  async createForumReply(reply: InsertForumReply): Promise<ForumReply> {
    const [created] = await db.insert(forumReplies).values(reply).returning();
    await db.update(forumPosts).set({
      replyCount: sql`${forumPosts.replyCount} + 1`,
      lastActivityAt: new Date()
    }).where(eq(forumPosts.id, reply.postId));
    return created;
  }

  async toggleForumLike(userId: number, postId?: number, replyId?: number): Promise<boolean> {
    const conditions = [eq(forumLikes.userId, userId)];
    if (postId) conditions.push(eq(forumLikes.postId, postId));
    if (replyId) conditions.push(eq(forumLikes.replyId, replyId));

    const [existing] = await db.select().from(forumLikes).where(and(...conditions));
    if (existing) {
      await db.delete(forumLikes).where(eq(forumLikes.id, existing.id));
      if (postId) await db.update(forumPosts).set({ likeCount: sql`GREATEST(${forumPosts.likeCount} - 1, 0)` }).where(eq(forumPosts.id, postId));
      if (replyId) await db.update(forumReplies).set({ likeCount: sql`GREATEST(${forumReplies.likeCount} - 1, 0)` }).where(eq(forumReplies.id, replyId));
      return false;
    } else {
      await db.insert(forumLikes).values({ userId, postId: postId || null, replyId: replyId || null });
      if (postId) await db.update(forumPosts).set({ likeCount: sql`${forumPosts.likeCount} + 1` }).where(eq(forumPosts.id, postId));
      if (replyId) await db.update(forumReplies).set({ likeCount: sql`${forumReplies.likeCount} + 1` }).where(eq(forumReplies.id, replyId));
      return true;
    }
  }

  async getForumLikes(userId: number): Promise<ForumLike[]> {
    return await db.select().from(forumLikes).where(eq(forumLikes.userId, userId));
  }

  async getForumBookmarks(userId: number): Promise<ForumBookmark[]> {
    return await db.select().from(forumBookmarks).where(eq(forumBookmarks.userId, userId));
  }

  async toggleForumBookmark(userId: number, postId: number): Promise<boolean> {
    const [existing] = await db.select().from(forumBookmarks)
      .where(and(eq(forumBookmarks.userId, userId), eq(forumBookmarks.postId, postId)));
    if (existing) {
      await db.delete(forumBookmarks).where(eq(forumBookmarks.id, existing.id));
      return false;
    } else {
      await db.insert(forumBookmarks).values({ userId, postId });
      return true;
    }
  }

  async searchForumPosts(query: string): Promise<ForumPost[]> {
    return await db.select().from(forumPosts)
      .where(or(
        ilike(forumPosts.title, `%${query}%`),
        ilike(forumPosts.content, `%${query}%`)
      ))
      .orderBy(desc(forumPosts.lastActivityAt))
      .limit(50);
  }

  async getTrendingForumPosts(limit = 10): Promise<ForumPost[]> {
    return await db.select().from(forumPosts)
      .orderBy(desc(forumPosts.likeCount), desc(forumPosts.replyCount), desc(forumPosts.viewCount))
      .limit(limit);
  }

  // Boundary background-check consent methods
  async getBoundaryCheckConsents(userId: number): Promise<BoundaryCheckConsent[]> {
    return await db.select().from(boundaryCheckConsents)
      .where(eq(boundaryCheckConsents.userId, userId))
      .orderBy(desc(boundaryCheckConsents.consentedAt));
  }

  async createBoundaryCheckConsent(data: InsertBoundaryCheckConsent): Promise<BoundaryCheckConsent> {
    const [created] = await db.insert(boundaryCheckConsents).values(data).returning();
    return created;
  }

  async revokeBoundaryCheckConsent(id: number, userId: number): Promise<boolean> {
    const result = await db.update(boundaryCheckConsents)
      .set({ revokedAt: new Date() })
      .where(and(eq(boundaryCheckConsents.id, id), eq(boundaryCheckConsents.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Cooperative-pricing interest registry (X Premium + Truth Social paid)
  async getXCoopPricingInterest(userId: number, platform: string = "x"): Promise<XCoopPricingInterest | undefined> {
    const rows = await db.select().from(xCoopPricingInterest).where(eq(xCoopPricingInterest.userId, userId));
    return rows.find(r => (r.platform || "x") === platform);
  }

  async getAllXCoopPricingInterestForUser(userId: number): Promise<XCoopPricingInterest[]> {
    return await db.select().from(xCoopPricingInterest).where(eq(xCoopPricingInterest.userId, userId));
  }

  async upsertXCoopPricingInterest(data: InsertXCoopPricingInterest): Promise<XCoopPricingInterest> {
    const platform = (data as any).platform || "x";
    const existing = await this.getXCoopPricingInterest(data.userId, platform);
    if (existing) {
      const [updated] = await db.update(xCoopPricingInterest)
        .set({
          xHandle: data.xHandle,
          isXPremium: data.isXPremium ?? false,
          pornOptOut: data.pornOptOut ?? true,
          platform,
        })
        .where(eq(xCoopPricingInterest.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(xCoopPricingInterest).values({ ...data, platform } as any).returning();
    return created;
  }

  async countXCoopPricingInterest(): Promise<{ total: number; premium: number; pornOptOut: number; byPlatform: Record<string, { total: number; premium: number }> }> {
    const rows = await db.select().from(xCoopPricingInterest);
    const byPlatform: Record<string, { total: number; premium: number }> = {};
    for (const r of rows) {
      const p = r.platform || "x";
      if (!byPlatform[p]) byPlatform[p] = { total: 0, premium: 0 };
      byPlatform[p].total += 1;
      if (r.isXPremium) byPlatform[p].premium += 1;
    }
    return {
      total: rows.length,
      premium: rows.filter(r => r.isXPremium).length,
      pornOptOut: rows.filter(r => r.pornOptOut).length,
      byPlatform,
    };
  }

  // Meta Lens scan import
  async getMetaLensScansByUser(userId: number): Promise<MetaLensScan[]> {
    return await db.select().from(metaLensScans).where(eq(metaLensScans.userId, userId)).orderBy(desc(metaLensScans.createdAt));
  }

  async getMetaLensScan(id: number): Promise<MetaLensScan | undefined> {
    const [row] = await db.select().from(metaLensScans).where(eq(metaLensScans.id, id));
    return row;
  }

  async createMetaLensScan(data: InsertMetaLensScan): Promise<MetaLensScan> {
    const [created] = await db.insert(metaLensScans).values(data).returning();
    return created;
  }

  async linkMetaLensScanToConfig(scanId: number, configId: number): Promise<MetaLensScan | undefined> {
    const [updated] = await db.update(metaLensScans)
      .set({ generatedConfigId: configId, status: "configured" })
      .where(eq(metaLensScans.id, scanId))
      .returning();
    return updated;
  }

  async deleteMetaLensScan(id: number, userId: number): Promise<boolean> {
    const result = await db.delete(metaLensScans)
      .where(and(eq(metaLensScans.id, id), eq(metaLensScans.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Bluesky share attestation (ethics gate)
  async getActiveBlueskyAttestation(userId: number): Promise<BlueskyShareAttestation | undefined> {
    const rows = await db.select().from(blueskyShareAttestations)
      .where(eq(blueskyShareAttestations.userId, userId))
      .orderBy(desc(blueskyShareAttestations.attestedAt));
    return rows.find(r => !r.revokedAt && r.adultContentDisabled);
  }

  async createBlueskyAttestation(data: InsertBlueskyShareAttestation): Promise<BlueskyShareAttestation> {
    const [created] = await db.insert(blueskyShareAttestations).values(data).returning();
    return created;
  }

  async revokeBlueskyAttestation(id: number, userId: number): Promise<boolean> {
    const result = await db.update(blueskyShareAttestations)
      .set({ revokedAt: new Date() })
      .where(and(eq(blueskyShareAttestations.id, id), eq(blueskyShareAttestations.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async listHerbalEntries(category?: string): Promise<HerbalKnowledgeEntry[]> {
    if (category) {
      return await db.select().from(herbalKnowledgeEntries)
        .where(eq(herbalKnowledgeEntries.category, category))
        .orderBy(herbalKnowledgeEntries.commonName);
    }
    return await db.select().from(herbalKnowledgeEntries).orderBy(herbalKnowledgeEntries.commonName);
  }

  async getHerbalEntry(id: number): Promise<HerbalKnowledgeEntry | undefined> {
    const [row] = await db.select().from(herbalKnowledgeEntries).where(eq(herbalKnowledgeEntries.id, id));
    return row;
  }

  async createHerbalEntry(data: InsertHerbalKnowledgeEntry): Promise<HerbalKnowledgeEntry> {
    const [created] = await db.insert(herbalKnowledgeEntries).values(data).returning();
    return created;
  }

  async listWikiActivity(): Promise<Array<{ articleId: string; lastContributedAt: string | null; lastVotedAt: string | null; contributionCount: number; voteCount: number }>> {
    const contribAgg = await db
      .select({
        articleId: wikiContributions.articleId,
        lastAt: sql<Date | null>`max(${wikiContributions.createdAt})`.as("last_at"),
        cnt: sql<number>`count(*)::int`.as("cnt"),
      })
      .from(wikiContributions)
      .groupBy(wikiContributions.articleId);

    const voteAgg = await db
      .select({
        articleId: wikiVotes.articleId,
        lastAt: sql<Date | null>`max(${wikiVotes.createdAt})`.as("last_at"),
        cnt: sql<number>`count(*)::int`.as("cnt"),
      })
      .from(wikiVotes)
      .groupBy(wikiVotes.articleId);

    const map = new Map<string, { articleId: string; lastContributedAt: string | null; lastVotedAt: string | null; contributionCount: number; voteCount: number }>();
    for (const c of contribAgg) {
      map.set(c.articleId, {
        articleId: c.articleId,
        lastContributedAt: c.lastAt ? new Date(c.lastAt).toISOString() : null,
        lastVotedAt: null,
        contributionCount: Number(c.cnt) || 0,
        voteCount: 0,
      });
    }
    for (const v of voteAgg) {
      const existing = map.get(v.articleId);
      if (existing) {
        existing.lastVotedAt = v.lastAt ? new Date(v.lastAt).toISOString() : null;
        existing.voteCount = Number(v.cnt) || 0;
      } else {
        map.set(v.articleId, {
          articleId: v.articleId,
          lastContributedAt: null,
          lastVotedAt: v.lastAt ? new Date(v.lastAt).toISOString() : null,
          contributionCount: 0,
          voteCount: Number(v.cnt) || 0,
        });
      }
    }
    return Array.from(map.values());
  }

  async listWikiContributions(articleId: string): Promise<WikiContribution[]> {
    return await db.select().from(wikiContributions)
      .where(eq(wikiContributions.articleId, articleId))
      .orderBy(desc(wikiContributions.createdAt));
  }

  async recordWikiContribution(data: InsertWikiContribution): Promise<WikiContribution> {
    const [created] = await db.insert(wikiContributions).values(data).returning();
    return created;
  }

  async recordWikiVote(articleId: string, userId: number, contributionId?: number | null): Promise<{ vote: WikiVote; alreadyVoted: boolean }> {
    const [existing] = await db.select().from(wikiVotes)
      .where(and(eq(wikiVotes.articleId, articleId), eq(wikiVotes.userId, userId)));
    if (existing) {
      return { vote: existing, alreadyVoted: true };
    }
    const [created] = await db.insert(wikiVotes).values({
      articleId,
      userId,
      contributionId: contributionId ?? null,
    }).returning();
    return { vote: created, alreadyVoted: false };
  }

  async hasUserVotedWiki(articleId: string, userId: number): Promise<boolean> {
    const [existing] = await db.select().from(wikiVotes)
      .where(and(eq(wikiVotes.articleId, articleId), eq(wikiVotes.userId, userId)));
    return !!existing;
  }

  async getActiveXAttestation(userId: number): Promise<XShareAttestation | undefined> {
    const rows = await db.select().from(xShareAttestations)
      .where(eq(xShareAttestations.userId, userId))
      .orderBy(desc(xShareAttestations.attestedAt));
    return rows.find(r => !r.revokedAt && r.adultContentDisabled && r.usesQoolNftStudio);
  }

  async createXAttestation(data: InsertXShareAttestation): Promise<XShareAttestation> {
    const [created] = await db.insert(xShareAttestations).values(data).returning();
    return created;
  }

  async revokeXAttestation(id: number, userId: number): Promise<boolean> {
    const result = await db.update(xShareAttestations)
      .set({ revokedAt: new Date() })
      .where(and(eq(xShareAttestations.id, id), eq(xShareAttestations.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async listPlatformCompensation(): Promise<PlatformCompensationAttestation[]> {
    return await db.select().from(platformCompensationAttestations).orderBy(platformCompensationAttestations.platformName);
  }

  async getPlatformCompensation(platformName: string): Promise<PlatformCompensationAttestation | undefined> {
    const [row] = await db.select().from(platformCompensationAttestations)
      .where(eq(platformCompensationAttestations.platformName, platformName));
    return row;
  }

  async listTrisexportSlots(userId: number): Promise<TrisexportPartnerSlot[]> {
    return await db.select().from(trisexportPartnerSlots)
      .where(eq(trisexportPartnerSlots.userId, userId))
      .orderBy(desc(trisexportPartnerSlots.encounterDate));
  }

  async addTrisexportSlot(data: InsertTrisexportPartnerSlot): Promise<TrisexportPartnerSlot> {
    const existing = await this.listTrisexportSlots(data.userId);
    if (existing.length >= 6) {
      const oldest = existing[existing.length - 1];
      await db.delete(trisexportPartnerSlots).where(eq(trisexportPartnerSlots.id, oldest.id));
    }
    const [created] = await db.insert(trisexportPartnerSlots).values(data).returning();
    return created;
  }

  async deleteTrisexportSlot(id: number, userId: number): Promise<boolean> {
    const result = await db.delete(trisexportPartnerSlots)
      .where(and(eq(trisexportPartnerSlots.id, id), eq(trisexportPartnerSlots.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async upsertPlatformCompensation(data: InsertPlatformCompensationAttestation): Promise<PlatformCompensationAttestation> {
    const existing = await this.getPlatformCompensation(data.platformName);
    if (existing) {
      const [updated] = await db.update(platformCompensationAttestations)
        .set({ ...data, lastReviewed: new Date() })
        .where(eq(platformCompensationAttestations.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(platformCompensationAttestations).values(data).returning();
    return created;
  }

  // --- Inclusive Ordering framework adopters (self-reported registry) ---
  async listInclusiveOrderingAdopters(): Promise<InclusiveOrderingAdopter[]> {
    return await db.select().from(inclusiveOrderingAdopters)
      .orderBy(desc(inclusiveOrderingAdopters.createdAt));
  }

  async createInclusiveOrderingAdopter(data: InsertInclusiveOrderingAdopter): Promise<InclusiveOrderingAdopter> {
    const [created] = await db.insert(inclusiveOrderingAdopters).values(data).returning();
    return created;
  }

  async countInclusiveOrderingAdopters(): Promise<{ verified: number; pending: number; ourNameForks: number }> {
    const rows = await db.select({
      status: inclusiveOrderingAdopters.status,
      carriesOurName: inclusiveOrderingAdopters.carriesOurName,
    }).from(inclusiveOrderingAdopters);
    const active = rows.filter((r) => r.status !== "withdrawn");
    return {
      verified: active.filter((r) => r.status === "verified").length,
      pending: active.filter((r) => r.status === "pending").length,
      ourNameForks: active.filter((r) => r.carriesOurName).length,
    };
  }

  // --- Joint protection orders (matched-pair, two-body barrier design spec) ---
  async createJointProtectionOrder(data: InsertJointProtectionOrder): Promise<JointProtectionOrder> {
    const [created] = await db.insert(jointProtectionOrders).values(data as any).returning();
    return created;
  }

  async countJointProtectionOrders(): Promise<number> {
    const rows = await db.select({ id: jointProtectionOrders.id }).from(jointProtectionOrders);
    return rows.length;
  }

  // --- Passkey (WebAuthn) OS-side verification ---
  async getPasskeyCredentialsByUser(userId: number): Promise<PasskeyCredential[]> {
    return await db.select().from(passkeyCredentials).where(eq(passkeyCredentials.userId, userId));
  }

  async getPasskeyCredentialById(credentialId: string): Promise<PasskeyCredential | undefined> {
    const [row] = await db.select().from(passkeyCredentials).where(eq(passkeyCredentials.credentialId, credentialId));
    return row;
  }

  async createPasskeyCredential(data: InsertPasskeyCredential): Promise<PasskeyCredential> {
    const [created] = await db.insert(passkeyCredentials).values(data).returning();
    return created;
  }

  async updatePasskeyCounter(credentialId: string, counter: number): Promise<void> {
    await db.update(passkeyCredentials).set({ counter }).where(eq(passkeyCredentials.credentialId, credentialId));
  }

  // --- Digital-ID (mDL) age verification ---
  async getDigitalIdVerificationByUser(userId: number): Promise<DigitalIdVerification | undefined> {
    const [row] = await db.select().from(digitalIdVerifications).where(eq(digitalIdVerifications.userId, userId));
    return row;
  }

  async createDigitalIdVerification(data: InsertDigitalIdVerification): Promise<DigitalIdVerification> {
    const [created] = await db.insert(digitalIdVerifications).values(data).returning();
    return created;
  }

  async upgradeDigitalIdVerification(id: number, data: Partial<InsertDigitalIdVerification>): Promise<DigitalIdVerification> {
    const [updated] = await db.update(digitalIdVerifications).set(data).where(eq(digitalIdVerifications.id, id)).returning();
    return updated;
  }

  // --- Manufacturing partners (self-reported registry) ---
  async listManufacturingPartners(): Promise<ManufacturingPartner[]> {
    return await db.select().from(manufacturingPartners)
      .orderBy(desc(manufacturingPartners.createdAt));
  }

  async createManufacturingPartner(data: InsertManufacturingPartner): Promise<ManufacturingPartner> {
    const [created] = await db.insert(manufacturingPartners).values(data).returning();
    return created;
  }


  async listConstellationProfiles(): Promise<ConstellationProfile[]> {
    return await db.select().from(constellationProfiles)
      .where(eq(constellationProfiles.status, "active"))
      .orderBy(desc(constellationProfiles.createdAt));
  }

  async createConstellationProfile(data: InsertConstellationProfile): Promise<ConstellationProfile> {
    const [created] = await db.insert(constellationProfiles).values(data).returning();
    return created;
  }

  async getConstellationProfileById(id: number): Promise<ConstellationProfile | undefined> {
    const [row] = await db.select().from(constellationProfiles).where(eq(constellationProfiles.id, id));
    return row;
  }

  async getConstellationProfileByManageToken(token: string): Promise<ConstellationProfile | undefined> {
    const [row] = await db.select().from(constellationProfiles).where(eq(constellationProfiles.manageToken, token));
    return row;
  }

  async createConstellationContactRequest(data: InsertConstellationContactRequest & { requesterToken: string }): Promise<ConstellationContactRequest> {
    const [created] = await db.insert(constellationContactRequests).values(data).returning();
    return created;
  }

  async listConstellationContactRequestsForProfile(profileId: number): Promise<ConstellationContactRequest[]> {
    return await db.select().from(constellationContactRequests)
      .where(eq(constellationContactRequests.targetProfileId, profileId))
      .orderBy(desc(constellationContactRequests.createdAt));
  }

  async getConstellationContactRequestById(id: number): Promise<ConstellationContactRequest | undefined> {
    const [row] = await db.select().from(constellationContactRequests).where(eq(constellationContactRequests.id, id));
    return row;
  }

  async getConstellationContactRequestByRequesterToken(token: string): Promise<ConstellationContactRequest | undefined> {
    const [row] = await db.select().from(constellationContactRequests).where(eq(constellationContactRequests.requesterToken, token));
    return row;
  }

  async updateConstellationContactRequestStatus(id: number, status: "accepted" | "declined"): Promise<ConstellationContactRequest | undefined> {
    const [row] = await db.update(constellationContactRequests)
      .set({ status })
      .where(eq(constellationContactRequests.id, id))
      .returning();
    return row;
  }

}

export const storage = new MemStorage();

// One-time startup migration to the unified account model: any account that
// still carries a legacy role (e.g. the old "admin"/"consumer"/"clinic_staff")
// is normalised to the single "cooperator" tier. Safe to run on every boot.
export async function normalizeUserRoles(): Promise<void> {
  try {
    await db
      .update(users)
      .set({ role: "cooperator" })
      .where(sql`${users.role} <> 'cooperator'`);
  } catch (err) {
    console.error("normalizeUserRoles failed:", err);
  }
}
