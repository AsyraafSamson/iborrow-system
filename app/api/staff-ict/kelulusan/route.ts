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
      return NextResponse.json({
        success: true,
        message: body.status === 'Diluluskan' ? 'Tempahan diluluskan (Mock)' : 'Tempahan ditolak (Mock)'
      })
    }

    // Real D1 update
    const staffId = 'user_002' // TODO: Get from session

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

    // If approved, update barang quantity
    if (body.status === 'Diluluskan') {
      const tempahan = await db.prepare(
        'SELECT barangId, kuantiti FROM tempahan WHERE id = ?'
      ).bind(body.id).first()

      await db.prepare(
        'UPDATE barang SET kuantitiTersedia = kuantitiTersedia - ? WHERE id = ?'
      ).bind(tempahan.kuantiti, tempahan.barangId).run()
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
