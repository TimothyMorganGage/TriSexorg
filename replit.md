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
    -   Sniffies platform-access ethics gate, a unilateral policy requiring compensation for STIs contracted via Sniffies for API access.
    -   Herbal Knowledge Base for co-operators to contribute peer-reviewed entries on foraging and co-crafting protection materials, grounded in the American Herbalists Guild (AHG) framework.
    -   Honesty refactors across analytics, economic-impact, monogamy-economics, 4D-STI-intervention, open-books, infinitely-affirmative-protection, newsletter, and trisex-stablecoin features to remove fabricated data and introduce transparent, framework-based approaches.
    -   Filing Preparation system for the $BAD cooperative, generating downloadable, filing-ready packets for IRS and financial compliance with clear disclaimers.

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