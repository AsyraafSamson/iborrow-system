import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'summary'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: getMockReportData(reportType)
      })
    }

    let reportData: any = {}

    switch (reportType) {
      case 'summary':
        // Overall summary statistics
        reportData = await db.prepare(`
          SELECT
            (SELECT COUNT(*) FROM users) as totalUsers,
            (SELECT COUNT(*) FROM users WHERE status = 'aktif') as activeUsers,
            (SELECT COUNT(*) FROM barang) as totalBarang,
            (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as availableBarang,
            (SELECT COUNT(*) FROM tempahan) as totalTempahan,
            (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as pendingTempahan,
            (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as approvedTempahan,
            (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as rejectedTempahan,
            (SELECT COUNT(*) FROM log_aktiviti) as totalActivities
        `).first()
        break

      case 'barang-popular':
        // Most borrowed items
        reportData.items = await db.prepare(`
          SELECT
            b.id, b.namaBarang, b.kategori, b.kodBarang,
            COUNT(t.id) as totalBookings,
            SUM(t.kuantiti) as totalQuantityBooked,
            b.kuantitiTotal, b.kuantitiTersedia, b.lokasi
          FROM barang b
          LEFT JOIN tempahan t ON b.id = t.barangId
          WHERE t.status IN ('Diluluskan', 'Selesai')
          ${startDate && endDate ? `AND t.createdAt BETWEEN ? AND ?` : ''}
          GROUP BY b.id
          ORDER BY totalBookings DESC
          LIMIT 20
        `).bind(
          ...(startDate && endDate ? [startDate, endDate] : [])
        ).all()
        break

      case 'users-active':
        // Most active users
        reportData.users = await db.prepare(`
          SELECT
            u.id, u.nama, u.email, u.peranan, u.fakulti,
            COUNT(t.id) as totalBookings,
            SUM(CASE WHEN t.status = 'Diluluskan' THEN 1 ELSE 0 END) as approvedBookings,
            SUM(CASE WHEN t.status = 'Ditolak' THEN 1 ELSE 0 END) as rejectedBookings
          FROM users u
          LEFT JOIN tempahan t ON u.id = t.userId
          ${startDate && endDate ? `WHERE t.createdAt BETWEEN ? AND ?` : ''}
          GROUP BY u.id
          HAVING totalBookings > 0
          ORDER BY totalBookings DESC
          LIMIT 20
        `).bind(
          ...(startDate && endDate ? [startDate, endDate] : [])
        ).all()
        break

      case 'tempahan-by-date':
        // Bookings by date range
        reportData.bookings = await db.prepare(`
          SELECT
            t.*,
            b.namaBarang, b.kategori, b.kodBarang,
            u.nama as namaPemohon, u.email as emailPemohon, u.peranan, u.fakulti,
            s.nama as namaApprover
          FROM tempahan t
          JOIN barang b ON t.barangId = b.id
          JOIN users u ON t.userId = u.id
          LEFT JOIN users s ON t.diluluskanOleh = s.id
          ${startDate && endDate ? `WHERE t.createdAt BETWEEN ? AND ?` : ''}
          ORDER BY t.createdAt DESC
        `).bind(
          ...(startDate && endDate ? [startDate, endDate] : [])
        ).all()
        break

      case 'kategori-analysis':
        // Analysis by item category
        reportData.categories = await db.prepare(`
          SELECT
            b.kategori,
            COUNT(DISTINCT b.id) as totalItems,
            SUM(b.kuantitiTotal) as totalQuantity,
            SUM(b.kuantitiTersedia) as availableQuantity,
            COUNT(t.id) as totalBookings
          FROM barang b
          LEFT JOIN tempahan t ON b.id = t.barangId AND t.status IN ('Diluluskan', 'Selesai')
          GROUP BY b.kategori
          ORDER BY totalBookings DESC
        `).all()
        break

      case 'fakulti-usage':
        // Usage by faculty/department
        reportData.faculties = await db.prepare(`
          SELECT
            u.fakulti,
            COUNT(DISTINCT u.id) as totalUsers,
            COUNT(t.id) as totalBookings,
            SUM(CASE WHEN t.status = 'Diluluskan' THEN 1 ELSE 0 END) as approvedBookings,
            SUM(CASE WHEN t.status = 'Ditolak' THEN 1 ELSE 0 END) as rejectedBookings
          FROM users u
          LEFT JOIN tempahan t ON u.id = t.userId
          ${startDate && endDate ? `WHERE t.createdAt BETWEEN ? AND ?` : ''}
          GROUP BY u.fakulti
          ORDER BY totalBookings DESC
        `).bind(
          ...(startDate && endDate ? [startDate, endDate] : [])
        ).all()
        break

      case 'monthly-trend':
        // Monthly booking trends
        reportData.trends = await db.prepare(`
          SELECT
            strftime('%Y-%m', createdAt) as month,
            COUNT(*) as totalBookings,
            SUM(CASE WHEN status = 'Diluluskan' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'Ditolak' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending
          FROM tempahan
          GROUP BY month
          ORDER BY month DESC
          LIMIT 12
        `).all()
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      reportType,
      dateRange: startDate && endDate ? { startDate, endDate } : null,
      data: reportData
    })

  } catch (error) {
    console.error('Admin laporan error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

function getMockReportData(type: string) {
  switch (type) {
    case 'summary':
      return {
        totalUsers: 45,
        activeUsers: 42,
        totalBarang: 128,
        availableBarang: 95,
        totalTempahan: 156,
        pendingTempahan: 8,
        approvedTempahan: 120,
        rejectedTempahan: 12,
        totalActivities: 450
      }
    case 'barang-popular':
      return {
        items: [
          { id: 'brg_001', namaBarang: 'Laptop Dell', kategori: 'Laptop', totalBookings: 45, totalQuantityBooked: 52 },
          { id: 'brg_002', namaBarang: 'Projektor Epson', kategori: 'Projektor', totalBookings: 32, totalQuantityBooked: 35 }
        ]
      }
    case 'users-active':
      return {
        users: [
          { id: 'user_003', nama: 'Ahmad', email: 'ahmad@ilkkm.edu.my', totalBookings: 12, approvedBookings: 10, rejectedBookings: 2 }
        ]
      }
    default:
      return { message: 'Mock data for ' + type }
  }
}
