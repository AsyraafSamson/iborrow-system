import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Real D1 insert
    const id = 'brg_' + Date.now()
    const newBarangData = {
      id,
      namaBarang: body.namaBarang,
      kategori: body.kategori,
      kodBarang: body.kodBarang,
      kuantitiTersedia: body.kuantitiTersedia || body.kuantitiTotal,
      kuantitiTotal: body.kuantitiTotal,
      lokasi: body.lokasi,
      status: 'Tersedia',
      hargaPerolehan: body.hargaPerolehan || 0,
      tarikhPerolehan: body.tarikhPerolehan || new Date().toISOString().split('T')[0],
      catatan: body.catatan || ''
    }

    await db.prepare(`
      INSERT INTO barang (id, namaBarang, kategori, kodBarang, kuantitiTersedia,
        kuantitiTotal, lokasi, status, hargaPerolehan, tarikhPerolehan, catatan, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      newBarangData.namaBarang,
      newBarangData.kategori,
      newBarangData.kodBarang,
      newBarangData.kuantitiTersedia,
      newBarangData.kuantitiTotal,
      newBarangData.lokasi,
      newBarangData.status,
      newBarangData.hargaPerolehan,
      newBarangData.tarikhPerolehan,
      newBarangData.catatan,
      currentUser?.id || 'user_001'
    ).run()

    // Log the creation
    if (currentUser) {
      await logCRUD(
        db,
        currentUser.id,
        'CREATE',
        'barang',
        id,
        null,
        newBarangData,
        request
      )
    }

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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Get old data before update
    const oldBarang = await db.prepare(
      'SELECT * FROM barang WHERE id = ?'
    ).bind(body.id).first()

    // Full update with all fields
    if (body.namaBarang) {
      const newData = {
        namaBarang: body.namaBarang,
        kategori: body.kategori,
        kodBarang: body.kodBarang,
        kuantitiTotal: body.kuantitiTotal || 1,
        kuantitiTersedia: body.kuantitiTersedia !== undefined ? body.kuantitiTersedia : 1,
        status: body.status || 'Tersedia',
        lokasi: body.lokasi,
        catatan: body.deskripsi || body.nota || ''
      }

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
        newData.namaBarang,
        newData.kategori,
        newData.kodBarang,
        newData.kuantitiTotal,
        newData.kuantitiTersedia,
        newData.status,
        newData.lokasi,
        newData.catatan,
        body.id
      ).run()

      // Log full update
      if (currentUser && oldBarang) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'barang',
          body.id,
          oldBarang,
          newData,
          request
        )
      }
    }
    // Quick status update only
    else if (body.status && !body.namaBarang) {
      await db.prepare(
        'UPDATE barang SET status = ?, updatedAt = datetime("now") WHERE id = ?'
      ).bind(body.status, body.id).run()

      // Log status update
      if (currentUser && oldBarang) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'barang',
          body.id,
          { status: oldBarang.status },
          { status: body.status },
          request
        )
      }
    }
    // Quick quantity update only
    else if (body.kuantitiTersedia !== undefined && !body.namaBarang) {
      await db.prepare(
        'UPDATE barang SET kuantitiTersedia = ?, updatedAt = datetime("now") WHERE id = ?'
      ).bind(body.kuantitiTersedia, body.id).run()

      // Log quantity update
      if (currentUser && oldBarang) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'barang',
          body.id,
          { kuantitiTersedia: oldBarang.kuantitiTersedia },
          { kuantitiTersedia: body.kuantitiTersedia },
          request
        )
      }
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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Bulk delete
    if (body.ids && Array.isArray(body.ids)) {
      // Get old data for each item before deletion
      for (const id of body.ids) {
        const oldBarang = await db.prepare(
          'SELECT id, namaBarang, kategori, kodBarang FROM barang WHERE id = ?'
        ).bind(id).first()

        await db.prepare('DELETE FROM barang WHERE id = ?').bind(id).run()

        // Log each deletion
        if (currentUser && oldBarang) {
          await logCRUD(
            db,
            currentUser.id,
            'DELETE',
            'barang',
            id,
            oldBarang,
            null,
            request
          )
        }
      }

      return NextResponse.json({
        success: true,
        message: `${body.ids.length} barang berjaya dipadam`
      })
    }

    // Single delete - Get old data first
    if (body.id) {
      const oldBarang = await db.prepare(
        'SELECT id, namaBarang, kategori, kodBarang FROM barang WHERE id = ?'
      ).bind(body.id).first()

      await db.prepare(
        'DELETE FROM barang WHERE id = ?'
      ).bind(body.id).run()

      // Log the deletion
      if (currentUser && oldBarang) {
        await logCRUD(
          db,
          currentUser.id,
          'DELETE',
          'barang',
          body.id,
          oldBarang,
          null,
          request
        )
      }

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
