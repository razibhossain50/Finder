# Product Overview

**Mawami** is a comprehensive matrimony/biodata platform designed to help people find their perfect life partners.

## Core Features
- **User Registration & Authentication**: Regular users and Google OAuth integration
- **Biodata Management**: Multi-step biodata creation and editing with profile pictures
- **Search & Discovery**: Advanced filtering by gender, age, location, marital status
- **Admin Panel**: Complete biodata and user management system
- **Profile Views**: View tracking and analytics for biodata visibility
- **Favorites System**: Users can favorite and manage preferred profiles
- **Status Management**: Dual-layer approval system (admin approval + user visibility)

## User Types
- **Regular Users**: Create and manage their biodata, search other profiles
- **Admin**: Approve/reject biodatas, manage users, view analytics
- **Superadmin**: Full system access including user deletion

## Key Business Logic
- Biodatas require admin approval before becoming publicly visible
- Users can toggle their biodata visibility (if approved)
- Profile views are tracked with 24-hour cooldown per viewer
- Multi-step form process for biodata creation with progress tracking