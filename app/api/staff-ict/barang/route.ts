import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const kategori = searchParams.get('kategori') || ''
    const status = searchParams.get('status') || ''

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      const mockBarang = [
        {
          id: 'brg_001',
          namaBarang: 'Laptop Dell Latitude 5420',
          kategori: 'Laptop',
          kodBarang: 'LT-001',
          kuantitiTersedia: 8,
          kuantitiTotal: 10,
          lokasi: 'Stor ICT',
          status: 'Tersedia',
          hargaPerolehan: 3500.00,
          tarikhPerolehan: '2024-01-15',
          catatan: 'Untuk kegunaan pelajar',
          createdAt: new Date().toISOString()
        },
        {
          id: 'brg_002',
          namaBarang: 'Projektor Epson EB-X05',
          kategori: 'Projektor',
          kodBarang: 'PJ-001',
          kuantitiTersedia: 5,
          kuantitiTotal: 6,
          lokasi: 'Stor ICT',
          status: 'Tersedia',
          hargaPerolehan: 1200.00,
          tarikhPerolehan: '2024-02-20',
          catatan: '',
          createdAt: new Date().toISOString()
        },
        {
          id: 'brg_003',
          namaBarang: 'Kamera DSLR Canon 800D',
          kategori: 'Kamera',
          kodBarang: 'KM-001',
          kuantitiTersedia: 0,
          kuantitiTotal: 3,
          lokasi: 'Stor ICT',
          status: 'Tidak Tersedia',
          hargaPerolehan: 2800.00,
          tarikhPerolehan: '2023-11-10',
          catatan: 'Semua dipinjam',
          createdAt: new Date().toISOString()
        }
      ]

      let filtered = mockBarang

      if (search) {
        filtered = filtered.filter(b =>
          b.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
          b.kodBarang.toLowerCase().includes(search.toLowerCase())
        )
      }

      if (kategori && kategori !== 'all') {
        filtered = filtered.filter(b => b.kategori === kategori)
      }

      if (status && status !== 'all') {
        filtered = filtered.filter(b => b.status === status)
      }

      return NextResponse.json({
        success: true,
        barang: filtered,
        stats: {
          totalItems: mockBarang.length,
          tersedia: mockBarang.filter(b => b.status === 'Tersedia').length,
          dipinjam: mockBarang.filter(b => b.status === 'Tidak Tersedia').length,
          rosak: mockBarang.filter(b => b.status === 'Rosak').length
        }
      })
    }

    // Build query conditions
    let query = 'SELECT * FROM barang WHERE 1=1'
    const params: any[] = []

    if (search) {
      query += ' AND (namaBarang LIKE ? OR kodBarang LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (kategori && kategori !== 'all') {
      query += ' AND kategori = ?'
      params.push(kategori)
    }

    if (status && status !== 'all') {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY namaBarang ASC'

    const result = await db.prepare(query).bind(...params).all()

    // Get stats
    const statsResult = await db.prepare(`
      SELECT
        COUNT(*) as totalItems,
        SUM(CASE WHEN status = 'Tersedia' THEN 1 ELSE 0 END) as tersedia,
        SUM(CASE WHEN status = 'Tidak Tersedia' THEN 1 ELSE 0 END) as dipinjam,
        SUM(CASE WHEN status = 'Rosak' THEN 1 ELSE 0 END) as rosak
      FROM barang
    `).first()

    return NextResponse.json({
      success: true,
      barang: result.results || [],
      stats: statsResult || {
        totalItems: 0,
        tersedia: 0,
        dipinjam: 0,
        rosak: 0
      }
    })

  } catch (error) {
    console.error('Staff barang GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
