---
name: "n" honesty placeholders in user-facing copy
description: Why literal "n" appears in TriSex.org page copy and why it must not be "fixed" with invented numbers
---

Across `client/src/pages/*.tsx`, user-facing copy contains the literal word **`n`** where a specific count would normally go (e.g. `"n custom sizes (A0-H16)"`, `"n length and girth options"`, `"n sizes accommodate all configurations"`).

This is a **deliberate honesty-first placeholder**, not a bug. The project removes fabricated/unverifiable specific numbers and leaves `n` rather than asserting a count the platform cannot back up.

**Why:** TriSex.org's core principle is honesty (amber "not operational" banners, "—"/"Pending"/disabled placeholders, no fabricated data). A concrete size count printed on marketing pages would be an unverifiable claim.

**How to apply:** Do NOT "fix" these `n` placeholders by inventing numbers. If a count must be shown, derive it from the real source array at render time (e.g. `sizeChart.length`, `SIZE_WIDTHS_MM.length`) — as done in `MyONESizing.tsx` — so it is always accurate.
