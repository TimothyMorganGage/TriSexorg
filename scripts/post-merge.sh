#!/bin/bash
# Post-merge setup: runs automatically after a task merge.
# Must be idempotent, non-interactive, and fail fast.
set -e

# Install any dependencies added by the merged task.
npm install --no-audit --no-fund

# Apply schema changes non-interactively.
# Note: plain `npm run db:push` (drizzle-kit push) is interactive; --force
# auto-accepts. Keep all existing tables declared in shared/schema.ts —
# drizzle will otherwise try to drop them (see .agents/memory).
npx drizzle-kit push --force
