import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          totalTempahan: 5,
          tempahanAktif: 2,
          barangTersedia: 128
        }
      })
    }

    // Real D1 query
    const userId = 'user_003' // TODO: Get from session/auth
    const stats = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM tempahan WHERE userId = ?) as totalTempahan,
        (SELECT COUNT(*) FROM tempahan WHERE userId = ? AND status = 'Aktif') as tempahanAktif,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barangTersedia
    `).bind(userId, userId).first()

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('User dashboard error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
