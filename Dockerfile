# Multi-stage build for backend only
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci --only=production --workspace backend

# Build the backend
FROM base AS builder
WORKDIR /app

# Copy package files and source
COPY package*.json ./
COPY backend/ ./backend/

# Install all dependencies (including dev)
RUN npm ci --workspace backend

# Build the backend
RUN npm --workspace backend run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=deps --chown=nestjs:nodejs /app/backend/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/backend/package.json ./package.json

USER nestjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "dist/main"]