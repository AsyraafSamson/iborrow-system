import { NextRequest, NextResponse } from 'next/server'
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

    // Real D1 query
    const userId = 'user_003' // TODO: Get from session
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

    // Real D1 insert
    const id = 'tmp_' + Date.now()
    const userId = body.userId || 'user_003'

    await db.prepare(`
      INSERT INTO tempahan (id, userId, barangId, kuantiti, tarikhMula, tarikhTamat, tujuan, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userId,
      body.barangId,
      body.kuantiti || 1,
      body.tarikhMula,
      body.tarikhTamat,
      body.tujuan || '',
      'Pending'
    ).run()

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

    // Real D1 update
    await db.prepare(
      'UPDATE tempahan SET status = ?, updatedAt = datetime("now") WHERE id = ?'
    ).bind('Dibatalkan', body.id).run()

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
