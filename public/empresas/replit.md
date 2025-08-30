# LIBERT.IA - LIBRE COMERCIO & INTELIGENCIA ARTIFICIAL

## Overview

LIBERT.IA is a comprehensive international trade platform designed to provide businesses with intelligent tools for import/export operations. Its primary purpose is to streamline international trade decision-making by offering a smart HS code search with country-specific trade regulations, comprehensive trade flow analysis, cost calculation, a global company directory, and market intelligence. This full-stack web application aims to be an intelligent solution for navigating the complexities of global commerce, serving as a critical tool for businesses engaged in or looking to expand into international markets.

## User Preferences

Preferred communication style: Simple, everyday language.
Monetization strategy: Freemium model with enterprise opportunities
Business development: Open to partnership and acquisition discussions
Deployment approach: Start free to build user base, then implement paid tiers
Expansion strategy preference: Continental analysis
Premium goal: Reach 100% balanced distribution - 100 companies in each category (Directas, Indirectas, PYMEs, Cooperativas, Estatales) for world-class 500-company platform

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite.
- **UI Library**: Radix UI components with shadcn/ui for styling.
- **Styling**: Tailwind CSS, utilizing a glassmorphic design consistent with K.O.R.A branding.
- **State Management**: TanStack Query (React Query) for server state management.
- **Routing**: Wouter for lightweight client-side routing.
- **Internationalization**: Custom system supporting Spanish and English.
- **Smart Search**: Country-aware HS code search with integrated trade regulation filtering.
- **Platform Rebranding**: Updated from K.O.R.A to LIBERT.IA.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API, including error handling and logging middleware.
- **Development Setup**: Features hot reload and middleware integration.
- **Storage Interface**: Abstract storage layer.

### Data Storage Solutions
- **Primary Database**: PostgreSQL, managed via Drizzle ORM.
- **Schema Management**: Drizzle Kit for migrations and schema generation.
- **Connection**: Neon Database serverless PostgreSQL.

### Database Schema Design
- **HS Codes**: Hierarchical structure covering complete nomenclature with tariff rates, units, trade restrictions, and multi-language support.
- **Companies**: Business directory with classification (importer/exporter/both).
- **Market Data**: Trade statistics by country, year, and HS code.
- **Shipments**: Tracking system.
- **Customs Procedures**: Country-specific documentation and requirements.
- **Smart Search**: Enhanced synonym mapping with extensive search terms.

### Component Architecture
- **UI Pattern**: Consistent glass card design with glassmorphic styling.
- **Responsiveness**: Mobile-first design using adaptive grid systems.
- **Modularity**: Reusable UI components with consistent APIs.
- **Accessibility**: Radix UI primitives ensure WCAG compliance.

### API Structure
- **Endpoints**: Dedicated endpoints for HS Code search, Company directory, Market Data, Regulatory Filtering, Shipment Tracking, and Cost Calculation.

### System Design Choices
- **Global Continental Coverage**: Verified across America, Europe, Asia, and Africa with operational success.
- **Trade Agreement Integration**: Incorporates official data from major trade organizations (e.g., USMCA, UE, RCEP) to calculate real tariff savings.
- **Dynamic Content**: Features like automatic map zoom, product-specific company filtering, and company location markers.
- **Intelligent Filtering**: System applies trade regulations and country-specific restrictions during product discovery.
- **Multi-Continental Companies Integration**: Complete verification including direct companies, cooperatives, state enterprises, and trading companies across 68+ countries, totaling over 875 companies.
- **International Customs Nomenclator Optimization**: Enhanced search with intelligent synonyms, contextual search, automatic corrections, and a scoring system based on continental relevance and business popularity.

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection.
- **drizzle-orm**: Type-safe database ORM (PostgreSQL dialect).
- **@tanstack/react-query**: Server state management and caching.
- **@radix-ui/***: Accessible UI component primitives.
- **tailwindcss**: Utility-first CSS framework.

### UI and Styling
- **class-variance-authority**: Component variant management.
- **clsx**: Conditional className utility.
- **tailwind-merge**: Tailwind class merging utility.
- **lucide-react**: Icon library.

### Form and Validation
- **react-hook-form**: Form state management.
- **@hookform/resolvers**: Form validation resolvers.
- **zod**: Runtime type validation and schema generation.
- **drizzle-zod**: Integration between Drizzle and Zod.

### Additional Features
- **date-fns**: Date manipulation and formatting.
- **embla-carousel-react**: Carousel component.
- **connect-pg-simple**: PostgreSQL session store.
- **wouter**: Lightweight React router.