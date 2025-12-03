// Database helper for Cloudflare D1
import type { D1Database } from '@cloudflare/workers-types'

// TypeScript types for database tables
export interface User {
  id: string
  email: string
  nama: string
  peranan: 'admin' | 'staff-ict' | 'pelajar' | 'staf' | 'pengajar' | 'staff-pentadbiran'
  jabatan: string | null
  no_telefon: string | null
  password_hash: string
  status: 'aktif' | 'tidak aktif'
  created_at: string
  updated_at: string
  last_login: string | null
}

export interface Barang {
  id: string
  nama: string
  kategori: string
  kod_barang: string
  kuantiti_total: number
  kuantiti_available: number
  status: 'available' | 'unavailable' | 'maintenance'
  lokasi: string
  penerangan: string | null
  gambar_url: string | null
  created_at: string
  updated_at: string
}

export interface Tempahan {
  id: string
  user_id: string
  barang_id: string
  kuantiti: number
  tarikh_pinjam: string
  tarikh_pulang: string
  tujuan: string
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'cancelled'
  approved_by: string | null
  approved_at: string | null
  reject_reason: string | null
  created_at: string
  updated_at: string
}

export interface LogAktiviti {
  id: string
  user_id: string
  aktiviti: string
  table_affected: string | null
  record_id: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

/**
 * Get D1 database instance from Cloudflare environment
 * Works with Cloudflare Pages + @cloudflare/next-on-pages
 */
export function getD1Database(): D1Database | null {
  try {
    // Access DB binding from Cloudflare environment
    const env = process.env as any

    if (env.DB && typeof env.DB.prepare === 'function') {
      console.log('✅ D1 Database connected')
      return env.DB as D1Database
    }

    console.log('⚠️ D1 Database not available (local dev mode)')
    return null
  } catch (error) {
    console.error('❌ Error accessing D1:', error)
    return null
  }
}

/**
 * Check if D1 database is available
 */
export function isDatabaseAvailable(): boolean {
  return getD1Database() !== null
}
