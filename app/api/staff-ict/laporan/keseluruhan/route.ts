import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const periode = searchParams.get('periode') || 'bulan' // hari, minggu, bulan, tahun
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Mock comprehensive data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          summary: {
            totalUsers: 156,
            activeUsers: 89,
            totalBarang: 45,
            availableBarang: 28,
            totalBookings: 234,
            pendingBookings: 12,
            approvedBookings: 198,
            rejectedBookings: 24,
            completedBookings: 198,
            overallUtilization: 62.2
          },
          trends: {
            bookingsThisMonth: 28,
            bookingsLastMonth: 23,
            growthRate: 21.7,
            popularCategories: [
              { kategori: 'Laptop', count: 89, percentage: 38 },
              { kategori: 'Projector', count: 56, percentage: 24 },
              { kategori: 'Camera', count: 34, percentage: 15 }
            ]
          },
          faculty: {
            mostActiveUsers: [
              { fakulti: 'Kejururawatan', bookings: 45, users: 23 },
              { fakulti: 'Farmasi', bookings: 38, users: 19 },
              { fakulti: 'Perubatan', bookings: 32, users: 18 }
            ]
          },
          timeAnalysis: {
            peakHours: [
              { hour: '09:00', bookings: 15 },
              { hour: '14:00', bookings: 12 },
              { hour: '10:00', bookings: 10 }
            ],
            peakDays: [
              { day: 'Isnin', bookings: 28 },
              { day: 'Selasa', bookings: 25 },
              { day: 'Rabu', bookings: 23 }
            ]
          }
        }
      })
    }

    // Calculate date range based on periode
    let dateFilter = ''
    const params: any[] = []

    if (startDate && endDate) {
      dateFilter = 'AND t.createdAt BETWEEN ? AND ?'
      params.push(startDate, endDate)
    } else {
      // Default periods
      switch (periode) {
        case 'hari':
          dateFilter = "AND DATE(t.createdAt) = DATE('now')"
          break
        case 'minggu':
          dateFilter = "AND t.createdAt >= DATE('now', '-7 days')"
          break
        case 'bulan':
          dateFilter = "AND t.createdAt >= DATE('now', '-30 days')"
          break
        case 'tahun':
          dateFilter = "AND t.createdAt >= DATE('now', '-365 days')"
          break
      }
    }

    // Get overall summary statistics
    const summary = await db.prepare(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'aktif') as totalUsers,
        (SELECT COUNT(DISTINCT userId) FROM tempahan WHERE createdAt >= DATE('now', '-30 days')) as activeUsers,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as totalBarang,
        (SELECT SUM(kuantitiTersedia) FROM barang WHERE status = 'Tersedia') as availableBarang,
        (SELECT COUNT(*) FROM tempahan) as totalBookings,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Pending') as pendingBookings,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Diluluskan') as approvedBookings,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Ditolak') as rejectedBookings,
        (SELECT COUNT(*) FROM tempahan WHERE status = 'Selesai') as completedBookings,
        (
          SELECT ROUND(
            AVG((CAST(kuantitiTotal - kuantitiTersedia AS FLOAT) / kuantitiTotal) * 100), 2
          ) 
          FROM barang WHERE kuantitiTotal > 0
        ) as overallUtilization
    `).first()

    // Get growth trends
    const trendsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM tempahan WHERE createdAt >= DATE('now', '-30 days')) as bookingsThisMonth,
        (SELECT COUNT(*) FROM tempahan WHERE createdAt BETWEEN DATE('now', '-60 days') AND DATE('now', '-30 days')) as bookingsLastMonth
    `
    const trends = await db.prepare(trendsQuery).first()

    // Calculate growth rate
    const growthRate = trends?.bookingsLastMonth > 0 
      ? ((trends.bookingsThisMonth - trends.bookingsLastMonth) / trends.bookingsLastMonth * 100).toFixed(1)
      : 0

    // Get popular categories
    const popularCategories = await db.prepare(`
      SELECT 
        b.kategori,
        COUNT(t.id) as count,
        ROUND((COUNT(t.id) * 100.0 / (SELECT COUNT(*) FROM tempahan ${dateFilter.replace('t.', '')})), 1) as percentage
      FROM barang b
      LEFT JOIN tempahan t ON b.id = t.barangId ${dateFilter}
      GROUP BY b.kategori
      ORDER BY count DESC
      LIMIT 5
    `).bind(...params).all()

    // Get most active faculties
    const mostActiveUsers = await db.prepare(`
      SELECT 
        u.fakulti,
        COUNT(t.id) as bookings,
        COUNT(DISTINCT u.id) as users
      FROM users u
      LEFT JOIN tempahan t ON u.id = t.userId ${dateFilter}
      GROUP BY u.fakulti
      ORDER BY bookings DESC
      LIMIT 5
    `).bind(...params).all()

    // Get peak usage analysis
    const peakHours = await db.prepare(`
      SELECT 
        strftime('%H:00', createdAt) as hour,
        COUNT(*) as bookings
      FROM tempahan
      WHERE 1=1 ${dateFilter.replace('t.', '')}
      GROUP BY strftime('%H', createdAt)
      ORDER BY bookings DESC
      LIMIT 5
    `).bind(...params).all()

    const peakDays = await db.prepare(`
      SELECT 
        CASE strftime('%w', createdAt)
          WHEN '0' THEN 'Ahad'
          WHEN '1' THEN 'Isnin'
          WHEN '2' THEN 'Selasa'
          WHEN '3' THEN 'Rabu'
          WHEN '4' THEN 'Khamis'
          WHEN '5' THEN 'Jumaat'
          WHEN '6' THEN 'Sabtu'
        END as day,
        COUNT(*) as bookings
      FROM tempahan
      WHERE 1=1 ${dateFilter.replace('t.', '')}
      GROUP BY strftime('%w', createdAt)
      ORDER BY bookings DESC
    `).bind(...params).all()

    return NextResponse.json({
      success: true,
      data: {
        summary: summary || {
          totalUsers: 0,
          activeUsers: 0,
          totalBarang: 0,
          availableBarang: 0,
          totalBookings: 0,
          pendingBookings: 0,
          approvedBookings: 0,
          rejectedBookings: 0,
          completedBookings: 0,
          overallUtilization: 0
        },
        trends: {
          bookingsThisMonth: trends?.bookingsThisMonth || 0,
          bookingsLastMonth: trends?.bookingsLastMonth || 0,
          growthRate: parseFloat(growthRate),
          popularCategories: popularCategories?.results || []
        },
        faculty: {
          mostActiveUsers: mostActiveUsers?.results || []
        },
        timeAnalysis: {
          peakHours: peakHours?.results || [],
          peakDays: peakDays?.results || []
        }
      },
      periode,
      dateRange: { startDate, endDate }
    })

  } catch (error) {
    console.error('Staff ICT laporan keseluruhan error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
