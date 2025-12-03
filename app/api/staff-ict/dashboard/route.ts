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
          perluKelulusan: 8,
          diluluskan: 23,
          ditolak: 5,
          totalBarang: 128
        }
      })
    }

    // Real D1 query
    const stats = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as perluKelulusan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as diluluskan,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as ditolak,
        (SELECT COUNT(*) FROM barang) as totalBarang
    `).first()

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Staff ICT dashboard error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
