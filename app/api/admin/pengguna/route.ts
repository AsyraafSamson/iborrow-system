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
        data: [
          {
            id: 'user_001',
            email: 'admin@ilkkm.edu.my',
            nama: 'Admin User',
            peranan: 'admin',
            fakulti: 'ICT Department',
            no_telefon: '0123456789',
            no_matrik: null,
            no_staf: 'STF2023001',
            status: 'aktif',
            created_at: new Date().toISOString()
          }
        ]
      })
    }

    // Real D1 query
    const users = await db.prepare(
      'SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status, created_at FROM users ORDER BY created_at DESC'
    ).all()

    return NextResponse.json({
      success: true,
      data: users.results
    })

  } catch (error) {
    console.error('Admin pengguna GET error:', error)
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
        message: 'Pengguna berjaya ditambah (Mock)',
        data: { id: 'user_' + Date.now() }
      })
    }

    // Real D1 insert
    const id = 'user_' + Date.now()

    await db.prepare(`
      INSERT INTO users (id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, password_hash, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.email,
      body.nama,
      body.role,
      body.fakulti,
      body.no_telefon || '',
      body.noMatrik || null,
      body.noStaf || null,
      'password123', // Default password
      'aktif'
    ).run()

    return NextResponse.json({
      success: true,
      message: 'Pengguna berjaya ditambah',
      data: { id }
    })

  } catch (error) {
    console.error('Admin pengguna POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const body = await request.json()

    // Mock response for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        message: 'Pengguna berjaya dikemaskini (Mock)'
      })
    }

    // Reset password
    if (body.action === 'reset-password') {
      await db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind('password123', body.id).run()

      return NextResponse.json({
        success: true,
        message: 'Password berjaya direset kepada password123'
      })
    }

    // Update status
    if (body.status) {
      await db.prepare(
        'UPDATE users SET status = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(body.status, body.id).run()
    }

    return NextResponse.json({
      success: true,
      message: 'Pengguna berjaya dikemaskini'
    })

  } catch (error) {
    console.error('Admin pengguna PUT error:', error)
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
      const count = body.ids ? body.ids.length : 1
      return NextResponse.json({
        success: true,
        message: `${count} pengguna berjaya dipadam (Mock)`
      })
    }

    // Bulk delete
    if (Array.isArray(body.ids)) {
      for (const id of body.ids) {
        await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()
      }
      return NextResponse.json({
        success: true,
        message: `${body.ids.length} pengguna berjaya dipadam`
      })
    }

    // Single delete
    await db.prepare('DELETE FROM users WHERE id = ?').bind(body.id).run()
    return NextResponse.json({
      success: true,
      message: 'Pengguna berjaya dipadam'
    })

  } catch (error) {
    console.error('Admin pengguna DELETE error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
