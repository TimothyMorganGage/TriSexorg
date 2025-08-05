# Fluck‽ - Comprehensive Sexual Health Platform

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

A comprehensive wellness and sexual health platform designed to support diverse identities through innovative technology and culturally responsive design.

## 🌟 Features

### Core Platform Features
- **Generative Fluck Protection**: Custom-fit products with personalized sizing and materials
- **Good Flucking Sex**: Interactive educational stories and content
- **Great Flucking Health**: Categorized educational resources and health tracking
- **Groovy Flucking People**: Partnership requests and community features

### Advanced Health Tracking
- **4D STI Tracking**: Comprehensive tracking across Time, Space, Severity, and Network dimensions
- **Sexual Partner Network Management**: Safe relationship tracking and verification
- **Mood & Wellness Tracking**: Emoji-based logging with DALY metrics
- **"Wise Time Flucks"**: Creative Commons time tracking system

### Safety & Verification Systems
- **Open Source Age Verification**: Inspired by id.me and login.gov with Creative Commons licensing
- **Multi-Document Identity Verification**: Support for driver's license, passport, birth certificate, military ID, tribal ID
- **Parental Consent System**: Secure verification workflows for minors
- **Genealogical Verification**: Prevents incest within 8 degrees of cousinship using GEDCOM family trees
- **Wright's Coefficient Calculations**: Precise relationship quantification

### Cooperative Features
- **Financial Tracking**: Budget voting and dividend distribution
- **Mentor & Facilitator System**: Co-editing with multi-platform messaging
- **Progressive Dating Stages**: Mandatory safety protocols with $FLUCK penalty system
- **Cross-Platform Integration**: Google Calendar, iCal, Outlook, healthcare systems

### Accessibility & Inclusion
- **2SLGBTIQA+ Inclusive Design**: Specialized support for diverse communities
- **Deaf & Braille Translation**: ASL/BSL sign language support
- **BIPOC, Intersex, Trans, Two Spirit Support**: Culturally responsive design
- **NanoHeal ⓒⓒ Integration**: Intersectional naturopathic STI treatment

## 🏗️ Architecture

### Frontend
- **React** with TypeScript
- **Vite** for development and bundling
- **Wouter** for routing
- **TanStack Query** for server state management
- **shadcn/ui** components with Radix UI primitives
- **Tailwind CSS** for styling

### Backend
- **Express.js** REST API server
- **TypeScript** throughout the stack
- **PostgreSQL** with Drizzle ORM
- **Neon serverless driver** for database connections
- **Multer** for file uploads

### Security & Authentication
- **Session-based authentication** system
- **Role-based access control** (consumer, clinic_staff, admin)
- **Secure document processing** with local OCR
- **Creative Commons BY-SA 4.0** licensing throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/fluck.git
cd fluck
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Database
DATABASE_URL=your_postgresql_url
PGDATABASE=your_db_name
PGHOST=your_db_host
PGPASSWORD=your_db_password
PGPORT=your_db_port
PGUSER=your_db_user

# Session
SESSION_SECRET=your_session_secret
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Express.js backend
│   ├── ageVerification.ts  # Age verification service
│   ├── genealogy.ts        # Genealogical verification
│   ├── routes.ts           # API routes
│   └── storage.ts          # Data storage interface
├── shared/                 # Shared TypeScript schemas
├── uploads/                # File upload directories
└── attached_assets/        # Static assets
```

## 🔒 Privacy & Security

- **Local OCR Processing**: Documents processed locally for privacy
- **Secure File Uploads**: 10MB limits with format validation
- **Audit Trails**: Comprehensive logging and compliance reporting
- **Wright's Coefficient**: Mathematical relationship verification
- **Creative Commons Licensed**: Open source verification systems

## 🤝 Contributing

This project is licensed under Creative Commons BY-SA 4.0. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper documentation
4. Ensure all tests pass
5. Submit a pull request

## 📜 License

This project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

### What this means:
- ✅ **Share** — copy and redistribute the material in any medium or format
- ✅ **Adapt** — remix, transform, and build upon the material for any purpose
- ⚖️ **Attribution** — You must give appropriate credit
- 🔄 **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

## 🌍 Community

- **Reproductive Justice Focus**: Empowering users with personalized protection solutions
- **Cooperative Financial Model**: Community-driven budget decisions and profit sharing
- **Inclusive Technology**: Designed for diverse sexual orientations and gender identities
- **Open Source Commitment**: All verification systems available under Creative Commons

## 📞 Support

For support, feature requests, or contributions, please:
- Open an issue on GitHub
- Contact the development team
- Review the Creative Commons licensing terms

---

**Fluck‽** - Empowering sexual health through inclusive technology and cooperative community building.