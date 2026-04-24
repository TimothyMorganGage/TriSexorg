# TriSex.org

## Overview

TriSex.org is a full-stack web application dedicated to personalized sexual health protection. It provides custom-fit products, educational resources, peer mentoring, and community analytics. The platform prioritizes 2SLGBTIQA+ inclusivity and reproductive justice, aiming to offer comprehensive, cooperative features for sexual health management. Its core purpose is to empower users with personalized protection solutions and cultivate a supportive community for sexual well-being, aspiring to be a leader in inclusive sexual health technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application uses a modern full-stack architecture with a clear separation of concerns.

-   **Frontend**: Built with React, Vite, Wouter for routing, TanStack Query for server state, and React hooks for local state. UI components leverage shadcn/ui on Radix UI primitives, styled with Tailwind CSS.
-   **Backend**: An Express.js REST API server in TypeScript, handling business logic, API routing, and database interactions.
-   **Database**: PostgreSQL, managed with Drizzle ORM and Neon serverless driver.
-   **Authentication**: Custom session-based system for user registration, login, and role-based access (consumer, clinic_staff, admin).
-   **Shared Components**: TypeScript with shared schemas for data consistency.
-   **UI/UX Decisions**: Focus on accessibility and user experience through shadcn/ui, Radix UI, and Tailwind CSS for a clean and intuitive interface.
-   **Key Features**:
    -   Multi-role user system and order management.
    -   Configurable protection products with custom sizing and material preferences based on natural senses profiling.
    -   Categorized educational content and partnership request system.
    -   Cooperative financial tracking (budget voting, dividends) and community features (DALY metrics).
    -   Mood and wellness tracking, "Wise Time TriSex" Creative Commons time tracking.
    -   Comprehensive 4D STI tracking and sexual partner network management.
    -   Integration of advanced biomaterials knowledge and "NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant."
    -   Wiki on sexual addiction and withdrawal with product recommendations.
    -   Progressive dating stages with mandatory sexual health safety protocols and a "$TRISEXORG" penalty system.
    -   Cross-platform notification system with smart break management.
    -   Mentor/facilitator co-editing with multi-platform messaging (iMessage, WhatsApp) and healthcare system connectivity (MyChart, Apple Health).
    -   Deaf and braille translation services with ASL/BSL support.
    -   Calendar integration (Google, iCal, Outlook, pureOS).
    -   Open-source age verification system (Creative Commons licensed) and comprehensive parental consent.
    -   Genealogical verification (GEDCOM) to prevent incest within 8 degrees of cousinship.
    -   Intersex-centered sizing system as the anatomical baseline for all products.
    -   Monogamy economics page with econometric analysis and platform policy exclusivity for monogamous relationships.
    -   Dedicated oral barriers for MSM product page, democratically owned by MSM "sides" cooperative.
    -   Comprehensive guides for endosex women with MSM partners and multidimensional value of gay sex byproducts (Gaynal Condoms).
    -   Federated syndication system for content distribution across decentralized social networks (Mastodon, Bluesky, Pixelfed, Loops). Bluesky cross-posting is gated by a two-condition ethics check: a member can share to Bluesky only if (1) they have self-attested that their own Bluesky account has Adult Content disabled, OR (2) the platform-level flag `compensationActive` flips to true once Bluesky / the AT Protocol publicly compensates individuals depicted in pornographic content on the network. Backed by `bluesky_share_attestations` table, `/api/bluesky/policy`, and `/api/bluesky/attestation` endpoints.
    -   "Remix to Replit" feature allowing users to create their own copies of TriSex.org.
    -   Community Forum for peer support and knowledge sharing with moderated categories, anonymous posting, content warnings, trending posts, and cooperative governance discussions. Fully backend-integrated with PostgreSQL storage (forum_categories, forum_posts, forum_replies, forum_likes, forum_bookmarks tables), REST API endpoints under `/api/forum/*`, and real-time data via TanStack Query.
    -   $TRISEXORG stablecoin system integrated with Time Banking for cooperative dividends and health impact rewards.
    -   Expired product upcycling program allowing users to exchange used barriers for credit toward new products.
    -   X (Twitter) and Truth Social cross-posting with porn-opt-out for scan-product privacy. Cooperative-pricing interest registry covering both X Premium and Truth Social paid (Truth+) subscribers (outreach in progress; no pricing deal exists yet — clearly disclosed in UI). Backed by `x_coop_pricing_interest` table (with `platform` discriminator) and `/api/x-coop/*` endpoints; "Co-op Pricing" tab on `/social-integration` lets members register on either platform with live aggregate demand totals.
    -   X (Twitter) share ethics gate (mirrors the Bluesky pattern): a member can cross-post to X only if (1) they self-attest that adult content is disabled on their X account AND that they use the qool.wtf NFT Studio for creative-control / on-chain attribution of depicted persons, OR (2) the platform-level flag `compensationActive` flips to true once X publicly compensates individuals depicted in pornographic content on the platform. qool.wtf is an external NFT studio — TriSex.org is not its operator and earns no commission; member use is self-attested with no API verification (clearly disclosed in UI). Backed by `x_share_attestations` table, `/api/x/policy`, and `/api/x/attestation` endpoints.
    -   Meta Lens scan-to-product workflow at `/meta-lens-scan`: lets users of Ray-Ban Meta / Oakley Meta smart glasses (and the Meta View / Meta AI apps) import body measurements they captured via Meta AI vision-reading of a flexible tape measure, then one-click generate a custom-fit product configuration from the scan. Honest disclosure that Meta does not expose body-measurement data via any public API — this is an import flow, not a live device integration. Backed by `meta_lens_scans` table and `/api/meta-lens-scans/*` endpoints; scans link directly to `productConfigurations` for ordering.
    -   Boundaries Background-Check Consent system: opt-in via WhatsApp or Signal (Signal recommended) for sexual-boundaries conflict review. Self-attested only — TriSex.org does not connect to messenger APIs or read messages. Stores platform, handle, scope, consent statement, timestamp, and optional auto-revoke. Page at `/boundaries-background-check`; backed by `boundary_check_consents` table and `/api/boundary-checks/consents` endpoints.
    -   Sniffies platform-access ethics gate at `/sniffies-policy`: a unilaterally published policy stating that Sniffies (or its proprietors) may use the TriSex.org platform — API access, federated integration, data import, co-marketing — only after operating a verifiable compensation program for persons who contracted STIs through encounters originated on Sniffies, including downstream harm from "bareback" absentmindedness within fluid-bonded relationships. Honest disclosures: TriSex.org has not contacted Sniffies, the policy is unilateral (not a negotiated agreement), STI causation is hard to prove with legal certainty, and the gate only governs Sniffies' access to TriSex.org (not Sniffies' general operations). Backed by `platform_compensation_attestations` table (general — reusable for other platforms), admin-only `POST /api/platform-compensation`, and public `GET /api/platform-compensation`, `GET /api/platform-compensation/:platform`, `GET /api/sniffies/policy` endpoints.
    -   Herbal Knowledge Base for co-operators who forage and co-craft protection materials, grounded in the American Herbalists Guild (AHG) framework. Page at `/herbal-knowledge` lets members browse and contribute peer-reviewed entries (common/Latin name, part used, traditional uses, foraging notes, safety warnings, sustainability, AHG scope-of-practice note) under CC BY-SA 4.0. Includes a prominent honesty banner that no foraged material substitutes for medical-grade STI/pregnancy barriers, links to the AHG Registered Herbalist (RH(AHG)) directory, and explicitly notes TriSex.org is not affiliated with AHG and does not reproduce AHG copyrighted publications. Backed by `herbal_knowledge_entries` table, `/api/herbal-entries/*` and `/api/herbal-policy` endpoints.
    -   Filing Preparation system for the $BAD cooperative — generates real, downloadable, filing-ready packets (IRS Form 1024 for 501(c)(12) status, 1099-DIV with patronage note, FinCEN Form 107 MSB registration, State Money Transmitter License packets via NMLS) with explicit honesty banners that TriSex.org does not file on behalf of users. Backed by `filing_documents` table; REST API under `/api/filings/*`; users update real-world status with actual agency confirmation numbers (no internal placeholders).

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