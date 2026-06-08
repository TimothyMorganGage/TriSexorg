---
name: Two parallel auth systems coexist
description: How custom email/password auth and Replit Auth share one session and avoid table collisions
---

The app runs TWO auth systems in parallel (by user choice — keep both):
- Custom email/password: integer-id `users` table, `req.session.userId`, store in `server/storage.ts`.
- Replit Auth ("Log in with Replit"): OIDC via passport, varchar-id table namespaced as `auth_users` (NOT `users`, to avoid collision), in `shared/models/auth.ts` (exported as `authUsers`/`AuthUser`).

**Why:** Both blueprints want a `users` table; only one can own that name. Two `express-session` middlewares would also fight over the cookie.

**How to apply:**
- ONE session middleware lives in `server/index.ts`. The Replit Auth `setupAuth` was edited to NOT mount its own session (`getSession` removed) — it reuses the existing one.
- Session cookie `sameSite` MUST stay `'lax'` (not `'strict'`) or the OIDC redirect back to `/api/callback` drops the session cookie and login fails.
- Replit Auth routes: `/api/login`, `/api/logout`, `/api/callback`, `/api/auth/user`. Custom auth routes are under `/api/auth/login|register|me|logout`.
