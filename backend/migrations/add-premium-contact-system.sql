-- Migration: Add Premium Contact System
-- This migration adds the payment and connection system for premium biodata contact access

-- Add connectionTokens column to users table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "connectionTokens" integer DEFAULT 0;

-- Create payments table
CREATE TABLE IF NOT EXISTS "payments" (
    "id" SERIAL PRIMARY KEY,
    "userId" integer NOT NULL,
    "amount" decimal(10,2) NOT NULL,
    "tokens" integer NOT NULL,
    "paymentMethod" varchar NOT NULL,
    "transactionId" varchar NOT NULL,
    "bkashTransactionId" varchar NOT NULL,
    "status" varchar DEFAULT 'pending',
    "paymentDetails" json,
    "createdAt" timestamp DEFAULT now(),
    "updatedAt" timestamp DEFAULT now(),
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

-- Create connections table
CREATE TABLE IF NOT EXISTS "connections" (
    "id" SERIAL PRIMARY KEY,
    "buyerId" integer NOT NULL,
    "biodataId" integer NOT NULL,
    "tokensUsed" integer DEFAULT 1,
    "status" varchar DEFAULT 'active',
    "createdAt" timestamp DEFAULT now(),
    FOREIGN KEY ("buyerId") REFERENCES "user"("id") ON DELETE CASCADE,
    FOREIGN KEY ("biodataId") REFERENCES "biodata"("id") ON DELETE CASCADE,
    UNIQUE("buyerId", "biodataId")
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_payments_userId" ON "payments"("userId");
CREATE INDEX IF NOT EXISTS "idx_payments_status" ON "payments"("status");
CREATE INDEX IF NOT EXISTS "idx_connections_buyerId" ON "connections"("buyerId");
CREATE INDEX IF NOT EXISTS "idx_connections_biodataId" ON "connections"("biodataId");
CREATE INDEX IF NOT EXISTS "idx_connections_status" ON "connections"("status");

-- Update existing users to have 0 connection tokens (if column was just added)
UPDATE "user" SET "connectionTokens" = 0 WHERE "connectionTokens" IS NULL;