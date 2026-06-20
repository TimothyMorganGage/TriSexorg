---
name: Genealogy incest-screening
description: How the GEDCOM biological-relatedness screening actually works and its honest pre-launch limits
---

# Genealogy biological-relatedness screening

The incest-prevention screening lives in `server/genealogy.ts` (parser + relationship math) and the `/api/genealogy/*` routes.

## Threshold
- Rule: partners blocked if closer than **3rd cousin**. In this model `cousin number = degree - 1`, so 3rd cousin == degree 4. `isRelationshipAllowed` allows `degree >= 4`.
- The relationship-name lookup array maps degree 2 -> "1st cousin", degree 4 -> "3rd cousin".

## How detection works
- The GEDCOM parser builds the family graph from **FAM records** (HUSB/WIFE/CHIL), not just INDI names. Earlier it only read INDI names, so parent/child links were never populated and the screen was a silent no-op that allowed everyone.
- `rootPerson` (the uploader / home person whose ancestors are walked) is resolved to the **first INDI** in the file — a convention, not guaranteed. A real home-person picker is a pre-launch TODO.
- Two users are flagged related when an ancestor in one uploaded tree name-matches an ancestor in the other (`isLikelyMatch`: same name, or birth years within 2). Cross-tree matching is inherently name-based.

## Honest limits (do not fabricate around these)
- Person-to-person matching is **pre-launch / simulated / empty** — Good People shows no real members, `partner_connections` is a MemStorage mock, and `partnership_requests` is B2B orgs. There is **no persisted match-creation route to gate yet**. When one is added, enforce `isRelationshipAllowed` server-side at that write boundary.
- **Why:** building enforcement on a nonexistent matching backend would fabricate functionality, violating the platform's honesty-first principle.
- Genealogy data is stored in an in-memory `Map` (wiped on restart) + the uploaded file on disk; it is **not encrypted**. UI copy must not claim encryption, Gramps, or GEDmatch integration — none exist.
- All `/api/genealogy/*` routes are `requireAuth` and derive the acting user from `req.session.userId` (String()) — never trust a client-supplied userId.
