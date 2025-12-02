import { NextRequest, NextResponse } from 'next/server'
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
    console.error('User profile error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
