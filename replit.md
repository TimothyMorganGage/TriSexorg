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
    -   Inclusive-ordering multi-use balance customization allowing single ordered units to flex across roles, contact zones, and procreative modes within a session.
    -   Inclusive-ordering product catalogue with expanded and clarified descriptions for internal protection (enumerating five fitting variants), oral barriers (listing five oral-health uses), and external protection (naming the phallic-anatomy range).

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