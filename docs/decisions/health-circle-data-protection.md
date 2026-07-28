# Data Protection Review: Shared Health Circle & Partner-Health Data

**Date:** 2026-07-28
**Status:** Reviewed & partially enforced (see "What is enforced today")
**Scope:** `partner_networks`, `partner_connections` (incl. Health Circle fields), `sti_tracking_events`, `partner_notifications`

## Context

The Shared Health Circle decision doc flagged that partner/STI data has no
encryption-at-rest beyond the database default and that `dataRetentionDays`
(default 90) was a soft field with no enforcement. This review classifies every
sensitive field and states what is enforced now vs. required before persistence.

**Storage reality check:** today only `users` (and sessions) live in Postgres.
Partner networks, connections, and STI events live in `MemStorage` (in-memory)
and are wiped on restart. That means there is currently *no* durable at-rest
copy of circle/STI data to encrypt — the real encryption decision lands with
the persistence work ("Keep health-circle contacts after a server restart").
This review sets the requirements that work must meet.

## Field-level classification

### `partner_networks`
| Field | Sensitivity | Decision |
|---|---|---|
| `networkName`, `privacyLevel`, `consentGiven`, `dataRetentionDays` | Low | Plaintext OK |
| `emergencyContactId` | Medium (links two identities) | Plaintext OK; never exposed to anyone but the owner |

### `partner_connections` (circle contacts)
| Field | Sensitivity | Decision |
|---|---|---|
| `contactLabel`, `contactNickname` | **High** — free text can identify a real person and imply a sexual relationship | **Encrypt at rest** (field-level) when persisted |
| `barrierPosture`, `cadenceCommitment`, `contactKind`, `relationshipStatus` | High — sexual-behavior data | **Encrypt at rest** when persisted |
| `lastTestDate`, `lastContact` | High | **Encrypt at rest** when persisted |
| `partnerUserId`, `mutualConsent` | High (account linkage) | Plaintext (needed for joins/consent checks) but access strictly owner-scoped; already enforced in routes via circle-ownership checks |
| `partnerAnonymousId` | Medium | Keep — it exists *for* minimization |
| `connectionStrength`, `notificationPreferences` | Medium | Encrypt with the rest of the record when persisted |

### `sti_tracking_events`
| Field | Sensitivity | Decision |
|---|---|---|
| `stiType`, `testResult`, `severityLevel`, `symptomsReported`, `treatmentProtocol` | **Highest** — STI status/medical data | **Encrypt at rest** when persisted; anonymized after retention window (enforced now) |
| `testingLocation`, `geographicArea`, `exposureTimeframe` | High — can deanonymize | **Minimized at ingestion** (enforced now): length-capped, `geographicArea` documented as coarse region only, never a street address |
| `eventType`, `eventDate` | Medium — kept after anonymization as the bare recency signal cadence tracking needs | Plaintext OK |
| `partnerNotificationStatus`, `isAnonymized`, `publicHealthReported` | Server-controlled | **Client can no longer set these** (enforced now via whitelist schema) |

### `partner_notifications`
Exposure messages are sensitive; rows are **deleted outright** once `expiresAt`
passes (enforced now by the retention sweep).

## What is enforced today

1. **Input minimization** — `POST /api/sti-tracking` now validates against
   `stiTrackingEventInputSchema` (shared/schema.ts): whitelisted fields only,
   enum-constrained `eventType`/`testResult`, length caps on all free text,
   and server-controlled fields (`userId`, `isAnonymized`,
   `publicHealthReported`, `partnerNotificationStatus`) stripped from client input.
2. **Retention enforcement** — `storage.enforceHealthDataRetention()` runs at
   startup and every 6 hours (server/index.ts). STI events older than the
   owner's `dataRetentionDays` (shortest across their circles; default 90) are
   anonymized in place: all sensitive detail fields nulled, keeping only
   `eventType` + `eventDate` so testing-cadence status still derives. Expired
   partner notifications are purged.
3. **Log minimization** — `/api/health-circle` and `/api/partner-networks`
   responses are excluded from request logging (server/index.ts sensitive-endpoint
   list), alongside `/api/sti-tracking`.
4. **Access scoping** (pre-existing, verified) — every health-circle and
   STI route checks ownership of the circle/event; result sharing requires
   mutual consent and an account link, and is per-event explicit.

## Requirements for the persistence task (must land together)

- Field-level encryption (AES-256-GCM) for the fields marked "Encrypt at rest"
  above, keyed from a dedicated secret (NOT `SESSION_SECRET`; request a new
  `HEALTH_DATA_ENCRYPTION_KEY`), with the key id stored beside the ciphertext
  to allow rotation.
- The retention sweep must move from map iteration to SQL (`UPDATE`/`DELETE`
  with the same anonymization shape) — the enforcement contract stays identical.
- No plaintext sensitive fields may appear in indexes or logs.

## Honesty note

The privacy policy previously claimed separate encryption keys, isolated
databases, and quarterly key rotation for sexual-health data. None of that was
true. The policy has been rewritten to describe actual current handling and to
distinguish "enforced today" from "committed before persistence ships".
