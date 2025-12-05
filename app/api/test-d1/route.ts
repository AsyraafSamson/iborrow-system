import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing D1 connection...')
    
    // Check environment variables
    const env = process.env as any
    console.log('Environment check:', {
      hasDB: !!env.DB,
      dbType: typeof env.DB,
      dbMethods: env.DB ? Object.getOwnPropertyNames(env.DB) : 'none'
    })

    // Try to get D1 database
    if (!env.DB || typeof env.DB.prepare !== 'function') {
      return NextResponse.json({
        success: false,
        message: 'D1 Database binding not available',
        environment: {
          hasDB: !!env.DB,
          dbType: typeof env.DB
        }
      })
    }

    // Test D1 query
    const result = await env.DB.prepare('SELECT COUNT(*) as total FROM users').first()
    
    return NextResponse.json({
      success: true,
      message: 'D1 Database connected successfully!',
      data: result,
      environment: {
        hasDB: !!env.DB,
        dbType: typeof env.DB
      }
    })

  } catch (error) {
    console.error('❌ D1 Test error:', error)
    return NextResponse.json({
      success: false,
      message: 'D1 Database connection failed',
      error: error.message
    }, { status: 500 })
  }
}