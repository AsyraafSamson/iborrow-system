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
        barang: [
          {
            id: 'brg_001',
            namaBarang: 'Laptop Dell Latitude 5420',
            kategori: 'Laptop',
            kuantitiTersedia: 5,
            status: 'Tersedia',
            createdAt: new Date().toISOString()
          },
          {
            id: 'brg_002',
            namaBarang: 'Projektor Epson EB-X49',
            kategori: 'Projektor',
            kuantitiTersedia: 3,
            status: 'Tersedia',
            createdAt: new Date().toISOString()
          }
        ]
      })
    }

    // Real D1 query - show items with available stock
    const barang = await db.prepare(
      'SELECT * FROM barang WHERE kuantitiTersedia > 0 ORDER BY createdAt DESC'
    ).all()

    return NextResponse.json({
      success: true,
      barang: barang.results
    })

  } catch (error) {
    console.error('User barang error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
