// app/api/auth/logout/route.ts - BUAT FILE BARU
import { NextRequest, NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Simple logout - clear session on client side
    // In real implementation, you might want to:
    // - Blacklist tokens
    // - Clear server sessions
    // - Update last_logout in database
    
    console.log('🚪 User logging out');
    
    return NextResponse.json({
      success: true,
      message: 'Logout berjaya'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}

// Optional: GET method untuk redirect
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Logout endpoint'
  });
}