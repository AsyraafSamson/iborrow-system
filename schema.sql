-- iBorrow System Database Schema for Cloudflare D1
-- Drop existing tables if they exist
DROP TABLE IF EXISTS log_aktiviti;
DROP TABLE IF EXISTS tempahan;
DROP TABLE IF EXISTS barang;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    peranan TEXT NOT NULL CHECK (peranan IN ('admin', 'staff-ict', 'user')),
    jabatan TEXT NOT NULL,
    no_telefon TEXT,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Barang (Items) Table
CREATE TABLE barang (
    id TEXT PRIMARY KEY,
    nama_barang TEXT NOT NULL,
    kategori TEXT NOT NULL,
    kod_barang TEXT UNIQUE NOT NULL,
    kuantiti_tersedia INTEGER NOT NULL DEFAULT 0,
    kuantiti_total INTEGER NOT NULL,
    lokasi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'tersedia' CHECK (status IN ('tersedia', 'dipinjam', 'rosak', 'diselenggara')),
    harga_perolehan REAL,
    tarikh_perolehan TEXT,
    catatan TEXT,
    gambar_url TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tempahan (Bookings) Table
CREATE TABLE tempahan (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    barang_id TEXT NOT NULL,
    kuantiti INTEGER NOT NULL,
    tarikh_mula TEXT NOT NULL,
    tarikh_tamat TEXT NOT NULL,
    tujuan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'diluluskan', 'ditolak', 'selesai', 'dibatalkan')),
    catatan_kelulusan TEXT,
    diluluskan_oleh TEXT,
    tarikh_kelulusan TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (barang_id) REFERENCES barang(id),
    FOREIGN KEY (diluluskan_oleh) REFERENCES users(id)
);

-- Log Aktiviti Table
CREATE TABLE log_aktiviti (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    jenis_aktiviti TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_peranan ON users(peranan);
CREATE INDEX idx_barang_kategori ON barang(kategori);
CREATE INDEX idx_barang_status ON barang(status);
CREATE INDEX idx_barang_kod ON barang(kod_barang);
CREATE INDEX idx_tempahan_user ON tempahan(user_id);
CREATE INDEX idx_tempahan_barang ON tempahan(barang_id);
CREATE INDEX idx_tempahan_status ON tempahan(status);
CREATE INDEX idx_log_user ON log_aktiviti(user_id);
CREATE INDEX idx_log_created ON log_aktiviti(created_at);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, nama, peranan, jabatan, no_telefon, password_hash, status) VALUES
('user_001', 'admin@iborrow.com', 'Administrator System', 'admin', 'ICT', '0123456789', 'admin123', 'active'),
('user_002', 'staffict@iborrow.com', 'Staff ICT', 'staff-ict', 'ICT', '0123456788', 'staffict123', 'active'),
('user_003', 'user@iborrow.com', 'User Biasa', 'user', 'Pentadbiran', '0123456787', 'user123', 'active');

-- Insert sample barang
INSERT INTO barang (id, nama_barang, kategori, kod_barang, kuantiti_tersedia, kuantiti_total, lokasi, status, harga_perolehan, created_by) VALUES
('brg_001', 'Laptop Dell Latitude 5420', 'Komputer', 'LAP-001', 5, 10, 'Bilik Server A', 'tersedia', 3500.00, 'user_001'),
('brg_002', 'Projektor Epson EB-X41', 'Multimedia', 'PRO-001', 3, 5, 'Bilik Stor B', 'tersedia', 1200.00, 'user_001'),
('brg_003', 'Kamera Canon EOS 90D', 'Multimedia', 'CAM-001', 2, 3, 'Bilik Media', 'tersedia', 4500.00, 'user_001'),
('brg_004', 'Router Cisco ISR4331', 'Rangkaian', 'NET-001', 4, 6, 'Bilik Server A', 'tersedia', 2800.00, 'user_001'),
('brg_005', 'Tablet Samsung Galaxy Tab S8', 'Komputer', 'TAB-001', 8, 10, 'Bilik Stor C', 'tersedia', 2200.00, 'user_001');
