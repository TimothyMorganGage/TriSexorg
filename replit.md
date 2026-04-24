# TriSex.org

## Overview
TriSex.org is a full-stack web application focused on personalized sexual health protection. It offers custom-fit products, educational resources, peer mentoring, and community analytics, with a strong emphasis on 2SLGBTIQA+ inclusivity and reproductive justice. The platform aims to empower users with comprehensive, cooperative features for sexual health management and foster a supportive community for sexual well-being, aspiring to be a leader in inclusive sexual health technologies.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application employs a modern full-stack architecture with a clear separation of concerns.

-   **Frontend**: React, Vite, Wouter for routing, TanStack Query for server state, and React hooks for local state. UI components utilize shadcn/ui on Radix UI primitives, styled with Tailwind CSS.
-   **Backend**: Express.js REST API server in TypeScript, managing business logic and database interactions.
-   **Database**: PostgreSQL, managed with Drizzle ORM and Neon serverless driver.
-   **Authentication**: Custom session-based system supporting multiple user roles (consumer, clinic_staff, admin).
-   **Shared Components**: TypeScript with shared schemas for data consistency.
-   **UI/UX Decisions**: Prioritizes accessibility and user experience through shadcn/ui, Radix UI, and Tailwind CSS for a clean and intuitive interface.
-   **Key Features**:
    -   Multi-role user system and order management for configurable protection products with custom sizing based on natural senses profiling.
    -   Categorized educational content and a partnership request system.
    -   Cooperative financial tracking (budget voting, dividends) and community features (DALY metrics).
    -   Mood and wellness tracking, including "Wise Time TriSex" Creative Commons time tracking.
    -   Comprehensive 4D STI tracking and sexual partner network management.
    -   Integration of advanced biomaterials knowledge, such as "NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant."
    -   Wiki on sexual addiction and withdrawal with product recommendations.
    -   Progressive dating stages with mandatory sexual health safety protocols and a "$TRISEXORG" penalty system.
    -   Cross-platform notification system with smart break management.
    -   Mentor/facilitator co-editing with multi-platform messaging (iMessage, WhatsApp) and healthcare system connectivity (MyChart, Apple Health).
    -   Deaf and braille translation services with ASL/BSL support.
    -   Calendar integration (Google, iCal, Outlook, pureOS).
    -   Open-source age verification and comprehensive parental consent.
    -   Genealogical verification (GEDCOM) to prevent incest within 8 degrees of cousinship.
    -   Intersex-centered sizing system as the anatomical baseline for all products.
    -   Monogamy economics page with econometric analysis and platform policy exclusivity for monogamous relationships.
    -   Dedicated oral barriers for MSM product page, democratically owned by MSM "sides" cooperative.
    -   Comprehensive guides for endosex women with MSM partners and multidimensional value of gay sex byproducts (Gaynal Condoms).
    -   Federated syndication system for content distribution across decentralized social networks (Mastodon, Bluesky, Pixelfed, Loops), including ethical gates for Bluesky and X (Twitter) cross-posting based on user attestations or platform compensation policies.
    -   "Remix to Replit" feature for user-created platform copies.
    -   Community Forum for peer support, knowledge sharing, and cooperative governance discussions with moderated categories and real-time data.
    -   $TRISEXORG stablecoin system integrated with Time Banking for cooperative dividends and health impact rewards.
    -   Expired product upcycling program.
    -   Meta Lens scan-to-product workflow for importing body measurements from Meta AI vision-reading for custom product configuration.
    -   Boundaries Background-Check Consent system for sexual-boundaries conflict review, opt-in via WhatsApp or Signal.
    -   TriSexPort recent-6 partner lattice for mapping recent sexual partners based on disease and consent vectors, providing testing recommendations.
    -   Wiki dynamic publication dates — co-operator contributions and upvotes update each article's displayed date. Two new Drizzle tables (`wikiContributions` {id, articleId, userId, summary, createdAt}, `wikiVotes` {id, articleId, userId, contributionId, createdAt}) record activity, with idempotent voting (one vote per co-operator per article). Storage methods: `listWikiActivity` (aggregate Map of articleId → {lastContributedAt, lastVotedAt, contributionCount, voteCount}), `listWikiContributions`, `recordWikiContribution`, `recordWikiVote`, `hasUserVotedWiki`. Routes: `GET /api/wiki/activity` (public), `GET /api/wiki/articles/:id/contributions` (public), `GET /api/wiki/articles/:id/me` (auth, has-voted check), `POST /api/wiki/articles/:id/contribute` (auth, summary ≥ 4 chars), `POST /api/wiki/articles/:id/vote` (auth, idempotent). Wiki page UI: each article card displays the most recent of (a) seed `lastUpdated`, (b) most recent recorded contribution, (c) most recent recorded upvote — labelled "Updated by co-operators YYYY-MM-DD" when there's real activity, else "Originally published YYYY-MM-DD" with a tooltip noting no activity is recorded yet. Article-detail header shows the same dynamic date plus actual upvote and contribution counts and (for signed-in members) an Upvote button + a Contribution-summary textarea + a recorded-honesty disclaimer naming the date-source rule and confirming counts are real database row counts (no seeded or fabricated activity). Honesty fallback: when the activity endpoint is unreachable (e.g. before `npm run db:push --force` runs), all articles cleanly show seed dates with the "Originally published" label and zero counts.
    -   Local Economy Trading Systems (LETS) Framework page (`/lets-framework`) — replaces the former Sniffies platform-compensation attestation page with a documentation page covering the LETS lineage (Linton 1983 Comox Valley LETSystem, Cahn 1980 Time Banks, 1991 Ithaca HOURS, 2009 Brixton Pound, Sardex, hOurworld federation), five operating principles (mutual credit / no interest / bounded commitment / public ledger / local-first), and design hypotheses mapping LETS onto existing Time Banking, $TRISEXORG stablecoin, forum, and dividends features. Honesty banner: TriSex.org has not launched a LETS, has not issued any units to members, and is not displaying any membership / volume / transaction figures. Header link "Sniffies Policy" → "LETS Framework"; backend `/api/sniffies/policy` route removed; broader `platformCompensationAttestations` table retained because Bluesky/X share gates still consult it.
    -   Herbal Knowledge Base for co-operators to contribute peer-reviewed entries on foraging and co-crafting protection materials, grounded in the American Herbalists Guild (AHG) framework.
    -   Honesty refactors across analytics, economic-impact, monogamy-economics, 4D-STI-intervention, open-books, infinitely-affirmative-protection, newsletter, and trisex-stablecoin features to remove fabricated data and introduce transparent, framework-based approaches.
    -   Filing Preparation system for the $BAD cooperative, generating downloadable, filing-ready packets for IRS and financial compliance with clear disclaimers.
    -   Honesty refactors extended to bad-coop-dashboard (4 fake "Community Health Advocates" with ratings/sessions, 6 fake legal-template download counts in the 3,210–12,453 range, fabricated 45–92% module progress, four invented recent-activity entries, fabricated upcoming tasks, four fake forum post counts, and fake video-course completion %s — all replaced with empty states + named-removal disclaimers) and social-integration (zeroed Bluesky/Mastodon/Pixelfed/Loops follower / post / engagement / reach numbers and removed four fabricated cross-platform posts with invented likes/shares/views).
    -   Recent Team Changes feed page (`/recent-team-changes`) — White House-app-style unified feed with three lanes: **Pulse** (real co-op feature usage counts derived live from `/api/feed/recent-team`, no telemetry/analytics SDK, sorted by row count), **Cross-Pollination** (curated map of federated outposts — Mastodon/Pixelfed/Loops/Hylo as active share targets, Bluesky/X as ethics-gated, Truth Social as active-share-no-federation — with explicit notes on each platform's gate and protocol, no fabricated follower/reach numbers), and **Team Changes Log** (hand-curated chronological changelog of honesty refactors, new features, policies). Linked from global header as "Team Changes".
    -   Inclusive-ordering product catalogue (`/inclusive-ordering`) honesty + scope expansion: the "Internal Protection" card no longer reads "innovative internal protection designed for all anatomies" (a phrase that erased intersex / transmasc / post-surgical canal differences); it now explicitly enumerates five fitting variants — endosex vaginal canal, frontal opening / front hole (transmasc, non-binary, intersex frontal anatomy), post-vaginoplasty neovagina (shallower depth profile), anal canal (separate ring tension and length spec), and intersex internal-canal variants (partial canal, blind-ending pouch, urogenital sinus — fitting consult required). The "Dental Protection" card has been renamed "Oral Barriers" and now lists five oral-health uses instead of the single dental-dam-over-vulva framing — oral-vulva, oral-anal/rim, oral-penile (glans cap or full-shaft sleeve, pre-cum and throat-coating barrier), oral-frontal (front-hole / T-dick contact), and oral-surgery / post-extraction shield. The "External Protection" card was also widened to name the phallic-anatomy range (endosex penile shaft, T-dick / hormonally enlarged clitoris, micropenis / hypospadias-aware fit, post-phalloplasty / metoidioplasty shaft). Each refactored card carries a dashed-amber honesty disclaimer naming the exact prior wording that was replaced.
    -   Honesty refactors extended further to: products (stripped fabricated NanoHeal STI efficacy %s 97/95/89/93/91/96/87 and false "FDA breakthrough therapy" + "WHO recognition" claims from vegan and traditional feature lists, replaced with EXPERIMENTAL disclaimer naming each removed claim); terms-of-service (killed "97.8% STI prevention efficacy rate" guarantee and "$0.99/unit, 83% savings" claim with named-removal disclaimers); materials-science (zeroed sustainabilityMetrics 15+/2.5/8/5 tons/month and 85%/90%/60% reductions and 6-12mo biodegradation to "—", softened four fabricated "yield" %s, flipped five qualityStandards — ISO 10993, ASTM D6400, FDA 21 CFR 177, USP Class VI, RoHS — from "Certified" to "Not yet certified — earlier copy falsely listed Certified"); anatomy-scanning (zeroed STI tracking metrics 98% Protection Usage / 100% Notifications / +2.3 DALY, emptied fake MyChart HIV/Chlamydia/Syphilis-Negative results dated Nov 15 2025, zeroed Healthy Outcomes 99.7% Barrier Effectiveness and related scores, softened scanning-method "accuracy" %s 98/99/99.5/95/90 to "Pending validation" in both scanningMethods array and method-comparison grid); clinics (replaced fabricated benefits 95% satisfaction / 30% revenue / 50% time savings with "Pending — earlier copy claimed X without data"); natural-lubricants (softened "GMP-certified production line" to a planned/aspirational claim); clinic-dashboard analytics tab (replaced hard-coded Inventory Turnover values "Fast Moving Items: 23", "Slow Moving Items: 8", "Average Turnover Rate: 4.2x/month" and Cost Analysis values arbitrary 8% inventory-cost multiplier / "Waste from Expiration: $2,340" / "Cost Savings (Automation): +$8,920" with empty-state disclaimers naming each removed placeholder).

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