import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'

export const runtime = 'edge'

// User creates return request
export async function POST(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const currentUser = getCurrentUser(request)

    if (!currentUser) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { bookingId, urgency, notes } = await request.json()

    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Return request submitted (Mock)',
        requestId: 'ret_mock'
      })
    }

    // Get booking details
    const booking = await db.prepare(`
      SELECT t.*, b.namaBarang
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      WHERE t.id = ?
    `).bind(bookingId).first()

    if (!booking) {
      return NextResponse.json({
        success: false,
        error: 'Tempahan tidak dijumpai'
      }, { status: 404 })
    }

    if (booking.status !== 'Diluluskan') {
      return NextResponse.json({
        success: false,
        error: 'Hanya tempahan yang diluluskan boleh dikembalikan'
      }, { status: 400 })
    }

    // Check if already has pending return request
    const existing = await db.prepare(`
      SELECT id FROM return_requests
      WHERE bookingId = ? AND status IN ('pending', 'acknowledged', 'scheduled')
    `).bind(bookingId).first()

    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Return request already exists for this booking'
      }, { status: 400 })
    }

    // Create return request
    const requestId = 'ret_' + Date.now()
    await db.prepare(`
      INSERT INTO return_requests (
        id, bookingId, userId, userName, itemName, kuantiti, urgency, userNotes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      requestId,
      bookingId,
      currentUser.id,
      currentUser.nama,
      booking.namaBarang,
      booking.kuantiti,
      urgency || 'normal',
      notes || ''
    ).run()

    // Get all staff ICT and admin users
    const staffUsers = await db.prepare(`
      SELECT id, email, nama FROM users
      WHERE peranan IN ('staff-ict', 'admin')
      AND status = 'aktif'
    `).all()

    // Create notification in activity log for each staff
    for (const staff of staffUsers.results) {
      await db.prepare(`
        INSERT INTO log_aktiviti (
          id, userId, jenisAktiviti, keterangan, createdAt
        ) VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(
        'log_' + Date.now() + '_' + staff.id,
        staff.id,
        'RETURN_NOTIFICATION',
        `🔔 ${currentUser.nama} wants to return ${booking.namaBarang} (${booking.kuantiti} unit)`
      ).run()
    }

    // Log user activity
    await logCRUD(
      db,
      currentUser.id,
      'CREATE',
      'return_requests',
      requestId,
      null,
      { bookingId, itemName: booking.namaBarang },
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Return request submitted. Staff will be notified.',
      requestId,
      staffCount: staffUsers.results.length
    })

  } catch (error) {
    console.error('Return request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Get user's return requests
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
        data: []
      })
    }

    const requests = await db.prepare(`
      SELECT * FROM return_requests
      WHERE userId = ?
      ORDER BY createdAt DESC
      LIMIT 50
    `).bind(currentUser.id).all()

    return NextResponse.json({
      success: true,
      data: requests.results
    })

  } catch (error) {
    console.error('Get return requests error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
