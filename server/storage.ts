import { eq, and, or, desc, sql, ilike } from "drizzle-orm";
import { db } from "./db";
import { 
  users, products, productConfigurations, orders, educationalContent, partnershipRequests,
  financialRecords, budgetItems, budgetVotes, communityDividends,
  moodEntries, wellnessGoals, moodInsights, timeEntries, timeGoals, timeInsights,
  calendarConnections, scheduledTasks, taskTemplates, savedProductConfigurations,
  forumCategories, forumPosts, forumReplies, forumLikes, forumBookmarks,
  filingDocuments, boundaryCheckConsents, xCoopPricingInterest, metaLensScans,
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
  type FilingDocument, type InsertFilingDocument,
  type BoundaryCheckConsent, type InsertBoundaryCheckConsent,
  type XCoopPricingInterest, type InsertXCoopPricingInterest,
  type MetaLensScan, type InsertMetaLensScan,
  type BlueskyShareAttestation, type InsertBlueskyShareAttestation,
  type HerbalKnowledgeEntry, type InsertHerbalKnowledgeEntry,
  herbalKnowledgeEntries,
  type XShareAttestation, type InsertXShareAttestation,
  xShareAttestations,
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

  // Filing Preparation methods
  getFilingDocuments(userId: number): Promise<FilingDocument[]>;
  getFilingDocument(id: number): Promise<FilingDocument | undefined>;
  createFilingDocument(data: InsertFilingDocument & { documentBody: string }): Promise<FilingDocument>;
  updateFilingDocumentStatus(id: number, status: string, fields?: { confirmationNumber?: string; agencyResponse?: string; notes?: string }): Promise<FilingDocument | undefined>;
  deleteFilingDocument(id: number): Promise<boolean>;

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

  // X (Twitter) share attestation (ethics gate, mirrors Bluesky)
  getActiveXAttestation(userId: number): Promise<XShareAttestation | undefined>;
  createXAttestation(data: InsertXShareAttestation): Promise<XShareAttestation>;
  revokeXAttestation(id: number, userId: number): Promise<boolean>;

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
  createStiTrackingEvent(event: any): Promise<any>;
  updateStiTrackingEvent(id: number, event: any): Promise<any>;
  generatePartnerNotifications(eventId: number): Promise<any[]>;
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

  // BAD Co-op Integration methods
  getBadCoopIntegration(userId: number): Promise<any>;
  createBadCoopIntegration(data: any): Promise<any>;
  updateBadCoopIntegration(id: number, data: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
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
  private currentUserId: number;
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

  constructor() {
    this.users = new Map();
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
    this.currentUserId = 1;
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

    this.initializeData();
  }

  private initializeData() {
    // Create default products
    const defaultProducts: InsertProduct[] = [
      {
        name: "TriSex External Protection - Ocean Plastic",
        description: "3D-printed custom-fit external protection made from recycled ocean plastic and hydrogel. Fits penis anatomy 4.5-11.5 inches.",
        category: "penis_protection",
        bodyCompatibility: ["penis"],
        sizeRange: "custom",
        basePrice: "29.99",
        isActive: true,
      },
      {
        name: "TriSex Internal Protection - Natural Blend",
        description: "3D-printed custom-fit internal protection made from natural plant-based materials. Compatible with vaginal and anal anatomy.",
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

    // Create sample educational content
    const defaultContent: InsertEducationalContent[] = [
      {
        title: "STI Prevention Best Practices",
        slug: "sti-prevention-best-practices",
        content: "Comprehensive guide to sexually transmitted infection prevention...",
        excerpt: "Learn about the latest research and best practices for STI prevention.",
        category: "sti_prevention",
        tags: ["prevention", "health", "safety"],
        isPublished: true,
        authorId: 1,
      },
      {
        title: "Inclusive Sexual Health for LGBTQ+ Communities",
        slug: "inclusive-sexual-health-lgbtq",
        content: "Health information specifically for LGBTQ+ individuals...",
        excerpt: "Inclusive health information for transgender, intersex, and gender-diverse individuals.",
        category: "inclusive_health",
        tags: ["lgbtq", "inclusive", "health"],
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
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "consumer",
      organizationName: insertUser.organizationName || null,
      organizationType: insertUser.organizationType || null,
      contactName: insertUser.contactName || null,
      title: insertUser.title || null,
      phone: insertUser.phone || null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
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
    if (this.clinicInventory.size === 0) {
      // Initialize sample inventory data
      const sampleInventory = [
        {
          id: 1,
          productId: 1,
          productName: "Universal Recycled Plastic Protection - Size S",
          category: "external_protection",
          currentStock: 45,
          minimumThreshold: 10,
          maximumCapacity: 100,
          unitCost: 29.99,
          lastRestock: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          batchNumber: "URP-2024-001",
          supplier: "Sustainable Materials Co.",
          location: "Storage Room A, Shelf 3",
          status: "in_stock",
          customConfiguration: {
            lengthRange: "4-6 inches",
            material: "Ocean Plastic + Hydrogel",
            features: ["Antimicrobial coating", "Temperature responsive"]
          }
        },
        {
          id: 2,
          productId: 1,
          productName: "Universal Recycled Plastic Protection - Size M",
          category: "external_protection",
          currentStock: 8,
          minimumThreshold: 15,
          maximumCapacity: 100,
          unitCost: 29.99,
          lastRestock: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          batchNumber: "URP-2024-002",
          supplier: "Sustainable Materials Co.",
          location: "Storage Room A, Shelf 4",
          status: "low_stock",
          customConfiguration: {
            lengthRange: "6-8 inches",
            material: "Ocean Plastic + Hydrogel",
            features: ["Antimicrobial coating", "Flexible walls"]
          }
        },
        {
          id: 3,
          productId: 2,
          productName: "Custom Lubricant - Plant-Based Formula",
          category: "lubricants",
          currentStock: 120,
          minimumThreshold: 25,
          maximumCapacity: 200,
          unitCost: 15.99,
          lastRestock: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          batchNumber: "LUB-PB-2024-015",
          supplier: "Natural Health Solutions",
          location: "Refrigerated Storage B",
          status: "in_stock"
        },
        {
          id: 4,
          productId: 3,
          productName: "4D STI Testing Kit - Comprehensive Panel",
          category: "testing_kits",
          currentStock: 0,
          minimumThreshold: 5,
          maximumCapacity: 50,
          unitCost: 85.00,
          lastRestock: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          batchNumber: "STI-4D-2024-008",
          supplier: "BioMedical Diagnostics",
          location: "Medical Supply Cabinet",
          status: "out_of_stock"
        }
      ];

      sampleInventory.forEach(item => {
        this.clinicInventory.set(item.id, item);
      });

      // Generate stock alerts for low/out of stock items
      this.generateStockAlerts();
    }

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
    if (this.restockOrders.size === 0) {
      // Initialize sample restock orders
      const sampleOrders = [
        {
          id: 1,
          items: [
            { itemId: 2, itemName: "Universal Recycled Plastic Protection - Size M", quantity: 50, unitCost: 29.99 },
            { itemId: 4, itemName: "4D STI Testing Kit - Comprehensive Panel", quantity: 20, unitCost: 85.00 }
          ],
          supplier: "Sustainable Materials Co.",
          orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "confirmed",
          totalCost: 3199.50
        }
      ];

      sampleOrders.forEach(order => {
        this.restockOrders.set(order.id, order);
      });
    }

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

  // Partner Network methods
  async getPartnerNetworks(userId: number): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        networkName: "Primary Network",
        isActive: true,
        privacyLevel: "private",
        consentGiven: true,
        dataRetentionDays: 90,
        emergencyContactId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  async createPartnerNetwork(network: any): Promise<any> {
    return { id: Date.now(), ...network, createdAt: new Date(), updatedAt: new Date() };
  }

  async updatePartnerNetwork(id: number, network: any): Promise<any> {
    return { id, ...network, updatedAt: new Date() };
  }

  async deletePartnerNetwork(id: number): Promise<boolean> {
    return true;
  }

  // Partner Connection methods
  async getPartnerConnections(networkId: number): Promise<any[]> {
    return [
      {
        id: 1,
        networkId,
        partnerUserId: 2,
        partnerAnonymousId: null,
        connectionType: "sexual_partner",
        relationshipStatus: "current",
        mutualConsent: true,
        notificationPreferences: { 
          stiAlerts: true, 
          testReminders: true, 
          emergencyNotifications: true 
        },
        lastContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        connectionStrength: 4,
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        networkId,
        partnerUserId: null,
        partnerAnonymousId: "anon_partner_xyz",
        connectionType: "casual",
        relationshipStatus: "past",
        mutualConsent: true,
        notificationPreferences: { 
          stiAlerts: true, 
          testReminders: false, 
          emergencyNotifications: true 
        },
        lastContact: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        connectionStrength: 2,
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
  }

  async createPartnerConnection(connection: any): Promise<any> {
    return { id: Date.now(), ...connection, createdAt: new Date(), updatedAt: new Date() };
  }

  async updatePartnerConnection(id: number, connection: any): Promise<any> {
    return { id, ...connection, updatedAt: new Date() };
  }

  async removePartnerConnection(id: number): Promise<boolean> {
    return true;
  }

  // 4D STI Tracking methods
  async getStiTrackingEvents(userId: number, filters?: any): Promise<any[]> {
    return [
      {
        id: 1,
        userId,
        networkId: 1,
        eventType: "test_result",
        stiType: "chlamydia",
        testResult: "negative",
        severityLevel: null,
        symptomsReported: [],
        treatmentProtocol: null,
        testingLocation: "Health Center Downtown",
        geographicArea: "Downtown District",
        exposureTimeframe: {},
        partnerNotificationStatus: "not_applicable",
        followUpRequired: false,
        followUpDate: null,
        isAnonymized: false,
        publicHealthReported: false,
        eventDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        id: 2,
        userId,
        networkId: 1,
        eventType: "test_result",
        stiType: "gonorrhea",
        testResult: "negative",
        severityLevel: null,
        symptomsReported: [],
        treatmentProtocol: null,
        testingLocation: "Health Center Downtown",
        geographicArea: "Downtown District",
        exposureTimeframe: {},
        partnerNotificationStatus: "not_applicable",
        followUpRequired: false,
        followUpDate: null,
        isAnonymized: false,
        publicHealthReported: false,
        eventDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      }
    ];
  }

  async createStiTrackingEvent(event: any): Promise<any> {
    return { id: Date.now(), ...event, createdAt: new Date() };
  }

  async updateStiTrackingEvent(id: number, event: any): Promise<any> {
    return { id, ...event, updatedAt: new Date() };
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

  // BAD Co-op Integration methods
  async getBadCoopIntegration(userId: number): Promise<any> {
    return null;
  }

  async createBadCoopIntegration(data: any): Promise<any> {
    return { id: Date.now(), ...data, createdAt: new Date() };
  }

  async updateBadCoopIntegration(id: number, data: any): Promise<any> {
    return { id, ...data, updatedAt: new Date() };
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

  // Filing Preparation methods
  async getFilingDocuments(userId: number): Promise<FilingDocument[]> {
    return await db.select().from(filingDocuments)
      .where(eq(filingDocuments.userId, userId))
      .orderBy(desc(filingDocuments.generatedAt));
  }

  async getFilingDocument(id: number): Promise<FilingDocument | undefined> {
    const [doc] = await db.select().from(filingDocuments).where(eq(filingDocuments.id, id));
    return doc;
  }

  async createFilingDocument(data: InsertFilingDocument & { documentBody: string }): Promise<FilingDocument> {
    const [created] = await db.insert(filingDocuments).values(data).returning();
    return created;
  }

  async updateFilingDocumentStatus(
    id: number,
    status: string,
    fields?: { confirmationNumber?: string; agencyResponse?: string; notes?: string }
  ): Promise<FilingDocument | undefined> {
    const update: any = { status };
    if (status === "submitted") update.submittedAt = new Date();
    if (status === "acknowledged" || status === "approved") update.acknowledgedAt = new Date();
    if (fields?.confirmationNumber !== undefined) update.confirmationNumber = fields.confirmationNumber;
    if (fields?.agencyResponse !== undefined) update.agencyResponse = fields.agencyResponse;
    if (fields?.notes !== undefined) update.notes = fields.notes;
    const [updated] = await db.update(filingDocuments).set(update).where(eq(filingDocuments.id, id)).returning();
    return updated;
  }

  async deleteFilingDocument(id: number): Promise<boolean> {
    const result = await db.delete(filingDocuments).where(eq(filingDocuments.id, id)).returning();
    return result.length > 0;
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
}

export const storage = new MemStorage();
