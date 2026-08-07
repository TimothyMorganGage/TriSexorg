---
name: Hybrid storage model
description: Why user accounts are DB-backed while the rest of storage is in-memory
---
# Hybrid storage: users in Postgres, everything else in memory

`server/storage.ts` exports `storage = new MemStorage()`. Despite the name,
**user accounts, forums, and the health-circle entities (partner networks,
partner connections, STI tracking events)** are **DB-backed** (Drizzle/Postgres).
Other entities (products, orders, etc.) remain in-memory and are wiped on
restart. Partner *notifications* are still in-memory.

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
