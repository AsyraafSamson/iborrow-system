import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'edge'
import { getD1Database } from '@/lib/database'
import { verifyPassword } from '@/lib/password'

export async function GET(request: NextRequest) {
  try {
    const db = getD1Database()

    if (!db) {
      return NextResponse.json({ error: 'DB not available' })
    }

    // Get admin user
    const user = await db.prepare(
      'SELECT email, password_hash, status FROM users WHERE email = ?'
    ).bind('admin@ilkkm.edu.my').first()

    if (!user) {
      return NextResponse.json({ error: 'User not found' })
    }

    // Test password
    const testPassword = 'admin123'
    const isValid = await verifyPassword(testPassword, user.password_hash as string)

    return NextResponse.json({
      email: user.email,
      status: user.status,
      hash_length: (user.password_hash as string).length,
      hash_preview: (user.password_hash as string).substring(0, 20),
      testPassword,
      passwordMatch: isValid
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
