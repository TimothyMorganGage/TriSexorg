---
name: Hybrid storage model
description: Why user accounts are DB-backed while the rest of storage is in-memory
---
# Hybrid storage: users in Postgres, everything else in memory

`server/storage.ts` exports `storage = new MemStorage()`. Despite the name, the
**user-account methods** (`getUser`, `getUserByUsername`, `getUserByEmail`,
`createUser`, `getUsersByRole`) are intentionally **DB-backed** (Drizzle on the
`users` table). All other entities (products, orders, forum, etc.) remain
in-memory and are wiped on restart.

**Why:** The user asked to "preserve my account ... with the unified account
types." MemStorage wiped all accounts on every restart. Rather than rewrite the
entire 3400-line storage layer to Postgres, only accounts were made durable —
that is the part that must survive restarts (logins). Sessions already persist
via `connect-pg-simple`.

**How to apply:**
- `createUser` force-sets `role: "cooperator"` (unified single-tier model; no
  admin/consumer/clinic_staff). Don't reintroduce role-based gating — access is
  gated only on being signed in.
- `normalizeUserRoles()` runs at startup (called in `server/index.ts`) and rewrites
  any non-`cooperator` role to `cooperator`. Safe to run every boot.
- If you add new persistent entities, decide deliberately: in-memory (ephemeral
  demo data) vs Postgres (must survive restart). Don't assume MemStorage = memory
  for everything.
