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
    -   Integration of "NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant" for universal STI coverage and intersectional customization.
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

## Recent Changes (February 2025)

-   ✅ **Saved Product Configurations Feature**: Complete save and share system for custom product configurations
    -   **Secure Storage**: User-owned saved configurations with ownership verification on all operations
    -   **Shareable Links**: Unique share codes for public configurations (e.g., share with friends)
    -   **CRUD Operations**: Create, read, update, and delete saved configurations via secure API
    -   **Security**: Ownership checks on GET/PATCH/DELETE, validated update schema prevents privilege escalation
    -   **Schema Validation**: Whitelist approach for updates (configurationName, configurationData, isPublic only)
    -   **Database**: JSONB storage for flexible configuration data, unique shareCode index for fast lookups

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
-   ✅ **NanoHeal Wiki Article**: Added comprehensive 28-minute Wiki article covering NanoHeal ⚧️ Intersectional Naturopathic STI Treatment Lubricant & Gaynal Condom System with technical specifications, clinical data, and cooperative production model
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
-   ✅ **Remix to Replit Feature**: Comprehensive "spin-off" system allowing users to create their own copies of TriSex.org
    -   **Dedicated Remix Page**: Full landing page at `/remix-replit` explaining the remix process and use cases
    -   **One-Click Template**: Direct link to remix the entire platform to user's own Replit account
    -   **Complete Package**: Users get full source code, database schema, security features, wiki content, and cooperative tools
    -   **Regional Chapters**: Enables local co-op chapters to spin off customized versions (TriSex Seattle, TriSex Atlanta, etc.)
    -   **Specialized Adaptations**: Support for demographic-specific versions (Deaf/HoH, neurodivergent, rural access)
    -   **Educational Use**: Perfect for teaching sexual health, cooperative economics, or web development
    -   **CC BY-SA 4.0 License**: Clear Creative Commons licensing with cooperative solidarity principles
    -   **Setup Guide**: 4-step quick start with secrets configuration, content customization, and deployment instructions
    -   **6 Use Cases**: Regional chapters, specialized health focus, educational institutions, R&D, international adaptations, allied movements
    -   **Navigation Integration**: Added to header menu and footer for easy discovery
-   ✅ **Monogamy Economics Page**: Comprehensive econometric analysis of monogamy vs. non-monogamy dating structures
    -   **Cost Comparison**: Annual expenses for monogamous dyads ($470-2,110) vs. polyamorous ($5,360-32,180) vs. open relationships ($5,700-33,700)
    -   **Network Mathematics**: Exponential STI exposure growth in non-monogamous networks (2 people vs. 15-30+ within 3 degrees)
    -   **DALY Analysis**: Disability-adjusted life years lost: monogamy (0.01-0.05) vs. poly (0.2-0.8) vs. open (0.5-2.0)
    -   **Economic Value**: Lifetime impact from STI-related health burden: monogamy ($500-7,500) vs. poly ($10,000-120,000) vs. open ($25,000-300,000)
    -   **Platform Policy**: Explicit statement that TriSex.org exclusively serves monogamous relationships for epidemiological efficacy
    -   **Separation Risk Analysis**: Economic/health risks of dating people who are "separated but not divorced" or in open relationships
    -   **Monogamy Pathway**: 8-step process for establishing verified monogamous partnerships with STI testing and fluid-bonding protocols
-   ✅ **Oral Barriers for MSM Product Page**: Dedicated offering for men who have sex with men practicing oral-only sex
    -   **Super Sides 🥰 Cooperative**: Democratically owned by MSM "sides" (oral-focused, non-penetrative sex practitioners)
    -   **Co-op Benefits**: Product voting rights, dividend distributions, discounted pricing, free workshops, peer support
    -   **Side Identity Celebration**: Destigmatizing oral sex as primary (not secondary) pleasure practice
    -   **60+ Intersex-Centered Sizes**: Complete sizing spectrum accommodating all anatomical configurations
    -   **12 Flavor Options**: Unflavored to champagne luxury with food-safe, sugar-free formulations
    -   **5 Material Choices**: Ultra-thin, recycled plastic, latex-free, flavored fusion, smart sensors
    -   **9 Enhancement Features**: Enhanced lubrication, warming/cooling sensations, numbing control, antimicrobial silver
    -   **STI Education**: Comprehensive information on oral transmission of gonorrhea, chlamydia, syphilis, herpes, HPV, Hepatitis A
    -   **Monogamy Support**: Guidance for transitioning to fluid-bonded status after testing windows
    -   **Price Range**: $19.99-$80+ depending on material and feature selections
    -   **Sustainability**: Every purchase removes 100g of microplastics from waterways
-   ✅ **Endosex Women with MSM Partners Wiki Article**: 25-minute comprehensive guide for women in monogamous relationships with bisexual/MSM men
    -   **Bridge Population Framework**: Understanding STI transmission from MSM networks to heterosexual women through bisexual male partners
    -   **Comprehensive Testing Protocols**: MSM-specific testing requirements (throat/rectal swabs, full hepatitis panel, herpes antibodies)
    -   **Intersex-Inclusive Protection**: How intersex-centered barrier design benefits endosex women and their partners
    -   **Relationship Navigation**: Communication about MSM history, addressing biphobia, monogamy verification strategies
    -   **4 Health Scenarios**: Partner just came out, historical MSM activity, attracted but never acted, exploring anal sex
    -   **Product Recommendations**: Internal condoms, dental dams, pH-balanced lubricants, intersex-sized external condoms
    -   **Cultural Considerations**: Trans/intersex partners, religious contexts, sex-positive frameworks, community support
    -   **Testing Timeline**: Initial test → 3-month window → confirmatory test → fluid-bonding decision → optional annual monitoring
-   ✅ **Gaynal Condoms Wiki Article**: Comprehensive 30-minute article exploring multidimensional value of gay sex byproducts
    -   **Environmental Value**: Zero-waste intimacy models, fluid recycling, nutrient cycling, reduced resource consumption
    -   **Reproductive Value**: Relational reproduction, chosen family building, non-procreative partnership bonding
    -   **Spiritual Value**: Tantric same-sex union, kundalini activation, sacred energy exchange, semen alchemy
    -   **Sanitary Value**: STI prevention, public health protection, intersex-specific design, monogamy + barrier model
    -   **Waste Stream Safety Protocols**: Comprehensive santorum education with harm-reduction framework
        -   Destigmatizing fecal contact as normal physiological reality
        -   Econologic framework: microbial networks, community engagement, reproductive systems perspective
        -   Medical realities: GI pathogen risks (E. coli, Hepatitis A, parasites) and transmission routes
        -   Hygiene protocols: pre-play preparation, during-play safety, post-play cleanup best practices
        -   Vaccination recommendations and medical prevention strategies
        -   Intersex & trans-specific anatomical/hormonal considerations
        -   Community care traditions and collective hygiene wisdom
        -   Waste disposal and environmental stewardship integration
    -   **Holistic Framework**: Integration of all four dimensions for comprehensive sexual health approach
    -   **Cultural Resistance**: Counter-narratives to anti-gay stigma, gaynal pride as political/spiritual liberation
    -   **Practical Guides**: Step-by-step instructions for monogamous couples, intersex/trans individuals, educators
    -   **Intersex-Centered Design**: TriSex.org gaynal condom sizing for all anatomical configurations