# TriSex.org

## Overview
TriSex.org is a full-stack web application focused on personalized sexual health protection for the 2SLGBTIQA+ community, emphasizing reproductive justice. It provides custom-fit products, educational resources, peer mentoring, and community analytics. The platform aims to empower users and foster a supportive community, aspiring to be a leader in inclusive sexual health technologies.

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
-   $TRISEXORG stablecoin system integrated with Time Banking for cooperative dividends and health impact rewards.
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