import { NextRequest, NextResponse } from 'next/server'

// Configure for Cloudflare Pages Edge Runtime
export const runtime = 'edge'
export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Logout berjaya'
    })
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
