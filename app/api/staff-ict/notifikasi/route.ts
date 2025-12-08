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
        createdAt,
        COALESCE(isRead, 0) as isRead
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_NOTIFICATION', 'BOOKING_REQUEST')
      ORDER BY createdAt DESC
      LIMIT ?
    `).bind(currentUser.id, limit).all()

    // Count unread only (isRead = 0 or NULL)
    const unreadCount = await db.prepare(`
      SELECT COUNT(*) as count
      FROM log_aktiviti
      WHERE userId = ?
      AND jenisAktiviti IN ('RETURN_NOTIFICATION', 'BOOKING_REQUEST')
      AND COALESCE(isRead, 0) = 0
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

// Mark notifications as read
export async function POST(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const currentUser = requireRole(request, ['staff-ict', 'admin'])

    if (currentUser instanceof NextResponse) {
      return currentUser
    }

    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Marked as read (Mock)'
      })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead } = body

    if (markAllAsRead) {
      // Mark all notifications as read for this user
      await db.prepare(`
        UPDATE log_aktiviti
        SET isRead = 1
        WHERE userId = ?
        AND jenisAktiviti IN ('RETURN_NOTIFICATION', 'BOOKING_REQUEST')
        AND COALESCE(isRead, 0) = 0
      `).bind(currentUser.id).run()

      return NextResponse.json({
        success: true,
        message: 'Semua notifikasi ditandakan sebagai dibaca'
      })
    }

    if (notificationId) {
      // Mark specific notification as read
      await db.prepare(`
        UPDATE log_aktiviti
        SET isRead = 1
        WHERE id = ?
        AND userId = ?
      `).bind(notificationId, currentUser.id).run()

      return NextResponse.json({
        success: true,
        message: 'Notifikasi ditandakan sebagai dibaca'
      })
    }

    return NextResponse.json({
      success: false,
      error: 'notificationId or markAllAsRead diperlukan'
    }, { status: 400 })

  } catch (error) {
    console.error('Mark notification as read error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
