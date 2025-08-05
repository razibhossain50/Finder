# Finder - Matrimony Platform Context

## Project Overview

**Finder** is a comprehensive matrimony/biodata platform built with Next.js and NestJS, designed to help people find their perfect life partners. The platform features a complete biodata management system with advanced search capabilities, admin panel for user management, and role-based authentication system.

## Technology Stack

### Frontend (Version 2.0.2)
- **Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript 5.x
- **Runtime**: React 19.0.0
- **Styling**: Tailwind CSS V4.1.8 with PostCSS
- **UI Components**: HeroUI 2.8.2 (NextUI-based)
- **State Management**: TanStack React Query 5.80.2
- **Forms**: React Hook Form 7.56.4 with Zod 3.25.45 validation
- **Icons**: Lucide React 0.511.0
- **Animations**: Framer Motion 12.23.12
- **Charts**: ApexCharts 4.3.0 with React ApexCharts
- **Calendar**: FullCalendar 6.1.15
- **Maps**: React JVectorMap
- **File Upload**: React Dropzone 14.3.5
- **Drag & Drop**: React DND 16.0.1
- **Utilities**: Class Variance Authority, clsx, Tailwind Merge

### Backend
- **Framework**: NestJS 11.0.1
- **Language**: TypeScript 5.7.3
- **Database**: PostgreSQL with TypeORM 0.3.25
- **Authentication**: JWT 11.0.0 with Passport 0.7.0
- **Password Hashing**: bcryptjs 3.0.2
- **Validation**: Class Validator 0.14.2 & Class Transformer 0.5.1
- **Configuration**: NestJS Config 4.0.2

## Project Structure

```
finder_frontend/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (client)/                  # Client-facing application
│   │   │   ├── (protected)/           # Protected user routes
│   │   │   │   ├── dashboard/         # User dashboard
│   │   │   │   ├── profile/           # User profile management
│   │   │   │   └── settings/          # User settings
│   │   │   ├── auth/                  # Client authentication
│   │   │   │   ├── login/             # User login page
│   │   │   │   └── signup/            # User registration page
│   │   │   ├── profile/               # Public profile views
│   │   │   │   └── biodatas/          # Biodata search & display
│   │   │   ├── layout.tsx             # Client layout wrapper
│   │   │   └── page.tsx               # Client homepage
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── (pages)/               # Admin pages
│   │   │   │   ├── biodatas/          # Biodata management
│   │   │   │   ├── users/             # User management
│   │   │   │   ├── table/             # Data tables
│   │   │   │   └── blank/             # Blank page template
│   │   │   ├── videos/                # Video management
│   │   │   ├── layout.tsx             # Admin layout
│   │   │   └── page.tsx               # Admin dashboard
│   │   ├── auth/                      # Authentication routes
│   │   │   └── admin/                 # Admin authentication
│   │   │       └── login/             # Admin login page
│   │   └── profile/                   # Profile API routes
│   │       └── [id]/                  # Dynamic profile routes
│   ├── components/                    # Reusable components
│   │   ├── auth/                      # Authentication components
│   │   │   ├── AuthRedirect.tsx       # Auth redirect logic
│   │   │   ├── LoginFormRegular.tsx   # User login form
│   │   │   ├── SignUpFormRegular.tsx  # User signup form
│   │   │   └── ProtectedRoute.tsx     # Route protection
│   │   ├── biodata/                   # Biodata components
│   │   │   └── BiodataSearch.tsx      # Search & filter component
│   │   ├── common/                    # Common utilities
│   │   │   ├── GridShape.tsx          # Grid background
│   │   │   ├── PageBreadCrumb.tsx     # Breadcrumb navigation
│   │   │   ├── QueryProvider.tsx      # React Query provider
│   │   │   └── ThemeToggleButton.tsx  # Theme switcher
│   │   ├── dashboard/                 # Dashboard components
│   │   │   ├── EcommerceMetrics.tsx   # Metrics display
│   │   │   ├── MonthlySalesChart.tsx  # Sales charts
│   │   │   └── MonthlyTarget.tsx      # Target tracking
│   │   ├── form/                      # Form components
│   │   │   ├── Label.tsx              # Form labels
│   │   │   └── LocationSelector.tsx   # Location picker
│   │   ├── layout/                    # Layout components
│   │   │   ├── AppHeader.tsx          # Main header
│   │   │   ├── AppSidebar.tsx         # Sidebar navigation
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── UserDropdown.tsx       # User menu
│   │   │   └── NotificationDropdown.tsx # Notifications
│   │   ├── profile/                   # Profile components
│   │   │   └── marriage/              # Marriage-related forms
│   │   └── ui/                        # Base UI components
│   │       ├── dropdown/              # Dropdown components
│   │       └── cascading-select.tsx   # Cascading selects
│   ├── context/                       # React contexts
│   │   └── RegularAuthContext.tsx     # User authentication context
│   ├── hooks/                         # Custom hooks
│   ├── lib/                           # Utility functions
│   ├── api/                           # API client functions
│   └── icons/                         # SVG icons
├── backend/                           # NestJS backend
│   └── src/
│       ├── auth/                      # Authentication module
│       │   ├── decorators/            # Custom decorators
│       │   ├── dto/                   # Data transfer objects
│       │   ├── guards/                # Auth guards
│       │   ├── interfaces/            # Auth interfaces
│       │   ├── strategies/            # Passport strategies
│       │   ├── auth.controller.ts     # Auth endpoints
│       │   ├── auth.service.ts        # Auth business logic
│       │   └── auth.module.ts         # Auth module config
│       ├── biodata/                   # Biodata module
│       │   ├── dto/                   # Biodata DTOs
│       │   ├── entities/              # Database entities
│       │   ├── biodata.controller.ts  # Biodata endpoints
│       │   ├── biodata.service.ts     # Biodata business logic
│       │   ├── biodata.entity.ts      # Biodata entity
│       │   └── biodata.module.ts      # Biodata module config
│       ├── user/                      # User module
│       │   ├── user.controller.ts     # User endpoints
│       │   ├── user.service.ts        # User business logic
│       │   ├── user.entity.ts         # User entity
│       │   └── *.dto.ts               # User DTOs
│       ├── app.module.ts              # Main app module
│       └── main.ts                    # Application entry point
└── public/                            # Static assets
    ├── icons/                         # Icon assets
    └── images/                        # Image assets
```

## Key Features

### 1. Comprehensive Authentication System
- **Dual Authentication**: Separate login systems for users and admins
- **Role-based Access Control**: User, Admin, and Superadmin roles
- **JWT Token Management**: Secure token-based authentication with automatic role detection
- **Smart Redirects**: Automatic redirection based on user roles (users → dashboard, admins → admin panel)
- **Protected Routes**: Route protection for both user and admin areas
- **Auto-created Accounts**: 
  - Superadmin: `admin@example.com` / `aaaaa`
  - Test User: `user@example.com` / `12345`

### 2. Advanced Admin Panel
- **User Management**: Complete CRUD operations for user accounts
  - View all users with dynamic data from database
  - Delete users with confirmation dialogs
  - Role-based filtering (User/Admin/Superadmin)
  - Search by name or email
  - Pagination and sorting capabilities
- **Biodata Management**: Full biodata administration
  - View all biodatas (Active/Inactive/Pending)
  - Status management with approval workflow
  - Real-time status updates
  - Individual biodata review and editing
- **Dashboard Analytics**: Comprehensive admin dashboard with metrics
- **Data Tables**: Professional data tables with sorting, filtering, and pagination

### 3. Biodata Management System
- **Multi-step Biodata Creation**: Comprehensive profile building process
- **Status Workflow**: Inactive → Pending → Active status management
- **Admin Approval System**: Admins can approve/reject biodata submissions
- **Profile Picture Management**: Image upload and display
- **Comprehensive Data Fields**: 50+ fields covering personal, family, education, and preferences
- **Privacy Controls**: Controlled access to sensitive information

### 4. Advanced Search & Discovery
- **BiodataSearch Component**: Self-contained search with real-time filtering
- **Multi-criteria Filtering**: Gender, marital status, location, age, profession, education
- **Location-based Search**: Hierarchical filtering (Country → Division → District → Upazilla → Area)
- **Real-time Results**: Instant filtering without page reloads
- **Pagination**: Efficient handling of large datasets
- **Responsive Grid**: Mobile-optimized biodata cards

### 5. Modern UI/UX Design
- **HeroUI Components**: Professional UI component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Theme switching capability
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: WCAG-compliant components and interactions

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

### Authentication Endpoints
- `POST /auth/login` - User/Admin authentication with role-based redirects
- `POST /auth/signup` - User registration with automatic login
- `POST /auth/logout` - Secure logout with token cleanup

### User Management Endpoints
- `GET /api/users` - Fetch all users (Admin only)
- `GET /api/users/:id` - Fetch specific user
- `PUT /api/users/:id` - Update user information
- `PUT /api/users/:id/password` - Update user password
- `DELETE /api/users/:id` - Delete user (Admin only, with superadmin protection)

### Biodata Management Endpoints
- `GET /api/biodatas` - Fetch all public biodatas
- `GET /api/biodatas/search` - Advanced biodata search with filters
- `GET /api/biodatas/admin/all` - Fetch all biodatas for admin (includes inactive)
- `GET /api/biodatas/current` - Get current user's biodata
- `GET /api/biodatas/:id` - Fetch specific biodata
- `POST /api/biodatas` - Create new biodata
- `PUT /api/biodatas/current` - Update current user's biodata
- `PUT /api/biodatas/:id/status` - Update biodata status (Admin only)
- `PUT /api/biodatas/:id/step/:step` - Update biodata step in multi-step form

### Data Models

#### User Interface
```typescript
interface User {
  id: number;
  email: string;
  fullName: string | null;
  role: 'user' | 'admin' | 'superadmin';
  createdAt: string;
  updatedAt: string;
}
```

#### Biodata Interface
```typescript
interface Biodata {
  id: number;
  step: number;
  userId: number | null;
  completedSteps: number | null;
  
  // Partner Preferences
  partnerAgeMin: number;
  partnerAgeMax: number;
  partnerComplexion: string;
  partnerHeight: string;
  partnerEducation: string;
  partnerProfession: string;
  partnerLocation: string;
  partnerDetails: string;
  
  // Basic Information
  sameAsPermanent: boolean;
  religion: string;
  biodataType: string; // 'Male' | 'Female'
  maritalStatus: string;
  dateOfBirth: string;
  age: number;
  height: string;
  weight: number;
  complexion: string;
  profession: string;
  bloodGroup: string;
  
  // Location Information
  permanentCountry: string;
  permanentDivision: string;
  permanentZilla: string;
  permanentUpazilla: string;
  permanentArea: string;
  presentCountry: string;
  presentDivision: string;
  presentZilla: string;
  presentUpazilla: string;
  presentArea: string;
  
  // Health & Education
  healthIssues: string;
  educationMedium: string;
  highestEducation: string;
  instituteName: string;
  subject: string;
  passingYear: number;
  result: string;
  economicCondition: string;
  
  // Family Information
  fatherName: string;
  fatherProfession: string;
  fatherAlive: string;
  motherName: string;
  motherProfession: string;
  motherAlive: string;
  brothersCount: number;
  sistersCount: number;
  familyDetails: string;
  
  // Contact Information
  fullName: string;
  profilePicture: string | null;
  email: string;
  guardianMobile: string;
  ownMobile: string;
  
  // Status Management
  status: 'Active' | 'Inactive' | 'Pending' | null;
}
```

#### Search Filters Interface
```typescript
interface BiodataFilters {
  gender?: string;
  maritalStatus?: string;
  location?: string;
  biodataNumber?: string;
  ageMin?: number;
  ageMax?: number;
  page?: number;
  limit?: number;
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

## Recent Updates & Implementations

### Authentication System Overhaul
- **Fixed Circular Dependencies**: Resolved RegularAuthContext initialization issues
- **Smart Role-based Routing**: Automatic redirection based on user roles
- **Dual Token System**: Separate token management for users and admins
- **Auto-created Test Accounts**: Superadmin and test user accounts for development

### Admin Panel Implementation
- **Dynamic Users Table**: Real-time user management with database integration
- **User Deletion System**: Confirmation dialogs with superadmin protection
- **Biodata Status Management**: Complete approval workflow for biodata submissions
- **Professional Data Tables**: Sorting, filtering, pagination, and search capabilities

### BiodataSearch Component Refactor
- **Complete Self-containment**: Moved all search logic, API calls, and pagination into the component
- **Removed Dependencies**: Component no longer requires props or external state management
- **Enhanced UX**: Real-time filtering without manual search button clicks
- **Simplified Integration**: Can be dropped into any page with `<BiodataSearch />`

### Backend API Enhancements
- **User Management Endpoints**: Complete CRUD operations for user accounts
- **Biodata Admin Endpoints**: Admin-specific biodata management APIs
- **Status Update System**: Real-time biodata status management
- **Security Improvements**: Role-based access control and input validation

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