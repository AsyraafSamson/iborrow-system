import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, requireRole } from '@/lib/session'
import { logApproval } from '@/lib/activity-logger'

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
            lokasi: 'Stor ICT',
            namaPemohon: 'Ahmad Bin Ali',
            emailPemohon: 'ahmad@ilkkm.edu.my',
            fakulti: 'Kejururawatan',
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

    // Real D1 query
    const tempahan = await db.prepare(`
      SELECT t.*, b.namaBarang, b.kategori, b.lokasi,
             u.nama as namaPemohon, u.email as emailPemohon, u.fakulti
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      JOIN users u ON t.userId = u.id
      ORDER BY t.createdAt DESC
    `).all()

    return NextResponse.json({
      success: true,
      data: tempahan.results
    })

  } catch (error) {
    console.error('Staff ICT kelulusan GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      const messages = {
        Diluluskan: 'Tempahan diluluskan (Mock)',
        Ditolak: 'Tempahan ditolak (Mock)',
        Dikembalikan: 'Barang dikembalikan (Mock)',
        Selesai: 'Tempahan selesai (Mock)'
      }
      return NextResponse.json({
        success: true,
        message: messages[body.status as keyof typeof messages] || 'Status dikemaskini (Mock)'
      })
    }

    // Get current user from session (must be staff-ict or admin)
    const currentUser = requireRole(request, ['staff-ict', 'admin'])
    if (currentUser instanceof NextResponse) {
      return currentUser // Return error response
    }

    const staffId = currentUser.id

    // Get booking details for logging
    const tempahan = await db.prepare(
      'SELECT * FROM tempahan WHERE id = ?'
    ).bind(body.id).first()

    if (!tempahan) {
      return NextResponse.json(
        { success: false, error: 'Tempahan tidak dijumpai' },
        { status: 404 }
      )
    }

    // Handle different actions
    if (body.action === 'return') {
      // Return item workflow
      // Update booking status to "Dikembalikan" first, then "Selesai"
      await db.prepare(`
        UPDATE tempahan SET
          status = 'Selesai',
          catatanKelulusan = ?,
          updatedAt = datetime("now")
        WHERE id = ?
      `).bind(
        (tempahan.catatanKelulusan || '') + '\n[Dikembalikan: ' + (body.catatan || 'Barang telah dikembalikan') + ']',
        body.id
      ).run()

      // Restore item quantity
      await db.prepare(
        'UPDATE barang SET kuantitiTersedia = kuantitiTersedia + ? WHERE id = ?'
      ).bind(tempahan.kuantiti, tempahan.barangId).run()

      // Log the return
      await logApproval(
        db,
        staffId,
        'UPDATE',
        'tempahan',
        body.id,
        tempahan,
        'Barang dikembalikan: ' + (body.catatan || ''),
        request
      )

      return NextResponse.json({
        success: true,
        message: 'Barang berjaya dikembalikan. Kuantiti telah dipulihkan.'
      })
    }

    // Default approval/rejection flow
    await db.prepare(`
      UPDATE tempahan SET
        status = ?,
        catatanKelulusan = ?,
        diluluskanOleh = ?,
        tarikhKelulusan = datetime("now"),
        updatedAt = datetime("now")
      WHERE id = ?
    `).bind(
      body.status,
      body.catatan || '',
      staffId,
      body.id
    ).run()

    // If approved, update barang quantity (decrease)
    if (body.status === 'Diluluskan') {
      await db.prepare(
        'UPDATE barang SET kuantitiTersedia = kuantitiTersedia - ? WHERE id = ?'
      ).bind(tempahan.kuantiti, tempahan.barangId).run()
    }

    // Log the approval or rejection
    if (tempahan) {
      await logApproval(
        db,
        staffId,
        body.status === 'Diluluskan' ? 'APPROVE' : 'REJECT',
        'tempahan',
        body.id,
        tempahan,
        body.catatan || '',
        request
      )
    }

    return NextResponse.json({
      success: true,
      message: body.status === 'Diluluskan' ? 'Tempahan diluluskan' : 'Tempahan ditolak'
    })

  } catch (error) {
    console.error('Staff ICT kelulusan PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
