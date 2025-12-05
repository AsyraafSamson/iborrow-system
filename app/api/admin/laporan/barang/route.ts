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
        data: {
          totalBarang: 45,
          tersedia: 38,
          dipinjam: 5,
          rosak: 2,
          totalValue: 125000,
          byKategori: {
            'Laptop': 15,
            'Projektor': 8,
            'Kamera': 6,
            'Tablet': 10,
            'Lain-lain': 6
          },
          topBarang: [
            {
              id: 'brg_001',
              namaBarang: 'Laptop Dell Latitude 5420',
              kategori: 'Laptop',
              kodBarang: 'LT-001',
              kuantitiTotal: 10,
              kuantitiTersedia: 7,
              totalPinjaman: 125,
              hargaPerolehan: 3500
            }
          ],
          lowStock: [
            {
              id: 'brg_003',
              namaBarang: 'Kamera DSLR',
              kategori: 'Kamera',
              kodBarang: 'KM-001',
              kuantitiTotal: 3,
              kuantitiTersedia: 0,
              status: 'Tidak Tersedia'
            }
          ]
        }
      })
    }

    // Real D1 queries
    const stats = await db.prepare(`
      SELECT
        COUNT(*) as totalBarang,
        SUM(CASE WHEN status = 'Tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN status = 'Tidak Tersedia' THEN 1 ELSE 0 END) as dipinjam,
        SUM(CASE WHEN status = 'Rosak' THEN 1 ELSE 0 END) as rosak,
        SUM(COALESCE(hargaPerolehan, 0) * kuantitiTotal) as totalValue
      FROM barang
    `).first()

    const byKategori = await db.prepare(`
      SELECT kategori, COUNT(*) as count
      FROM barang
      GROUP BY kategori
      ORDER BY count DESC
    `).all()

    const topBarang = await db.prepare(`
      SELECT
        b.id, b.namaBarang, b.kategori, b.kodBarang,
        b.kuantitiTotal, b.kuantitiTersedia,
        b.hargaPerolehan,
        COUNT(t.id) as totalPinjaman
      FROM barang b
      LEFT JOIN tempahan t ON b.id = t.barangId
      GROUP BY b.id
      ORDER BY totalPinjaman DESC
      LIMIT 10
    `).all()

    const lowStock = await db.prepare(`
      SELECT
        id, namaBarang, kategori, kodBarang,
        kuantitiTotal, kuantitiTersedia, status
      FROM barang
      WHERE kuantitiTersedia <= 2 OR status = 'Rosak'
      ORDER BY kuantitiTersedia ASC
      LIMIT 10
    `).all()

    // Format kategori data
    const kategoriData: any = {}
    byKategori.results?.forEach((row: any) => {
      kategoriData[row.kategori] = row.count
    })

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        byKategori: kategoriData,
        topBarang: topBarang.results || [],
        lowStock: lowStock.results || []
      }
    })

  } catch (error) {
    console.error('Item report error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
