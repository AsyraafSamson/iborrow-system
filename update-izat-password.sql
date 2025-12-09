-- Update izat@ilkkm.edu.my password with correct bcrypt hash
-- Generated hash for password: password123
UPDATE users SET password_hash = '$2b$10$8o53PSfFmhaVd74GjhFfnulgDK7x3wuCZJRRRjXll6AMU3ZsD3yee' WHERE email = 'izat@ilkkm.edu.my';

-- Verify the update
SELECT email, nama, peranan, password_hash FROM users WHERE email = 'izat@ilkkm.edu.my';
