import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/session'
import { logCRUD } from '@/lib/activity-logger'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user_002'

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          id: 'user_002',
          email: 'staffict@ilkkm.edu.my',
          nama: 'Staff ICT',
          peranan: 'staff-ict',
          fakulti: 'ICT Department',
          no_telefon: '0123456789',
          no_matrik: null,
          no_staf: 'STF2023002',
          status: 'aktif'
        }
      })
    }

    // Real D1 query
    const user = await db.prepare(
      'SELECT id, email, nama, peranan, fakulti, no_telefon, no_matrik, no_staf, status FROM users WHERE id = ?'
    ).bind(userId).first()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Staff ICT profile GET error:', error)
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
        message: 'Profile berjaya dikemaskini (Mock)'
      })
    }

    const userId = body.userId || body.id

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID diperlukan' },
        { status: 400 }
      )
    }

    // Handle password change
    if (body.action === 'change-password') {
      const { currentPassword, newPassword } = body

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Password lama dan baru diperlukan' },
          { status: 400 }
        )
      }

      // Get current password hash
      const user = await db.prepare(
        'SELECT password_hash FROM users WHERE id = ?'
      ).bind(userId).first()

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User tidak dijumpai' },
          { status: 404 }
        )
      }

      // Verify current password (you'll need to import verifyPassword and hashPassword)
      const { verifyPassword, hashPassword } = await import('@/lib/password')
      const isValid = await verifyPassword(currentPassword, user.password_hash)
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Password lama tidak sah' },
          { status: 401 }
        )
      }

      // Hash new password
      const newHash = await hashPassword(newPassword)

      // Update password
      await db.prepare(
        'UPDATE users SET password_hash = ?, updated_at = datetime("now") WHERE id = ?'
      ).bind(newHash, userId).run()

      // Log password change
      const currentUser = getCurrentUser(request)
      if (currentUser) {
        await logCRUD(
          db,
          currentUser.id,
          'UPDATE',
          'users',
          userId,
          { action: 'password_change' },
          { action: 'password_change' },
          request
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Password berjaya ditukar'
      })
    }

    // Handle profile update
    // Get old data before update
    const oldUser = await db.prepare(
      'SELECT nama, email, fakulti, no_telefon, no_staf FROM users WHERE id = ?'
    ).bind(userId).first()

    const updates: string[] = []
    const values: any[] = []
    const newData: any = {}

    if (body.nama !== undefined) {
      updates.push('nama = ?')
      values.push(body.nama)
      newData.nama = body.nama
    }
    if (body.email !== undefined) {
      updates.push('email = ?')
      values.push(body.email)
      newData.email = body.email
    }
    if (body.fakulti !== undefined) {
      updates.push('fakulti = ?')
      values.push(body.fakulti)
      newData.fakulti = body.fakulti
    }
    if (body.no_telefon !== undefined) {
      updates.push('no_telefon = ?')
      values.push(body.no_telefon)
      newData.no_telefon = body.no_telefon
    }
    if (body.no_staf !== undefined) {
      updates.push('no_staf = ?')
      values.push(body.no_staf)
      newData.no_staf = body.no_staf
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tiada perubahan untuk dikemaskini' },
        { status: 400 }
      )
    }

    updates.push('updated_at = datetime("now")')
    values.push(userId)

    await db.prepare(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values).run()

    // Log profile update
    const currentUser = getCurrentUser(request)
    if (currentUser && oldUser) {
      await logCRUD(
        db,
        currentUser.id,
        'UPDATE',
        'users',
        userId,
        oldUser,
        newData,
        request
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile berjaya dikemaskini'
    })

  } catch (error) {
    console.error('Staff ICT profile PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
