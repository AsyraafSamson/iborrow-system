import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'

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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Real D1 insert
    const id = 'user_' + Date.now()
    const newUserData = {
      id,
      email: body.email,
      nama: body.nama,
      peranan: body.role,
      fakulti: body.fakulti,
      no_telefon: body.no_telefon || '',
      no_matrik: body.noMatrik || null,
      no_staf: body.noStaf || null,
      status: 'aktif'
    }

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

    // Log the creation
    if (currentUser) {
      await logCRUD(
        db,
        currentUser.id,
        'CREATE',
        'users',
        id,
        null,
        newUserData,
        request
      )
    }

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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Get old data before update
    const oldUser = await db.prepare(
      'SELECT * FROM users WHERE id = ?'
    ).bind(body.id).first()

    // Reset password
    if (body.action === 'reset-password') {
      await db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind('password123', body.id).run()

      // Log password reset
      if (currentUser && oldUser) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'users',
          body.id,
          { action: 'password_reset' },
          { action: 'password_reset', new_password: 'password123' },
          request
        )
      }

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

      // Log status update
      if (currentUser && oldUser) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'users',
          body.id,
          { status: oldUser.status },
          { status: body.status },
          request
        )
      }
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

    // Get current user for logging
    const currentUser = getCurrentUser(request)

    // Bulk delete
    if (Array.isArray(body.ids)) {
      for (const id of body.ids) {
        // Get old data before delete
        const oldUser = await db.prepare(
          'SELECT id, nama, email, peranan FROM users WHERE id = ?'
        ).bind(id).first()

        await db.prepare('DELETE FROM users WHERE id = ?').bind(id).run()

        // Log each deletion
        if (currentUser && oldUser) {
          await logCRUD(
            db,
            currentUser.id,
            'DELETE',
            'users',
            id,
            oldUser,
            null,
            request
          )
        }
      }
      return NextResponse.json({
        success: true,
        message: `${body.ids.length} pengguna berjaya dipadam`
      })
    }

    // Single delete - Get old data first
    const oldUser = await db.prepare(
      'SELECT id, nama, email, peranan FROM users WHERE id = ?'
    ).bind(body.id).first()

    await db.prepare('DELETE FROM users WHERE id = ?').bind(body.id).run()

    // Log the deletion
    if (currentUser && oldUser) {
      await logCRUD(
        db,
        currentUser.id,
        'DELETE',
        'users',
        body.id,
        oldUser,
        null,
        request
      )
    }

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
