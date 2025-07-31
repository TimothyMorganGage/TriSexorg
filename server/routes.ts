import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertProductConfigurationSchema, insertOrderSchema,
  insertEducationalContentSchema, insertPartnershipRequestSchema 
} from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerSchema.parse(req.body);
      const { confirmPassword, ...userData } = data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Product Configuration routes
  app.get("/api/configurations", async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      const configurations = await storage.getProductConfigurations(userId);
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.post("/api/configurations", async (req, res) => {
    try {
      const configData = insertProductConfigurationSchema.parse(req.body);
      const configuration = await storage.createProductConfiguration(configData);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create configuration" });
    }
  });

  app.patch("/api/configurations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const configuration = await storage.updateProductConfigurationStatus(id, status);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update configuration" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const clinicId = req.query.clinicId ? parseInt(req.query.clinicId as string) : undefined;
      
      let orders;
      if (userId) {
        orders = await storage.getOrdersByUser(userId);
      } else if (clinicId) {
        orders = await storage.getOrdersByClinic(clinicId);
      } else {
        orders = await storage.getOrders();
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Educational content routes
  app.get("/api/education", async (req, res) => {
    try {
      const category = req.query.category as string;
      let content;
      if (category) {
        content = await storage.getEducationalContentByCategory(category);
      } else {
        content = await storage.getEducationalContent();
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational content" });
    }
  });

  app.get("/api/education/:slug", async (req, res) => {
    try {
      const content = await storage.getEducationalContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post("/api/education", async (req, res) => {
    try {
      const contentData = insertEducationalContentSchema.parse(req.body);
      const content = await storage.createEducationalContent(contentData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create content" });
    }
  });

  // Partnership request routes
  app.get("/api/partnerships", async (req, res) => {
    try {
      const requests = await storage.getPartnershipRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnership requests" });
    }
  });

  app.post("/api/partnerships", async (req, res) => {
    try {
      const requestData = insertPartnershipRequestSchema.parse(req.body);
      const request = await storage.createPartnershipRequest(requestData);
      res.json(request);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create partnership request" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/orders", async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order stats" });
    }
  });

  // Mood and Wellness Logging routes
  app.get("/api/mood-entries", async (req, res) => {
    try {
      // For now, use a mock user ID (in real app, get from session)
      const userId = 1;
      const entries = await storage.getMoodEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/mood-entries", async (req, res) => {
    try {
      // For now, use a mock user ID (in real app, get from session)
      const userId = 1;
      const entryData = { ...req.body, userId };
      const entry = await storage.createMoodEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create mood entry" });
    }
  });

  app.get("/api/wellness-goals", async (req, res) => {
    try {
      // For now, use a mock user ID (in real app, get from session)
      const userId = 1;
      const goals = await storage.getWellnessGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wellness goals" });
    }
  });

  app.get("/api/mood-insights", async (req, res) => {
    try {
      // For now, use a mock user ID (in real app, get from session)
      const userId = 1;
      const insights = await storage.getMoodInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood insights" });
    }
  });

  // Clinic Inventory Management routes
  app.get("/api/clinic-inventory", async (req, res) => {
    try {
      const inventory = await storage.getClinicInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinic inventory" });
    }
  });

  app.post("/api/clinic-inventory/:id/update-stock", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity, notes } = req.body;
      
      const updatedItem = await storage.updateInventoryStock(parseInt(id), quantity, notes);
      if (!updatedItem) {
        return res.status(404).json({ message: "Inventory item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inventory stock" });
    }
  });

  app.get("/api/stock-alerts", async (req, res) => {
    try {
      const alerts = await storage.getStockAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock alerts" });
    }
  });

  app.post("/api/stock-alerts/:id/acknowledge", async (req, res) => {
    try {
      const { id } = req.params;
      const acknowledgedAlert = await storage.acknowledgeStockAlert(parseInt(id));
      
      if (!acknowledgedAlert) {
        return res.status(404).json({ message: "Stock alert not found" });
      }
      
      res.json(acknowledgedAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to acknowledge stock alert" });
    }
  });

  app.get("/api/restock-orders", async (req, res) => {
    try {
      const orders = await storage.getRestockOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restock orders" });
    }
  });

  app.post("/api/restock-orders", async (req, res) => {
    try {
      const { items, supplier } = req.body;
      const newOrder = await storage.createRestockOrder({ items, supplier });
      res.json(newOrder);
    } catch (error) {
      res.status(500).json({ message: "Failed to create restock order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
