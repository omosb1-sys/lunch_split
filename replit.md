# Korean Lunch Decision App

## Overview

A mobile-first web application designed to help groups decide what to eat for lunch through voting and bill splitting features. The app provides three main functionalities: random menu recommendations, collaborative voting rooms, and bill splitting calculations. Built with a focus on Korean cuisine and Korean-speaking users, it emphasizes playful, efficient decision-making with a clean, food delivery app-inspired aesthetic.

**Current Status**: ✅ MVP Complete - All three core features implemented and tested end-to-end with real-time WebSocket updates working.

## Recent Changes

**October 26, 2025**
- ✅ Implemented complete MVP with three features: random menu picker, group voting rooms with real-time updates, and bill splitting calculator
- ✅ Fixed critical bug: JSON response parsing in vote room creation (apiRequest returns Response object requiring .json() call)
- ✅ Replaced all emoji usage with Lucide React icons per design guidelines (Soup, Beef, Salad, Sandwich, Pizza, etc.)
- ✅ Implemented WebSocket server for real-time vote broadcasting on `/ws` endpoint
- ✅ Added comprehensive data-testid attributes throughout for testing
- ✅ Passed full end-to-end test validating all features and user flows
- ✅ Korean language UI implemented throughout with Noto Sans KR font

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
- ✅ ACTIVE: WebSocket integration for live vote updates across clients
- Custom WebSocket client in VoteRoom.tsx connecting to `/ws` endpoint
- Server broadcasts "vote-update" events when new votes are submitted
- Frontend automatically refreshes vote counts when receiving updates
- Protocol detection: uses wss: for HTTPS, ws: for HTTP
- Same-origin WebSocket URL construction using window.location.host

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
- ✅ ACTIVE: In-memory storage implementation (`MemStorage`) as the current data persistence layer
- Storage interface (`IStorage`) defining the contract for data operations with complete CRUD methods
- Designed to support future database migration (Drizzle ORM configuration present)
- Current implementation: All data persists in memory during server session

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

## Key Implementation Patterns

### Frontend Patterns

**API Request Handling**
- ⚠️ IMPORTANT: `apiRequest()` in `client/src/lib/queryClient.ts` returns a `Response` object, NOT parsed JSON
- All mutations MUST call `.json()` on the response: `const data = await response.json()`
- Example:
  ```typescript
  mutationFn: async (data) => {
    const response = await apiRequest("POST", "/api/vote-rooms", data);
    return await response.json() as VoteRoom;  // Must parse JSON!
  }
  ```

**Icon System**
- NO EMOJIS allowed per design guidelines
- All visual icons use Lucide React components (Soup, Beef, Salad, Sandwich, Pizza, Utensils, Calculator, Users, Vote, etc.)
- Icons displayed in circular containers with `w-20 h-20` container, `bg-primary/10` background
- Icon size: `w-12 h-12` with `text-primary` color

**Menu Item Mapping**
- Korean menu names mapped to Lucide icons in `getMenuIcon()` function (VoteRoom.tsx, Home.tsx)
- Default fallback icon: Soup
- Common mappings: 김치찌개→Soup, 제육볶음→Beef, 비빔밥→Salad, 불고기→Beef, 파스타→Pizza

**Testing Attributes**
- Comprehensive `data-testid` attributes on all interactive elements
- Pattern: `{action}-{target}` (e.g., `button-create-room`, `input-voter-name`)
- For dynamic content: append unique ID (e.g., `card-menu-${index}`)

### Backend Patterns

**Storage Interface**
- All data operations go through `IStorage` interface in `server/storage.ts`
- Current implementation: `MemStorage` (in-memory)
- Methods: createVoteRoom, getVoteRoom, createVote, getVotesByRoom, createBillSplit, getBillSplit

**API Routes**
- POST `/api/vote-rooms` - Create voting room, returns VoteRoom with UUID
- GET `/api/vote-rooms/:id` - Get room by ID
- POST `/api/votes` - Submit vote, broadcasts WebSocket event
- GET `/api/votes/:roomId` - Get all votes for a room
- POST `/api/bill-splits` - Create bill split record (not actively used in UI)

**WebSocket Broadcasting**
- Server broadcasts on channel: `vote-update`
- Message payload: `{ type: 'vote-update', roomId: string }`
- Frontend listens and invalidates React Query cache for that room
- WebSocket URL: `/ws` (same origin)

**Validation**
- All POST endpoints validate request body using Zod schemas from `shared/schema.ts`
- Uses `insertVoteRoomSchema`, `insertVoteSchema`, etc.
- Returns 400 with error message if validation fails

## Feature Specifications

### 1. Random Menu Picker (Home Page)
- Displays grid of 6 Korean menu items with Lucide icons
- "메뉴 추천 받기" button triggers random selection with animation
- Selected menu highlighted with green border and checkmark
- Navigation buttons to voting and bill split features

### 2. Group Voting Rooms
**Creation Flow**:
- User enters room name and selects menu options (can add custom items)
- POST to `/api/vote-rooms` creates room with unique UUID
- Redirects to `/vote/:id` to view the room

**Voting Flow**:
- Participants enter name and click menu card to vote
- POST to `/api/votes` submits vote and broadcasts WebSocket event
- Real-time updates show vote counts, percentages, and progress bars
- Copy link button allows sharing room URL

**Real-time Updates**:
- WebSocket connection established on room page load
- Listens for `vote-update` events matching current roomId
- Invalidates React Query cache to trigger re-fetch
- Displays updated vote counts without page refresh

### 3. Bill Splitting Calculator
**Features**:
- Enter total amount in Korean won (₩)
- Add multiple participants by name
- Three splitting strategies:
  - **N빵** (Split evenly) - Equal shares
  - **계산하기** (Custom amounts) - Manually assign amounts per person
  - Remove individual people from the split
- Real-time calculation showing total, assigned, and remaining amounts
- Visual feedback with "정산 완료!" badge when fully allocated

## Important Notes for Future Development

### Known Technical Patterns
1. **Response Parsing**: Always parse JSON from `apiRequest()` responses
2. **Icon System**: Use Lucide React, never emoji characters
3. **WebSocket Protocol**: Auto-detects wss: vs ws: based on page protocol
4. **Korean Typography**: Noto Sans KR loaded via CDN, applied via Tailwind config

### Testing
- Comprehensive end-to-end test validates all features
- Tests cover: menu recommendation, room creation, voting flow, real-time updates, bill splitting
- All tests passing as of October 26, 2025

### Performance Considerations
- In-memory storage resets on server restart
- WebSocket connections cleaned up on component unmount
- React Query cache invalidation prevents stale data
- Vote polling fallback: 3-second interval in addition to WebSocket updates