import { NextRequest, NextResponse } from 'next/server'

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
            namaPemohon: 'Ahmad Bin Ali',
            fakulti: 'Kejururawatan',
            kuantiti: 1,
            tarikhMula: '2025-12-05',
            tarikhTamat: '2025-12-10',
            status: 'Pending',
            createdAt: new Date().toISOString()
          }
        ]
      })
    }

    // Real D1 query
    const tempahan = await db.prepare(`
      SELECT t.*, b.namaBarang, u.nama as namaPemohon, u.fakulti
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      JOIN users u ON t.userId = u.id
      ORDER BY t.createdAt DESC
      LIMIT 100
    `).all()

    return NextResponse.json({
      success: true,
      data: tempahan.results
    })

  } catch (error) {
    console.error('Laporan tempahan error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
