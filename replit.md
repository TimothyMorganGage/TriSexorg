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