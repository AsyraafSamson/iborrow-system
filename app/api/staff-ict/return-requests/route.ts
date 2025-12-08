import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requireRole } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'

export const runtime = 'edge'

// Get all return requests for staff
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
        data: []
      })
    }

    // Get filter from query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'

    let query = `
      SELECT
        rr.*,
        t.tarikhMula,
        t.tarikhTamat,
        t.status as bookingStatus,
        u.email as userEmail,
        u.fakulti as userFakulti
      FROM return_requests rr
      JOIN tempahan t ON rr.bookingId = t.id
      JOIN users u ON rr.userId = u.id
    `

    if (status !== 'all') {
      query += ` WHERE rr.status = ?`
    }

    query += ` ORDER BY
      CASE rr.urgency WHEN 'urgent' THEN 0 ELSE 1 END,
      rr.createdAt DESC
    `

    const requests = status !== 'all'
      ? await db.prepare(query).bind(status).all()
      : await db.prepare(query).all()

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

// Staff responds to return request
export async function PUT(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const currentUser = requireRole(request, ['staff-ict', 'admin'])

    if (currentUser instanceof NextResponse) {
      return currentUser
    }

    const { requestId, action, response, scheduledTime } = await request.json()

    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Return request updated (Mock)'
      })
    }

    // Get return request details
    const returnRequest = await db.prepare(`
      SELECT * FROM return_requests WHERE id = ?
    `).bind(requestId).first()

    if (!returnRequest) {
      return NextResponse.json({
        success: false,
        error: 'Return request not found'
      }, { status: 404 })
    }

    let newStatus = returnRequest.status
    let message = ''

    // Handle different actions
    switch (action) {
      case 'acknowledge':
        newStatus = 'acknowledged'
        message = `✅ ${currentUser.nama} has acknowledged your return request for ${returnRequest.itemName}`
        break

      case 'schedule':
        if (!scheduledTime) {
          return NextResponse.json({
            success: false,
            error: 'Scheduled time is required'
          }, { status: 400 })
        }
        newStatus = 'scheduled'
        message = `📅 Your return for ${returnRequest.itemName} is scheduled for ${new Date(scheduledTime).toLocaleString('ms-MY')}`
        break

      case 'complete':
        newStatus = 'completed'
        message = `✅ Return completed! ${returnRequest.itemName} (${returnRequest.kuantiti} unit) has been returned and verified by ${currentUser.nama}`

        // Update booking status to Selesai
        await db.prepare(`
          UPDATE tempahan SET
            status = 'Selesai',
            catatanKelulusan = ?,
            updatedAt = datetime('now')
          WHERE id = ?
        `).bind(
          (returnRequest.itemName || '') + '\n[Dikembalikan via return request system]',
          returnRequest.bookingId
        ).run()

        // Restore item quantity
        const booking = await db.prepare(
          'SELECT barangId, kuantiti FROM tempahan WHERE id = ?'
        ).bind(returnRequest.bookingId).first()

        if (booking) {
          await db.prepare(
            'UPDATE barang SET kuantitiTersedia = kuantitiTersedia + ? WHERE id = ?'
          ).bind(booking.kuantiti, booking.barangId).run()
        }
        break

      case 'cancel':
        newStatus = 'cancelled'
        message = `❌ Your return request for ${returnRequest.itemName} has been cancelled. ${response || ''}`
        break

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }

    // Update return request
    await db.prepare(`
      UPDATE return_requests SET
        status = ?,
        staffId = ?,
        staffName = ?,
        staffResponse = ?,
        respondedAt = datetime('now'),
        scheduledTime = ?,
        updatedAt = datetime('now')
      WHERE id = ?
    `).bind(
      newStatus,
      currentUser.id,
      currentUser.nama,
      response || '',
      scheduledTime || null,
      requestId
    ).run()

    // Notify user via activity log
    await db.prepare(`
      INSERT INTO log_aktiviti (
        id, userId, jenisAktiviti, keterangan, createdAt
      ) VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(
      'log_' + Date.now(),
      returnRequest.userId,
      'RETURN_UPDATE',
      message
    ).run()

    // Log staff activity
    await logCRUD(
      db,
      currentUser.id,
      'UPDATE',
      'return_requests',
      requestId,
      returnRequest,
      { action, newStatus, response },
      request
    )

    return NextResponse.json({
      success: true,
      message: `Return request ${action}d successfully`,
      newStatus
    })

  } catch (error) {
    console.error('Update return request error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
