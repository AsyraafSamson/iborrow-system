import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const fakulti = searchParams.get('fakulti')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '100')

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          bookings: [
            {
              id: 'tmp_001',
              userId: 'user_003',
              barangId: 'brg_001',
              namaBarang: 'Laptop Dell Latitude 5420',
              kategori: 'Laptop',
              namaPemohon: 'Ahmad Bin Ali',
              emailPemohon: 'ahmad@ilkkm.edu.my',
              fakulti: 'Kejururawatan',
              kuantiti: 1,
              tarikhMula: '2025-12-05',
              tarikhTamat: '2025-12-10',
              tujuan: 'Kuliah online',
              status: 'Pending',
              namaApprover: null,
              createdAt: new Date().toISOString()
            }
          ],
          summary: {
            totalBookings: 1,
            pendingCount: 1,
            approvedCount: 0,
            rejectedCount: 0,
            completedCount: 0
          }
        }
      })
    }

    // Build filter conditions
    const conditions: string[] = []
    const params: any[] = []

    if (status) {
      conditions.push('t.status = ?')
      params.push(status)
    }

    if (fakulti) {
      conditions.push('u.fakulti = ?')
      params.push(fakulti)
    }

    if (startDate && endDate) {
      conditions.push('t.createdAt BETWEEN ? AND ?')
      params.push(startDate, endDate)
    }

    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : ''

    // Get bookings with full details
    const bookings = await db.prepare(`
      SELECT
        t.*,
        b.namaBarang, b.kategori, b.kodBarang,
        u.nama as namaPemohon, u.email as emailPemohon, u.fakulti, u.peranan,
        s.nama as namaApprover
      FROM tempahan t
      JOIN barang b ON t.barangId = b.id
      JOIN users u ON t.userId = u.id
      LEFT JOIN users s ON t.diluluskanOleh = s.id
      ${whereClause}
      ORDER BY t.createdAt DESC
      LIMIT ?
    `).bind(...params, limit).all()

    // Get summary statistics
    const summary = await db.prepare(`
      SELECT
        COUNT(*) as totalBookings,
        SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) as pendingCount,
        SUM(CASE WHEN t.status = 'Diluluskan' THEN 1 ELSE 0 END) as approvedCount,
        SUM(CASE WHEN t.status = 'Ditolak' THEN 1 ELSE 0 END) as rejectedCount,
        SUM(CASE WHEN t.status = 'Selesai' THEN 1 ELSE 0 END) as completedCount,
        SUM(CASE WHEN t.status = 'Dibatalkan' THEN 1 ELSE 0 END) as cancelledCount
      FROM tempahan t
      JOIN users u ON t.userId = u.id
      ${whereClause}
    `).bind(...params).first()

    return NextResponse.json({
      success: true,
      data: {
        bookings: bookings.results,
        summary: summary || {
          totalBookings: 0,
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
          completedCount: 0,
          cancelledCount: 0
        }
      },
      filters: { status, fakulti, startDate, endDate, limit }
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
