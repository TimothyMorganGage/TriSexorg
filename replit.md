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
    -   Mood and wellness tracking, "Wise Time Flucks" Creative Commons time tracking.
    -   Comprehensive 4D STI tracking and sexual partner network management.
    -   Integration of advanced biomaterials knowledge and "NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant."
    -   Wiki on sexual addiction and withdrawal with product recommendations.
    -   Progressive dating stages with mandatory sexual health safety protocols and a "$FLUCK" penalty system.
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
    -   Federated syndication system for content distribution across decentralized social networks (Mastodon, Bluesky, Pixelfed, Loops).
    -   "Remix to Replit" feature allowing users to create their own copies of TriSex.org.
    -   Community Forum for peer support and knowledge sharing with moderated categories, anonymous posting, content warnings, trending posts, and cooperative governance discussions.
    -   $TRISEX stablecoin system integrated with Time Banking for cooperative dividends and health impact rewards.
    -   Expired product upcycling program allowing users to exchange used barriers for credit toward new products.

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