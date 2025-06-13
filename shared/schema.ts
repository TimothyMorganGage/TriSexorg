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
  category: text("category").notNull(),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const productConfigurations = pgTable("product_configurations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  size: text("size").notNull(), // small, medium, large
  material: text("material").notNull(), // ocean_plastic_hydrogel, natural_blend
  features: text("features").array(), // enhanced_lubrication, durability_coating, textured_surface
  customMeasurements: text("custom_measurements"), // JSON string for detailed measurements
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
