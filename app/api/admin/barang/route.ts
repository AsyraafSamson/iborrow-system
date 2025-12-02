import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        barang: [
          {
            id: 'brg_001',
            namaBarang: 'Laptop Dell Latitude 5420',
            kategori: 'Laptop',
            kodBarang: 'LT-001',
            kuantitiTersedia: 5,
            kuantitiTotal: 10,
            lokasi: 'Stor ICT',
            status: 'Tersedia',
            hargaPerolehan: 3500.00,
            tarikhPerolehan: '2024-01-15',
            catatan: 'i5-11th Gen, 8GB RAM',
            createdAt: new Date().toISOString()
          }
        ]
      })
    }

    // Real D1 query
    const barang = await db.prepare(
      'SELECT * FROM barang ORDER BY createdAt DESC'
    ).all()

    return NextResponse.json({
      success: true,
      barang: barang.results
    })

  } catch (error) {
    console.error('Admin barang GET error:', error)
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
        message: 'Barang berjaya ditambah (Mock)',
        data: { id: 'brg_' + Date.now() }
      })
    }

    // Real D1 insert
    const id = 'brg_' + Date.now()

    await db.prepare(`
      INSERT INTO barang (id, namaBarang, kategori, kodBarang, kuantitiTersedia,
        kuantitiTotal, lokasi, status, hargaPerolehan, tarikhPerolehan, catatan, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.namaBarang,
      body.kategori,
      body.kodBarang,
      body.kuantitiTersedia || body.kuantitiTotal,
      body.kuantitiTotal,
      body.lokasi,
      'Tersedia',
      body.hargaPerolehan || 0,
      body.tarikhPerolehan || new Date().toISOString().split('T')[0],
      body.catatan || '',
      body.createdBy || 'user_001'
    ).run()

    return NextResponse.json({
      success: true,
      message: 'Barang berjaya ditambah',
      data: { id }
    })

  } catch (error) {
    console.error('Admin barang POST error:', error)
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
        message: 'Barang berjaya dikemaskini (Mock)'
      })
    }

    // Full update with all fields
    if (body.namaBarang) {
      await db.prepare(`
        UPDATE barang SET
          namaBarang = ?,
          kategori = ?,
          kodBarang = ?,
          kuantitiTotal = ?,
          kuantitiTersedia = ?,
          status = ?,
          lokasi = ?,
          catatan = ?,
          updatedAt = datetime("now")
        WHERE id = ?
      `).bind(
        body.namaBarang,
        body.kategori,
        body.kodBarang,
        body.kuantitiTotal || 1,
        body.kuantitiTersedia !== undefined ? body.kuantitiTersedia : 1,
        body.status || 'Tersedia',
        body.lokasi,
        body.deskripsi || body.nota || '',
        body.id
      ).run()
    }
    // Quick status update only
    else if (body.status && !body.namaBarang) {
      await db.prepare(
        'UPDATE barang SET status = ?, updatedAt = datetime("now") WHERE id = ?'
      ).bind(body.status, body.id).run()
    }
    // Quick quantity update only
    else if (body.kuantitiTersedia !== undefined && !body.namaBarang) {
      await db.prepare(
        'UPDATE barang SET kuantitiTersedia = ?, updatedAt = datetime("now") WHERE id = ?'
      ).bind(body.kuantitiTersedia, body.id).run()
    }

    return NextResponse.json({
      success: true,
      message: 'Barang berjaya dikemaskini'
    })

  } catch (error) {
    console.error('Admin barang PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal kemaskini barang'
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
      const count = body.ids ? body.ids.length : 1
      return NextResponse.json({
        success: true,
        message: `${count} barang berjaya dipadam (Mock)`
      })
    }

    // Bulk delete
    if (body.ids && Array.isArray(body.ids)) {
      const placeholders = body.ids.map(() => '?').join(',')
      await db.prepare(
        `DELETE FROM barang WHERE id IN (${placeholders})`
      ).bind(...body.ids).run()

      return NextResponse.json({
        success: true,
        message: `${body.ids.length} barang berjaya dipadam`
      })
    }

    // Single delete
    if (body.id) {
      await db.prepare(
        'DELETE FROM barang WHERE id = ?'
      ).bind(body.id).run()

      return NextResponse.json({
        success: true,
        message: 'Barang berjaya dipadam'
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'ID atau IDs diperlukan'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('Admin barang DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
