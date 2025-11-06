// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    // MOCK DATA - TANPA last_login untuk elak error
    const mockUsers = [
      {
        id: '1',
        email: 'admin@iborrow.com',
        nama: 'Administrator System',
        peranan: 'admin',
        jabatan: 'ICT',
        no_telefon: '0123456789',
        password_hash: 'admin123',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
        // last_login removed to avoid errors
      },
      {
        id: '2',
        email: 'staff@iborrow.com',
        nama: 'Ahmad Staff ICT',
        peranan: 'staff-ict', 
        jabatan: 'ICT',
        no_telefon: '0123456790',
        password_hash: 'staff123',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        email: 'user@iborrow.com',
        nama: 'Siti User',
        peranan: 'user',
        jabatan: 'Akademik',
        no_telefon: '0123456791',
        password_hash: 'user123',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const user = mockUsers.find(u => u.email === email && u.password_hash === password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // SIMULATE UPDATE LAST LOGIN - tanpa modify user object
    const currentTime = new Date().toLocaleString('ms-MY');
    console.log('🕐 [SIMULATION] Updating last_login for user:', user.email);
    console.log('📅 Last login time:', currentTime);
    
    // Return last login time tanpa modify user object
    const { password_hash, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo: getRedirectPath(user.peranan),
      lastLogin: currentTime // Return as separate field
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin': return '/admin/dashboard';
    case 'staff-ict': return '/staff-ict/dashboard';
    case 'user': return '/user/dashboard';
    default: return '/user/dashboard';
  }
}