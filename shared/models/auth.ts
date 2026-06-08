import { sql } from "drizzle-orm";
import { jsonb, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

// User storage table for Replit Auth ("Log in with Replit").
// Namespaced as "auth_users" so it can coexist with the app's existing
// integer-id email/password `users` table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const authUsers = pgTable("auth_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertAuthUser = typeof authUsers.$inferInsert;
export type AuthUser = typeof authUsers.$inferSelect;
