import { NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'User Dashboard API',
    data: {
      totalBookings: 0,
      activeBookings: 0,
      historyCount: 0
    }
  });
}