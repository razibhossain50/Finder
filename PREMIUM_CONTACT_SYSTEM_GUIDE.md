# Premium Biodata Contact System Implementation Guide

## Overview

This implementation adds a premium contact system to your matrimony platform where users need to purchase connection tokens to view biodata contact information. The system integrates with bKash payment gateway for seamless payments.

## Features Implemented

### 1. Connection Token System
- Users purchase tokens to view contact information
- Each biodata contact view costs 1 token
- Token balance is tracked per user
- Tokens are deducted when contact info is accessed

### 2. bKash Payment Integration
- Secure payment processing through bKash API
- Multiple token packages with discounts
- Payment callback handling
- Transaction history tracking

### 3. Premium Contact Protection
- Contact information (email, mobile numbers) is hidden by default
- Only accessible after purchasing tokens
- Users can view their own biodata contact info for free
- Admin users have full access

### 4. User Dashboard Features
- Token balance display
- Connection history
- Payment history
- Purchase tokens interface

## Backend Implementation

### New Entities

#### Payment Entity (`backend/src/payment/payment.entity.ts`)
- Tracks all payment transactions
- Stores bKash transaction details
- Links payments to users and token amounts

#### Connection Entity (`backend/src/connection/connection.entity.ts`)
- Records when users purchase biodata contact access
- Tracks token usage
- Prevents duplicate purchases

### New Services

#### PaymentService (`backend/src/payment/payment.service.ts`)
- Handles bKash payment creation and execution
- Manages token balance updates
- Provides payment history

#### ConnectionService (`backend/src/connection/connection.service.ts`)
- Manages contact access purchases
- Validates user permissions
- Provides connection statistics

### API Endpoints

#### Payment Endpoints
- `POST /api/payments/bkash/create` - Create bKash payment
- `POST /api/payments/bkash/execute` - Execute bKash payment
- `GET /api/payments/tokens/balance` - Get user token balance
- `GET /api/payments/history` - Get payment history

#### Connection Endpoints
- `POST /api/connections/purchase/:biodataId` - Purchase contact access
- `GET /api/connections/check-access/:biodataId` - Check if user has access
- `GET /api/connections/contact/:biodataId` - Get contact information
- `GET /api/connections/my-connections` - Get user's connections

## Frontend Implementation

### New Components

#### TokenBalance (`src/components/payment/TokenBalance.tsx`)
- Displays user's current token balance
- Real-time balance updates

#### BuyTokensModal (`src/components/payment/BuyTokensModal.tsx`)
- Token purchase interface
- Multiple package options with discounts
- bKash payment integration

#### ContactInfoCard (`src/components/biodata/ContactInfoCard.tsx`)
- Premium contact information display
- Purchase access interface
- Token requirement indication

#### PaymentCallback (`src/app/(client)/payment/callback/page.tsx`)
- Handles bKash payment responses
- Success/failure status display

## Configuration

### Environment Variables (backend/.env)

```env
# bKash Payment Configuration
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your_bkash_username
BKASH_PASSWORD=your_bkash_password
BKASH_APP_KEY=your_bkash_app_key
BKASH_APP_SECRET=your_bkash_app_secret
FRONTEND_URL=http://localhost:3000
```

### Database Migration

Run the migration script to add the new tables:

```sql
-- Run the migration file
psql -d your_database -f backend/migrations/add-premium-contact-system.sql
```

## Token Packages

The system includes 4 token packages:

1. **10 Tokens** - ৳100 (৳10 per token)
2. **25 Tokens** - ৳200 (৳8 per token) - 20% OFF - **Popular**
3. **50 Tokens** - ৳350 (৳7 per token) - 30% OFF
4. **100 Tokens** - ৳600 (৳6 per token) - 40% OFF

## Usage Flow

### For Users:
1. Browse biodata profiles (contact info hidden)
2. Click "View Contact Info" on desired profile
3. If insufficient tokens, redirected to purchase tokens
4. Complete bKash payment
5. Tokens added to account automatically
6. Access granted to view contact information

### For Admins:
- View all payments and connections
- Access global statistics
- Manage user token balances

## Security Features

- JWT authentication for all premium endpoints
- User ownership validation
- Duplicate purchase prevention
- Secure bKash API integration
- Transaction logging and audit trail

## Testing

### Test the Implementation:

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend server:**
   ```bash
   npm run dev
   ```

3. **Test the flow:**
   - Register/login as a user
   - Browse biodata profiles
   - Try to view contact information
   - Purchase tokens through bKash (use sandbox credentials)
   - Verify token balance updates
   - Access contact information

## bKash Integration Setup

### 1. Get bKash Credentials
- Register for bKash merchant account
- Get sandbox credentials for testing
- Get production credentials for live deployment

### 2. Configure Webhook URLs
- Set callback URL in bKash merchant panel
- Configure success/failure/cancel URLs

### 3. Test Payment Flow
- Use bKash sandbox environment for testing
- Test with different payment scenarios
- Verify webhook handling

## Deployment Considerations

### Production Setup:
1. Update bKash URLs to production endpoints
2. Set secure environment variables
3. Configure SSL certificates
4. Set up database backups
5. Monitor payment transactions
6. Set up error logging and alerts

### Security Checklist:
- [ ] Secure API endpoints with proper authentication
- [ ] Validate all payment data
- [ ] Implement rate limiting
- [ ] Set up CORS properly
- [ ] Use HTTPS in production
- [ ] Secure database connections
- [ ] Implement proper error handling

## Monitoring and Analytics

### Key Metrics to Track:
- Token purchase conversion rate
- Average tokens per user
- Most popular token packages
- Payment success/failure rates
- User engagement with premium features

### Recommended Tools:
- Payment transaction monitoring
- User behavior analytics
- Error tracking and logging
- Performance monitoring

## Support and Maintenance

### Regular Tasks:
- Monitor payment transactions
- Handle failed payments
- Update token packages based on usage
- Maintain bKash API integration
- User support for payment issues

### Troubleshooting:
- Check bKash API status for payment issues
- Verify database connections
- Monitor server logs for errors
- Test payment flow regularly

## Future Enhancements

### Potential Features:
1. **Subscription Plans** - Monthly/yearly unlimited access
2. **Bulk Discounts** - Special rates for high-volume users
3. **Referral System** - Earn tokens by referring users
4. **Token Expiry** - Time-limited tokens for urgency
5. **Premium Profiles** - Enhanced profile features
6. **Mobile App Integration** - Native mobile payment support

This implementation provides a complete premium contact system that can generate revenue while maintaining user experience and security.