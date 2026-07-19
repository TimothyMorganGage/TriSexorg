---
name: WebAuthn behind Replit proxy
description: Origin/rpID derivation for passkey verification requires trust proxy
---
Passkey (WebAuthn) verification derives expectedOrigin/rpID from the request. Behind Replit's HTTPS proxy, Express reports `http` unless `app.set("trust proxy", 1)` is set, which makes origin checks fail on deployed domains even when the browser ceremony is valid.
**Why:** Architect review caught this before deployment; localhost testing never surfaces it.
**How to apply:** Any request-derived origin/host logic (WebAuthn, OAuth callbacks, secure cookies) needs trust proxy enabled and should be smoke-tested with X-Forwarded-Proto/Host headers.
