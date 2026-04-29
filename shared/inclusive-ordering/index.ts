/**
 * TriSex.org Inclusive Ordering Framework — public API
 *
 * Licence: CC BY-SA 4.0 (Creative Commons Attribution-ShareAlike 4.0 International).
 * Source of truth: https://trisex.org  (this codebase, file://shared/inclusive-ordering/)
 *
 * The Inclusive Ordering Framework is the data + types + UX vocabulary used by
 * TriSex.org to fit protection products to anatomical diversity, with intersex
 * anatomy as the universal baseline. This barrel re-exports the framework's
 * stable public surface so other apps (or other surfaces of this app) can adopt
 * the same data model and naming without depending on internal file paths.
 *
 * What is in this framework:
 *
 *   1. CATALOGUE — 86 named intersex variations grouped into 8 categories
 *      (sex-chromosome, 46xx-dsd, 46xy-dsd, gonadal-dysgenesis, external-genital,
 *      internal-canal, endocrine-presentation, post-surgical), each mapped to
 *      relevant contact zones and a fitting note.
 *
 *   2. FITTING PARAMETERS — a controlled vocabulary of per-variation fitting
 *      controls (sliders, selects, switches, free-text) with defaults derived
 *      from the variation's relevant zones and consult-required flag.
 *
 *   3. SEX-MARKER ASSIGNMENT — a derivation of recorded birth assignment
 *      (AMAB / AFAB / AXAB) per variation, with explicit overrides for
 *      phenotype-divergent entries and per-marker honesty blurbs. Variations
 *      assigned across more than one marker appear under each.
 *
 *   4. MULTI-USE BALANCE — the persisted shape of an inclusive order
 *      (role balance, contact zones, procreative mode, intersex variations,
 *      per-variation custom parameters, fold-state index). Persisted on the
 *      `orders.multi_use_balance` JSON column.
 *
 * Honesty rules baked into the framework:
 *
 *   - Sex-marker grouping is recorded birth assignment, not anatomy.
 *   - AXAB ("Assigned X / Intersex At Birth") is legal in only some jurisdictions.
 *   - Variation counts per marker are intentional groupings, not clinical stats.
 *   - Fitting notes are design hypotheses for protection sizing, never medical
 *     advice or efficacy claims.
 *   - Selection is self-reported only — no biometric verification is implied.
 *
 * Adopter checklist (what an app needs to claim "powered by Inclusive Ordering"):
 *
 *   - Use the canonical 86-variation catalogue (or a documented subset/superset
 *     with the same identifier scheme).
 *   - Preserve the AMAB/AFAB/AXAB marker triad with the same overlap semantics.
 *   - Surface the same honesty notes (paraphrasing allowed; meaning preserved).
 *   - Honour the CC BY-SA 4.0 licence: attribute "TriSex.org Inclusive Ordering
 *     Framework" and share derivative data under the same licence.
 *   - Self-report adoption at /inclusive-ordering-registry on this app.
 */

export {
  // --- Catalogue ---
  INTERSEX_VARIATIONS,
  INTERSEX_CATEGORIES,
  // --- Fitting parameters ---
  FITTING_PARAMS,
  getApplicableParams,
  getDefaultCustomization,
  // --- Sex-marker assignment ---
  ASSIGNMENT_MARKERS,
  getAssignmentMarkers,
  countVariationsByMarker,
} from "../../client/src/data/intersex-variations";

export type {
  ContactZoneId,
  IntersexVariation,
  IntersexCategoryId,
  FittingParamId,
  FittingParamValue,
  FittingParamSpec,
  AssignmentMarker,
} from "../../client/src/data/intersex-variations";

// Multi-use balance (the persisted order shape) is sourced from the canonical
// Drizzle schema so adopters serialising to PostgreSQL stay byte-compatible.
export {
  multiUseBalanceSchema,
} from "../schema";

export type {
  MultiUseBalance,
} from "../schema";

export const INCLUSIVE_ORDERING_FRAMEWORK_VERSION = "1.0.0" as const;
export const INCLUSIVE_ORDERING_FRAMEWORK_LICENCE = "CC BY-SA 4.0" as const;
export const INCLUSIVE_ORDERING_FRAMEWORK_SOURCE_OF_TRUTH = "https://trisex.org" as const;

export type AdoptedSurface =
  | "catalogue"           // 86-variation catalogue
  | "marker-filter"       // AMAB/AFAB/AXAB filter
  | "fitting-params"      // FITTING_PARAMS controls
  | "multi-use-balance"   // persisted order shape
  | "fold-sequence"       // origami fold-state index
  | "schema";             // shared/schema.ts orders table

export const ADOPTED_SURFACES: ReadonlyArray<{ id: AdoptedSurface; label: string; description: string }> = [
  { id: "catalogue", label: "86-variation catalogue", description: "The full named-variation list with categories, relevant zones, and fitting notes." },
  { id: "marker-filter", label: "AMAB/AFAB/AXAB marker filter", description: "Sex-marker grouping with overlap semantics and honesty blurbs." },
  { id: "fitting-params", label: "Per-variation fitting parameters", description: "Controlled vocabulary of sliders, selects, switches, and free-text inputs." },
  { id: "multi-use-balance", label: "Multi-use balance order shape", description: "Persisted JSON shape covering role balance, contact zones, procreative mode, variation customisations." },
  { id: "fold-sequence", label: "Origami fold-state sequence", description: "Inclusive multi-use fold sequence allowing one unit to serve multiple acts." },
  { id: "schema", label: "Drizzle schema (orders + multi-use balance)", description: "Direct adoption of the canonical PostgreSQL table shapes." },
];
