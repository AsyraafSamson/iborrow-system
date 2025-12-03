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
            id: 'brg_001',
            namaBarang: 'Laptop Dell Latitude 5420',
            kategori: 'Laptop',
            kodBarang: 'LT-001',
            kuantitiTotal: 10,
            kuantitiTersedia: 5,
            lokasi: 'Stor ICT',
            status: 'Tersedia',
            jumlahDipinjam: 15
          }
        ]
      })
    }

    // Real D1 query
    const barang = await db.prepare(`
      SELECT b.*,
        (SELECT COUNT(*) FROM tempahan WHERE barangId = b.id AND status = 'Diluluskan') as jumlahDipinjam
      FROM barang b
      ORDER BY jumlahDipinjam DESC
    `).all()

    return NextResponse.json({
      success: true,
      data: barang.results
    })

  } catch (error) {
    console.error('Laporan barang error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
