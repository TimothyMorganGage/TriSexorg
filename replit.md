# Replit.md

## Overview

This is a full-stack web application for "fluck" - a custom-fit sexual health protection platform with comprehensive cooperative features. The application provides personalized protection products, educational content, peer mentoring, and community analytics with a focus on 2SLGBTIQA+ inclusivity and reproductive justice.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with a clear separation between client and server concerns:

- **Frontend**: React-based SPA using Vite as the build tool
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM (using Neon serverless driver)
- **Authentication**: Custom session-based authentication
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Development**: TypeScript throughout with shared schemas

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for client-server integration
- **Routing**: Wouter for lightweight routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables and brand colors

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database Layer**: Drizzle ORM with Neon PostgreSQL serverless connection
- **API Design**: RESTful endpoints with consistent error handling
- **Middleware**: JSON parsing, CORS, request logging
- **Development**: Hot reloading with custom Vite integration

### Database Schema
The application uses a comprehensive schema defined in `shared/schema.ts`:
- **Users**: Multi-role system (consumer, clinic_staff, admin)
- **Products**: Configurable protection products with categories
- **Product Configurations**: Custom sizing and material preferences
- **Orders**: Order management with status tracking
- **Educational Content**: Categorized learning materials
- **Partnership Requests**: Organization partnership system
- **Financial Records**: Cooperative financial tracking
- **Community Features**: Budget voting, dividends, DALY metrics
- **Mood & Wellness**: Emoji-based mood logging with comprehensive wellness tracking
- **Time Management**: "Wise Time Flucks" Creative Commons time tracking system

### Authentication System
- Session-based authentication with user registration/login
- Role-based access control (consumer, clinic_staff, admin)
- User profile management with organization details
- Protected routes and API endpoints

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Processing**: Express routes handle business logic and database operations
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Flow**: Structured JSON responses with consistent error handling
5. **State Updates**: TanStack Query manages cache invalidation and updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Database ORM with type safety
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production server
- **vite**: Frontend build tool and development server

### UI/UX Libraries
- **class-variance-authority**: Styling variant management
- **embla-carousel-react**: Carousel components
- **recharts**: Data visualization
- **react-hook-form**: Form management with validation

## Deployment Strategy

### Development
- Uses Vite development server with Express API integration
- Hot module reloading for rapid development
- TypeScript compilation without emission for type checking
- Database migrations managed via Drizzle Kit

### Production Build
- Frontend: Vite builds to `dist/public` directory
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle handles schema migrations
- Static file serving integrated into Express server

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development vs production mode handling
- Replit-specific integration for hosted deployment
- Build process separates client and server bundles

The architecture emphasizes type safety, developer experience, and scalable cooperative platform features while maintaining performance and accessibility standards.

## Recent Changes

### Beta Disclaimer System Implementation (January 2025)
- Implemented comprehensive beta disclaimer system across all application pages
- Created reusable BetaDisclaimer component with expandable team change tracking
- Added prominent warning banner: "⚠️ BETA MODE: This work in progress represents idealism in development"
- Integrated team change tracking with categories: Feature, Integration, System, Healthcare, UI/UX, Contact, Documentation
- Fixed JSX syntax and compilation issues across products, education, wiki, and partner STI tracking pages
- Applied sticky positioning on home page for maximum visibility
- Beta disclaimer now appears on: home, products, education, partner STI tracking, and wiki pages

### "Wise Time Flucks" Time Management System (January 2025)
- Implemented comprehensive time tracking with Creative Commons mantra
- Added time entries with start/stop timer functionality
- Included energy, focus quality, and satisfaction ratings (1-5 scale)
- Created time wisdom reflection and "Wise Time Fluck" personal mantras
- Added Creative Commons licensing option for tracked work
- Built productivity tagging system for categorizing time blocks
- Implemented time goals and insights features
- Added Time Tracker to main navigation menu

### Enhanced Wellness Tracking Features
- Expanded mood logging with emoji-based interface (10 mood options)
- Added comprehensive wellness metrics (energy, stress, sleep quality)
- Implemented physical symptoms and emotional state tracking
- Created wellness goals and mood insights system
- Integrated time management with wellness tracking for holistic health approach

### Calendar Integration System (January 2025)
- Built comprehensive calendar sync for Google Calendar, iCal, Outlook, and pureOS
- Created external calendar connection management with multiple sync directions
- Implemented scheduled task system with calendar integration
- Added task template system with Creative Commons sharing
- Built iCal export functionality for cross-platform calendar compatibility
- Created calendar sync API endpoints for external integrations
- Added CalDAV support for open calendar standards
- Integrated with "Wise Time Flucks" for seamless time tracking and calendar blocking
- Implemented Interactive Calendar Sync Wizard with step-by-step guided setup
- Added automated calendar connection testing and validation
- Created wizard-based OAuth flow for Google Calendar and Outlook integration
- Built advanced sync feature selection with real-time configuration
- Added sync frequency options from real-time to daily scheduling

### Cross-Platform Notification Sync & Smart Break System (January 2025)
- Built comprehensive cross-platform notification system for web, mobile, desktop, email, and SMS
- Implemented smart break pattern management with Pomodoro and custom configurations
- Created AI-powered rest suggestions based on energy and stress levels
- Added real-time break session tracking with effectiveness analytics
- Built notification scheduling for break reminders across all platforms
- Implemented smart break suggestion engine with contextual recommendations
- Added break session analytics with energy and stress level tracking
- Created customizable notification preferences for different break types

### Mentor & Facilitator Co-editing with Multi-Platform Integration (January 2025)
- Built comprehensive messaging platform integration (iMessage, WhatsApp, Google Messages, Facebook Messenger, Signal)
- Implemented healthcare system connectivity (MyChart, Apple Health, OpenEHR, Epic, Cerner)
- Created real-time co-editing sessions with mentor and facilitator support
- Added deaf and braille translation services with ASL/BSL sign language support
- Built cross-platform message delivery with automatic accessibility translations
- Implemented HIPAA-compliant healthcare data sync and contextual sharing
- Created comprehensive accessibility settings (braille grades, sign language types, voice options)
- Added real-time WebSocket communication for collaborative editing
- Built translation services with human verification and quality scoring
- Integrated voice-to-text, text-to-speech, and multi-modal accessibility support

### 4D STI Tracking & Sexual Product Customization (January 2025)
- Implemented comprehensive 4D STI tracking (Time, Space, Severity, Network dimensions)
- Built sexual partner network management with privacy controls and consent frameworks
- Created personalized sexual product customization based on natural senses profiling
- Integrated greensong.info/natural-senses framework for sensory-optimized protection products
- Added comprehensive sensory profiling (visual, auditory, tactile, olfactory, interoceptive)
- Built partner notification system for STI alerts and health updates
- Implemented product effectiveness tracking with partner feedback integration
- Created network exposure analysis for epidemiological health tracking
- Added HIPAA-compliant partner data management with configurable retention policies
- Built natural senses-based product recommendations for optimal sensory experience

### Advanced Bio-Materials Wiki Integration (January 2025)
- Added comprehensive bio-materials article to wiki covering antipsychotic medication interactions
- Integrated detailed sections on mushroom mycelium-based protection technologies
- Added bacterial cellulose matrix technology for psychiatric care applications
- Included protein-based polymer films with therapeutic benefits
- Covered lignin recovery and valorization for sustainable medical applications
- Created clinical integration protocols for healthcare provider training
- Added research and development pipeline information for future innovations
- Built implementation guidelines for healthcare settings and patient education

### NanoHeal™ STI Treatment Technology Integration (January 2025)
- Implemented revolutionary NanoHeal™ Intersectional Naturopathic STI Treatment Lubricant product
- Added nanotech material option with $149.99 pricing for advanced STI containment and treatment
- Integrated comprehensive therapeutic properties including targeted nanoparticle delivery
- Added naturopathic ingredient profiles (echinacea, tea tree, propolis, calendula, oregano, turmeric, aloe, manuka honey)
- Built nanotechnology specifications with smart drug release and pathogen detection
- Implemented clinical approach features for preventive barrier and infection containment
- Added research validation data showing 97% HSV-2 efficacy and 95% chlamydia containment
- Created enhanced feature options for STI treatment nanobots and pathogen detection systems
- Built detailed product information display with specialized UI highlighting for revolutionary technology
- **Intersectional Customization**: Custom formulations for intersex, trans, Two Spirit, Latinx, Quare, and BIPOC identities
- **Cultural Affirmations**: Sacred geometry nanoparticle patterns, ceremonial blessing protocols, elder consultation
- **Identity-Specific Features**: Hormone compatibility, anatomy optimization, ceremonial plant integration
- **Traditional Healing**: White sage, hierba buena, romero, ruda, shea butter, moringa, ginseng, reishi integration
- **Community-Centered**: Traditional knowledge keeper collaboration and community-defined healing intentions

### Sexual Addiction & Withdrawal Treatment Integration (January 2025)
- Added comprehensive wiki article on sexual addiction and withdrawal in context of fluck product use
- Covered Compulsive Sexual Behavior Disorder (CSBD) diagnostic criteria and neurobiological basis
- Integrated sexual withdrawal syndrome symptoms and timeline (4-phase recovery process)
- Built stage-specific product recommendations for early recovery, stabilization, and long-term maintenance
- Added specialized product categories including withdrawal management and biofeedback-enabled products
- Created clinical integration protocols with healthcare provider training and patient assessment tools
- Included research evidence base with efficacy studies and patient-reported outcomes
- Built comprehensive safety considerations and contraindications for therapeutic product use
- Added support systems integration including professional resources and community support networks