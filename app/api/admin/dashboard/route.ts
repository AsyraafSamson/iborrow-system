import { NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'Admin dashboard API',
    data: {
      totalUsers: 0,
      totalItems: 0, 
      activeBookings: 0
    }
  });
}