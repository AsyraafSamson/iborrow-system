import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const kategori = searchParams.get('kategori')
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'popularity' // popularity, name, quantity
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          items: [
            {
              id: 'brg_001',
              namaBarang: 'Laptop Dell Latitude 5420',
              kategori: 'Laptop',
              kodBarang: 'LT-001',
              kuantitiTotal: 10,
              kuantitiTersedia: 5,
              kuantitiDipinjam: 5,
              lokasi: 'Stor ICT',
              status: 'Tersedia',
              totalBookings: 15,
              approvedBookings: 12,
              rejectedBookings: 3,
              utilizationRate: 50
            }
          ],
          summary: {
            totalItems: 1,
            totalQuantity: 10,
            availableQuantity: 5,
            borrowedQuantity: 5,
            overallUtilization: 50
          }
        }
      })
    }

    // Build filter conditions
    const conditions: string[] = []
    const params: any[] = []

    if (kategori) {
      conditions.push('b.kategori = ?')
      params.push(kategori)
    }

    if (status) {
      conditions.push('b.status = ?')
      params.push(status)
    }

    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : ''

    // Determine sort order
    let orderBy = 'totalBookings DESC'
    if (sortBy === 'name') orderBy = 'b.namaBarang ASC'
    else if (sortBy === 'quantity') orderBy = 'b.kuantitiTotal DESC'

    // Date filter for bookings
    const dateFilter = startDate && endDate
      ? `AND t.createdAt BETWEEN '${startDate}' AND '${endDate}'`
      : ''

    // Get detailed item report
    const items = await db.prepare(`
      SELECT
        b.*,
        (b.kuantitiTotal - b.kuantitiTersedia) as kuantitiDipinjam,
        COUNT(DISTINCT t.id) as totalBookings,
        SUM(CASE WHEN t.status = 'Diluluskan' THEN 1 ELSE 0 END) as approvedBookings,
        SUM(CASE WHEN t.status = 'Ditolak' THEN 1 ELSE 0 END) as rejectedBookings,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pendingBookings,
        ROUND((CAST(b.kuantitiTotal - b.kuantitiTersedia AS FLOAT) / b.kuantitiTotal) * 100, 2) as utilizationRate
      FROM barang b
      LEFT JOIN tempahan t ON b.id = t.barangId ${dateFilter}
      ${whereClause}
      GROUP BY b.id
      ORDER BY ${orderBy}
    `).bind(...params).all()

    // Get summary statistics
    const summary = await db.prepare(`
      SELECT
        COUNT(*) as totalItems,
        SUM(kuantitiTotal) as totalQuantity,
        SUM(kuantitiTersedia) as availableQuantity,
        SUM(kuantitiTotal - kuantitiTersedia) as borrowedQuantity,
        ROUND(AVG((CAST(kuantitiTotal - kuantitiTersedia AS FLOAT) / kuantitiTotal) * 100), 2) as overallUtilization
      FROM barang
      ${whereClause}
    `).bind(...params).first()

    return NextResponse.json({
      success: true,
      data: {
        items: items.results,
        summary: summary || {
          totalItems: 0,
          totalQuantity: 0,
          availableQuantity: 0,
          borrowedQuantity: 0,
          overallUtilization: 0
        }
      },
      filters: { kategori, status, sortBy, startDate, endDate }
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
