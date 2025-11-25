import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'User Profile API',
    data: {}
  });
}

export async function PUT() {
  return NextResponse.json({ 
    success: true,
    message: 'Profile updated'
  });
}