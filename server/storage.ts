import { 
  users, products, productConfigurations, orders, educationalContent, partnershipRequests,
  financialRecords, budgetItems, budgetVotes, communityDividends,
  type User, type InsertUser, type Product, type InsertProduct,
  type ProductConfiguration, type InsertProductConfiguration,
  type Order, type InsertOrder, type EducationalContent, type InsertEducationalContent,
  type PartnershipRequest, type InsertPartnershipRequest,
  type FinancialRecord, type InsertFinancialRecord,
  type BudgetItem, type InsertBudgetItem,
  type BudgetVote, type InsertBudgetVote,
  type CommunityDividend, type InsertCommunityDividend
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
      createdAt: new Date()
    };
    this.communityDividends.set(id, dividend);
    return dividend;
  }
}

export const storage = new MemStorage();
