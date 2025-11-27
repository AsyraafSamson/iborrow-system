// app/api/auth/login/route.ts - PROPERLY TYPED FOR CLOUDFLARE D1
import { NextRequest, NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

// Cloudflare D1 Database Types
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta?: {
    duration: number;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Database User Type
interface DbUser {
  id: string;
  email: string;
  nama: string;
  peranan: 'admin' | 'staff-ict' | 'user';
  jabatan: string;
  no_telefon: string;
  password_hash: string;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock untuk development
const mockUsers = [
  {
    id: 'user_001',
    email: 'admin@iborrow.com',
    nama: 'Administrator System',
    peranan: 'admin',
    jabatan: 'ICT',
    no_telefon: '0123456789',
    password_hash: 'admin123',
    status: 'active'
  },
  {
    id: 'user_002',
    email: 'staffict@iborrow.com',
    nama: 'Staff ICT',
    peranan: 'staff-ict',
    jabatan: 'ICT',
    no_telefon: '0123456788',
    password_hash: 'staffict123',
    status: 'active'
  },
  {
    id: 'user_003',
    email: 'user@iborrow.com',
    nama: 'User Biasa',
    peranan: 'user',
    jabatan: 'Pentadbiran',
    no_telefon: '0123456787',
    password_hash: 'user123',
    status: 'active'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email dan password diperlukan' },
        { status: 400 }
      );
    }

    console.log('🔐 Login attempt for:', email);

    let user = null;
    let usingRealDatabase = false;

    // 🚀 CLOUDFLARE D1 DATABASE ACCESS
    try {
      // Try Cloudflare runtime first
      const db = (process.env as Record<string, unknown>).DB as D1Database;
      
      if (db && typeof db.prepare === 'function') {
        usingRealDatabase = true;
        console.log('✅ D1 database detected (Cloudflare runtime)');

        const result = await db.prepare(
          'SELECT * FROM users WHERE email = ?'
        ).bind(email).all<DbUser>();

        user = result.results[0];
        
        if (user && user.password_hash === password) {
          console.log('✅ Password matched - login successful');
          await db.prepare(
            "UPDATE users SET last_login = datetime('now') WHERE id = ?"
          ).bind(user.id).run();
        } else {
          user = null;
        }
      } else {
        // 🔥 PECAH TELUR MODE - Try D1 Proxy Server!
        console.log('🔥 Trying D1 proxy server at http://localhost:8787...');
        
        try {
          const proxyResponse = await fetch('http://localhost:8787', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'SELECT * FROM users WHERE email = ?',
              params: [email]
            })
          });

          if (proxyResponse.ok) {
            const proxyData = await proxyResponse.json();
            if (proxyData.success && proxyData.data.length > 0) {
              usingRealDatabase = true;
              console.log('✅ D1 database connected via proxy!');
              
              user = proxyData.data[0] as DbUser;
              
              if (user.password_hash === password) {
                console.log('✅ Password matched - login successful');
                
                // Update last login via proxy
                await fetch('http://localhost:8787', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    query: "UPDATE users SET last_login = datetime('now') WHERE id = ?",
                    params: [user.id]
                  })
                });
              } else {
                user = null;
              }
            }
          } else {
            console.log('🛠️ D1 proxy not available, using mock data');
          }
        } catch (proxyError) {
          console.log('🛠️ D1 proxy connection failed, using mock data');
        }
      }
    } catch (dbError) {
      console.error('❌ D1 database error:', dbError);
      usingRealDatabase = false;
    }

    // Fallback to mock data jika D1 tak available
    if (!user) {
      console.log('🛠️ Using mock data for development');
      user = mockUsers.find(u => u.email === email && u.password_hash === password);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const currentTime = new Date().toLocaleString('ms-MY');
    console.log('🕐 Login successful for:', user.email);

    // Remove password_hash from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      redirectTo: getRedirectPath(user.peranan),
      lastLogin: currentTime,
      usingRealDatabase: usingRealDatabase,
      message: usingRealDatabase ? 'Login berjaya (D1 Database)' : 'Login berjaya (Mock Data)'
    });

  } catch (error) {
    console.error('❌ Login endpoint error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { success: false, error: 'Ralat server dalaman' },
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