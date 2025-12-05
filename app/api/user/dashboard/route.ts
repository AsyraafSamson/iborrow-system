import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'

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
          totalTempahan: 5,
          tempahanAktif: 2,
          barangTersedia: 128
        }
      })
    }

    // Get current user from session
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Sila log masuk' },
        { status: 401 }
      )
    }

    const userId = currentUser.id
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
