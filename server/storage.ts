import { 
  users, products, productConfigurations, orders, educationalContent, partnershipRequests,
  financialRecords, budgetItems, budgetVotes, communityDividends,
  moodEntries, wellnessGoals, moodInsights, timeEntries, timeGoals, timeInsights,
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
  type TimeInsight, type InsertTimeInsight
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

  // Time Management methods - "Wise Time Flucks" system
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

  // Clinic Inventory methods
  getClinicInventory(): Promise<any[]>;
  updateInventoryStock(itemId: number, quantity: number, notes?: string): Promise<any>;
  getStockAlerts(): Promise<any[]>;
  acknowledgeStockAlert(alertId: number): Promise<any>;
  getRestockOrders(): Promise<any[]>;
  createRestockOrder(orderData: { items: { itemId: number; quantity: number }[]; supplier: string }): Promise<any>;
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
  private clinicInventory: Map<number, any>;
  private stockAlerts: Map<number, any>;
  private restockOrders: Map<number, any>;
  private currentInventoryId: number;
  private currentAlertId: number;
  private currentRestockOrderId: number;

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
    this.clinicInventory = new Map();
    this.stockAlerts = new Map();
    this.restockOrders = new Map();
    this.currentInventoryId = 1;
    this.currentAlertId = 1;
    this.currentRestockOrderId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Create default products
    const defaultProducts: InsertProduct[] = [
      {
        name: "fluck External Protection - Ocean Plastic",
        description: "3D-printed custom-fit external protection made from recycled ocean plastic and hydrogel. Fits penis anatomy 4.5-11.5 inches.",
        category: "penis_protection",
        bodyCompatibility: ["penis"],
        sizeRange: "custom",
        basePrice: "29.99",
        isActive: true,
      },
      {
        name: "fluck Internal Protection - Natural Blend",
        description: "3D-printed custom-fit internal protection made from natural plant-based materials. Compatible with vaginal and anal anatomy.",
        category: "multi_anatomical",
        bodyCompatibility: ["vagina", "anus", "front_hole"],
        sizeRange: "custom",
        basePrice: "34.99",
        isActive: true,
      },
      {
        name: "fluck Multi-Anatomy Kit - Bio Silicone",
        description: "Complete kit for intersex and trans bodies. Includes external, internal, and barrier protection options.",
        category: "multi_anatomical",
        bodyCompatibility: ["penis", "vagina", "anus", "front_hole", "multi_anatomy"],
        sizeRange: "custom",
        basePrice: "49.99",
        isActive: true,
      },
      {
        name: "fluck Barrier Dams - Ocean Plastic",
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
      ...insertItem,
      votes: 0,
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

  // Time Management methods - "Wise Time Flucks" system
  async getTimeEntries(userId: number): Promise<TimeEntry[]> {
    return Array.from(this.timeEntries.values()).filter(entry => entry.userId === userId);
  }

  async getTimeEntry(id: number): Promise<TimeEntry | undefined> {
    return this.timeEntries.get(id);
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const newEntry: TimeEntry = {
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
}

export const storage = new MemStorage();
