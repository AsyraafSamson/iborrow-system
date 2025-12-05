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
          totalTempahan: 247,
          pending: 12,
          diluluskan: 156,
          ditolak: 45,
          dibatalkan: 34,
          approvalRate: 77.6,
          byStatus: {
            'Pending': 12,
            'Diluluskan': 156,
            'Ditolak': 45,
            'Dibatalkan': 34
          },
          monthlyTrend: [
            { month: 'Jan', count: 45 },
            { month: 'Feb', count: 52 },
            { month: 'Mar', count: 48 }
          ],
          recentBookings: [
            {
              id: 'tmp_001',
              userId: 'user_003',
              namaPemohon: 'Ahmad Bin Ali',
              barangId: 'brg_001',
              namaBarang: 'Laptop Dell',
              kategori: 'Laptop',
              kuantiti: 1,
              tarikhMula: '2025-12-05',
              tarikhTamat: '2025-12-10',
              status: 'Pending',
              createdAt: new Date().toISOString()
            }
          ]
        }
      })
    }

    // Real D1 queries
    const stats = await db.prepare(`
      SELECT
        COUNT(*) as totalTempahan,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'Diluluskan' THEN 1 ELSE 0 END) as diluluskan,
        SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as ditolak,
        SUM(CASE WHEN status = 'Dibatalkan' THEN 1 ELSE 0 END) as dibatalkan
      FROM tempahan
    `).first()

    // Calculate approval rate
    const totalProcessed = (stats?.diluluskan || 0) + (stats?.ditolak || 0)
    const approvalRate = totalProcessed > 0
      ? ((stats?.diluluskan || 0) / totalProcessed) * 100
      : 0

    const byStatus = await db.prepare(`
      SELECT status, COUNT(*) as count
      FROM tempahan
      GROUP BY status
      ORDER BY count DESC
    `).all()

    // Monthly trend for current year
    const monthlyTrend = await db.prepare(`
      SELECT
        strftime('%m', createdAt) as month,
        COUNT(*) as count
      FROM tempahan
      WHERE strftime('%Y', createdAt) = strftime('%Y', 'now')
      GROUP BY strftime('%m', createdAt)
      ORDER BY month
    `).all()

    const recentBookings = await db.prepare(`
      SELECT
        t.*,
        u.nama as namaPemohon,
        b.namaBarang, b.kategori, b.kodBarang
      FROM tempahan t
      JOIN users u ON t.userId = u.id
      JOIN barang b ON t.barangId = b.id
      ORDER BY t.createdAt DESC
      LIMIT 20
    `).all()

    // Format status data
    const statusData: any = {}
    byStatus.results?.forEach((row: any) => {
      statusData[row.status] = row.count
    })

    // Format monthly trend
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const trendData = monthlyTrend.results?.map((row: any) => ({
      month: monthNames[parseInt(row.month) - 1],
      count: row.count
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        approvalRate: parseFloat(approvalRate.toFixed(1)),
        byStatus: statusData,
        monthlyTrend: trendData,
        recentBookings: recentBookings.results || []
      }
    })

  } catch (error) {
    console.error('Booking report error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
