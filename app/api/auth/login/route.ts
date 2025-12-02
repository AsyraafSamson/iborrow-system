import { NextRequest, NextResponse } from 'next/server'
function getRedirectPath(role: string) {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'staff-ict': return '/staff-ict/dashboard';
    case 'user': return '/user/dashboard';
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

    // Get D1 database from environment
    const db = (process.env as any).DB

    // Use mock data for local dev if D1 not available
    if (!db || typeof db.prepare !== 'function') {
      // Mock users for testing
      const mockUsers = [
        { id: 'user_001', email: 'admin@ilkkm.edu.my', password_hash: 'admin123', nama: 'Admin User', peranan: 'admin' },
        { id: 'user_002', email: 'staffict@ilkkm.edu.my', password_hash: 'staffict123', nama: 'Staff ICT', peranan: 'staff-ict' },
        { id: 'user_003', email: 'ahmad@ilkkm.edu.my', password_hash: 'user123', nama: 'Ahmad Bin Ali', peranan: 'pelajar' },
      ]

      const user = mockUsers.find(u => u.email === email && u.password_hash === password)

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email atau password salah'
          },
          { status: 401 }
        )
      }

      const { password_hash, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        redirectTo: getRedirectPath(user.peranan),
        usingRealDatabase: false,
        message: 'Login berjaya (Mock Data - Local Dev)'
      })
    }

    // Query D1 database (production)
    const result = await db.prepare(
      'SELECT * FROM users WHERE email = ? AND password_hash = ?'
    ).bind(email, password).first()

    if (!result) {
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
    ).bind(result.id).run()

    // Remove password from response
    const { password_hash, ...user } = result

    return NextResponse.json({
      success: true,
      user,
      redirectTo: getRedirectPath(user.peranan),
      usingRealDatabase: true,
      message: 'Login berjaya (D1 Database)'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
