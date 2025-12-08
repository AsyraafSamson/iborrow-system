import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'
import { hashPassword } from '@/lib/password'

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

    // Hash default password before storing
    const hashedPassword = await hashPassword('password123')

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
      hashedPassword, // Hashed default password
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
      // Hash the reset password before storing
      const hashedResetPassword = await hashPassword('password123')

      await db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(hashedResetPassword, body.id).run()

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
      // Check for active dependencies first
      const usersWithActiveDeps: string[] = []
      
      for (const id of body.ids) {
        const activeBookings = await db.prepare(
          "SELECT COUNT(*) as count FROM tempahan WHERE (userId = ? OR diluluskanOleh = ?) AND status IN ('Pending','Diluluskan','Dipinjam')"
        ).bind(id, id).first()
        
        if (activeBookings && activeBookings.count > 0) {
          const user = await db.prepare('SELECT nama FROM users WHERE id = ?').bind(id).first()
          usersWithActiveDeps.push(user?.nama || id)
        }
      }
      
      if (usersWithActiveDeps.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `Tidak boleh padam pengguna yang mempunyai tempahan aktif: ${usersWithActiveDeps.join(', ')}`,
            deletionPath: 'bulk'
          },
          { status: 400 }
        )
      }

      for (const id of body.ids) {
        // Get old data before delete
        const oldUser = await db.prepare(
          'SELECT id, nama, email, peranan FROM users WHERE id = ?'
        ).bind(id).first()

        // Clean up FK references
        await db.prepare("DELETE FROM tempahan WHERE (userId = ? OR diluluskanOleh = ?) AND status NOT IN ('Pending','Diluluskan','Dipinjam')").bind(id, id).run()
        await db.prepare('DELETE FROM log_aktiviti WHERE userId = ?').bind(id).run()
        await db.prepare('UPDATE barang SET createdBy = NULL WHERE createdBy = ?').bind(id).run()

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
        message: `${body.ids.length} pengguna berjaya dipadam`,
        deletionPath: 'bulk'
      })
    }

    // Single delete - Check for active dependencies first
    const activeBookings = await db.prepare(
      "SELECT COUNT(*) as count FROM tempahan WHERE (userId = ? OR diluluskanOleh = ?) AND status IN ('Pending','Diluluskan','Dipinjam')"
    ).bind(body.id, body.id).first()
    
    if (activeBookings && activeBookings.count > 0) {
      const user = await db.prepare('SELECT nama FROM users WHERE id = ?').bind(body.id).first()
      return NextResponse.json(
        {
          success: false,
          error: `Tidak boleh padam "${user?.nama || 'pengguna ini'}" kerana mempunyai ${activeBookings.count} tempahan aktif`,
          deletionPath: 'single'
        },
        { status: 400 }
      )
    }

    // Single delete - Get old data first
    const oldUser = await db.prepare(
      'SELECT id, nama, email, peranan FROM users WHERE id = ?'
    ).bind(body.id).first()

    // Clean up FK references
    await db.prepare("DELETE FROM tempahan WHERE (userId = ? OR diluluskanOleh = ?) AND status NOT IN ('Pending','Diluluskan','Dipinjam')").bind(body.id, body.id).run()
    await db.prepare('DELETE FROM log_aktiviti WHERE userId = ?').bind(body.id).run()
    await db.prepare('UPDATE barang SET createdBy = NULL WHERE createdBy = ?').bind(body.id).run()

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
      message: 'Pengguna berjaya dipadam',
      deletionPath: 'single'
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
