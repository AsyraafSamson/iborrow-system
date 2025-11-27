import { NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'Staff ICT Profile API',
    data: {}
  });
}