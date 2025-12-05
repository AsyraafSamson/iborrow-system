import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, getCurrentUser } from '@/lib/session'
import { getD1Database } from '@/lib/database'
import { logAuth } from '@/lib/activity-logger'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    // Get current user before clearing session
    const currentUser = getCurrentUser(request)

    // Log logout if user is logged in and DB is available
    if (currentUser) {
      const db = getD1Database()
      if (db) {
        await logAuth(db, currentUser.id, 'LOGOUT', request)
      }
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout berjaya'
    })

    // Clear session cookie
    clearSessionCookie(response)

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
