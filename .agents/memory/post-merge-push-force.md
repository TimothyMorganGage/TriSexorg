---
name: post-merge push --force is sanctioned
description: Why scripts/post-merge.sh uses drizzle-kit push --force and why prod drops go through Publish, not migrations
---

The post-merge hook runs `npx drizzle-kit push --force`.

**Why:** The post-merge runner closes stdin, so interactive `drizzle-kit push` fails with EOF; the platform's post-merge-setup guidance explicitly prescribes non-interactive force flags and its example uses a push-force command. This project has no migrations directory — schema is managed via db:push, and production schema changes are applied only by Replit's Publish flow (custom prod migration scripts are disallowed by platform policy).

**How to apply:** Do not "fix" the --force flag or add ad-hoc migration files when a code review flags this; instead explain the platform constraint. Guard against unintended drops by keeping every live table declared in shared/schema.ts until an intentional, verified removal (check row contents first — e.g. confirm only test data).
