# Product Decision: Multi-Partner Health Feature ("Shared Health Circle")

**Date:** 2026-07-28
**Status:** Decided
**Decision: YES — build a private "Shared Health Circle" feature, framed as personal health logistics, not relationship identity.**

## Context

The Polyglamorous People page (removed 2026-07-28 at the team's request) was a **public matchmaking directory** built around non-monogamy *identity and disclosure*: relationship-structure labels (solo-poly, relationship-anarchy, etc.), metamour disclosure preference, polycule visibility, veto posture, and a per-match consent gate for contact-handle exchange. Its `polyglamorous_profiles` / `polyglamorous_contact_requests` tables remain declared in `shared/schema.ts` only so `db:push` doesn't drop them (removal is tracked separately in Task #3).

The new question is different and simpler: many users have **concurrent sexual-health relationships** — a spouse, a partner, a close contact — without identifying with polyamory community framing. They need health *logistics*, not community *identity*. Should the app serve them?

## Why yes

1. **The need is health-practical, not identity-based.** Per-contact STI testing cadence, barrier posture, and last-test recency are core sexual-health hygiene for anyone with more than one contact — including serially monogamous users with an overlapping transition period. Refusing to model >1 contact would make the app quietly dishonest about how real testing cadence works.
2. **The platform already half-commits to this.** `partner_networks`, `partner_connections`, and `sti_tracking_events` (shared/schema.ts, "4D STI Tracking" section) and the `/partner-sti-tracking` page already model multi-partner networks with per-connection type, status, and notification preferences. README and replit.md both advertise "sexual partner network management." The decision is really *whether to finish and humanize an existing capability*, not whether to add a new one.
3. **It fills the gap the removal created without recreating the removed surface.** Good People stays monogamy-only by design; the poly directory is gone. Users in between (spouse + partner, no community label) currently have no honest home. A private circle serves them with zero public surface area.

### Scoping guardrails (the "no" parts)
- **No directory, no matchmaking, no discovery.** Nothing about a circle is ever listed, searchable, or visible to other members. This is the single biggest differentiator from the removed page.
- **No relationship-structure taxonomy.** No solo-poly/hierarchical/kitchen-table/DADT vocabulary. Contacts are just labeled by the user in their own words ("spouse", "partner", "J.").
- **No outing risk by construction.** Contacts are user-entered records, not linked accounts, by default. Linking a contact to a real account is optional and requires that account's explicit acceptance (mutual-consent flag already exists on `partner_connections`).

## Brief spec

**Working name:** Shared Health Circle (surface it on/alongside the existing `/partner-sti-tracking` page rather than a new nav entry).

### Data captured (per user, private)
- **Circle** — one implicit circle per user (reuse `partner_networks`; drop the multi-network UI complexity — users think "my contacts", not "my networks").
- **Contact** (reuse/extend `partner_connections`):
  - User-chosen label + optional nickname (free text; no structure taxonomy)
  - Contact kind: `ongoing` | `occasional` | `past` (simplify existing `relationshipStatus`)
  - Barrier posture with this contact: `always` | `sometimes` | `fluid-bonded` | `prefer-not-to-say`
  - Optional link to a real user account, gated on mutual consent (existing `mutualConsent`)
- **Per-contact testing cadence** (new fields on the connection):
  - Cadence commitment: `every-3-months` | `every-6-months` | `every-12-months` | `after-new-contact` (mirrors the vocabulary the removed page used, but *per contact* instead of one public profile-level attestation)
  - Last shared/verified test date (self-reported)
  - Derived "next test due" + overdue indicator; optional reminder

### STI testing cadence tracking per contact
- Each contact's cadence + last-test date yields a due date; the circle view shows a simple per-contact status: current / due soon / overdue / unknown.
- Test events keep flowing through the existing `sti_tracking_events` table; a new test event updates recency across all contacts at once.
- No results are ever shared automatically; sharing a result with a linked contact is an explicit per-event action (aligns with existing `partnerNotificationStatus`).

### How this differs from the removed Polyglamorous People page
| | Removed page | Shared Health Circle |
|---|---|---|
| Purpose | Public matchmaking directory | Private health logistics |
| Visibility | Listed publicly (scrubbed fields) | Never visible to anyone but the owner (+ mutually-consented links) |
| Framing | Poly community identity & vocabulary | Neutral; user's own labels |
| Attestations | 5 public attestations | None public; nothing to attest to strangers |
| STI cadence | One profile-level public commitment | Per-contact private cadence + due tracking |
| Contact exchange | Token-gated request/accept flow | No contact exchange at all |

### Out of scope
- Any public or member-visible surface; any discovery/matching
- Encryption-at-rest upgrade and data-retention hardening (should be evaluated before launch, given sensitivity — the existing `dataRetentionDays` default of 90 is a good instinct to keep)
- Migrating/removing the archived polyglamorous tables (Task #3)
