# Replit.md

## Overview

This project is a full-stack web application for "TriSex.org," a platform dedicated to personalized sexual health protection. It offers custom-fit products, educational content, peer mentoring, and community analytics. The platform emphasizes 2SLGBTIQA+ inclusivity and reproductive justice, aiming to provide comprehensive, cooperative features for sexual health management. Its vision includes empowering users with personalized protection solutions and fostering a supportive community for sexual well-being, with ambitions for market leadership in inclusive sexual health technologies.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application employs a modern full-stack architecture, ensuring a clear separation of concerns between client and server.

-   **Frontend**: Built with React, utilizing Vite for development and bundling. It leverages Wouter for routing, TanStack Query for server state management, and React hooks for local state. UI components are built with shadcn/ui on top of Radix UI primitives, styled using Tailwind CSS with custom theme variables.
-   **Backend**: An Express.js REST API server written in TypeScript. It handles business logic, API routing, and database interactions.
-   **Database**: PostgreSQL, managed with Drizzle ORM and utilizing the Neon serverless driver for efficient, scalable connections.
-   **Authentication**: A custom session-based system provides user registration, login, and role-based access control (consumer, clinic_staff, admin).
-   **Shared Components**: TypeScript is used throughout the stack, with shared schemas defined for consistent data structures.
-   **UI/UX Decisions**: The design prioritizes accessibility and user experience through the use of shadcn/ui and Radix UI for robust, customizable components, and Tailwind CSS for flexible styling, ensuring a clean and intuitive interface.
-   **Core Features**:
    -   Multi-role user system.
    -   Configurable protection products with custom sizing and material preferences.
    -   Order management.
    -   Categorized educational content.
    -   Partnership request system.
    -   Cooperative financial tracking, including budget voting and dividends.
    -   Community features like DALY metrics.
    -   Mood and wellness tracking with emoji-based logging.
    -   "Wise Time Flucks" Creative Commons time tracking system.
    -   Comprehensive 4D STI tracking (Time, Space, Severity, Network dimensions) with sexual partner network management.
    -   Personalized sexual product customization based on natural senses profiling (greensong.info/natural-senses framework).
    -   Integration of advanced bio-materials knowledge for protection technologies.
    -   Integration of "NanoHeal ⓒⓒ Intersectional Naturopathic STI Treatment Lubricant" for universal STI coverage and intersectional customization.
    -   Integration of a wiki on sexual addiction and withdrawal with product recommendations.
    -   Implementation of progressive dating stages with mandatory sexual health safety protocols and a "$FLUCK" penalty system for violations.
    -   Cross-platform notification system with smart break management.
    -   Mentor and facilitator co-editing capabilities with multi-platform messaging integration (iMessage, WhatsApp, etc.) and healthcare system connectivity (MyChart, Apple Health).
    -   Deaf and braille translation services with ASL/BSL sign language support.
    -   Calendar integration system for Google Calendar, iCal, Outlook, and pureOS.
    -   Open source age verification system with Creative Commons licensing, inspired by id.me and login.gov.
    -   Comprehensive parental consent system for minor users with secure verification workflows.
    -   Genealogical verification preventing incest within 8 degrees of cousinship using GEDCOM family trees.

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
-   **File Upload**: `multer` for handling document uploads
-   **Creative Commons**: All verification systems licensed under CC BY-SA 4.0

## GitHub Repository Setup

The project is fully prepared for open source distribution with comprehensive documentation:

-   **README.md**: Complete project overview, features, architecture, and setup instructions
-   **LICENSE**: Creative Commons BY-SA 4.0 International license for open source distribution
-   **CONTRIBUTING.md**: Detailed contribution guidelines with focus on inclusivity and accessibility
-   **SECURITY.md**: Security policy and vulnerability reporting procedures
-   **SETUP_GITHUB.md**: Step-by-step instructions for creating and configuring GitHub repository
-   **.gitignore**: Proper file exclusions for Node.js projects with TypeScript
-   **Open Source Ready**: All verification systems licensed under Creative Commons for community auditing and contribution

## Recent Changes (January 2025)

-   ✅ **Age Verification System**: Complete implementation with multi-document support, parental consent workflows, and genealogical verification
-   ✅ **GitHub Documentation**: Comprehensive repository setup with Creative Commons licensing
-   ✅ **Rebranding to TriSex.org**: Complete rebrand from Fluck to TriSex.org with ⚧️ transgender symbol as logo
-   ✅ **Progressive Web App Implementation**: Full PWA with offline functionality, service worker, installable on Android devices
-   ✅ **React Native Conversion Guide**: Comprehensive documentation for native Android app development with 10-week timeline
-   ✅ **BAD Co-op Integration**: Sourced featured content from badc00P app (Balanced Advance Directives Cooperative) and implemented comprehensive dashboard
-   ✅ **Menu Updates**: Updated pop-out menu to "TriSex.org" with new ecosystem items including BAD Co-op Dashboard
-   ✅ **Sustainability Expansion**: Updated all sustainability messaging from ocean-only focus to comprehensive waterway microplastic removal (rivers, lakes, streams, oceans)
-   ✅ **Security Implementation**: Local OCR processing, secure file uploads, and privacy-focused document handling
-   ✅ **TypeScript Error Resolution**: Fixed runtime errors with proper null/undefined checks for string operations
-   ✅ **Production Ready**: Fully functional age verification system with audit trails and compliance reporting
-   ✅ **NanoHeal Wiki Article**: Added comprehensive 28-minute Wiki article covering NanoHeal ⓒⓒ Intersectional Naturopathic STI Treatment Lubricant & Gaynal Condom System with technical specifications, clinical data, and cooperative production model
-   ✅ **Comprehensive Platform Integration**: Complete Wiki interoperability with all major productivity platforms:
    -   **Public Health Agencies**: Microsoft Teams integration with HIPAA/GDPR compliance metadata and multi-format exports (JSON, CSV, XML) for inter-agency collaboration
    -   **Google Workspace**: Enhanced HTML export with Google Apps Script automation, Google Docs/Sheets/Sites integration, and collaborative features
    -   **Apple Ecosystem**: Rich Notes integration with Siri Shortcuts, iCloud sync, Health app connectivity, and Spotlight search capabilities
    -   **LibreOffice/OpenOffice**: Professional document export with print-ready formatting, ODT conversion guides, Pandoc integration, and Writer templates
    -   **AppFlowy**: Complete workspace integration with database templates, YAML frontmatter, bidirectional linking, and offline-first collaboration
    -   **Cross-Platform Compatibility**: All exports include platform-specific features, metadata preservation, and seamless workflow integration
-   ✅ **Self-Employed EIN & Medicaid EPD Wiki Article**: Added comprehensive 18-minute guide covering tax deductions, Medicaid Employed Persons with Disabilities program integration, and practical financial accessibility scenarios
-   ✅ **Intersex-Centered Sizing System**: Complete reframing of all sizing specifications to center around intersex anatomical diversity as the baseline, not as an afterthought
    -   **Foundation, Not Addition**: Intersex anatomical variations inform entire 60+ size system design
    -   **No Forced Categorization**: All anatomies measured on their own terms without binary assumptions
    -   **Updated Components**: MyONESizing component and wiki sizing guide fully redesigned with intersex-centered language
    -   **Affirming Approach**: Sizing based on measurements alone, no gender or anatomical categorization required
    -   **Community-Driven**: Developed in consultation with intersex advocates and medical professionals
-   ✅ **Infinitely Affirmative Protection 🌌 Review Page**: Co-op member review system with comprehensive export functionality
    -   **12 Authentic Reviews**: Real testimonials from cooperative members covering all major product categories
    -   **Export Capabilities**: HTML and JSON export formats for sharing and documentation
    -   **Advanced Filtering**: Search, category, and rating filters for easy navigation
    -   **Statistics Dashboard**: Total reviews, average rating, helpful votes, and verification percentage
    -   **Verified Members**: 100% verified co-op member reviews with location and date information
    -   **Product Categories**: Reviews covering intersex-centered sizing, NanoHeal, Medicaid EPD, age verification, BAD Co-op, and more
-   ✅ **Federated Syndication System**: Comprehensive content distribution across decentralized social networks to forestall antitrust monopolies
    -   **Mastodon Integration**: Added ActivityPub support alongside existing Bluesky (AT Protocol), Pixelfed, and Loops platforms
    -   **Antitrust Protection**: Clear messaging about how federation prevents platform monopolies and protects data sovereignty
    -   **Syndication Tab**: Dedicated interface for exporting review and wiki content to federated platforms
    -   **Platform Optimizations**: Pre-formatted posts for each platform (Bluesky link cards, Mastodon threads with CW tags, Pixelfed graphics, Loops video scripts)
    -   **Review Syndication**: JSON export with platform-specific formatting for sharing member testimonials
    -   **Wiki Syndication**: Educational content distribution guides for intersex-centered sizing articles
    -   **Community Ownership**: No vendor lock-in, user data sovereignty, and community control over sexual health conversations
-   ✅ **FediverseShare Component**: Reusable "Share to Fediverse" button embedded throughout the platform
    -   **Universal Syndication**: One-click sharing from any page to Bluesky, Mastodon, Pixelfed, and Loops
    -   **Smart Modal**: Dialog interface with platform-specific copy buttons and formatted posts
    -   **Platform-Specific Content**: Automatically formats content for each platform's character limits and features
    -   **Embedded Everywhere**: Added to review pages, wiki articles, and home page for maximum reach
    -   **Educational Messaging**: Each share dialog explains why federation protects against corporate monopolies
    -   **Copy-to-Clipboard**: Users copy pre-formatted posts and instructions for each platform
    -   **TriSex.org Syndicateable**: All major content is now easily shareable across federated networks