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
          totalUsers: 156,
          activeUsers: 124,
          inactiveUsers: 32,
          byRole: {
            pelajar: 98,
            pengajar: 35,
            'staff-pentadbiran': 15,
            'staff-ict': 5,
            admin: 3
          },
          byFakulti: {
            'Kejuruteraan': 45,
            'Kejururawatan': 38,
            'Perubatan': 32,
            'Farmasi': 25,
            'Lain-lain': 16
          },
          recentUsers: [
            {
              id: 'user_001',
              nama: 'Ahmad Bin Ali',
              email: 'ahmad@ilkkm.edu.my',
              peranan: 'pelajar',
              fakulti: 'Kejuruteraan',
              status: 'aktif',
              totalTempahan: 12,
              lastLogin: new Date().toISOString(),
              createdAt: '2024-01-15'
            }
          ]
        }
      })
    }

    // Real D1 queries
    const stats = await db.prepare(`
      SELECT
        COUNT(*) as totalUsers,
        SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as activeUsers,
        SUM(CASE WHEN status = 'tidak aktif' THEN 1 ELSE 0 END) as inactiveUsers
      FROM users
    `).first()

    const byRole = await db.prepare(`
      SELECT peranan, COUNT(*) as count
      FROM users
      GROUP BY peranan
      ORDER BY count DESC
    `).all()

    const byFakulti = await db.prepare(`
      SELECT fakulti, COUNT(*) as count
      FROM users
      WHERE fakulti IS NOT NULL AND fakulti != ''
      GROUP BY fakulti
      ORDER BY count DESC
      LIMIT 10
    `).all()

    const recentUsers = await db.prepare(`
      SELECT
        u.id, u.nama, u.email, u.peranan, u.fakulti, u.status,
        u.last_login as lastLogin,
        u.created_at as createdAt,
        COUNT(t.id) as totalTempahan
      FROM users u
      LEFT JOIN tempahan t ON u.id = t.userId
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT 20
    `).all()

    // Format role data
    const roleData: any = {}
    byRole.results?.forEach((row: any) => {
      roleData[row.peranan] = row.count
    })

    // Format fakulti data
    const fakultiData: any = {}
    byFakulti.results?.forEach((row: any) => {
      fakultiData[row.fakulti] = row.count
    })

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        byRole: roleData,
        byFakulti: fakultiData,
        recentUsers: recentUsers.results || []
      }
    })

  } catch (error) {
    console.error('User report error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
