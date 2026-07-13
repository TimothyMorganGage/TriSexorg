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
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
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
  // Replit Auth ("Log in with Replit") — extra login option alongside
  // the existing custom email/password auth. Reuses the session middleware
  // mounted in server/index.ts.
  await setupAuth(app);
  registerAuthRoutes(app);

  // Bridge: when a user is authenticated via "Log in with Replit" (Passport
  // populates req.user from the OIDC session) but the app's own session-based
  // identity isn't set yet, find-or-create a matching app user and set
  // req.session.userId. This lets Replit-logged-in users use every existing
  // route/middleware that relies on req.session.userId (and /api/auth/me).
  app.use(async (req, _res, next) => {
    try {
      const replitUser = req.user as any;
      const claims = replitUser?.claims;
      if (claims?.sub && !req.session.userId) {
        const email: string =
          claims.email || `replit_${claims.sub}@users.noreply.replit.com`;
        let appUser = await storage.getUserByEmail(email);
        if (!appUser) {
          const base = (claims.email?.split("@")[0] || `replit_user`)
            .replace(/[^a-zA-Z0-9_]/g, "")
            .slice(0, 20) || "replit_user";
          let username = `${base}_${String(claims.sub).slice(0, 6)}`;
          if (await storage.getUserByUsername(username)) {
            username = `${username}_${Date.now().toString(36)}`;
          }
          // Random unusable password — this account logs in via Replit only.
          const randomPassword = await bcrypt.hash(
            `${claims.sub}:${Math.random().toString(36)}:${Date.now()}`,
            10,
          );
          appUser = await storage.createUser({
            username,
            email,
            password: randomPassword,
            role: "cooperator",
          });
        }
        req.session.userId = appUser.id;
      }
    } catch (err) {
      console.error("Replit auth bridge error:", err);
    }
    next();
  });

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
        password: hashedPassword,
        role: "cooperator", // no role hierarchy: every member is an equal co-operator
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

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "Invalid order id" });
      }
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
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
  app.post("/api/genealogy/upload", requireAuth, uploadGeneology.single('gedcom'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No GEDCOM file uploaded" });
      }

      // Bind the tree to the authenticated user; never trust a client-supplied id.
      const userId = String(req.session.userId!);
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

  app.post("/api/genealogy/check-relationship", requireAuth, async (req, res) => {
    try {
      // One side is always the authenticated caller; only the candidate is supplied.
      const userId1 = String(req.session.userId!);
      const { userId2 } = req.body;

      if (!userId2) {
        return res.status(400).json({ message: "Candidate user ID required" });
      }

      const relationship = genealogyService.calculateRelationship(userId1, userId2);
      const isAllowed = genealogyService.isRelationshipAllowed(userId1, userId2);

      res.json({
        relationship,
        isAllowed,
        withinEighthCousinLimit: relationship.degree ? 
          RelationshipUtils.isWithinEighthCousinLimit(relationship.degree * 2) : 
          true
      });

    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Relationship check failed" 
      });
    }
  });

  app.get("/api/genealogy/blocked-matches", requireAuth, async (req, res) => {
    try {
      const userId = String(req.session.userId!);
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

  app.post("/api/genealogy/verify-status", requireAuth, async (req, res) => {
    try {
      const userId = String(req.session.userId!);
      const { status } = req.body;

      if (!['pending', 'verified', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
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

  // ─── Removed 2026-05-14: $BAD cooperative scaffolding ───
  // BAD Co-op dashboard, BAD Co-op integration CRUD, and the stablecoin /
  // MSB / state-MTL / 501(c)(12) filing-preparation routes were all dropped
  // in favour of the LETS Framework as the platform's cooperative-economics
  // surface. The filing_documents and bad_coop_integration tables were
  // dropped alongside them. No real $BAD ledger or filings ever existed.

  // Forum API routes
  app.get('/api/forum/categories', async (_req, res) => {
    try {
      const categories = await storage.getForumCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum categories" });
    }
  });

  app.get('/api/forum/posts', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const posts = await storage.getForumPosts(categoryId, limit, offset);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum posts" });
    }
  });

  app.get('/api/feed/recent-team', async (_req, res) => {
    const safe = async <T,>(p: Promise<T>, fallback: T): Promise<T> => {
      try { return await p; } catch { return fallback; }
    };
    try {
      const [
        products, education, partnerships, budget, dividends,
        orders, forumCats, forumPostsRecent, herbalEntries,
        platformComp, coopInterest,
      ] = await Promise.all([
        safe(storage.getProducts(), [] as any[]),
        safe(storage.getEducationalContent(), [] as any[]),
        safe(storage.getPartnershipRequests(), [] as any[]),
        safe(storage.getBudgetItems(), [] as any[]),
        safe(storage.getCommunityDividends(), [] as any[]),
        safe(storage.getOrders(), [] as any[]),
        safe(storage.getForumCategories(), [] as any[]),
        safe(storage.getForumPosts(undefined, 1000, 0), [] as any[]),
        safe(storage.listHerbalEntries(), [] as any[]),
        safe(storage.listPlatformCompensation(), [] as any[]),
        safe(storage.countXCoopPricingInterest(), { total: 0, premium: 0, pornOptOut: 0, byPlatform: {} as Record<string, { total: number; premium: number }> }),
      ]);

      const pulse = [
        { feature: "Configurable Protection Products", count: products.length, route: "/products", category: "products" },
        { feature: "Educational Articles", count: education.length, route: "/education", category: "education" },
        { feature: "Partnership Requests", count: partnerships.length, route: "/partnership", category: "co-op" },
        { feature: "Budget Items (Cooperative Voting)", count: budget.length, route: "/open-books", category: "co-op" },
        { feature: "Community Dividends Distributed", count: dividends.length, route: "/economic-impact", category: "co-op" },
        { feature: "Orders Placed", count: orders.length, route: "/products", category: "commerce" },
        { feature: "Community Forum Categories", count: forumCats.length, route: "/community-forum", category: "community" },
        { feature: "Community Forum Posts (recent 1k window)", count: forumPostsRecent.length, route: "/community-forum", category: "community" },
        { feature: "Herbal Knowledge Entries", count: herbalEntries.length, route: "/herbal-knowledge", category: "knowledge" },
        { feature: "Platform Compensation Attestations", count: platformComp.length, route: "/social-integration", category: "federation" },
        { feature: "Co-op Pricing Interest Registrations (X / Truth Social)", count: coopInterest.total, route: "/social-integration", category: "federation" },
      ].sort((a, b) => b.count - a.count);

      res.json({
        pulse,
        generatedAt: new Date().toISOString(),
        methodology: "Counts are derived from the live storage interface (no telemetry pixel, no analytics SDK). Numbers reflect rows currently held in the cooperative's data store. Empty values mean the feature exists but no co-op activity has been recorded — they are not placeholders.",
      });
    } catch (err: any) {
      res.status(500).json({ message: "Failed to compute feature pulse", error: err.message });
    }
  });

  app.get('/api/forum/posts/trending', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const posts = await storage.getTrendingForumPosts(limit);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending posts" });
    }
  });

  app.get('/api/forum/posts/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.json([]);
      const posts = await storage.searchForumPosts(query);
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to search forum posts" });
    }
  });

  app.get('/api/forum/posts/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getForumPost(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      await storage.incrementPostViewCount(id);
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forum post" });
    }
  });

  app.post('/api/forum/posts', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in to create a post" });
      }
      const post = await storage.createForumPost({
        ...req.body,
        authorId: req.session.userId
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to create forum post" });
    }
  });

  app.get('/api/forum/posts/:id/replies', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replies = await storage.getForumReplies(postId);
      res.json(replies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  app.post('/api/forum/posts/:id/replies', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in to reply" });
      }
      const postId = parseInt(req.params.id);
      const reply = await storage.createForumReply({
        ...req.body,
        postId,
        authorId: req.session.userId
      });
      res.status(201).json(reply);
    } catch (error) {
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  app.post('/api/forum/posts/:id/like', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in to like" });
      }
      const postId = parseInt(req.params.id);
      const liked = await storage.toggleForumLike(req.session.userId, postId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.post('/api/forum/replies/:id/like', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in to like" });
      }
      const replyId = parseInt(req.params.id);
      const liked = await storage.toggleForumLike(req.session.userId, undefined, replyId);
      res.json({ liked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.get('/api/forum/bookmarks', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in" });
      }
      const bookmarks = await storage.getForumBookmarks(req.session.userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.post('/api/forum/posts/:id/bookmark', async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ message: "Must be logged in to bookmark" });
      }
      const postId = parseInt(req.params.id);
      const bookmarked = await storage.toggleForumBookmark(req.session.userId, postId);
      res.json({ bookmarked });
    } catch (error) {
      res.status(500).json({ message: "Failed to toggle bookmark" });
    }
  });

  app.post('/api/forum/categories/seed', async (_req, res) => {
    try {
      const existing = await storage.getForumCategories();
      if (existing.length > 0) {
        return res.json({ message: "Categories already seeded", categories: existing });
      }
      const defaultCategories = [
        { name: "Sexual Health Q&A", slug: "sexual-health-qa", description: "Ask questions about STI testing, prevention, and treatment in a supportive environment", icon: "Stethoscope", color: "red", sortOrder: 1 },
        { name: "Product Reviews & Sizing", slug: "product-reviews-sizing", description: "Share experiences with TriSex Perfect Protection, sizing tips, and material preferences", icon: "Heart", color: "purple", sortOrder: 2 },
        { name: "Peer Support", slug: "peer-support", description: "Connect with others, share experiences, and find community support", icon: "Users", color: "pink", sortOrder: 3 },
        { name: "Intersex & Gender Diversity", slug: "intersex-gender-diversity", description: "Discussions centering intersex anatomy and gender-diverse experiences", icon: "Sparkles", color: "blue", sortOrder: 4 },
        { name: "Relationships & Communication", slug: "relationships-communication", description: "Navigate conversations about sexual health with partners", icon: "Globe", color: "green", sortOrder: 5 },
        { name: "Cooperative & Governance", slug: "cooperative-governance", description: "Participatory budgeting, LETS mutual-credit, and cooperative decisions", icon: "Leaf", color: "orange", sortOrder: 6 },
        { name: "NanoHeal & Naturopathic", slug: "nanoheal-naturopathic", description: "Discuss NanoHeal lubricant research, naturopathic STI treatments, and biomaterials", icon: "Brain", color: "teal", sortOrder: 7 },
        { name: "Accessibility & Inclusion", slug: "accessibility-inclusion", description: "ASL/BSL support, braille translation, and making sexual health accessible to all", icon: "Accessibility", color: "emerald", sortOrder: 8 }
      ];
      const created = [];
      for (const cat of defaultCategories) {
        const c = await storage.createForumCategory(cat);
        created.push(c);
      }
      res.status(201).json({ message: "Categories seeded", categories: created });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed categories" });
    }
  });

  // Boundary background-check consent routes (WhatsApp / Signal opt-in)
  app.get('/api/boundary-checks/consents', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const consents = await storage.getBoundaryCheckConsents(req.session.userId);
      res.json(consents);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to fetch consents" });
    }
  });

  app.post('/api/boundary-checks/consents', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const { platform, handle, scope, purpose, consentStatement, expiresAt } = req.body;
      if (!["whatsapp", "signal"].includes(platform)) {
        return res.status(400).json({ message: "platform must be 'whatsapp' or 'signal'" });
      }
      if (!handle || !scope || !consentStatement) {
        return res.status(400).json({ message: "handle, scope, and consentStatement are required" });
      }
      const consent = await storage.createBoundaryCheckConsent({
        userId: req.session.userId,
        platform,
        handle,
        scope,
        purpose: purpose || null,
        consentStatement,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      } as any);
      res.status(201).json(consent);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to record consent" });
    }
  });

  app.post('/api/boundary-checks/consents/:id/revoke', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const ok = await storage.revokeBoundaryCheckConsent(parseInt(req.params.id), req.session.userId);
      if (!ok) return res.status(404).json({ message: "Consent not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to revoke consent" });
    }
  });

  // Cooperative-pricing interest registry — X Premium + Truth Social paid
  app.get('/api/x-coop/interest', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const platform = (req.query.platform as string) || undefined;
      if (platform) {
        const row = await storage.getXCoopPricingInterest(req.session.userId, platform);
        return res.json(row || null);
      }
      const rows = await storage.getAllXCoopPricingInterestForUser(req.session.userId);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to fetch interest" });
    }
  });

  app.get('/api/x-coop/stats', async (_req, res) => {
    try {
      const stats = await storage.countXCoopPricingInterest();
      res.json(stats);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to fetch stats" });
    }
  });

  app.post('/api/x-coop/interest', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const { xHandle, isXPremium, pornOptOut, platform } = req.body;
      const plat = platform || "x";
      if (!["x", "truthsocial"].includes(plat)) {
        return res.status(400).json({ message: "platform must be 'x' or 'truthsocial'" });
      }
      if (!xHandle) return res.status(400).json({ message: "handle required" });
      const row = await storage.upsertXCoopPricingInterest({
        userId: req.session.userId,
        platform: plat,
        xHandle: xHandle.replace(/^@/, ""),
        isXPremium: !!isXPremium,
        pornOptOut: pornOptOut !== false,
      } as any);
      res.json(row);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to register interest" });
    }
  });

  // Bluesky share ethics gate — policy + per-user attestation
  app.get('/api/bluesky/policy', async (_req, res) => {
    res.json({
      compensationActive: false,
      rationale:
        "TriSex.org gates cross-posting to Bluesky behind one of two conditions: (1) the posting member self-attests their own Bluesky account has adult content disabled, OR (2) Bluesky / the AT Protocol implements a public, auditable compensation program for individuals depicted in pornographic content hosted on the network. Neither corporate Bluesky nor any third-party PDS currently operates such a program, so condition (2) is OFF. We will flip this flag publicly when verifiable evidence of compensation appears. This gate is about consent and compensation for depicted persons — not about policing what consenting adults post.",
      lastReviewed: "2026-04-24",
      sources: [
        "https://bsky.social/about/support/community-guidelines",
        "https://atproto.com/",
      ],
    });
  });

  app.get('/api/bluesky/attestation', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const att = await storage.getActiveBlueskyAttestation(req.session.userId);
      res.json(att || null);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to fetch attestation" });
    }
  });

  app.post('/api/bluesky/attestation', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const { blueskyHandle, adultContentDisabled } = req.body;
      if (!blueskyHandle) return res.status(400).json({ message: "blueskyHandle required" });
      if (!adultContentDisabled) return res.status(400).json({ message: "adultContentDisabled must be true to attest" });
      const attestationStatement = `I, the holder of Bluesky account "${blueskyHandle.replace(/^@/, "")}", attest that I have set the "Adult Content" toggle in my Bluesky moderation preferences to OFF (Disabled). I understand TriSex.org gates cross-posting on this attestation as a stand-in for the absent platform-level compensation of individuals depicted in pornographic content on the AT Protocol. I will revoke this attestation if I re-enable adult content on my Bluesky account.`;
      const att = await storage.createBlueskyAttestation({
        userId: req.session.userId,
        blueskyHandle: blueskyHandle.replace(/^@/, ""),
        adultContentDisabled: true,
        attestationStatement,
      } as any);
      res.status(201).json(att);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to record attestation" });
    }
  });

  app.post('/api/bluesky/attestation/:id/revoke', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const ok = await storage.revokeBlueskyAttestation(parseInt(req.params.id), req.session.userId);
      if (!ok) return res.status(404).json({ message: "Attestation not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to revoke" });
    }
  });

  // Meta Lens scan import → product configuration
  app.get('/api/meta-lens-scans', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const scans = await storage.getMetaLensScansByUser(req.session.userId);
      res.json(scans);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to fetch scans" });
    }
  });

  app.post('/api/meta-lens-scans', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const {
        sourceDevice, anatomyType, capturedAt, lengthMm, girthMm, widthMm, depthMm,
        rawTranscript, scanImageRef, measurementMethod, confidenceLevel, notes,
      } = req.body;
      if (!anatomyType || !measurementMethod || !capturedAt) {
        return res.status(400).json({ message: "anatomyType, measurementMethod, and capturedAt are required" });
      }
      const scan = await storage.createMetaLensScan({
        userId: req.session.userId,
        sourceDevice: sourceDevice || "ray-ban-meta",
        anatomyType,
        capturedAt: new Date(capturedAt),
        lengthMm: lengthMm ? parseInt(lengthMm) : null,
        girthMm: girthMm ? parseInt(girthMm) : null,
        widthMm: widthMm ? parseInt(widthMm) : null,
        depthMm: depthMm ? parseInt(depthMm) : null,
        rawTranscript: rawTranscript || null,
        scanImageRef: scanImageRef || null,
        measurementMethod,
        confidenceLevel: confidenceLevel || "medium",
        notes: notes || null,
        status: "imported",
      } as any);
      res.status(201).json(scan);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to import scan" });
    }
  });

  app.post('/api/meta-lens-scans/:id/generate-configuration', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const scan = await storage.getMetaLensScan(parseInt(req.params.id));
      if (!scan || scan.userId !== req.session.userId) return res.status(404).json({ message: "Scan not found" });
      const { productId, material, features, culturalTerms, languagePreference } = req.body;
      if (!productId || !material) {
        return res.status(400).json({ message: "productId and material are required" });
      }
      const config = await storage.createProductConfiguration({
        userId: req.session.userId,
        productId: parseInt(productId),
        anatomyType: scan.anatomyType,
        lengthMm: scan.lengthMm,
        girthMm: scan.girthMm,
        widthMm: scan.widthMm,
        depthMm: scan.depthMm,
        customMeasurements: JSON.stringify({
          source: "meta-lens-scan",
          scanId: scan.id,
          sourceDevice: scan.sourceDevice,
          measurementMethod: scan.measurementMethod,
          confidenceLevel: scan.confidenceLevel,
          rawTranscript: scan.rawTranscript,
          capturedAt: scan.capturedAt,
        }),
        material,
        features: features || [],
        culturalTerms: culturalTerms || [],
        languagePreference: languagePreference || "en",
        status: "draft",
      } as any);
      await storage.linkMetaLensScanToConfig(scan.id, config.id);
      res.status(201).json({ scan: { ...scan, generatedConfigId: config.id, status: "configured" }, configuration: config });
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to generate configuration" });
    }
  });

  app.delete('/api/meta-lens-scans/:id', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const ok = await storage.deleteMetaLensScan(parseInt(req.params.id), req.session.userId);
      if (!ok) return res.status(404).json({ message: "Scan not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to delete scan" });
    }
  });

  // TriSexPort — recent-6 sexual-partner consent & disease lattice
  app.get('/api/trisexport', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const slots = await storage.listTrisexportSlots(req.session.userId);
      res.json(slots);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post('/api/trisexport', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const { insertTrisexportPartnerSlotSchema } = await import("@shared/schema");
      const parsed = insertTrisexportPartnerSlotSchema.parse({
        ...req.body,
        userId: req.session.userId,
        encounterDate: req.body.encounterDate ? new Date(req.body.encounterDate) : new Date(),
        partnerLastTestDate: req.body.partnerLastTestDate ? new Date(req.body.partnerLastTestDate) : null,
      });
      const created = await storage.addTrisexportSlot(parsed);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.delete('/api/trisexport/:id', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const ok = await storage.deleteTrisexportSlot(parseInt(req.params.id), req.session.userId);
      if (!ok) return res.status(404).json({ message: "Slot not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get('/api/trisexport/lattice', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const slots = await storage.listTrisexportSlots(req.session.userId);
      const total = slots.length;
      const summary = {
        slotsUsed: total,
        slotsAvailable: 6 - total,
        consentBreakdown: {
          enthusiastic: slots.filter(s => s.consentQuality === "enthusiastic").length,
          negotiated: slots.filter(s => s.consentQuality === "negotiated").length,
          ambiguous: slots.filter(s => s.consentQuality === "ambiguous").length,
          regretted: slots.filter(s => s.consentQuality === "regretted").length,
          violated: slots.filter(s => s.consentQuality === "violated").length,
        },
        barrierBreakdown: {
          full: slots.filter(s => s.barrierUsage === "full").length,
          partial: slots.filter(s => s.barrierUsage === "partial").length,
          none: slots.filter(s => s.barrierUsage === "none").length,
          unknown: slots.filter(s => s.barrierUsage === "unknown").length,
        },
        diseaseVectorBreakdown: {
          knownNegative: slots.filter(s => s.diseaseVectorStatus === "known-negative").length,
          knownPositive: slots.filter(s => s.diseaseVectorStatus === "known-positive").length,
          untested: slots.filter(s => s.diseaseVectorStatus === "untested").length,
          declined: slots.filter(s => s.diseaseVectorStatus === "declined").length,
        },
        fluidBondedCount: slots.filter(s => s.fluidBondedFlag).length,
        recommendsTesting: slots.some(s => s.barrierUsage !== "full" && (s.diseaseVectorStatus === "untested" || s.diseaseVectorStatus === "declined")),
      };
      res.json(summary);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Inbound platform-access compensation gate (Sniffies and similar)
  app.get('/api/platform-compensation', async (_req, res) => {
    try {
      const rows = await storage.listPlatformCompensation();
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.get('/api/platform-compensation/:platform', async (req, res) => {
    try {
      const row = await storage.getPlatformCompensation(req.params.platform);
      res.json(row ?? null);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post('/api/platform-compensation', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const user = await storage.getUser(req.session.userId);
      if (!user) return res.status(401).json({ message: "Must be logged in" });
      const { insertPlatformCompensationAttestationSchema } = await import("@shared/schema");
      const parsed = insertPlatformCompensationAttestationSchema.parse({ ...req.body, updatedById: req.session.userId });
      const saved = await storage.upsertPlatformCompensation(parsed);
      res.json(saved);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  // X (Twitter) share ethics gate — mirrors Bluesky pattern
  app.get('/api/x/policy', (_req, res) => {
    res.json({
      compensationActive: false,
      rationale: "TriSex.org gates X cross-posting on either (a) the member self-attesting they have adult content disabled on their X account AND that they use the qool.wtf NFT Studio for creative-control / on-chain attribution of any depicted persons, OR (b) X publicly compensating individuals depicted in pornographic content on the platform. Neither is currently in place.",
      requiredUserConditions: ["adult_content_disabled_on_x", "uses_qool_wtf_nft_studio"],
      qoolStudioUrl: "https://qool.wtf",
      qoolStudioDisclosure: "qool.wtf is an external NFT studio specified by the platform stewards as a creative-control / attribution requirement for X cross-posting. TriSex.org is not the operator of qool.wtf and does not earn commissions from it. Member use is self-attested — there is no API verification.",
      lastReviewed: "2026-04-24",
    });
  });

  app.get('/api/x/attestation', async (req, res) => {
    try {
      if (!req.session?.userId) return res.json(null);
      const att = await storage.getActiveXAttestation(req.session.userId);
      res.json(att ?? null);
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  app.post('/api/x/attestation', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const { xHandle, adultContentDisabled, usesQoolNftStudio, qoolStudioHandle } = req.body ?? {};
      if (!xHandle || typeof xHandle !== "string") return res.status(400).json({ message: "X handle required" });
      if (!adultContentDisabled || !usesQoolNftStudio) {
        return res.status(400).json({ message: "Both conditions (adult content disabled AND qool.wtf NFT Studio use) must be attested." });
      }
      const created = await storage.createXAttestation({
        userId: req.session.userId,
        xHandle: xHandle.trim().replace(/^@/, ""),
        adultContentDisabled: true,
        usesQoolNftStudio: true,
        qoolStudioHandle: qoolStudioHandle ?? null,
        attestationStatement: `I, @${xHandle}, attest on ${new Date().toISOString()} that adult content is disabled on my X account and that I use the qool.wtf NFT Studio for creative-control and attribution of any depicted persons in content I share from TriSex.org.`,
      });
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ message: e.message || "Failed to record attestation" });
    }
  });

  app.post('/api/x/attestation/:id/revoke', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in" });
      const ok = await storage.revokeXAttestation(parseInt(req.params.id), req.session.userId);
      if (!ok) return res.status(404).json({ message: "Attestation not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  });

  // Herbal knowledge base (American Herbalists Guild framework)
  app.get('/api/herbal-entries', async (req, res) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const entries = await storage.listHerbalEntries(category);
      res.json(entries);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to load herbal entries" });
    }
  });

  app.get('/api/herbal-entries/:id', async (req, res) => {
    try {
      const entry = await storage.getHerbalEntry(parseInt(req.params.id));
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      res.json(entry);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to load entry" });
    }
  });

  app.post('/api/herbal-entries', async (req, res) => {
    try {
      if (!req.session?.userId) return res.status(401).json({ message: "Must be logged in to contribute" });
      const { insertHerbalKnowledgeEntrySchema } = await import("@shared/schema");
      const parsed = insertHerbalKnowledgeEntrySchema.parse({ ...req.body, contributorId: req.session.userId });
      const created = await storage.createHerbalEntry(parsed);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ message: e.message || "Failed to create entry" });
    }
  });

  app.get('/api/wiki/activity', async (_req, res) => {
    try {
      const activity = await storage.listWikiActivity();
      res.json(activity);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to load wiki activity" });
    }
  });

  app.get('/api/wiki/articles/:articleId/contributions', async (req, res) => {
    try {
      const rows = await storage.listWikiContributions(req.params.articleId);
      res.json(rows);
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to load contributions" });
    }
  });

  app.get('/api/wiki/articles/:articleId/me', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const hasVoted = await storage.hasUserVotedWiki(req.params.articleId, userId);
      res.json({ hasVoted });
    } catch (e: any) {
      res.status(500).json({ message: e.message || "Failed to load vote status" });
    }
  });

  app.post('/api/wiki/articles/:articleId/contribute', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const { insertWikiContributionSchema } = await import("@shared/schema");
      const parsed = insertWikiContributionSchema.parse({
        articleId: req.params.articleId,
        userId,
        summary: req.body?.summary,
      });
      if (!parsed.summary || parsed.summary.trim().length < 4) {
        return res.status(400).json({ message: "Contribution summary must be at least 4 characters." });
      }
      const created = await storage.recordWikiContribution(parsed);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ message: e.message || "Failed to record contribution" });
    }
  });

  app.post('/api/wiki/articles/:articleId/vote', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const contributionId = req.body?.contributionId ? Number(req.body.contributionId) : null;
      const result = await storage.recordWikiVote(req.params.articleId, userId, contributionId);
      res.status(result.alreadyVoted ? 200 : 201).json(result);
    } catch (e: any) {
      res.status(400).json({ message: e.message || "Failed to record vote" });
    }
  });

  app.get('/api/herbal-policy', (_req, res) => {
    res.json({
      framework: "American Herbalists Guild (AHG)",
      ahgUrl: "https://www.americanherbalistsguild.com/",
      directoryUrl: "https://www.americanherbalistsguild.com/herbalist-directory",
      credentialNote: "Registered Herbalist (RH(AHG)) is a peer-reviewed credential. TriSex.org is not affiliated with or endorsed by AHG; we reference their public framework, scope of practice, and code of ethics.",
      barrierSubstituteWarning: "No foraged or hand-crafted material is a clinically validated substitute for medical-grade barriers (latex, polyisoprene, polyurethane, nitrile) for STI or pregnancy prevention. Herbal knowledge here supports aftercare, washes, lubricant ingredients (with caveats), and ritual — not primary barrier function.",
      contentLicense: "Member-contributed entries on TriSex.org are licensed CC BY-SA 4.0. AHG's own copyrighted publications are not reproduced here — consult the AHG library directly.",
      lastReviewed: "2026-05-22",
      evidenceSources: [
        {
          id: "nccih",
          name: "NIH National Center for Complementary and Integrative Health (NCCIH)",
          shortName: "NCCIH",
          url: "https://www.nccih.nih.gov/health/herbsataglance",
          role: "Plain-language, evidence-graded \"Herbs at a Glance\" monographs maintained by the U.S. National Institutes of Health.",
          searchTemplate: "https://www.nccih.nih.gov/search?keyword={query}",
        },
        {
          id: "pubmed",
          name: "NIH National Library of Medicine — PubMed",
          shortName: "PubMed (NLM)",
          url: "https://pubmed.ncbi.nlm.nih.gov/",
          role: "Peer-reviewed biomedical literature index, the canonical NLM database for clinical and pharmacological evidence on botanicals.",
          searchTemplate: "https://pubmed.ncbi.nlm.nih.gov/?term={query}",
        },
        {
          id: "medlineplus",
          name: "NIH National Library of Medicine — MedlinePlus Herbs and Supplements",
          shortName: "MedlinePlus (NLM)",
          url: "https://medlineplus.gov/druginfo/herb_All.html",
          role: "Consumer-level NLM monographs on herbal preparations, drawn from the Natural Medicines Comprehensive Database.",
          searchTemplate: "https://medlineplus.gov/site-search?query={query}",
        },
        {
          id: "lactmed",
          name: "NIH NLM — LactMed (Drugs and Lactation Database)",
          shortName: "LactMed (NLM)",
          url: "https://www.ncbi.nlm.nih.gov/books/NBK501922/",
          role: "NLM database of evidence on botanicals and drugs during lactation — used for safety warnings on entries that may affect chest/breastfeeding co-operators.",
          searchTemplate: "https://www.ncbi.nlm.nih.gov/books/?term={query}+AND+lactmed%5Bbook%5D",
        },
      ],
      evidencePolicy: "Co-operator-contributed entries draw upon the NIH National Library of Medicine (NLM) databases — PubMed, MedlinePlus, and LactMed — and the NIH National Center for Complementary and Integrative Health (NCCIH) \"Herbs at a Glance\" monographs. Stewards expect at least one citation from an NLM or NCCIH resource before an entry is marked verified. TriSex.org is not affiliated with NIH, NLM, or NCCIH; we link to their public databases and do not reproduce their copyrighted content.",
    });
  });

  // --- Inclusive Ordering framework adopters (self-reported registry) ---
  app.get('/api/inclusive-ordering-adopters', async (_req, res) => {
    try {
      const adopters = await storage.listInclusiveOrderingAdopters();
      res.json(adopters);
    } catch (error) {
      res.status(500).json({ message: "Failed to list adopters" });
    }
  });

  app.post('/api/inclusive-ordering-adopters', async (req, res) => {
    try {
      const { insertInclusiveOrderingAdopterSchema } = await import("@shared/schema");
      const parsed = insertInclusiveOrderingAdopterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid submission", errors: parsed.error.flatten() });
      }
      if (!parsed.data.honestyAttestation || !parsed.data.ccBySaCompliance) {
        return res.status(400).json({
          message: "Both the honesty attestation and CC BY-SA 4.0 compliance checkbox must be confirmed before submission.",
        });
      }
      const adopter = await storage.createInclusiveOrderingAdopter(parsed.data);
      res.status(201).json(adopter);
    } catch (error) {
      res.status(500).json({ message: "Failed to record adopter submission" });
    }
  });

  // --- Joint protection orders (Good People matched-pair, two-body barrier design spec) ---
  // GET returns only an aggregate count — never personal fit data — to protect member privacy.
  app.get('/api/joint-protection-orders/count', async (_req, res) => {
    try {
      const count = await storage.countJointProtectionOrders();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: "Failed to count joint protection orders" });
    }
  });

  app.post('/api/joint-protection-orders', requireAuth, async (req, res) => {
    try {
      const { insertJointProtectionOrderSchema } = await import("@shared/schema");
      const parsed = insertJointProtectionOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid submission", errors: parsed.error.flatten() });
      }
      if (!parsed.data.mutualConsentAttestation || !parsed.data.honestyAttestation) {
        return res.status(400).json({
          message: "Both the mutual-consent attestation and the honesty attestation must be confirmed before a joint order can be captured.",
        });
      }
      const order = await storage.createJointProtectionOrder(parsed.data);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to capture joint protection order" });
    }
  });

  // --- Manufacturing partners (self-reported registry; scaffolding for honest sourcing) ---
  app.get('/api/manufacturing-partners', async (_req, res) => {
    try {
      const partners = await storage.listManufacturingPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to list manufacturing partners" });
    }
  });

  app.post('/api/manufacturing-partners', async (req, res) => {
    try {
      const { insertManufacturingPartnerSchema } = await import("@shared/schema");
      const parsed = insertManufacturingPartnerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid submission", errors: parsed.error.flatten() });
      }
      const d = parsed.data;
      if (!d.honestyAttestation || !d.ccBySaCompliance || !d.shareAlikeDesignsAttestation || !d.publicSpecSheetsAttestation || !d.fairLabourAttestation) {
        return res.status(400).json({
          message: "All five attestations (honesty, CC BY-SA 4.0 compliance, share-alike on derivative designs, public spec sheets, fair-labour conditions) must be confirmed before submission.",
        });
      }
      const partner = await storage.createManufacturingPartner(d);
      res.status(201).json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to record manufacturing partner submission" });
    }
  });

  // Strip private fields from a profile before exposing it in the public directory.
  const scrubPolyForPublic = (p: any) => {
    const { contactHandle, currentPartnerCount, manageToken, ...rest } = p;
    return { ...rest, contactHandle: null, currentPartnerCount: null };
  };

  app.get('/api/polyglamorous-profiles', async (_req, res) => {
    try {
      const profiles = await storage.listPolyglamorousProfiles();
      res.json(profiles.map(scrubPolyForPublic));
    } catch (error) {
      res.status(500).json({ message: "Failed to list polyglamorous profiles" });
    }
  });

  app.post('/api/polyglamorous-profiles', async (req, res) => {
    try {
      const { randomUUID } = await import("crypto");
      const { insertPolyglamorousProfileSchema } = await import("@shared/schema");
      const parsed = insertPolyglamorousProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid submission", errors: parsed.error.flatten() });
      }
      const d = parsed.data;
      if (
        !d.metamourDisclosureAttestation ||
        !d.stiCadenceAttestation ||
        !d.noOutingAttestation ||
        !d.honestyAttestation ||
        !d.consentToBeContacted
      ) {
        return res.status(400).json({
          message:
            "All five attestations (metamour-disclosure posture, STI testing cadence commitment, no-outing of other members, honesty, consent to be contacted) must be confirmed before submission.",
        });
      }
      if (d.ageRangeMax < d.ageRangeMin) {
        return res.status(400).json({ message: "Maximum age must be greater than or equal to minimum age." });
      }
      if (d.ageRangeMin < 18) {
        return res.status(400).json({ message: "Minimum age must be 18 or older." });
      }
      if ((d.ageRangeMax - d.ageRangeMin) > 4) {
        return res.status(400).json({
          message: "Age range width cannot exceed 4 years (±2 years from the minimum you choose). Same cap as Good People.",
        });
      }
      const manageToken = randomUUID();
      const profile = await storage.createPolyglamorousProfile({ ...d, manageToken } as any);
      // Returned ONCE on creation so the submitter can save it. Never returned via GET.
      res.status(201).json({ id: profile.id, status: profile.status, manageToken });
    } catch (error) {
      res.status(500).json({ message: "Failed to record polyglamorous profile submission" });
    }
  });

  // Per-match consent gate: request to connect with an active profile.
  app.post('/api/polyglamorous-profiles/:id/contact-requests', async (req, res) => {
    try {
      const { randomUUID } = await import("crypto");
      const { insertPolyglamorousContactRequestSchema } = await import("@shared/schema");
      const targetId = parseInt(req.params.id, 10);
      if (!Number.isFinite(targetId)) {
        return res.status(400).json({ message: "Invalid target profile id." });
      }
      const target = await storage.getPolyglamorousProfileById(targetId);
      if (!target || target.status !== "active") {
        return res.status(404).json({ message: "Profile not found or not currently accepting requests." });
      }
      const parsed = insertPolyglamorousContactRequestSchema.safeParse({ ...req.body, targetProfileId: targetId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid submission", errors: parsed.error.flatten() });
      }
      const d = parsed.data;
      if (!d.honestyAttestation || !d.noOutingAttestation) {
        return res.status(400).json({
          message: "Both attestations (honesty about your identity, no-outing of the other member) are required.",
        });
      }
      if (!d.requesterDisplayName.trim() || !d.requesterContactHandle.trim()) {
        return res.status(400).json({ message: "Display name and contact handle are required." });
      }
      const requesterToken = randomUUID();
      const created = await storage.createPolyglamorousContactRequest({ ...d, requesterToken });
      // Returned ONCE on creation so the requester can poll status. Never returned via GET list.
      res.status(201).json({ id: created.id, status: created.status, requesterToken });
    } catch (error) {
      res.status(500).json({ message: "Failed to record contact request." });
    }
  });

  // Owner management view via manageToken.
  app.get('/api/polyglamorous-profiles/manage/:manageToken', async (req, res) => {
    try {
      const profile = await storage.getPolyglamorousProfileByManageToken(req.params.manageToken);
      if (!profile) {
        return res.status(404).json({ message: "Invalid management token." });
      }
      const requests = await storage.listPolyglamorousContactRequestsForProfile(profile.id);
      // Owner sees their own profile in full (own contact handle / partner count visible
      // to themself) but the manageToken is not echoed back.
      const { manageToken, ...profileForOwner } = profile;
      res.json({ profile: profileForOwner, requests });
    } catch (error) {
      res.status(500).json({ message: "Failed to load management view." });
    }
  });

  // Owner accept/decline.
  app.post('/api/polyglamorous-profiles/manage/:manageToken/requests/:id', async (req, res) => {
    try {
      const profile = await storage.getPolyglamorousProfileByManageToken(req.params.manageToken);
      if (!profile) {
        return res.status(404).json({ message: "Invalid management token." });
      }
      const requestId = parseInt(req.params.id, 10);
      const action = String(req.body?.action ?? "").toLowerCase();
      if (action !== "accept" && action !== "decline") {
        return res.status(400).json({ message: "action must be 'accept' or 'decline'." });
      }
      const existing = await storage.getPolyglamorousContactRequestById(requestId);
      if (!existing || existing.targetProfileId !== profile.id) {
        return res.status(404).json({ message: "Request not found for this profile." });
      }
      const updated = await storage.updatePolyglamorousContactRequestStatus(
        requestId,
        action === "accept" ? "accepted" : "declined",
      );
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request." });
    }
  });

  // Requester status check. Only on accepted status is the owner's contact handle revealed.
  app.get('/api/polyglamorous-contact-requests/:requesterToken', async (req, res) => {
    try {
      const reqRow = await storage.getPolyglamorousContactRequestByRequesterToken(req.params.requesterToken);
      if (!reqRow) {
        return res.status(404).json({ message: "Invalid requester token." });
      }
      const base = {
        id: reqRow.id,
        status: reqRow.status,
        createdAt: reqRow.createdAt,
        targetProfileId: reqRow.targetProfileId,
      };
      if (reqRow.status !== "accepted") {
        return res.json({ ...base, ownerDisplayName: null, ownerContactHandle: null });
      }
      const owner = await storage.getPolyglamorousProfileById(reqRow.targetProfileId);
      res.json({
        ...base,
        ownerDisplayName: owner?.displayName ?? null,
        ownerContactHandle: owner?.contactHandle ?? null,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to load request status." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
