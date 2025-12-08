import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'
import { sendNotificationEmail, getStaffEmails } from '@/lib/email'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'tmp_001',
            userId: 'user_003',
            barangId: 'brg_001',
            namaBarang: 'Laptop Dell Latitude 5420',
            kategori: 'Laptop',
            kodBarang: 'LT-001',
            kuantiti: 1,
            tarikhMula: '2025-12-05',
            tarikhTamat: '2025-12-10',
            tujuan: 'Kuliah online',
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
        ]
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
    const tempahan = await db.prepare(`
      SELECT t.*, b.namaBarang, b.kategori, b.kodBarang
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      WHERE t.userId = ?
      ORDER BY t.createdAt DESC
    `).bind(userId).all()

    return NextResponse.json({
      success: true,
      data: tempahan.results
    })

  } catch (error) {
    console.error('User tempahan GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Tempahan berjaya dihantar (Mock)',
        data: { id: 'tmp_' + Date.now() }
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

    // Real D1 insert
    const id = 'tmp_' + Date.now()
    const userId = currentUser.id
    const newTempahanData = {
      id,
      userId,
      barangId: body.barangId,
      kuantiti: body.kuantiti || 1,
      tarikhMula: body.tarikhMula,
      tarikhTamat: body.tarikhTamat,
      tujuan: body.tujuan || '',
      status: 'Pending'
    }

    await db.prepare(`
      INSERT INTO tempahan (id, userId, barangId, kuantiti, tarikhMula, tarikhTamat, tujuan, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userId,
      newTempahanData.barangId,
      newTempahanData.kuantiti,
      newTempahanData.tarikhMula,
      newTempahanData.tarikhTamat,
      newTempahanData.tujuan,
      newTempahanData.status
    ).run()

    // Log the creation
    await logCRUD(
      db,
      userId,
      'CREATE',
      'tempahan',
      id,
      null,
      newTempahanData,
      request
    )

    // Send email notification to all staff-ict
    const barang = await db.prepare('SELECT namaBarang FROM barang WHERE id = ?').bind(body.barangId).first()
    const staffEmails = await getStaffEmails(db)
    
    if (barang && staffEmails.length > 0) {
      // Send to all staff members
      for (const email of staffEmails) {
        await sendNotificationEmail({
          to: email,
          userName: 'Staff ICT',
          type: 'NEW_BOOKING',
          itemName: barang.namaBarang,
          message: `Peminjam: ${currentUser.nama} (${currentUser.email})`
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Tempahan berjaya dihantar',
      data: { id }
    })

  } catch (error) {
    console.error('User tempahan POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal membuat tempahan'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Tempahan berjaya dibatalkan (Mock)'
      })
    }

    // Get current user for logging
    const currentUser = getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Sila log masuk' },
        { status: 401 }
      )
    }

    // Get old data before update
    const oldTempahan = await db.prepare(
      'SELECT * FROM tempahan WHERE id = ?'
    ).bind(body.id).first()

    // Real D1 update
    await db.prepare(
      'UPDATE tempahan SET status = ?, updatedAt = datetime("now") WHERE id = ?'
    ).bind('Dibatalkan', body.id).run()

    // Log the cancellation
    if (oldTempahan) {
      await logCRUD(
        db,
        currentUser.id,
        'UPDATE',
        'tempahan',
        body.id,
        { status: oldTempahan.status },
        { status: 'Dibatalkan' },
        request
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Tempahan berjaya dibatalkan'
    })

  } catch (error) {
    console.error('User tempahan DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
