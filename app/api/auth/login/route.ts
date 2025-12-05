import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
import { getD1Database, type User } from '@/lib/database'
import { verifyPassword } from '@/lib/password'
import { createSessionToken, setSessionCookie } from '@/lib/session'
import { logAuth } from '@/lib/activity-logger'

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
    
    console.log('🔍 Login API - D1 Database check:', {
      dbExists: !!db,
      envDB: !!(process.env as any).DB,
      dbType: typeof (process.env as any).DB
    })

    if (!db) {
      console.log('❌ D1 Database not available, using fallback')
      return NextResponse.json(
        {
          success: false,
          error: 'Database tidak tersedia. Sila hubungi admin.'
        },
        { status: 503 }
      )
    }
    
    console.log('✅ D1 Database connected, attempting login for:', email)

    // Query D1 database for user by email only
    const user = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND status = ?'
    ).bind(email, 'aktif').first<User>()

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email atau password salah'
        },
        { status: 401 }
      )
    }

    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
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

    // Log successful login
    await logAuth(db, user.id, 'LOGIN', request)

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user

    // Create session token
    const sessionToken = createSessionToken({
      id: user.id,
      email: user.email,
      nama: user.nama,
      peranan: user.peranan,
      fakulti: user.fakulti,
      no_telefon: user.no_telefon,
      no_matrik: user.no_matrik,
      no_staf: user.no_staf
    })

    // Create response with session cookie
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: sessionToken, // For frontend to use in API calls
      redirectTo: getRedirectPath(user.peranan),
      message: 'Login berjaya'
    })

    // Set session cookie
    setSessionCookie(response, {
      id: user.id,
      email: user.email,
      nama: user.nama,
      peranan: user.peranan,
      fakulti: user.fakulti,
      no_telefon: user.no_telefon,
      no_matrik: user.no_matrik,
      no_staf: user.no_staf
    })

    return response

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
