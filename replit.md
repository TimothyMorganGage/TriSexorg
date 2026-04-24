# TriSex.org

## Overview
TriSex.org is a full-stack web application dedicated to personalized sexual health protection. It provides custom-fit products, educational resources, peer mentoring, and community analytics, with a core focus on 2SLGBTIQA+ inclusivity and reproductive justice. The platform aims to empower users with comprehensive tools for managing sexual health and fostering a supportive community, aspiring to be a leader in inclusive sexual health technologies.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application utilizes a modern full-stack architecture.

-   **Frontend**: React, Vite, Wouter for routing, TanStack Query for server state, and React hooks for local state. UI components are built with shadcn/ui on Radix UI primitives, styled using Tailwind CSS.
-   **Backend**: Express.js REST API server in TypeScript, handling business logic and database interactions.
-   **Database**: PostgreSQL, managed with Drizzle ORM and Neon serverless driver.
-   **Authentication**: Custom session-based system supporting multiple user roles (consumer, clinic_staff, admin).
-   **Shared Components**: TypeScript with shared schemas for data consistency.
-   **UI/UX Decisions**: Emphasizes accessibility and user experience through shadcn/ui, Radix UI, and Tailwind CSS for a clean and intuitive interface.
-   **Key Features**:
    -   Multi-role user system and order management for configurable protection products with custom sizing based on natural senses profiling.
    -   Categorized educational content and a partnership request system.
    -   Cooperative financial tracking (budget voting, dividends) and community features (DALY metrics).
    -   Mood and wellness tracking, including "Wise Time TriSex" Creative Commons time tracking.
    -   Comprehensive 4D STI tracking and sexual partner network management.
    -   Wiki on sexual addiction and withdrawal with product recommendations.
    -   Progressive dating stages with mandatory sexual health safety protocols and a "$TRISEXORG" penalty system.
    -   Cross-platform notification system with smart break management.
    -   Mentor/facilitator co-editing with multi-platform messaging and healthcare system connectivity (MyChart, Apple Health).
    -   Deaf and braille translation services with ASL/BSL support.
    -   Calendar integration (Google, iCal, Outlook, pureOS).
    -   Open-source age verification and comprehensive parental consent.
    -   Genealogical verification (GEDCOM) to prevent incest within 8 degrees of cousinship.
    -   Intersex-centered sizing system as the anatomical baseline for all products.
    -   Monogamy economics page with econometric analysis and platform policy exclusivity for monogamous relationships.
    -   Dedicated oral barriers for MSM product page, democratically owned by MSM "sides" cooperative.
    -   Comprehensive guides for endosex women with MSM partners and multidimensional value of gay sex byproducts (Gaynal Condoms).
    -   Federated syndication system for content distribution across decentralized social networks (Mastodon, Bluesky, Pixelfed, Loops), including ethical gates for Bluesky and X (Twitter) cross-posting.
    -   "Remix to Replit" feature for user-created platform copies.
    -   Community Forum for peer support, knowledge sharing, and cooperative governance discussions.
    -   $TRISEXORG stablecoin system integrated with Time Banking for cooperative dividends and health impact rewards.
    -   Expired product upcycling program.
    -   Meta Lens scan-to-product workflow for importing body measurements from Meta AI vision-reading for custom product configuration.
    -   Boundaries Background-Check Consent system for sexual-boundaries conflict review, opt-in via WhatsApp or Signal.
    -   TriSexPort recent-6 partner lattice for mapping recent sexual partners based on disease and consent vectors, providing testing recommendations.
    -   Wiki dynamic publication dates based on co-operator contributions and upvotes, stored in Drizzle tables (`wikiContributions`, `wikiVotes`).
    -   Local Economy Trading Systems (LETS) Framework page detailing LETS principles and design hypotheses for existing features.
    -   Herbal Knowledge Base for co-operators to contribute peer-reviewed entries on foraging and co-crafting protection materials, grounded in the American Herbalists Guild (AHG) framework.
    -   Filing Preparation system for the $BAD cooperative, generating downloadable, filing-ready packets for IRS and financial compliance.
    -   Recent Team Changes feed page providing a White House-app-style unified feed with Pulse (real co-op feature usage counts), Cross-Pollination (curated map of federated outposts), and Team Changes Log (hand-curated changelog).
    -   Inclusive-ordering origami fold sequence ("hammocks of the mind") (`/inclusive-ordering`, step 2 multi-use balance panel): a named library of fold-states a sexual puppeteer can transition one physical unit through during a session so a range of acts is served by the same one (or two) unit(s) instead of opening a new product per act. Six named folds: **Folded Square** (▢ — idle / between-acts reset), **Wing-Extended Dam** (▭ — planar barrier sheet for oral-vulva / oral-anal / oral-frontal), **Inverted Sleeve** (◖ — penetrative tube for penises, T-dicks, micropenises, post-phalloplasty shafts), **Cup-Pouch** (◓ — receptive lining for vaginal canal, neovagina, frontal opening, anal canal), **Hammock-Cradle** (◡ — slung sheet spanning two contact zones simultaneously, e.g. oral+frontal or oral+anal), and **Finger Cot Spire** (◉ — sealed cone for digital / manual contact). Each fold card carries its origami metaphor, the acts it serves, the zones it can be applied to, and a step-by-step "puppeteer instruction" for the re-fold. Pills filter to only the folds compatible with the contact zones the user selected; Prev/Next buttons cycle through them. Honesty notes block extended to name: (a) the fold sequence is a design hypothesis with no manufactured fold-cycling unit and no measured barrier integrity across fold transitions; (b) the six named folds are co-operator-designed shapes pending prototyping and independent validation; (c) the "3–4 fold transitions before tactile fatigue" guidance is a working co-operator estimate, not a measured product spec.
    -   Inclusive-ordering multi-use balance customization allowing single ordered units to flex across roles, contact zones, and procreative modes within a session. The full balance configuration is now persisted on the order schema: the `orders` table carries `brandingPreference` (text) and `multiUseBalance` (jsonb) columns, validated by a strongly-typed `multiUseBalanceSchema` Zod object (`shared/schema.ts`) covering `roleBalance` (receptive/penetrative/versatile), `contactZones` (oral/anal/vaginal/frontal/neovaginal), `procreativeMode` (barrier-only/procreative-permeable/fertility-only), `intersexVariations` (string IDs from the 86-variation catalogue), `consultRequiredCount`, `activeFoldId` (current origami fold), and `balanceCode` (e.g. V-AOV-B). The step-4 "Place order with this configuration" button submits via `POST /api/orders`, the saved order is round-tripped on `GET /api/orders`, and the page surfaces a persisted-order confirmation card with the order number, id, and an honesty note that storage is in-memory on the running server instance only.
    -   Inclusive-ordering product catalogue with expanded and clarified descriptions for internal protection (enumerating five fitting variants), oral barriers (listing five oral-health uses), and external protection (naming the phallic-anatomy range).
    -   Inclusive-ordering intersex variation configurator (`/inclusive-ordering`, step 2 multi-use balance panel, sourced from `client/src/data/intersex-variations.ts`): a searchable, categorised, multi-select catalogue of **86 named intersex variations** mapped to fitting implications. Variations are organised across eight categories — sex chromosome variations (17), 46,XX DSD (12), 46,XY DSD (18), gonadal dysgenesis & ovotesticular DSD (5), external genital anatomy (15), internal canal & Müllerian (11), endocrine-presentation intersex (4), and post-surgical intersex bodies (4). Each variation carries `relevantZones` (which contact zones it most commonly affects), a `fittingNote` (a one-sentence design hypothesis describing how the unit's fold-states and sleeve / pouch / dam adapters are sized for that anatomy), and a `consultRequired` flag (rendered as an amber "consult" badge) marking variations where a Meta Lens scan or one-to-one fitting consultation is recommended before shipping. The UI offers (a) a search input filtering across variation name and AKA, (b) category pills with per-category counts, (c) a 256px-tall scrollable list of clickable rows with checkboxes, (d) a "Synthesized fitting profile" panel that lists the selected variations as removable chips, computes the union of relevant zones across selections, and surfaces an aggregate consult-recommendation count, and (e) selected-variation chips carried into the step-4 order summary alongside the consult-flag count. Variation names follow the Chicago Consensus 2006 DSD nomenclature with overlay labels from InterACT Advocates for Intersex Youth, Organisation Intersex International (OII), and the archived Intersex Society of North America (ISNA). Honesty notes block names: (a) the catalogue is a working co-operator-assembled list not independently medically validated, (b) every fitting note is a design hypothesis rather than a measured product spec — TriSex.org has not manufactured custom-fit units for every named variation, has not measured barrier integrity or comfort across these specific anatomies, and is not claiming an off-the-shelf fit, and (c) variation selection is self-reported, not stored or shared outside the order summary, and not used for any registry, research, or insurance purpose.

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