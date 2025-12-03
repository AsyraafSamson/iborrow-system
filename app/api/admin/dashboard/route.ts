import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          totalUsers: 45,
          totalBarang: 128,
          tempahanAktif: 23,
          tempahanPending: 8,
          totalKuantiti: 450
        }
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
