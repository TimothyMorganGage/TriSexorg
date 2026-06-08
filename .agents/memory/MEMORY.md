# Memory Index

- [db:push is unsafe to run blind](db-push-drift.md) — schema drifts from DB (MemStorage app) + orphan connect-pg `session` table → false rename prompts; create single tables via SQL.
- [Two parallel auth systems](dual-auth-setup.md) — custom email/pw (`users`) + Replit Auth (`auth_users`) share ONE session; cookie sameSite must stay 'lax' for OIDC.
