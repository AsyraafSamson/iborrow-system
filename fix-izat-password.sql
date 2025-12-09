-- Fix password for izat@ilkkm.edu.my
-- This updates the plain text password to a proper bcrypt hash
-- The password will be: password123

-- Use one of these hashes generated from bcrypt('password123'):
UPDATE users SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE email = 'izat@ilkkm.edu.my';

-- Verify the update
SELECT email, nama, peranan, status, created_at FROM users WHERE email = 'izat@ilkkm.edu.my';
