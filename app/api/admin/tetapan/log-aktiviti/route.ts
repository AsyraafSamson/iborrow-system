import { NextRequest, NextResponse } from 'next/server'
import { getActivityLogs, getActivityStats } from '@/lib/activity-logger'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const userId = searchParams.get('userId')
    const jenisAktiviti = searchParams.get('jenisAktiviti')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const offset = (page - 1) * limit

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'log_001',
            userId: 'user_001',
            nama: 'Admin User',
            jenisAktiviti: 'CREATE',
            keterangan: 'Tambah barang baru: Laptop Dell',
            ipAddress: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            createdAt: new Date().toISOString()
          },
          {
            id: 'log_002',
            userId: 'user_002',
            nama: 'Staff ICT',
            jenisAktiviti: 'APPROVE',
            keterangan: 'Luluskan tempahan dari Ahmad',
            ipAddress: '192.168.1.2',
            userAgent: 'Mozilla/5.0...',
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          totalPages: 1
        }
      })
    }

    // Build filter conditions
    const conditions: string[] = []
    const params: any[] = []

    if (userId) {
      conditions.push('l.userId = ?')
      params.push(userId)
    }

    if (jenisAktiviti) {
      conditions.push('l.jenisAktiviti = ?')
      params.push(jenisAktiviti)
    }

    if (startDate && endDate) {
      conditions.push('l.createdAt BETWEEN ? AND ?')
      params.push(startDate, endDate)
    }

    const whereClause = conditions.length > 0
      ? 'WHERE ' + conditions.join(' AND ')
      : ''

    // Get total count
    const countQuery = await db.prepare(
      `SELECT COUNT(*) as total FROM log_aktiviti l ${whereClause}`
    ).bind(...params).first()

    const total = countQuery?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get logs with user info
    const logs = await db.prepare(`
      SELECT
        l.id, l.userId, l.jenisAktiviti, l.keterangan,
        l.ipAddress, l.userAgent, l.createdAt,
        u.nama, u.email, u.peranan
      FROM log_aktiviti l
      JOIN users u ON l.userId = u.id
      ${whereClause}
      ORDER BY l.createdAt DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

    return NextResponse.json({
      success: true,
      data: logs.results,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Log aktiviti GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Log aktiviti berjaya direkod (Mock)'
      })
    }

    const id = 'log_' + Date.now()
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await db.prepare(`
      INSERT INTO log_aktiviti (id, userId, jenisAktiviti, keterangan, ipAddress, userAgent)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.userId,
      body.jenisAktiviti,
      body.keterangan,
      ipAddress,
      userAgent
    ).run()

    return NextResponse.json({
      success: true,
      message: 'Log aktiviti berjaya direkod',
      data: { id }
    })

  } catch (error) {
    console.error('Log aktiviti POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Log aktiviti berjaya dipadam (Mock)'
      })
    }

    // Clear logs older than specified days
    if (body.action === 'clear-old' && body.days) {
      await db.prepare(`
        DELETE FROM log_aktiviti
        WHERE createdAt < datetime('now', '-' || ? || ' days')
      `).bind(body.days).run()

      return NextResponse.json({
        success: true,
        message: `Log aktiviti lebih dari ${body.days} hari telah dipadam`
      })
    }

    // Clear all logs
    if (body.action === 'clear-all') {
      await db.prepare('DELETE FROM log_aktiviti').run()

      return NextResponse.json({
        success: true,
        message: 'Semua log aktiviti telah dipadam'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Log aktiviti DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
