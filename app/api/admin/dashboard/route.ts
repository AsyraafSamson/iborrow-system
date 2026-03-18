export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getMockAdminDashboardStats } from '@/lib/mock-database'

// Configure for Cloudflare Pages Edge Runtime
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { success: false, error: 'Database tidak tersedia. Sila hubungi admin.' },
          { status: 503 }
        )
      }
      return NextResponse.json({
        success: true,
        data: getMockAdminDashboardStats()
      })
    }

    // Real D1 query
    const stats = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM users) as totalUsers,
        (SELECT COUNT(*) FROM barang) as totalBarang,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as tempahanAktif,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as tempahanPending,
        (SELECT SUM(kuantitiTersedia) FROM barang) as totalKuantiti
    `).first()

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

