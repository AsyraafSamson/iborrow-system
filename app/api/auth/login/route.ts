import { NextRequest, NextResponse } from 'next/server'
import { getD1Database, type User } from '@/lib/database'

function getRedirectPath(role: string) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'staff-ict': return '/staff-ict/dashboard';
    case 'user': return '/user/dashboard';
    case 'pelajar': return '/user/dashboard';
    case 'staf': return '/user/dashboard';
    default: return '/user/dashboard';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email dan password diperlukan'
        },
        { status: 400 }
      )
    }

    // Get D1 database using helper function
    const db = getD1Database()

    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database tidak tersedia. Sila hubungi admin.'
        },
        { status: 503 }
      )
    }

    // Query D1 database for user
    const user = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND password_hash = ? AND status = ?'
    ).bind(email, password, 'aktif').first<User>()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email atau password salah'
        },
        { status: 401 }
      )
    }

    // Update last login
    await db.prepare(
      "UPDATE users SET last_login = datetime('now') WHERE id = ?"
    ).bind(user.id).run()

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo: getRedirectPath(user.peranan),
      message: 'Login berjaya'
    })

  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
