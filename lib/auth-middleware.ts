import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from './session'

/**
 * Middleware to require authentication for API routes
 * Returns user if authenticated, or error response if not
 */
export function requireAuth(request: NextRequest) {
  const user = getCurrentUser(request)
  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Unauthorized - Sila log masuk' },
        { status: 401 }
      ),
      user: null
    }
  }
  return { error: null, user }
}

/**
 * Middleware to require specific role for API routes
 * Returns user if authorized, or error response if not
 */
export function requireRole(request: NextRequest, allowedRoles: string[]) {
  const { error, user } = requireAuth(request)
  if (error) return { error, user: null }
  
  if (!allowedRoles.includes(user.peranan)) {
    return {
      error: NextResponse.json(
        { success: false, error: 'Forbidden - Akses ditolak' },
        { status: 403 }
      ),
      user: null
    }
  }
  
  return { error: null, user }
}
