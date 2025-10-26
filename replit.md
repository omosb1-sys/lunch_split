# Korean Lunch Decision App

## Overview

A mobile-first web application designed to help groups decide what to eat for lunch through voting and bill splitting features. The app provides three main functionalities: random menu recommendations, collaborative voting rooms, and bill splitting calculations. Built with a focus on Korean cuisine and Korean-speaking users, it emphasizes playful, efficient decision-making with a clean, food delivery app-inspired aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing (alternative to React Router)
- Mobile-first responsive design with Tailwind CSS

**UI Component System**
- Shadcn/ui component library (New York variant) providing accessible, customizable components built on Radix UI primitives
- Extensive use of Radix UI primitives for accessibility (@radix-ui/react-* packages)
- Class Variance Authority (CVA) for managing component style variants
- Custom design system following Material Design interaction patterns with food delivery app aesthetics

**State Management**
- TanStack Query (React Query) v5 for server state management, caching, and data synchronization
- React Hook Form with Zod resolvers for form state and validation
- Local component state using React hooks

**Real-time Communication**
- WebSocket integration for live vote updates across clients
- Custom WebSocket client in the frontend connecting to `/ws` endpoint

**Styling Architecture**
- Tailwind CSS with custom configuration extending the base theme
- CSS custom properties (HSL-based color system) for theming support
- Custom utility classes for elevation (`hover-elevate`, `active-elevate-2`)
- Typography system using Noto Sans KR (primary for Korean) and Inter (secondary for Latin/numbers)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Node.js with ES Modules (type: "module")
- TypeScript for type safety across the stack

**API Structure**
- RESTful API endpoints under `/api/*` prefix
- WebSocket server for real-time updates using `ws` library
- JSON-based request/response format with validation

**Data Layer**
- In-memory storage implementation (`MemStorage`) as the current data persistence layer
- Storage interface (`IStorage`) defining the contract for data operations
- Designed to support future database migration (Drizzle ORM configuration present)

**Session Management**
- Express session middleware with potential PostgreSQL session store (`connect-pg-simple` available)

**Development Workflow**
- Vite middleware mode integrated with Express for seamless development experience
- Hot Module Replacement (HMR) support
- Custom error logging and request logging middleware

### Database Design (Prepared but Not Active)

**ORM & Migration Tool**
- Drizzle ORM configured for PostgreSQL with Neon serverless adapter
- Schema-first approach with Zod validation schemas generated from database schema
- Migration files configured to output to `./migrations` directory

**Schema Structure**

Three main tables defined:

1. **vote_rooms** - Voting session management
   - `id` (UUID, primary key)
   - `name` (text) - Room title
   - `menu_options` (text array) - Available menu choices
   - `created_at` (timestamp)

2. **votes** - Individual vote records
   - `id` (UUID, primary key)
   - `room_id` (varchar) - Reference to vote room
   - `menu_option` (text) - Selected menu choice
   - `voter_name` (text) - Name of voter
   - `created_at` (timestamp)

3. **bill_splits** - Bill splitting sessions
   - `id` (UUID, primary key)
   - `total_amount` (integer) - Total bill amount
   - `people` (text array) - List of participants
   - `created_at` (timestamp)

**Validation Layer**
- Drizzle-Zod integration for automatic schema validation
- Insert schemas strip auto-generated fields (id, createdAt)
- TypeScript types inferred from schemas for type safety

### External Dependencies

**Third-Party UI Libraries**
- Radix UI component primitives (20+ packages) for accessible, unstyled components
- Embla Carousel for carousel functionality
- Lucide React for iconography
- CMDK for command palette functionality
- Date-fns for date manipulation and formatting

**Development Tools**
- Replit-specific plugins for development environment integration
- Runtime error overlay for better debugging
- Cartographer and dev banner plugins (Replit-specific)

**Build & Type Checking**
- esbuild for server-side bundling in production
- TypeScript compiler for type checking (noEmit mode)
- PostCSS with Tailwind and Autoprefixer for CSS processing

**Database & Infrastructure (Configured)**
- @neondatabase/serverless for PostgreSQL connections
- Drizzle Kit for database migrations
- WebSocket (ws) library for real-time bidirectional communication

**Potential Integration Points**
- Google Fonts API (Noto Sans KR, Inter) loaded via CDN
- Future authentication system (User schema defined but not implemented)
- Future PostgreSQL database (configuration ready via DATABASE_URL environment variable)