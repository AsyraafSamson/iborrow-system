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
          totalLogs: 1247,
          todayLogs: 45,
          byActivity: {
            'LOGIN': 245,
            'CREATE': 189,
            'UPDATE': 156,
            'DELETE': 45,
            'APPROVE': 89,
            'REJECT': 34
          },
          byUser: [
            { nama: 'Admin User', count: 145 },
            { nama: 'Staff ICT 1', count: 98 }
          ],
          recentLogs: [
            {
              id: 'log_001',
              userId: 'user_001',
              nama: 'Admin User',
              email: 'admin@ilkkm.edu.my',
              peranan: 'admin',
              jenisAktiviti: 'CREATE',
              keterangan: 'Tambah barang baru: Laptop Dell',
              ipAddress: '192.168.1.1',
              createdAt: new Date().toISOString()
            }
          ]
        }
      })
    }

    // Real D1 queries
    const stats = await db.prepare(`
      SELECT
        COUNT(*) as totalLogs,
        SUM(CASE WHEN DATE(createdAt) = DATE('now') THEN 1 ELSE 0 END) as todayLogs
      FROM log_aktiviti
    `).first()

    const byActivity = await db.prepare(`
      SELECT jenisAktiviti, COUNT(*) as count
      FROM log_aktiviti
      GROUP BY jenisAktiviti
      ORDER BY count DESC
    `).all()

    const byUser = await db.prepare(`
      SELECT
        u.nama,
        COUNT(l.id) as count
      FROM log_aktiviti l
      JOIN users u ON l.userId = u.id
      GROUP BY l.userId
      ORDER BY count DESC
      LIMIT 10
    `).all()

    const recentLogs = await db.prepare(`
      SELECT
        l.id, l.userId, l.jenisAktiviti, l.keterangan,
        l.ipAddress, l.createdAt,
        u.nama, u.email, u.peranan
      FROM log_aktiviti l
      JOIN users u ON l.userId = u.id
      ORDER BY l.createdAt DESC
      LIMIT 20
    `).all()

    // Format activity data
    const activityData: any = {}
    byActivity.results?.forEach((row: any) => {
      activityData[row.jenisAktiviti] = row.count
    })

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        byActivity: activityData,
        byUser: byUser.results || [],
        recentLogs: recentLogs.results || []
      }
    })

  } catch (error) {
    console.error('Activity report error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
