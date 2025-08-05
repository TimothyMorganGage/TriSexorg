# Replit.md

## Overview

This project is a full-stack web application for "fluck," a platform dedicated to personalized sexual health protection. It offers custom-fit products, educational content, peer mentoring, and community analytics. The platform emphasizes 2SLGBTIQA+ inclusivity and reproductive justice, aiming to provide comprehensive, cooperative features for sexual health management. Its vision includes empowering users with personalized protection solutions and fostering a supportive community for sexual well-being, with ambitions for market leadership in inclusive sexual health technologies.

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