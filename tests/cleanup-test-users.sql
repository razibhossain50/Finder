-- Cleanup script for test users created during email uniqueness testing
-- Run this in your PostgreSQL database to remove test users

-- Remove test users by email pattern
DELETE FROM "user" 
WHERE email LIKE 'test.uniqueness%@example.com';

-- Verify cleanup
SELECT id, email, "fullName", role, "createdAt" 
FROM "user" 
WHERE email LIKE 'test%@example.com'
ORDER BY "createdAt" DESC;

-- Show remaining user count
SELECT COUNT(*) as total_users FROM "user";