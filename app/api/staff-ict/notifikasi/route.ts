import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/session'

export const runtime = 'edge'

// Get staff notifications
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const currentUser = requireRole(request, ['staff-ict', 'admin'])

    if (currentUser instanceof NextResponse) {
      return currentUser
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

    // Get staff notifications (return requests and booking requests)
    const notifications = await db.prepare(`
      SELECT
        id,
        jenisAktiviti,
        keterangan,
        createdAt
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_NOTIFICATION', 'BOOKING_REQUEST')
      ORDER BY createdAt DESC
      LIMIT ?
    `).bind(currentUser.id, limit).all()

    // Count unread (last 24 hours as "new")
    const unreadCount = await db.prepare(`
      SELECT COUNT(*) as count
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_NOTIFICATION', 'BOOKING_REQUEST')
      AND createdAt > datetime('now', '-24 hours')
    `).bind(currentUser.id).first()

    return NextResponse.json({
      success: true,
      data: notifications.results,
      unreadCount: unreadCount?.count || 0
    })

  } catch (error) {
    console.error('Get staff notifications error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
