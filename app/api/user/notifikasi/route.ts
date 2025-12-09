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

    // Get lastViewedAt from query param (set by frontend when user visits notification page)
    const lastViewedAt = searchParams.get('lastViewedAt')

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

    // Add isNew flag to each notification (new if created after lastViewedAt or within last 5 minutes)
    const cutoffTime = lastViewedAt || new Date(Date.now() - 5 * 60 * 1000).toISOString()
    const enrichedNotifications = notifications.results.map((notif: any) => ({
      ...notif,
      isNew: new Date(notif.createdAt) > new Date(cutoffTime)
    }))

    // Count unread (notifications newer than lastViewedAt)
    const unreadCount = enrichedNotifications.filter((n: any) => n.isNew).length

    return NextResponse.json({
      success: true,
      data: enrichedNotifications,
      unreadCount: unreadCount
    })

  } catch (error) {
    console.error('Get user notifications error:', error)
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
    const currentUser = getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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
        AND jenisAktiviti IN ('RETURN_UPDATE', 'BOOKING_APPROVED', 'BOOKING_REJECTED')
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
