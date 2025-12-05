import { NextRequest, NextResponse } from 'next/server'

// Simple JWT-like token encoding/decoding for Edge Runtime
// Using base64 encoding with a secret key

const SECRET_KEY = process.env.SESSION_SECRET || 'iborrow-secret-key-change-in-production'

interface SessionUser {
  id: string
  email: string
  nama: string
  peranan: string
  fakulti?: string
  no_telefon?: string
  no_matrik?: string
  no_staf?: string
}

/**
 * Create a session token from user data
 */
export function createSessionToken(user: SessionUser): string {
  const payload = {
    user,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiry
  }

  const jsonPayload = JSON.stringify(payload)
  const encoded = btoa(jsonPayload) // Base64 encode

  // Simple signature (not cryptographically secure, but works for Edge)
  const signature = btoa(SECRET_KEY + encoded)

  return `${encoded}.${signature}`
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): SessionUser | null {
  try {
    const [encoded, signature] = token.split('.')

    // Verify signature
    const expectedSignature = btoa(SECRET_KEY + encoded)
    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const jsonPayload = atob(encoded)
    const payload = JSON.parse(jsonPayload)

    // Check expiry
    if (payload.exp < Date.now()) {
      return null
    }

    return payload.user
  } catch (error) {
    console.error('Session token verification failed:', error)
    return null
  }
}

/**
 * Get current user from request
 */
export function getCurrentUser(request: NextRequest): SessionUser | null {
  try {
    // Try to get from cookie first
    const token = request.cookies.get('session')?.value

    if (token) {
      const user = verifySessionToken(token)
      if (user) {
        return user
      }
    }

    // Fallback: Try to get from Authorization header (for API calls from frontend)
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7)
      const user = verifySessionToken(bearerToken)
      if (user) {
        return user
      }
    }

    return null
  } catch (error) {
    console.error('Get current user failed:', error)
    return null
  }
}

/**
 * Set session cookie in response
 */
export function setSessionCookie(response: NextResponse, user: SessionUser) {
  const token = createSessionToken(user)

  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })

  return response
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(response: NextResponse) {
  response.cookies.delete('session')
  return response
}

/**
 * Check if user has required role
 */
export function hasRole(user: SessionUser | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.peranan)
}

/**
 * Require authentication middleware
 */
export function requireAuth(request: NextRequest): SessionUser | NextResponse {
  const user = getCurrentUser(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized - Sila log masuk' },
      { status: 401 }
    )
  }

  return user
}

/**
 * Require specific role middleware
 */
export function requireRole(request: NextRequest, roles: string[]): SessionUser | NextResponse {
  const user = getCurrentUser(request)

  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized - Sila log masuk' },
      { status: 401 }
    )
  }

  if (!hasRole(user, roles)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden - Akses ditolak' },
      { status: 403 }
    )
  }

  return user
}
