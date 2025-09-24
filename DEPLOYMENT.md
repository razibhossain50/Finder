# Deployment Guide

This project is configured to deploy the frontend on Vercel and backend + database on Railway.

## Prerequisites

1. Install Vercel CLI: `npm i -g vercel`
2. Install Railway CLI: `npm i -g @railway/cli`

## Frontend Deployment (Vercel)

### First Time Setup
1. Login to Vercel: `vercel login`
2. Link your project: `vercel link`
3. Deploy: `vercel --prod`

### Environment Variables on Vercel
Set these in your Vercel dashboard:
- `NEXT_PUBLIC_APP_NAME=mawami`
- `NEXT_PUBLIC_APP_VERSION=0.0.1`
- `NEXT_PUBLIC_ENVIRONMENT=production`
- `NEXT_PUBLIC_API_BASE_URL=https://your-backend-railway-url.up.railway.app`
- `NEXT_PUBLIC_API_TIMEOUT=10000`
- `NEXT_PUBLIC_R2_BASE_URL=https://pub-313f0e621b7a49c1ae5f1a8226cea653.r2.dev`

## Backend Deployment (Railway)

### First Time Setup
1. Login to Railway: `railway login`
2. Create new project: `railway new`
3. Link your project: `railway link`

### Environment Variables on Railway
Set these in your Railway dashboard:
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-vercel-url.vercel.app`
- `DATABASE_URL=postgresql://postgres:password@host:port/database`
- `JWT_SECRET=your-jwt-secret`
- `JWT_EXPIRES_IN=1d`
- `GOOGLE_CLIENT_ID=your-google-client-id`
- `GOOGLE_CLIENT_SECRET=your-google-client-secret`
- `GOOGLE_CALLBACK_URL=https://your-backend-railway-url.up.railway.app/auth/google/callback`
- `RECAPTCHA_SECRET_KEY=your-recaptcha-secret`
- `CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id`
- `R2_PUBLIC_URL=your-r2-public-url`
- `R2_BUCKET_NAME=your-bucket-name`
- `R2_ACCESS_KEY_ID=your-access-key`
- `R2_SECRET_ACCESS_KEY=your-secret-key`

### Database Setup on Railway
1. Add PostgreSQL service to your Railway project
2. Copy the connection string to `DATABASE_URL`

## Deployment Commands

### Deploy Frontend to Vercel
```bash
npm run deploy:vercel
```

### Deploy Backend to Railway
```bash
npm run deploy:railway
```

## Post-Deployment Steps

1. Update `NEXT_PUBLIC_API_BASE_URL` in Vercel with your Railway backend URL
2. Update `FRONTEND_URL` in Railway with your Vercel frontend URL
3. Update `GOOGLE_CALLBACK_URL` in Railway with your new backend URL
4. Test the deployment by visiting both URLs

## CORS Configuration

Make sure your backend allows requests from your Vercel domain. Update your CORS configuration in the backend to include your Vercel URL.

## Monitoring

- Frontend logs: Vercel dashboard
- Backend logs: Railway dashboard
- Database logs: Railway PostgreSQL service logs