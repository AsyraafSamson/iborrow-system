import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'

export const runtime = 'edge'

// Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const currentUser = getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: [],
        unreadCount: 0
      })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get user's notifications (return updates and other relevant notifications)
    const notifications = await db.prepare(`
      SELECT
        id,
        jenisAktiviti,
        keterangan,
        createdAt
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_UPDATE', 'BOOKING_APPROVED', 'BOOKING_REJECTED')
      ORDER BY createdAt DESC
      LIMIT ?
    `).bind(currentUser.id, limit).all()

    // Count unread (last 24 hours as "new")
    const unreadCount = await db.prepare(`
      SELECT COUNT(*) as count
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_UPDATE', 'BOOKING_APPROVED', 'BOOKING_REJECTED')
      AND createdAt > datetime('now', '-24 hours')
    `).bind(currentUser.id).first()

    return NextResponse.json({
      success: true,
      data: notifications.results,
      unreadCount: unreadCount?.count || 0
    })

  } catch (error) {
    console.error('Get user notifications error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
