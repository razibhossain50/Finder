# Finder - Matrimony Platform Context

## Project Overview

**Finder** is a modern matrimony/biodata platform built with Next.js and NestJS, designed to help people find their perfect life partners. The platform features a comprehensive biodata management system with advanced search and filtering capabilities.

## Technology Stack

### Frontend
- **Framework**: Next.js 15.x with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS V4
- **UI Components**: HeroUI (NextUI-based), Radix UI primitives
- **State Management**: React Query (@tanstack/react-query)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Password Hashing**: bcryptjs

## Project Structure

```
finder_frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (client)/          # Client-facing pages
│   │   │   ├── (protected)/   # Protected routes
│   │   │   ├── auth/          # Authentication pages
│   │   │   └── profile/       # Profile-related pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Auth API routes
│   │   └── profile/           # Profile API routes
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── biodata/           # Biodata-related components
│   │   ├── form/              # Form components
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Base UI components
│   │   └── ...
│   ├── context/               # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utility functions
│   ├── api/                   # API client functions
│   └── icons/                 # SVG icons
├── backend/                   # NestJS backend
└── public/                    # Static assets
```

## Key Features

### 1. Biodata Management
- **Comprehensive Profiles**: Full biodata with personal, family, and preference information
- **Photo Management**: Profile picture upload and management
- **Privacy Controls**: Controlled access to sensitive information

### 2. Advanced Search & Filtering
- **Multi-criteria Search**: Filter by gender, marital status, location, age, profession, education
- **Location-based Search**: Hierarchical location filtering (Country > Division > District > Upazilla > Area)
- **Real-time Filtering**: Instant results as users modify search criteria
- **Pagination**: Efficient handling of large result sets

### 3. User Authentication
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access**: Different access levels for users and admins
- **Protected Routes**: Route protection for authenticated users

### 4. Responsive Design
- **Mobile-first**: Optimized for mobile devices
- **Modern UI**: Clean, modern interface with gradient backgrounds
- **Accessibility**: WCAG-compliant components

## Component Architecture

### BiodataSearch Component
A self-contained component that handles:
- API calls to fetch biodata
- Search and filtering logic
- Pagination
- Results display
- Favorites management
- Loading and error states

**Key Props**: None (fully self-contained)
**Features**:
- Real-time search filtering
- Responsive grid layout
- Integrated pagination
- Favorite/unfavorite functionality

### Form Components
- **LocationSelector**: Hierarchical location selection
- **CascadingSelect**: Dependent dropdown selections
- **MultiSelect**: Multiple option selection
- **Custom Input Components**: Styled form inputs with validation

### Layout Components
- **AppHeader**: Main navigation header
- **AppSidebar**: Collapsible sidebar navigation
- **Footer**: Site footer with links and information

## API Integration

### Endpoints
- `GET /api/biodatas` - Fetch all biodatas
- `GET /api/biodatas/:id` - Fetch specific biodata
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration

### Data Models

#### Biodata Interface
```typescript
interface Biodata {
  id: number;
  fullName: string;
  profilePicture?: string;
  age: number;
  biodataType: string; // 'Male' | 'Female'
  profession: string;
  maritalStatus: string;
  height: string;
  complexion?: string;
  religion?: string;
  educationMedium?: string;
  highestEducation?: string;
  // Location fields
  presentCountry?: string;
  presentDivision?: string;
  presentZilla?: string;
  presentArea?: string;
  permanentArea?: string;
  permanentZilla?: string;
  // ... additional fields
}
```

## Development Guidelines

### Code Style
- **TypeScript**: Strict typing throughout the application
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **Import Organization**: Absolute imports using `@/` alias

### State Management
- **React Query**: For server state management
- **React Context**: For global client state (auth, theme, sidebar)
- **Local State**: useState for component-specific state

### Styling Approach
- **Tailwind CSS**: Utility-first CSS framework
- **Component Variants**: Using class-variance-authority for component variants
- **Responsive Design**: Mobile-first approach with responsive utilities

## Environment Setup

### Prerequisites
- Node.js 18.x or later (recommended: Node.js 20.x+)
- PostgreSQL database
- npm or yarn package manager

### Installation
```bash
# Clone repository
git clone git@github.com:razibhossain50/Finder.git

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Start development servers
npm run dev        # Frontend
cd backend && npm run dev  # Backend
```

### Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL
- Database connection strings for backend
- JWT secrets for authentication

## Recent Updates

### BiodataSearch Component Refactor
- **Complete Self-containment**: Moved all search logic, API calls, and pagination into the component
- **Removed Dependencies**: Component no longer requires props or external state management
- **Enhanced UX**: Real-time filtering without manual search button clicks
- **Simplified Integration**: Can be dropped into any page with `<BiodataSearch />`

## Future Enhancements

### Planned Features
- **Advanced Matching Algorithm**: AI-powered compatibility matching
- **Chat System**: In-app messaging between matched users
- **Video Profiles**: Video introduction support
- **Mobile App**: React Native mobile application
- **Payment Integration**: Premium membership features

### Technical Improvements
- **Performance Optimization**: Image optimization, lazy loading
- **SEO Enhancement**: Better meta tags and structured data
- **Testing**: Comprehensive unit and integration tests
- **Monitoring**: Error tracking and performance monitoring

## Support & Documentation

### Key Files
- `README.md`: Installation and setup instructions
- `README_AUTH_IMPLEMENTATION.md`: Authentication implementation details
- `ROUTE_PROTECTION_GUIDE.md`: Route protection guidelines
- `context.md`: This comprehensive project context

### Development Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

This context provides a comprehensive overview of the Finder matrimony platform, its architecture, components, and development guidelines for efficient collaboration and maintenance.