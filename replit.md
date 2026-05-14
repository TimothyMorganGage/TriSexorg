# TriSex.org

## Overview
TriSex.org is a full-stack web application focused on personalized sexual health protection for the 2SLGBTIQA+ community, emphasizing reproductive justice. It provides custom-fit products, educational resources, peer mentoring, and community analytics. The platform aims to empower users and foster a supportive community, aspiring to be a leader in inclusive sexual health technologies.

## Removed Surfaces
-   **$TRISEXORG stablecoin (removed 2026-05-01).** The dedicated `/trisex-stablecoin` page, wallet UI, dividend math, time-to-coin conversion, send dialog, USDC/DAI withdrawal copy, $1-USD-backed reserve claims, nav/footer links, home hero badge, peer-mentor "earn stablecoin dividends" copy, wiki dividend reference, LETS-framework cross-LETS clearing-token section, analytics "Stablecoin Dividend Distribution" card with its fabricated 708 hrs / $142.10 / 1.34x / 18% figures, the newsletter dividend card with its fabricated $18,472 / $156.80 / 4,234 hrs / 1.34x / $4.27 figures, the Terms-of-Service "Stablecoin dividends (USDC, DAI)" payment-method line, the BetaDisclaimer fork pitch and Coins badge, the FediverseShare/Hylo $TRISEXORG governance reference, and the cooperative-governance forum-category $TRISEXORG description were all removed. `TimeBank.stablecoinValue` + `pendingDividends` fields, the `calculateDividend` helper, and good-people's `trisexBalance` form field plus its "$TRISEXORG penalties" violation copy were dropped. **The $BAD filing-preparation system is intentionally retained** because it is real legal/compliance tooling for cooperative incorporation (FinCEN MSB / state MTL / 501(c)(12) prep), not speculative currency UI. No real $TRISEXORG ledger ever existed.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application uses a modern full-stack architecture with a focus on accessibility and user experience.

### Frontend
-   **Frameworks**: React, Vite, Wouter for routing.
-   **State Management**: TanStack Query for server state, React hooks for local state.
-   **UI**: shadcn/ui built on Radix UI primitives, styled with Tailwind CSS.

### Backend
-   **Server**: Express.js REST API in TypeScript for business logic and database interactions.

### Database
-   **Type**: PostgreSQL.
-   **ORM**: Drizzle ORM with Neon serverless driver.

### Authentication
-   Custom session-based system supporting multiple user roles (consumer, clinic_staff, admin).

### Shared Components
-   TypeScript with shared schemas ensures data consistency across frontend and backend.

### Key Features
-   Multi-role user system and order management for configurable protection products with custom sizing based on natural senses profiling.
-   Categorized educational content and a partnership request system.
-   Cooperative financial tracking and community features.
-   Mood and wellness tracking.
-   4D STI tracking and sexual partner network management.
-   Wiki on sexual addiction and withdrawal with product recommendations.
-   Progressive dating stages with mandatory sexual health safety protocols.
-   Cross-platform notification system.
-   Mentor/facilitator co-editing with multi-platform messaging and healthcare system connectivity (MyChart, Apple Health).
-   Deaf and braille translation services with ASL/BSL support.
-   Calendar integration (Google, iCal, Outlook, pureOS).
-   Open-source age verification and comprehensive parental consent.
-   Genealogical verification (GEDCOM) to prevent incest within 8 degrees of cousinship.
-   Intersex-centered sizing system as the anatomical baseline for all products.
-   Monogamy economics page and platform policy exclusivity for monogamous relationships.
-   Dedicated oral barriers for MSM product page, democratically owned by MSM "sides" cooperative.
-   Comprehensive guides for endosex women with MSM partners and multidimensional value of gay sex byproducts (Gaynal Condoms).
-   Federated syndication system for content distribution across decentralized social networks (Mastodon, Bluesky, Pixelfed, Loops), including ethical gates for Bluesky and X (Twitter) cross-posting.
-   "Remix to Replit" feature for user-created platform copies.
-   Community Forum for peer support, knowledge sharing, and cooperative governance discussions.
-   Expired product upcycling program.
-   Meta Lens scan-to-product workflow for importing body measurements for custom product configuration.
-   Boundaries Background-Check Consent system for sexual-boundaries conflict review, opt-in via WhatsApp or Signal.
-   TriSexPort recent-6 partner lattice for mapping recent sexual partners based on disease and consent vectors, providing testing recommendations.
-   Wiki dynamic publication dates based on co-operator contributions and upvotes.
-   Local Economy Trading Systems (LETS) Framework page detailing LETS principles and design hypotheses for existing features.
-   Herbal Knowledge Base for co-operators to contribute peer-reviewed entries on foraging and co-crafting protection materials, grounded in the American Herbalists Guild (AHG) framework.
-   Filing Preparation system for the $BAD cooperative, generating downloadable, filing-ready packets for IRS and financial compliance.
-   Recent Team Changes feed page providing a White House-app-style unified feed with Pulse (real co-op feature usage counts), Cross-Pollination (curated map of federated outposts), and Team Changes Log (hand-curated changelog).
-   Inclusive-ordering origami fold sequence for multi-use protection products, allowing a single unit to serve multiple acts through defined fold states.
-   Inclusive-ordering multi-use balance customization, persisting full balance configurations on the order schema, covering role balance, contact zones, procreative mode, intersex variations, and custom parameters.
-   Inclusive-ordering per-variation custom-order parameters for 86 named intersex variations, each with specific fitting controls.
-   Inclusive-ordering product catalogue with expanded descriptions for internal, oral, and external protection.
-   Sex-marker offerings section ("Offerings for AMAB, AFAB & AXAB Intersex People") on homepage and products page, detailing configurator controls and catalogue variations for each assignment.
-   Inclusive-ordering intersex variation configurator: a searchable, categorised, multi-select catalogue of 86 named intersex variations mapped to fitting implications, including relevant zones, fitting notes, and consultation recommendations.
-   Inclusive-ordering AMAB/AFAB/AXAB sex-marker filter: above the existing category pills, co-operators can narrow the 86-variation catalogue by recorded birth assignment (All / AMAB / AFAB / AXAB). Markers derive from a category-default + per-variation overrides map (`getAssignmentMarkers` in `client/src/data/intersex-variations.ts`); variations spanning more than one assignment appear under each, with overlap counts surfaced in the pill labels and a per-marker honesty blurb explaining that markers describe recorded birth assignment rather than anatomy.
-   Manufacturing sourcing scaffolding at `/manufacturing`: honest framing that no manufacturing partners have signed on yet, so every order through `/inclusive-ordering` is captured as an open-source CC BY-SA 4.0 design specification (sizing, fold-balance, variation overrides, zone selections) rather than a shipment — surfaced via an amber operational-status banner on the ordering page. The manufacturing page documents a five-point Manufacturing Partner Covenant (CC BY-SA 4.0 compliance, share-alike on derivative designs, public spec sheets per SKU, fair-labour attestation, honesty attestation — all five enforced server-side at submission), lists seven publicly verifiable real-world research candidates (MyONE Custom Fit / ONE Condoms, Karex Berhad, Glyde Health, Sustain Natural via Grove Collaborative, Lorals, Good Clean Love, Sliquid) each clearly labelled "research candidate — not contacted" with per-company CC BY-SA fit analysis, and exposes a `manufacturing_partners` Postgres table + self-application form (entries land as `pending` until manually verified by stewards; table is honestly empty by default). No fabricated capacity numbers, no implied partnerships.
-   Inclusive Ordering Framework, extracted as a reusable public surface at `shared/inclusive-ordering/` with a stable barrel `index.ts` re-exporting the catalogue, fitting params, marker derivation, and `multiUseBalanceSchema`. Versioned (v1.0.0), CC BY-SA 4.0 licensed, with an `ADOPTED_SURFACES` vocabulary covering catalogue / marker-filter / fitting-params / multi-use-balance / fold-sequence / schema. Companion `/fork-the-framework` page documents the public API, sample usage, files-to-copy, adopter checklist, and licence; companion `/inclusive-ordering-registry` page (with `inclusive_ordering_adopters` Postgres table) is a self-reported registry of apps using the framework, kept honestly empty until real adopters submit. Submissions require both an honesty attestation and a CC BY-SA 4.0 compliance checkbox enforced server-side; entries land as "pending" until manually verified by stewards.

## External Dependencies
-   **Database Driver**: `@neondatabase/serverless`
-   **ORM**: `drizzle-orm`
-   **State Management**: `@tanstack/react-query`
-   **UI Primitives**: `@radix-ui/*`
-   **CSS Framework**: `tailwindcss`
-   **UI Component Styling**: `class-variance-authority`
-   **Carousel**: `embla-carousel-react`
-   **Data Visualization**: `recharts`
-   **Form Management**: `react-hook-form`
-   **File Upload**: `multer`
-   **Creative Commons**: All verification systems licensed under CC BY-SA 4.0