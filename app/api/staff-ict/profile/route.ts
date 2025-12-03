import { NextRequest, NextResponse } from 'next/server'

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
    console.error('Staff ICT profile error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
