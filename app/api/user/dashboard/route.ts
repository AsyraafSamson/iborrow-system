import { NextResponse } from 'next/server';

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