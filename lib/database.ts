// lib/database.ts - Cloudflare D1 Helper Utilities

// Cloudflare D1 Database Types
export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

export interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: {
    duration: number;
    rows_read?: number;
    rows_written?: number;
  };
}

export interface D1ExecResult {
  count: number;
  duration: number;
}

// Database Models
export interface User {
  id: string;
  email: string;
  nama: string;
  peranan: 'admin' | 'staff-ict' | 'user';
  jabatan: string;
  no_telefon: string;
  password_hash: string;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Barang {
  id: string;
  nama_barang: string;
  kategori: string;
  kod_barang: string;
  kuantiti_tersedia: number;
  kuantiti_total: number;
  lokasi: string;
  status: 'tersedia' | 'dipinjam' | 'rosak' | 'diselenggara';
  harga_perolehan?: number;
  tarikh_perolehan?: string;
  catatan?: string;
  gambar_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Tempahan {
  id: string;
  user_id: string;
  barang_id: string;
  kuantiti: number;
  tarikh_mula: string;
  tarikh_tamat: string;
  tujuan: string;
  status: 'pending' | 'diluluskan' | 'ditolak' | 'selesai' | 'dibatalkan';
  catatan_kelulusan?: string;
  diluluskan_oleh?: string;
  tarikh_kelulusan?: string;
  created_at: string;
  updated_at: string;
}

export interface LogAktiviti {
  id: string;
  user_id: string;
  jenis_aktiviti: string;
  keterangan: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Helper function to get D1 database instance from Cloudflare runtime
export function getD1Database(): D1Database | null {
  try {
    const db = (process.env as Record<string, unknown>).DB as D1Database;
    if (db && typeof db.prepare === 'function') {
      return db;
    }
    return null;
  } catch {
    return null;
  }
}

// Check if D1 database is available
export function isD1Available(): boolean {
  return getD1Database() !== null;
}
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@iborrow.com',
    nama: 'Administrator',
    peranan: 'admin',
    jabatan: 'ICT',
    no_telefon: '0123456789',
    password_hash: 'admin123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'staff@iborrow.com',
    nama: 'Staff ICT',
    peranan: 'staff-ict',
    jabatan: 'ICT',
    no_telefon: '0123456790',
    password_hash: 'staff123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'user@iborrow.com',
    nama: 'Regular User',
    peranan: 'user',
    jabatan: 'Akademik',
    no_telefon: '0123456791',
    password_hash: 'user123',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];