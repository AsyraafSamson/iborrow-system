import { NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'User Tempahan API',
    data: []
  });
}

export async function POST() {
  return NextResponse.json({ 
    success: true,
    message: 'Tempahan created'
  });
}