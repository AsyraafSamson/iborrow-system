-- Migration: Add return_requests table for smart notification system
-- Created: 2025-12-08

CREATE TABLE IF NOT EXISTS return_requests (
    id TEXT PRIMARY KEY,
    bookingId TEXT NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    itemName TEXT NOT NULL,
    kuantiti INTEGER NOT NULL DEFAULT 1,
    requestedAt TEXT DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'acknowledged', 'scheduled', 'completed', 'cancelled')),
    urgency TEXT NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
    userNotes TEXT,

    -- Staff response fields
    staffId TEXT,
    staffName TEXT,
    staffResponse TEXT,
    respondedAt TEXT,
    scheduledTime TEXT,

    -- Metadata
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (bookingId) REFERENCES tempahan(id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (staffId) REFERENCES users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_return_requests_status ON return_requests(status);
CREATE INDEX IF NOT EXISTS idx_return_requests_booking ON return_requests(bookingId);
CREATE INDEX IF NOT EXISTS idx_return_requests_user ON return_requests(userId);
CREATE INDEX IF NOT EXISTS idx_return_requests_created ON return_requests(createdAt);

-- Verify tables
SELECT name FROM sqlite_master WHERE type='table' AND name='return_requests';
