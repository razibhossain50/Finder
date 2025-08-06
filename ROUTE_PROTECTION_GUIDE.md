# 🛡️ Route Protection Guide

## Overview
This project implements a comprehensive route protection system that separates public and protected routes using Next.js route groups and React context.

## 🏗️ Architecture

### Route Structure
```
src/app/(client)/
├── auth/                    # 🔓 Public auth routes
│   ├── login/
│   └── signup/
├── search/                  # 🔓 Public search routes
│   ├── partner/
│   └── doctor/
├── (protected)/            # 🔒 Protected route group
│   ├── layout.tsx          # ProtectedRoute wrapper
│   ├── dashboard/
│   ├── profile/
│   ├── messages/
│   └── settings/
├── layout.tsx              # RegularAuthProvider wrapper
└── page.tsx                # 🔓 Public home page
```

## 🔓 Public Routes (No Authentication Required)

### Home & Landing
- **`/`** - Home page with app introduction
- **`/search/partner`** - Browse partner profiles (public preview)
- **`/search/doctor`** - Browse doctor profiles (public preview)

### Authentication
- **`/auth/login`** - User login form
- **`/auth/signup`** - User registration form

**Note**: Auth pages automatically redirect authenticated users to `/dashboard`

## 🔒 Protected Routes (Authentication Required)

All routes under `(protected)/` require user authentication:

### Dashboard & Overview
- **`/dashboard`** - Main user dashboard with stats and overview
- **`/dashboard/profile/`** - Profile management sections

### User Management
- **`/profile`** - Edit personal profile and information
- **`/messages`** - Messaging system and conversations
- **`/settings`** - Account settings and preferences

## 🛡️ Protection Implementation

### 1. Route Group Protection
```typescript
// src/app/(client)/(protected)/layout.tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

### 2. ProtectedRoute Component
```typescript
// src/components/auth/ProtectedRoute.tsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useRegularAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  
  return <>{children}</>;
}
```

### 3. Auth Redirect Component
```typescript
// src/components/auth/AuthRedirect.tsx
export default function AuthRedirect({ children }) {
  const { isAuthenticated, isLoading } = useRegularAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isAuthenticated) return null;
  return <>{children}</>;
}
```

## 🔐 Authentication Context

### RegularAuthContext Features
- **Separate Storage**: Uses `regular_user_access_token` and `regular_user`
- **Role Validation**: Only allows users with `role: 'user'`
- **Auto Redirect**: Redirects to `/dashboard` on successful auth
- **Token Management**: Handles JWT token storage and cleanup

### Usage in Components
```typescript
import { useRegularAuth } from '@/context/RegularAuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useRegularAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user.fullName}!</div>;
}
```

## 🚀 Navigation Flow

### For Unauthenticated Users
1. **Visit any protected route** → Redirected to `/auth/login`
2. **Visit auth pages** → Can access login/signup forms
3. **Visit public routes** → Full access to search and home

### For Authenticated Users
1. **Visit protected routes** → Full access granted
2. **Visit auth pages** → Redirected to `/dashboard`
3. **Visit public routes** → Full access with authenticated header

## 🎯 Header Integration

The header dynamically shows different content based on authentication:

### Unauthenticated State
- Login and Sign Up buttons
- Basic navigation menu
- Guest user dropdown

### Authenticated State
- User welcome message
- Protected route links (Dashboard, Profile, Messages, Settings)
- Logout functionality

## 🔧 Adding New Protected Routes

To add a new protected route:

1. **Create the route** under `src/app/(client)/(protected)/`
2. **No additional protection needed** - automatically protected by layout
3. **Add navigation link** to header dropdown if needed

Example:
```bash
# Create new protected route
mkdir src/app/(client)/(protected)/favorites
touch src/app/(client)/(protected)/favorites/page.tsx
```

## 🔍 Testing Protection

### Manual Testing
1. **Visit protected route while logged out** → Should redirect to login
2. **Log in successfully** → Should redirect to dashboard
3. **Visit auth pages while logged in** → Should redirect to dashboard
4. **Log out** → Should redirect to login and clear storage

### Key Test Cases
- ✅ Unauthenticated access to protected routes
- ✅ Authenticated access to auth pages
- ✅ Token persistence across page refreshes
- ✅ Proper cleanup on logout
- ✅ Role-based access control

## 🛠️ Troubleshooting

### Common Issues
1. **Infinite redirect loops** - Check authentication state logic
2. **Flash of protected content** - Ensure loading states are handled
3. **Token not persisting** - Verify localStorage keys are correct
4. **Role access denied** - Check user role matches expected value

### Debug Tips
```typescript
// Add to components for debugging
const { user, isAuthenticated, isLoading } = useRegularAuth();
console.log('Auth State:', { user, isAuthenticated, isLoading });
```

This route protection system provides a secure, scalable foundation for managing user access across the application while maintaining a smooth user experience.