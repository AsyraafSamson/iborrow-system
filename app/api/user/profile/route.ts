import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
export async function GET(request: NextRequest) {
  try {
    const db = (process.env as any).DB
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'user_003'

    // Mock data for local dev
    if (!db || typeof db.prepare !== 'function') {
      return NextResponse.json({
        success: true,
        data: {
          id: 'user_003',
          email: 'ahmad@ilkkm.edu.my',
          nama: 'Ahmad Bin Ali',
          peranan: 'pelajar',
          fakulti: 'Kejururawatan',
          no_telefon: '0123456789',
          no_matrik: 'ILK2023001',
          no_staf: null,
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
    console.error('User profile GET error:', error)
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

      // Verify current password
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

      return NextResponse.json({
        success: true,
        message: 'Password berjaya ditukar'
      })
    }

    // Handle profile update
    const updates: string[] = []
    const values: any[] = []

    if (body.nama !== undefined) {
      updates.push('nama = ?')
      values.push(body.nama)
    }
    if (body.email !== undefined) {
      updates.push('email = ?')
      values.push(body.email)
    }
    if (body.fakulti !== undefined) {
      updates.push('fakulti = ?')
      values.push(body.fakulti)
    }
    if (body.no_telefon !== undefined) {
      updates.push('no_telefon = ?')
      values.push(body.no_telefon)
    }
    if (body.no_matrik !== undefined) {
      updates.push('no_matrik = ?')
      values.push(body.no_matrik)
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

    return NextResponse.json({
      success: true,
      message: 'Profile berjaya dikemaskini'
    })

  } catch (error) {
    console.error('User profile PUT error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
