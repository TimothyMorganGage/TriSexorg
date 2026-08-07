---
name: Partner-health data protection contract
description: Retention/minimization guarantees for circle + STI data and what must hold when persistence lands
---

The privacy policy now makes only claims the code actually enforces (retention sweep, input whitelisting, owner-only access, log redaction). Do not re-add aspirational security claims ("separate keys", "isolated databases") — they were deliberately removed as dishonest.

**Rules:**
- STI events past a circle's `dataRetentionDays` (default 90) are anonymized in place, keeping only `eventType` + `eventDate` so testing-cadence status still derives. A sweep runs at startup and every 6h.
- STI event writes go through a whitelist schema; client can never set server-controlled fields (`isAnonymized`, `publicHealthReported`, notification status).
- When circle/STI data moves from MemStorage to Postgres, field-level AES-256-GCM encryption of the sensitive fields (labels, barrier posture, cadence, test data) is a committed precondition, keyed from a dedicated secret (not SESSION_SECRET). Full field classification: `docs/decisions/health-circle-data-protection.md`.

**Why:** Data is sexual-health/STI status — highest sensitivity; policy honesty was an explicit task requirement.

## Account-link invite flow
Contact↔account linking is invite/accept only (no discovery). The invite endpoint answers identically whether or not the email matches an account (anti-enumeration); invitees see only the inviter's username, never contact-record contents. Either side can unlink, which resets partnerUserId + mutualConsent.
**Why:** the platform promises circles are never listed or searchable; any differing response on email lookup becomes a user directory.
**How to apply:** keep responses uniform on the invite route and keep invite/link payloads minimal when extending the flow.
