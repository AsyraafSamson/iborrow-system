-- Migration: Add isRead status to log_aktiviti for notification tracking
-- Created: 2025-12-08

-- Add isRead column (defaults to 0 = unread, 1 = read)
ALTER TABLE log_aktiviti ADD COLUMN isRead INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_log_aktiviti_isRead ON log_aktiviti(userId, isRead, jenisAktiviti);

-- Verify column added
SELECT sql FROM sqlite_master WHERE type='table' AND name='log_aktiviti';
