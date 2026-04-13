import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import session from "express-session";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { 
  insertUserSchema, insertProductConfigurationSchema, insertOrderSchema,
  insertEducationalContentSchema, insertPartnershipRequestSchema,
  insertSavedProductConfigurationSchema
} from "@shared/schema";
import { z } from "zod";
import { genealogyService, RelationshipUtils } from "./genealogy";
import { ageVerificationService, DocumentType, VerificationStatus, AgeVerificationUtils } from "./ageVerification";
import { requireAuth } from "./middleware/auth";
import { sendContactEmail } from "./email";
import { Storage } from "@google-cloud/storage";
import { fileTypeFromBuffer } from "file-type";

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

// Configure multer for GEDCOM file uploads
const uploadGeneology = multer({
  dest: 'uploads/genealogy/',
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/\.(ged|gedcom)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only GEDCOM files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Configure multer for age verification documents
const uploadVerification = multer({
  dest: 'uploads/verification/',
  fileFilter: (req, file, cb) => {
    if (AgeVerificationUtils.isValidDocumentFile(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, HEIC, and PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Configure multer for profile image uploads
const uploadProfileImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Initialize Google Cloud Storage for Replit Object Storage
const gcsStorage = new Storage();
const bucketName = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || '';

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form (public, rate-limited)
  const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: "Too many contact requests, please try again later" });
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const schema = z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        subject: z.string().min(3).max(200),
        message: z.string().min(10).max(5000),
      });
      const data = schema.parse(req.body);
      const result = await sendContactEmail(data);
      if (result.success) {
        res.json({ success: true });
      } else {
        res.status(500).json({ message: "Failed to send message. Please try again later." });
      }
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Invalid request" });
    }
  });

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

      // Hash password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Store user in session
      req.session.userId = user.id;
      
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
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password using bcrypt
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user in session
      req.session.userId = user.id;

      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie('sessionId');
        res.json({ message: "Logged out successfully" });
      });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userResponse } = user;
      res.json({ user: userResponse });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Profile image upload route - REQUIRES AUTHENTICATION
  // NOTE: In production, implement content moderation workflow before making uploads public
  app.post("/api/profile/upload-image", requireAuth, uploadProfileImage.single('profileImage'), async (req, res) => {
    try {
      // Verify user session exists (defense in depth)
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      // Validate bucket name is configured
      if (!bucketName) {
        console.error("Object storage bucket not configured");
        return res.status(500).json({ message: "Object storage not configured" });
      }

      // Server-side MIME type validation - defense against spoofed client headers
      const fileType = await fileTypeFromBuffer(req.file.buffer);
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!fileType || !allowedMimeTypes.includes(fileType.mime)) {
        return res.status(400).json({ 
          message: "Invalid image format. File must be a real JPG, PNG, GIF, or WebP image." 
        });
      }

      // Generate unique filename with user ID and timestamp for security
      const userId = req.session.userId;
      const timestamp = Date.now();
      const extension = `.${fileType.ext}`;
      const filename = `profile-images/user-${userId}-${timestamp}${extension}`;

      // Upload to GCS bucket
      const bucket = gcsStorage.bucket(bucketName);
      const file = bucket.file(filename);
      
      await file.save(req.file.buffer, {
        metadata: {
          contentType: fileType.mime,
          // Add metadata for moderation tracking
          uploadedBy: userId.toString(),
          uploadedAt: new Date().toISOString(),
          // Flag for content moderation review
          moderationStatus: 'pending',
        },
        // Making files public for MVP demo - In production:
        // 1. Set public: false
        // 2. Implement admin moderation dashboard  
        // 3. Add moderator approval workflow
        // 4. Generate signed URLs only for approved images
        // 5. Link imageUrl to user profile in database
        public: false, // Private until moderation approved
      });

      // Generate signed URL (valid for 7 days)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return signed URL (private file access)
      res.json({
        message: "Image uploaded successfully. Please ensure your photo follows our non-pornographic content policy.",
        imageUrl: signedUrl,
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Failed to upload image" });
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
  app.get("/api/configurations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const configurations = await storage.getProductConfigurations(userId);
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configurations" });
    }
  });

  app.post("/api/configurations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const configData = insertProductConfigurationSchema.parse({
        ...req.body,
        userId
      });
      const configuration = await storage.createProductConfiguration(configData);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create configuration" });
    }
  });

  app.patch("/api/configurations/:id/status", requireAuth, async (req, res) => {
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

  // Saved Product Configuration routes
  app.get("/api/saved-configurations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const configurations = await storage.getSavedProductConfigurations(userId);
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved configurations" });
    }
  });

  app.get("/api/saved-configurations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId!;
      const configuration = await storage.getSavedProductConfiguration(id);
      if (!configuration) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      // Verify ownership
      if (configuration.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration" });
    }
  });

  app.get("/api/shared-configurations/:shareCode", async (req, res) => {
    try {
      const { shareCode } = req.params;
      const configuration = await storage.getSavedProductConfigurationByShareCode(shareCode);
      if (!configuration) {
        return res.status(404).json({ message: "Shared configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch shared configuration" });
    }
  });

  app.post("/api/saved-configurations", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      // Generate a unique share code
      const shareCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const configData = insertSavedProductConfigurationSchema.parse({
        ...req.body,
        userId,
        shareCode
      });
      const configuration = await storage.createSavedProductConfiguration(configData);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to save configuration" });
    }
  });

  app.patch("/api/saved-configurations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // First verify ownership
      const existing = await storage.getSavedProductConfiguration(id);
      if (!existing) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      if (existing.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Only allow updating specific fields - prevent userId/shareCode tampering
      const updateSchema = z.object({
        configurationName: z.string().optional(),
        configurationData: z.any().optional(),
        isPublic: z.boolean().optional()
      });
      
      const updates = updateSchema.parse(req.body);
      const configuration = await storage.updateSavedProductConfiguration(id, updates);
      res.json(configuration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update configuration" });
    }
  });

  app.delete("/api/saved-configurations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Verify ownership before deleting
      const existing = await storage.getSavedProductConfiguration(id);
      if (!existing) {
        return res.status(404).json({ message: "Configuration not found" });
      }
      if (existing.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const success = await storage.deleteSavedProductConfiguration(id);
      res.json({ message: "Configuration deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete configuration" });
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
  app.get("/api/mood-entries", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const entries = await storage.getMoodEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.post("/api/mood-entries", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const entryData = { ...req.body, userId };
      const entry = await storage.createMoodEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create mood entry" });
    }
  });

  app.get("/api/wellness-goals", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const goals = await storage.getWellnessGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wellness goals" });
    }
  });

  app.get("/api/mood-insights", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const insights = await storage.getMoodInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood insights" });
    }
  });

  // Time Management routes - "Wise Time TriSexs" system
  app.get("/api/time-entries", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const entries = await storage.getTimeEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time entries" });
    }
  });

  app.post("/api/time-entries", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const entryData = { ...req.body, userId };
      const entry = await storage.createTimeEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create time entry" });
    }
  });

  app.put("/api/time-entries/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const entry = await storage.updateTimeEntry(parseInt(id), req.body);
      if (!entry) {
        return res.status(404).json({ message: "Time entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update time entry" });
    }
  });

  app.get("/api/time-entries/active", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const activeEntry = await storage.getActiveTimeEntry(userId);
      res.json(activeEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active time entry" });
    }
  });

  app.get("/api/time-goals", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const goals = await storage.getTimeGoals(userId);
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time goals" });
    }
  });

  app.post("/api/time-goals", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const goalData = { ...req.body, userId };
      const goal = await storage.createTimeGoal(goalData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create time goal" });
    }
  });

  app.get("/api/time-insights", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const insights = await storage.getTimeInsights(userId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch time insights" });
    }
  });

  // Calendar Integration routes
  app.get("/api/calendar-connections", async (req, res) => {
    try {
      const userId = 1;
      const connections = await storage.getCalendarConnections(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch calendar connections" });
    }
  });

  app.post("/api/calendar-connections", async (req, res) => {
    try {
      const userId = 1;
      const connectionData = { ...req.body, userId };
      const connection = await storage.createCalendarConnection(connectionData);
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create calendar connection" });
    }
  });

  app.put("/api/calendar-connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const connection = await storage.updateCalendarConnection(parseInt(id), req.body);
      if (!connection) {
        return res.status(404).json({ message: "Calendar connection not found" });
      }
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update calendar connection" });
    }
  });

  app.delete("/api/calendar-connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCalendarConnection(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Calendar connection not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete calendar connection" });
    }
  });

  // Scheduled Tasks routes
  app.get("/api/scheduled-tasks", async (req, res) => {
    try {
      const userId = 1;
      const { startDate, endDate } = req.query;
      
      let tasks;
      if (startDate && endDate) {
        tasks = await storage.getScheduledTasksByDateRange(userId, startDate as string, endDate as string);
      } else {
        tasks = await storage.getScheduledTasks(userId);
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scheduled tasks" });
    }
  });

  app.post("/api/scheduled-tasks", async (req, res) => {
    try {
      const userId = 1;
      const taskData = { ...req.body, userId };
      const task = await storage.createScheduledTask(taskData);
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create scheduled task" });
    }
  });

  app.put("/api/scheduled-tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateScheduledTask(parseInt(id), req.body);
      if (!task) {
        return res.status(404).json({ message: "Scheduled task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update scheduled task" });
    }
  });

  app.delete("/api/scheduled-tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteScheduledTask(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Scheduled task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete scheduled task" });
    }
  });

  // Task Templates routes
  app.get("/api/task-templates", async (req, res) => {
    try {
      const userId = 1;
      const { includePublic } = req.query;
      
      let templates = await storage.getTaskTemplates(userId);
      if (includePublic === 'true') {
        const publicTemplates = await storage.getPublicTaskTemplates();
        templates = [...templates, ...publicTemplates];
      }
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch task templates" });
    }
  });

  app.post("/api/task-templates", async (req, res) => {
    try {
      const userId = 1;
      const templateData = { ...req.body, userId };
      const template = await storage.createTaskTemplate(templateData);
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create task template" });
    }
  });

  app.put("/api/task-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.updateTaskTemplate(parseInt(id), req.body);
      if (!template) {
        return res.status(404).json({ message: "Task template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update task template" });
    }
  });

  app.post("/api/task-templates/:id/use", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.incrementTemplateUsage(parseInt(id));
      if (!template) {
        return res.status(404).json({ message: "Task template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment template usage" });
    }
  });

  // Calendar sync endpoints for external integration
  app.post("/api/calendar-sync/google", async (req, res) => {
    try {
      // This would integrate with Google Calendar API
      // For now, return success with sync status
      res.json({ 
        success: true, 
        message: "Google Calendar sync initiated",
        syncedEvents: 0 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync with Google Calendar" });
    }
  });

  app.post("/api/calendar-sync/ical", async (req, res) => {
    try {
      const { icalUrl } = req.body;
      // This would fetch and parse iCal data
      // For now, return success with sync status
      res.json({ 
        success: true, 
        message: "iCal sync initiated",
        url: icalUrl,
        syncedEvents: 0 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync with iCal" });
    }
  });

  app.post("/api/calendar-sync/pureos", async (req, res) => {
    try {
      // This would integrate with pureOS calendar systems
      // For now, return success with sync status
      res.json({ 
        success: true, 
        message: "pureOS calendar sync initiated",
        syncedEvents: 0 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync with pureOS calendar" });
    }
  });

  // Export calendar data in various formats
  app.get("/api/calendar-export/ical", async (req, res) => {
    try {
      const userId = 1;
      const tasks = await storage.getScheduledTasks(userId);
      
      // Generate iCal format
      let icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TriSex//Wise Time TriSexs//EN
NAME:Wise Time TriSexs Calendar
X-WR-CALNAME:Wise Time TriSexs Calendar
`;

      tasks.forEach(task => {
        const startDate = task.scheduledDate.replace(/-/g, '');
        const startTime = task.scheduledStartTime ? task.scheduledStartTime.replace(':', '') + '00' : '090000';
        const endTime = task.scheduledEndTime ? task.scheduledEndTime.replace(':', '') + '00' : '100000';
        
        icalData += `BEGIN:VEVENT
UID:${task.id}@TriSex.wtf
DTSTART:${startDate}T${startTime}
DTEND:${startDate}T${endTime}
SUMMARY:${task.title}
DESCRIPTION:${task.description || ''}${task.wiseTimePrep ? '\\n\\nWise Time Prep: ' + task.wiseTimePrep : ''}
CATEGORIES:${task.category}
STATUS:${task.status?.toUpperCase()}
END:VEVENT
`;
      });

      icalData += 'END:VCALENDAR';

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', 'attachment; filename="wise-time-TriSexs.ics"');
      res.send(icalData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export calendar data" });
    }
  });

  // Cross-Platform Notification System routes
  app.get("/api/notification-settings", async (req, res) => {
    try {
      const userId = 1;
      const settings = await storage.getNotificationSettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.post("/api/notification-settings", async (req, res) => {
    try {
      const userId = 1;
      const settingsData = { ...req.body, userId };
      const settings = await storage.createNotificationSettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create notification settings" });
    }
  });

  app.put("/api/notification-settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const settings = await storage.updateNotificationSettings(parseInt(id), req.body);
      if (!settings) {
        return res.status(404).json({ message: "Notification settings not found" });
      }
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update notification settings" });
    }
  });

  app.post("/api/notifications/send", async (req, res) => {
    try {
      const userId = 1;
      const notificationData = { ...req.body, userId };
      const notification = await storage.createCrossPlatformNotification(notificationData);
      
      // Here we would integrate with actual notification services
      // For now, just mark as sent
      await storage.markNotificationAsSent(notification.id);
      
      res.json({ success: true, notificationId: notification.id });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to send notification" });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = 1;
      const { unreadOnly } = req.query;
      
      let notifications;
      if (unreadOnly === 'true') {
        notifications = await storage.getUnreadNotifications(userId);
      } else {
        notifications = await storage.getNotifications(userId);
      }
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markNotificationAsRead(parseInt(id));
      if (!success) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Smart Break and Rest Interval routes
  app.get("/api/break-patterns", async (req, res) => {
    try {
      const userId = 1;
      const patterns = await storage.getBreakPatterns(userId);
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch break patterns" });
    }
  });

  app.post("/api/break-patterns", async (req, res) => {
    try {
      const userId = 1;
      const patternData = { ...req.body, userId };
      const pattern = await storage.createBreakPattern(patternData);
      res.json(pattern);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create break pattern" });
    }
  });

  app.put("/api/break-patterns/:id/activate", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = 1;
      const pattern = await storage.activateBreakPattern(userId, parseInt(id));
      if (!pattern) {
        return res.status(404).json({ message: "Break pattern not found" });
      }
      res.json(pattern);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to activate break pattern" });
    }
  });

  app.get("/api/rest-suggestions", async (req, res) => {
    try {
      const userId = 1;
      const { energyLevel, stressLevel, personalizedOnly } = req.query;
      
      const suggestions = await storage.getRestSuggestions(userId, {
        energyLevel: energyLevel ? parseInt(energyLevel as string) : undefined,
        stressLevel: stressLevel ? parseInt(stressLevel as string) : undefined,
        personalizedOnly: personalizedOnly === 'true',
      });
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rest suggestions" });
    }
  });

  app.post("/api/rest-suggestions", async (req, res) => {
    try {
      const userId = 1;
      const suggestionData = { ...req.body, userId };
      const suggestion = await storage.createRestSuggestion(suggestionData);
      res.json(suggestion);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create rest suggestion" });
    }
  });

  app.post("/api/smart-break-sessions", async (req, res) => {
    try {
      const userId = 1;
      const sessionData = { ...req.body, userId };
      const session = await storage.createSmartBreakSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create break session" });
    }
  });

  app.put("/api/smart-break-sessions/:id/complete", async (req, res) => {
    try {
      const { id } = req.params;
      const { actualDuration, energyAfter, stressAfter, effectiveness, notes } = req.body;
      
      const session = await storage.completeSmartBreakSession(parseInt(id), {
        actualDuration,
        energyAfter,
        stressAfter,
        effectiveness,
        notes,
        completedAt: new Date(),
      });
      
      if (!session) {
        return res.status(404).json({ message: "Break session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to complete break session" });
    }
  });

  app.get("/api/smart-break-sessions", async (req, res) => {
    try {
      const userId = 1;
      const { startDate, endDate } = req.query;
      
      let sessions;
      if (startDate && endDate) {
        sessions = await storage.getSmartBreakSessionsByDateRange(userId, startDate as string, endDate as string);
      } else {
        sessions = await storage.getRecentSmartBreakSessions(userId);
      }
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch break sessions" });
    }
  });

  // Smart suggestions based on current context
  app.post("/api/suggest-break", async (req, res) => {
    try {
      const userId = 1;
      const { currentEnergy, currentStress, workDuration, lastBreakTime } = req.body;
      
      const suggestion = await storage.generateSmartBreakSuggestion(userId, {
        currentEnergy,
        currentStress,
        workDuration,
        lastBreakTime,
      });
      
      res.json(suggestion);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate break suggestion" });
    }
  });

  // Notification scheduling for breaks
  app.post("/api/schedule-break-reminders", async (req, res) => {
    try {
      const userId = 1;
      const { patternId, startTime } = req.body;
      
      const reminders = await storage.scheduleBreakReminders(userId, patternId, startTime);
      res.json({ success: true, reminders });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to schedule break reminders" });
    }
  });

  // Messaging Platform Integration routes
  app.get("/api/messaging-integrations", async (req, res) => {
    try {
      const userId = 1;
      const integrations = await storage.getMessagingIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messaging integrations" });
    }
  });

  app.post("/api/messaging-integrations", async (req, res) => {
    try {
      const userId = 1;
      const integrationData = { ...req.body, userId };
      const integration = await storage.createMessagingIntegration(integrationData);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create messaging integration" });
    }
  });

  app.put("/api/messaging-integrations/:id/sync", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await storage.syncMessagingPlatform(parseInt(id));
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to sync messaging platform" });
    }
  });

  // Healthcare System Integration routes
  app.get("/api/healthcare-integrations", async (req, res) => {
    try {
      const userId = 1;
      const integrations = await storage.getHealthcareIntegrations(userId);
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch healthcare integrations" });
    }
  });

  app.post("/api/healthcare-integrations", async (req, res) => {
    try {
      const userId = 1;
      const integrationData = { ...req.body, userId };
      const integration = await storage.createHealthcareIntegration(integrationData);
      res.json(integration);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create healthcare integration" });
    }
  });

  app.post("/api/healthcare-integrations/:id/sync", async (req, res) => {
    try {
      const { id } = req.params;
      const { dataTypes } = req.body;
      const result = await storage.syncHealthcareData(parseInt(id), dataTypes);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to sync healthcare data" });
    }
  });

  // Accessibility Settings routes
  app.get("/api/accessibility-settings", async (req, res) => {
    try {
      const userId = 1;
      const settings = await storage.getAccessibilitySettings(userId);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accessibility settings" });
    }
  });

  app.post("/api/accessibility-settings", async (req, res) => {
    try {
      const userId = 1;
      const settingsData = { ...req.body, userId };
      const settings = await storage.createAccessibilitySettings(settingsData);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create accessibility settings" });
    }
  });

  app.put("/api/accessibility-settings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const settings = await storage.updateAccessibilitySettings(parseInt(id), req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update accessibility settings" });
    }
  });

  // Co-editing Session routes
  app.post("/api/co-editing-sessions", async (req, res) => {
    try {
      const userId = 1;
      const sessionData = { ...req.body, initiatorId: userId };
      const session = await storage.createCoEditingSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create co-editing session" });
    }
  });

  app.get("/api/co-editing-sessions", async (req, res) => {
    try {
      const userId = 1;
      const { active } = req.query;
      let sessions;
      if (active === 'true') {
        sessions = await storage.getActiveCoEditingSessions(userId);
      } else {
        sessions = await storage.getCoEditingSessions(userId);
      }
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch co-editing sessions" });
    }
  });

  app.post("/api/co-editing-sessions/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = 1;
      const messageData = { ...req.body, sessionId: parseInt(id), senderId: userId };
      const message = await storage.createCoEditingMessage(messageData);
      
      // Trigger real-time translation and cross-platform delivery
      await storage.processMessageTranslation(message.id);
      await storage.deliverToPlatforms(message.id);
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to send message" });
    }
  });

  app.get("/api/co-editing-sessions/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getCoEditingMessages(parseInt(id));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Translation Services routes
  app.post("/api/translate", async (req, res) => {
    try {
      const userId = 1;
      const { sourceText, targetFormat, priority } = req.body;
      
      const translation = await storage.requestTranslation({
        userId,
        sourceText,
        targetFormat,
        priority: priority || 'normal'
      });
      
      res.json(translation);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to process translation" });
    }
  });

  app.get("/api/translations", async (req, res) => {
    try {
      const userId = 1;
      const { targetFormat, verified } = req.query;
      
      const translations = await storage.getTranslations(userId, {
        targetFormat: targetFormat as string,
        verified: verified === 'true'
      });
      res.json(translations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch translations" });
    }
  });

  // Health Data Sync routes
  app.get("/api/health-data-sync", async (req, res) => {
    try {
      const userId = 1;
      const { dataType, sourceSystem } = req.query;
      
      const syncRecords = await storage.getHealthDataSync(userId, {
        dataType: dataType as string,
        sourceSystem: sourceSystem as string
      });
      res.json(syncRecords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch health data sync records" });
    }
  });

  app.post("/api/health-data-sync/trigger", async (req, res) => {
    try {
      const userId = 1;
      const { systems, dataTypes } = req.body;
      
      const syncResults = await storage.triggerHealthDataSync(userId, systems, dataTypes);
      res.json(syncResults);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to trigger health data sync" });
    }
  });

  // WebSocket endpoint for real-time co-editing
  app.get("/api/co-editing-sessions/:id/websocket-token", async (req, res) => {
    try {
      const { id } = req.params;
      const userId = 1;
      
      const token = await storage.generateWebSocketToken(userId, parseInt(id));
      res.json({ token, wsUrl: `/ws/co-editing/${id}` });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to generate WebSocket token" });
    }
  });

  // Partner Network routes
  app.get("/api/partner-networks", async (req, res) => {
    try {
      const userId = 1;
      const networks = await storage.getPartnerNetworks(userId);
      res.json(networks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner networks" });
    }
  });

  app.post("/api/partner-networks", async (req, res) => {
    try {
      const userId = 1;
      const networkData = { ...req.body, userId };
      const network = await storage.createPartnerNetwork(networkData);
      res.json(network);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create partner network" });
    }
  });

  app.put("/api/partner-networks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const network = await storage.updatePartnerNetwork(parseInt(id), req.body);
      res.json(network);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update partner network" });
    }
  });

  // Partner Connection routes
  app.get("/api/partner-networks/:networkId/connections", async (req, res) => {
    try {
      const { networkId } = req.params;
      const connections = await storage.getPartnerConnections(parseInt(networkId));
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner connections" });
    }
  });

  app.post("/api/partner-networks/:networkId/connections", async (req, res) => {
    try {
      const { networkId } = req.params;
      const connectionData = { ...req.body, networkId: parseInt(networkId) };
      const connection = await storage.createPartnerConnection(connectionData);
      res.json(connection);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create partner connection" });
    }
  });

  // 4D STI Tracking routes
  app.get("/api/sti-tracking", async (req, res) => {
    try {
      const userId = 1;
      const { stiType, startDate, endDate } = req.query;
      
      const events = await storage.getStiTrackingEvents(userId, {
        stiType: stiType as string,
        startDate: startDate as string,
        endDate: endDate as string
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch STI tracking events" });
    }
  });

  app.post("/api/sti-tracking", async (req, res) => {
    try {
      const userId = 1;
      const eventData = { ...req.body, userId };
      const event = await storage.createStiTrackingEvent(eventData);
      
      // Generate partner notifications if positive result
      if (req.body.testResult === 'positive') {
        await storage.generatePartnerNotifications(event.id);
      }
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create STI tracking event" });
    }
  });

  app.get("/api/partner-networks/:networkId/exposure-analysis/:stiType", async (req, res) => {
    try {
      const { networkId, stiType } = req.params;
      const analysis = await storage.getNetworkExposureAnalysis(parseInt(networkId), stiType);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate exposure analysis" });
    }
  });

  // Sexual Product Customization routes
  app.get("/api/sexual-product-customizations", async (req, res) => {
    try {
      const userId = 1;
      const customizations = await storage.getSexualProductCustomizations(userId);
      res.json(customizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product customizations" });
    }
  });

  app.post("/api/sexual-product-customizations", async (req, res) => {
    try {
      const userId = 1;
      const customizationData = { ...req.body, userId };
      const customization = await storage.createSexualProductCustomization(customizationData);
      res.json(customization);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create product customization" });
    }
  });

  app.put("/api/sexual-product-customizations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const customization = await storage.updateSexualProductCustomization(parseInt(id), req.body);
      res.json(customization);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update product customization" });
    }
  });

  app.get("/api/partner-networks/:networkId/compatible-products", async (req, res) => {
    try {
      const { networkId } = req.params;
      const products = await storage.getPartnerCompatibleProducts(parseInt(networkId));
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compatible products" });
    }
  });

  // Natural Senses Profile routes
  app.get("/api/natural-senses-profile", async (req, res) => {
    try {
      const userId = 1;
      const profile = await storage.getNaturalSensesProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch natural senses profile" });
    }
  });

  app.post("/api/natural-senses-profile", async (req, res) => {
    try {
      const userId = 1;
      const profileData = { ...req.body, userId };
      const profile = await storage.createNaturalSensesProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create natural senses profile" });
    }
  });

  app.put("/api/natural-senses-profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const profile = await storage.updateNaturalSensesProfile(parseInt(id), req.body);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to update natural senses profile" });
    }
  });

  app.get("/api/optimal-product-recommendations", async (req, res) => {
    try {
      const userId = 1;
      const recommendations = await storage.getOptimalProductRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product recommendations" });
    }
  });

  // Product Effectiveness routes
  app.get("/api/sexual-product-customizations/:id/effectiveness-reports", async (req, res) => {
    try {
      const { id } = req.params;
      const reports = await storage.getProductEffectivenessReports(parseInt(id));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch effectiveness reports" });
    }
  });

  app.post("/api/product-effectiveness-reports", async (req, res) => {
    try {
      const report = await storage.createProductEffectivenessReport(req.body);
      res.json(report);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create effectiveness report" });
    }
  });

  app.get("/api/partner-networks/:networkId/effectiveness-analysis", async (req, res) => {
    try {
      const { networkId } = req.params;
      const analysis = await storage.getNetworkEffectivenessAnalysis(parseInt(networkId));
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate effectiveness analysis" });
    }
  });

  // Partner Notification routes
  app.get("/api/partner-notifications", async (req, res) => {
    try {
      const userId = 1;
      const notifications = await storage.getPartnerNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partner notifications" });
    }
  });

  app.post("/api/partner-notifications", async (req, res) => {
    try {
      const notification = await storage.sendPartnerNotification(req.body);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to send partner notification" });
    }
  });

  app.put("/api/partner-notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(parseInt(id));
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to mark notification as read" });
    }
  });

  app.post("/api/partner-notifications/:id/respond", async (req, res) => {
    try {
      const { id } = req.params;
      const response = await storage.respondToNotification(parseInt(id), req.body);
      res.json(response);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to respond to notification" });
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

  // Age Verification routes
  app.get("/api/age-verification/status", async (req, res) => {
    try {
      const userId = req.body.userId || 'test-user'; // In real app, get from session
      const status = ageVerificationService.getUserVerificationStatus(userId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get verification status" 
      });
    }
  });

  app.post("/api/age-verification/upload", uploadVerification.single('document'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document file uploaded" });
      }

      const userId = req.body.userId || 'test-user'; // In real app, get from session
      const documentType = req.body.documentType as DocumentType;

      if (!documentType || !Object.values(DocumentType).includes(documentType)) {
        return res.status(400).json({ message: "Valid document type required" });
      }

      const document = await ageVerificationService.submitVerificationDocument(
        userId,
        documentType,
        req.file.path,
        req.file.originalname
      );

      res.json({
        message: "Document uploaded successfully",
        documentId: document.id,
        status: document.verificationStatus,
        requiresParentalConsent: document.verificationStatus === VerificationStatus.REQUIRES_PARENTAL_CONSENT
      });

    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  app.post("/api/age-verification/parental-consent", async (req, res) => {
    try {
      const {
        parentGuardianName,
        parentGuardianEmail,
        parentGuardianPhone,
        relationshipToMinor,
        consentType
      } = req.body;

      const minorUserId = req.body.minorUserId || 'test-user'; // In real app, get from session
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      if (!parentGuardianName || !parentGuardianEmail || !relationshipToMinor || !consentType) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      const consent = await ageVerificationService.requestParentalConsent(
        minorUserId,
        parentGuardianName,
        parentGuardianEmail,
        relationshipToMinor,
        consentType,
        ipAddress,
        userAgent,
        parentGuardianPhone
      );

      res.json({
        message: "Parental consent request sent successfully",
        consentId: consent.id,
        parentEmail: consent.parentGuardianEmail,
        expiresAt: consent.expiresAt
      });

    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Consent request failed" 
      });
    }
  });

  app.get("/api/age-verification/parental-consent/:consentId", async (req, res) => {
    try {
      const { consentId } = req.params;
      const consent = ageVerificationService['parentalConsents'].get(consentId);
      
      if (!consent) {
        return res.status(404).json({ message: "Consent request not found" });
      }

      res.json({
        id: consent.id,
        parentGuardianName: consent.parentGuardianName,
        parentGuardianEmail: consent.parentGuardianEmail,
        relationshipToMinor: consent.relationshipToMinor,
        consentType: consent.consentType,
        status: consent.status,
        expiresAt: consent.expiresAt,
        requestedAt: consent.requestedAt
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get consent details" 
      });
    }
  });

  app.post("/api/age-verification/parental-consent/:consentId/respond", async (req, res) => {
    try {
      const { consentId } = req.params;
      const { approved, verificationCode, parentSignature } = req.body;

      if (!verificationCode) {
        return res.status(400).json({ message: "Verification code required" });
      }

      const consent = await ageVerificationService.processParentalConsent(
        consentId,
        approved === true,
        verificationCode,
        parentSignature
      );

      res.json({
        message: approved ? "Consent approved successfully" : "Consent denied",
        consentId: consent.id,
        status: consent.status,
        respondedAt: consent.respondedAt
      });

    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Consent response failed" 
      });
    }
  });

  app.post("/api/age-verification/admin/verify-document", async (req, res) => {
    try {
      const { documentId, approved, rejectionReason } = req.body;
      const verifiedBy = req.body.verifiedBy || 'admin'; // In real app, get from session

      if (!documentId || approved === undefined) {
        return res.status(400).json({ message: "Document ID and approval status required" });
      }

      const document = await ageVerificationService.verifyDocument(
        documentId,
        approved,
        verifiedBy,
        rejectionReason
      );

      res.json({
        message: approved ? "Document verified successfully" : "Document rejected",
        documentId: document.id,
        status: document.verificationStatus,
        verifiedAt: document.verifiedAt
      });

    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Document verification failed" 
      });
    }
  });

  app.get("/api/age-verification/compliance-report/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const report = ageVerificationService.generateComplianceReport(userId);
      res.json(report);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate compliance report" 
      });
    }
  });

  // Genealogy verification routes
  app.post("/api/genealogy/upload", uploadGeneology.single('gedcom'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No GEDCOM file uploaded" });
      }

      const userId = req.body.userId || 'anonymous'; // In real app, get from session
      const filePath = req.file.path;

      // Parse GEDCOM file
      const familyTree = await genealogyService.parseGEDCOM(filePath, userId);
      
      // Set verification status to pending
      await genealogyService.setVerificationStatus(userId, 'pending');

      res.json({
        message: "GEDCOM file uploaded successfully",
        fileName: req.file.originalname,
        peopleCount: Object.keys(familyTree.people).length,
        status: 'pending'
      });

    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  app.post("/api/genealogy/check-relationship", async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;
      
      if (!userId1 || !userId2) {
        return res.status(400).json({ message: "Both user IDs required" });
      }

      const relationship = genealogyService.calculateRelationship(userId1, userId2);
      const isAllowed = genealogyService.isRelationshipAllowed(userId1, userId2);

      res.json({
        relationship,
        isAllowed,
        withinEightCousinLimit: relationship.degree ? 
          RelationshipUtils.isWithinEightCousinLimit(relationship.degree * 2) : 
          true
      });

    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Relationship check failed" 
      });
    }
  });

  app.get("/api/genealogy/blocked-matches/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const { potentialMatches } = req.query;

      if (!potentialMatches) {
        return res.status(400).json({ message: "Potential matches list required" });
      }

      const matchIds = Array.isArray(potentialMatches) ? 
        potentialMatches as string[] : 
        [potentialMatches as string];

      const blockedMatches = genealogyService.getBlockedMatches(userId, matchIds);

      res.json({
        userId,
        blockedMatches,
        allowedMatches: matchIds.filter(id => !blockedMatches.includes(id))
      });

    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to check blocked matches" 
      });
    }
  });

  app.post("/api/genealogy/verify-status", async (req, res) => {
    try {
      const { userId, status } = req.body;
      
      if (!userId || !['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid user ID or status" });
      }

      await genealogyService.setVerificationStatus(userId, status);

      res.json({
        message: `Verification status updated to ${status}`,
        userId,
        status
      });

    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Status update failed" 
      });
    }
  });

  // BAD Co-op Dashboard API routes
  app.get('/api/bad-coop-dashboard/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const dashboardData = {
        userProgress: {
          completionRate: 85,
          activeModules: 6,
          communityScore: 4.8,
          nextReviewDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 2 months
        },
        modules: [
          {
            id: "advance-directives",
            progress: 85,
            status: "complete",
            lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            priority: "critical"
          },
          {
            id: "sexual-health-integration", 
            progress: 92,
            status: "complete",
            lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
            priority: "high"
          },
          {
            id: "cooperative-advocacy",
            progress: 78,
            status: "active",
            lastUpdated: new Date(),
            priority: "high"
          },
          {
            id: "financial-planning",
            progress: 45,
            status: "incomplete",
            lastUpdated: null,
            priority: "medium"
          },
          {
            id: "mental-health",
            progress: 67,
            status: "in-progress",
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            priority: "high"
          },
          {
            id: "family-care",
            progress: 89,
            status: "complete",
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            priority: "high"
          }
        ],
        recentActivity: [
          {
            action: "Sexual health directives updated",
            module: "Sexual Health Integration",
            time: new Date(Date.now() - 2 * 60 * 60 * 1000),
            status: "completed",
            details: "Integrated new contraception preferences with TriSex.org protection systems"
          },
          {
            action: "Community health council meeting",
            module: "Cooperative Advocacy",
            time: new Date(Date.now() - 24 * 60 * 60 * 1000),
            status: "attended",
            details: "Participated in democratic healthcare governance session"
          },
          {
            action: "Healthcare proxy verification",
            module: "Advance Directives",
            time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: "verified",
            details: "Emergency contact confirmed and healthcare proxy signed"
          },
          {
            action: "Mental health crisis plan review",
            module: "Mental Health",
            time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            status: "needs-update",
            details: "Annual review scheduled for psychiatric advance directives"
          }
        ],
        upcomingTasks: [
          {
            task: "Annual directive comprehensive review",
            dueDate: "In 2 months",
            priority: "critical",
            module: "Advance Directives"
          },
          {
            task: "Sexual health education workshop",
            dueDate: "Next week",
            priority: "medium",
            module: "Sexual Health Integration"
          },
          {
            task: "Cooperative insurance enrollment",
            dueDate: "In 3 weeks", 
            priority: "high",
            module: "Financial Planning"
          },
          {
            task: "Mental health support group check-in",
            dueDate: "Tomorrow",
            priority: "medium",
            module: "Mental Health"
          }
        ]
      };
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: "Failed to load dashboard data" });
    }
  });

  // BAD Co-op Integration API routes
  app.get('/api/bad-coop-integration', async (req, res) => {
    try {
      const integration = await storage.getBadCoopIntegration(1); // Using demo user ID
      res.json(integration);
    } catch (error) {
      res.status(404).json({ message: "Integration not found" });
    }
  });

  app.post('/api/bad-coop-integration', async (req, res) => {
    try {
      const integration = await storage.createBadCoopIntegration({
        userId: 1, // Using demo user ID
        consentForDataSharing: req.body.consentForDataSharing || false,
        advanceDirectivesLinked: req.body.advanceDirectivesLinked || false,
        healthPlanningConnected: req.body.healthPlanningConnected || false,
        sexualHealthPreferences: req.body.sexualHealthPreferences || '',
        communicationPreferences: req.body.communicationPreferences || '',
        emergencyContacts: req.body.emergencyContacts || []
      });
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.put('/api/bad-coop-integration/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedData = {
        consentForDataSharing: req.body.consentForDataSharing,
        advanceDirectivesLinked: req.body.advanceDirectivesLinked,
        healthPlanningConnected: req.body.healthPlanningConnected,
        sexualHealthPreferences: req.body.sexualHealthPreferences,
        communicationPreferences: req.body.communicationPreferences,
        emergencyContacts: req.body.emergencyContacts
      };
      
      const integration = await storage.updateBadCoopIntegration(id, updatedData);
      res.json(integration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
