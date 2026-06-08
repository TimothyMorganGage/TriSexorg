---
name: db:push is unsafe to run blind on this repo
description: Why `npm run db:push` prompts interactively / can be destructive here, and the safe alternative
---

`npm run db:push` (drizzle-kit) is NOT safe to run non-interactively on this repo.

**Why:** The running app serves seeded content from in-memory `MemStorage` (server/storage.ts), so the Postgres DB has drifted from `shared/schema.ts` — some schema tables are missing from the DB while others exist. Additionally, `connect-pg-simple` creates a `session` table at runtime that is NOT defined in the Drizzle schema. drizzle-kit sees `session` as an orphan to drop and pairs it with any new schema table, producing a false "rename table?" interactive prompt. Answering wrong renames/drops the live `session` table (logs everyone out) and a full push can alter real DB-backed tables (e.g. `forum_categories`).

**How to apply:** To add a single new table, create it directly with `CREATE TABLE IF NOT EXISTS ...` via SQL, matching the Drizzle column definition exactly, instead of running `db:push`. Only `forum_categories` and `session` are truly DB-backed for the live app; everything else is MemStorage.
