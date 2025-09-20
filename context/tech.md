# Technology Stack

## Architecture
- **Monorepo Structure**: Frontend and backend in separate workspaces
- **Frontend**: Next.js 15.2.3 with App Router, React 19, TypeScript
- **Backend**: NestJS 11.0.1 with TypeScript, PostgreSQL, TypeORM
- **Authentication**: JWT with Passport strategies (local + Google OAuth)

## Frontend Stack
- **Framework**: Next.js 15.2.3 with App Router
- **UI Library**: HeroUI 2.8.2 (NextUI-based components)
- **Styling**: Tailwind CSS V4.1.8 with PostCSS
- **State Management**: TanStack React Query 5.80.2
- **Forms**: React Hook Form 7.56.4 with Zod validation
- **Testing**: Jest, Playwright for E2E

## Backend Stack
- **Framework**: NestJS 11.0.1
- **Database**: PostgreSQL with TypeORM 0.3.25
- **Authentication**: JWT 11.0.0, Passport 0.7.0, bcryptjs
- **Validation**: Class Validator & Class Transformer
- **File Upload**: Multer with AWS S3 support
- **API Documentation**: Swagger/OpenAPI

## Development Commands

### Root Level (Workspace)
```bash
npm run dev                 # Start both frontend and backend
npm run build              # Build both applications
npm run test               # Run all tests
npm run test:biodata       # Run biodata-specific tests
```

### Frontend (port 3000)
```bash
npm run dev                # Development server
npm run build              # Production build
npm run test:e2e           # Playwright E2E tests
npm run test:frontend      # Jest unit tests
```

### Backend (port 3001)
```bash
npm run dev                # Development with hot reload
npm run start              # Production start with migrations
npm run test:biodata       # Biodata service tests
npm run test:api           # API integration tests
npm run database:migration-seed  # Run migrations and seed data
```

## Environment Setup
- **Node.js**: 18.x or later required
- **Database**: PostgreSQL with auto-migration support
- **File Storage**: Local uploads + AWS S3 integration
- **CORS**: Configured for localhost:3000 and production domains

## Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for both frontend and backend
- **Path Aliases**: `@/` for frontend src directory
- **API Prefix**: All backend routes prefixed with `/api`