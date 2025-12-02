-- iBorrow System Database Schema for Cloudflare D1
-- Drop existing tables if they exist
DROP TABLE IF EXISTS log_aktiviti;
DROP TABLE IF EXISTS tempahan;
DROP TABLE IF EXISTS barang;
DROP TABLE IF EXISTS users;

-- Users Table (Updated to match UI/UX)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    nama TEXT NOT NULL,
    peranan TEXT NOT NULL CHECK (peranan IN ('admin', 'staff-ict', 'pelajar', 'pengajar', 'staff-pentadbiran')),
    fakulti TEXT,
    no_telefon TEXT,
    no_matrik TEXT,
    no_staf TEXT,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'tidak aktif')),
    last_login TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Barang (Items) Table (Updated to camelCase to match UI/UX)
CREATE TABLE barang (
    id TEXT PRIMARY KEY,
    namaBarang TEXT NOT NULL,
    kategori TEXT NOT NULL,
    kodBarang TEXT UNIQUE NOT NULL,
    kuantitiTersedia INTEGER NOT NULL DEFAULT 0,
    kuantitiTotal INTEGER NOT NULL,
    lokasi TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Tersedia' CHECK (status IN ('Tersedia', 'Dipinjam', 'Rosak', 'Diselenggara')),
    hargaPerolehan REAL,
    tarikhPerolehan TEXT,
    catatan TEXT,
    gambarUrl TEXT,
    createdBy TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (createdBy) REFERENCES users(id)
);

-- Tempahan (Bookings) Table (Updated to camelCase)
CREATE TABLE tempahan (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    barangId TEXT NOT NULL,
    kuantiti INTEGER NOT NULL,
    tarikhMula TEXT NOT NULL,
    tarikhTamat TEXT NOT NULL,
    tujuan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diluluskan', 'Ditolak', 'Selesai', 'Dibatalkan', 'Aktif')),
    catatanKelulusan TEXT,
    diluluskanOleh TEXT,
    tarikhKelulusan TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (barangId) REFERENCES barang(id),
    FOREIGN KEY (diluluskanOleh) REFERENCES users(id)
);

-- Log Aktiviti Table (Updated to camelCase)
CREATE TABLE log_aktiviti (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    jenisAktiviti TEXT NOT NULL,
    keterangan TEXT NOT NULL,
    ipAddress TEXT,
    userAgent TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_peranan ON users(peranan);
CREATE INDEX idx_barang_kategori ON barang(kategori);
CREATE INDEX idx_barang_status ON barang(status);
CREATE INDEX idx_barang_kod ON barang(kodBarang);
CREATE INDEX idx_tempahan_user ON tempahan(userId);
CREATE INDEX idx_tempahan_barang ON tempahan(barangId);
CREATE INDEX idx_tempahan_status ON tempahan(status);
CREATE INDEX idx_log_user ON log_aktiviti(userId);
CREATE INDEX idx_log_created ON log_aktiviti(createdAt);

-- Insert default users (password: admin123, staffict123, user123, pengajar123, staff123)
INSERT INTO users (id, email, nama, peranan, fakulti, no_telefon, no_staf, no_matrik, password_hash, status) VALUES
('user_001', 'admin@ilkkm.edu.my', 'Administrator System', 'admin', 'Bahagian ICT', '0123456789', 'ADM001', NULL, 'admin123', 'aktif'),
('user_002', 'staffict@ilkkm.edu.my', 'Mohd Faris', 'staff-ict', 'Bahagian ICT', '0123456788', 'ICT001', NULL, 'staffict123', 'aktif'),
('user_003', 'ahmad@ilkkm.edu.my', 'Ahmad bin Ali', 'pelajar', 'Fakulti Teknologi Maklumat', '0123456787', NULL, 'A12345', 'user123', 'aktif'),
('user_004', 'siti@ilkkm.edu.my', 'Siti binti Rahman', 'pengajar', 'Fakulti Kejuruteraan', '0123456786', 'PJG001', NULL, 'pengajar123', 'aktif'),
('user_005', 'ali@ilkkm.edu.my', 'Ali bin Abu', 'staff-pentadbiran', 'Unit Pentadbiran', '0123456785', 'PEN001', NULL, 'staff123', 'aktif');

-- Insert sample barang
INSERT INTO barang (id, namaBarang, kategori, kodBarang, kuantitiTersedia, kuantitiTotal, lokasi, status, hargaPerolehan, createdBy, tarikhPerolehan) VALUES
('brg_001', 'Laptop Dell Latitude 5420', 'Komputer', 'LAP-001', 5, 10, 'Bilik Server A', 'Tersedia', 3500.00, 'user_001', '2024-01-15'),
('brg_002', 'Projektor Epson EB-X41', 'Multimedia', 'PRO-001', 3, 5, 'Bilik Stor B', 'Tersedia', 1200.00, 'user_001', '2024-02-10'),
('brg_003', 'Kamera Canon EOS 90D', 'Multimedia', 'CAM-001', 2, 3, 'Bilik Media', 'Tersedia', 4500.00, 'user_001', '2024-03-05'),
('brg_004', 'Router Cisco ISR4331', 'Rangkaian', 'NET-001', 4, 6, 'Bilik Server A', 'Tersedia', 2800.00, 'user_001', '2024-01-20'),
('brg_005', 'Tablet Samsung Galaxy Tab S8', 'Komputer', 'TAB-001', 8, 10, 'Bilik Stor C', 'Tersedia', 2200.00, 'user_001', '2024-04-12'),
('brg_006', 'Mic Wireless Shure SM58', 'Audio', 'MIC-001', 6, 8, 'Bilik Audio', 'Tersedia', 450.00, 'user_001', '2024-05-08'),
('brg_007', 'Printer HP LaserJet Pro', 'Pencetak', 'PRT-001', 2, 4, 'Bilik Server B', 'Dipinjam', 1800.00, 'user_001', '2024-02-28'),
('brg_008', 'Tripod Manfrotto Befree', 'Multimedia', 'TRP-001', 4, 5, 'Bilik Media', 'Tersedia', 280.00, 'user_001', '2024-06-15');
