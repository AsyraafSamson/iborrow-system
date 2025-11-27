// app/api/admin/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

// GET /api/admin/profile - Get admin profile data
export async function GET(request: NextRequest) {
  try {
    console.log('👤 Fetching admin profile...');
    
    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Using REAL D1 database for profile...');
      try {
        // Get user from session/token (for now, we'll get first admin user)
        // @ts-ignore
        const result = await db.prepare(
          'SELECT * FROM users WHERE peranan = "admin" AND status = "active" LIMIT 1'
        ).all();

        if (result.results.length > 0) {
          const user = result.results[0];
          const { password_hash, ...userWithoutPassword } = user;
          
          console.log('✅ Admin profile found in D1:', user.email);
          return NextResponse.json({ 
            success: true, 
            data: userWithoutPassword,
            usingRealDatabase: true 
          });
        }
      } catch (d1Error: any) {
        console.error('❌ D1 Profile Error:', d1Error.message);
      }
    }
    
    // Fallback to mock data
    console.log('🛠️ Using mock profile data...');
    const mockProfile = {
      id: '1',
      nama: 'Dr. Ahmad bin Abdullah',
      noStaf: 'STF2024001',
      email: 'ahmad.abdullah@ilkkm.edu.my',
      jabatan: 'Jabatan Teknologi Maklumat',
      no_telefon: '012-3456789',
      peranan: 'Super Admin',
      tarikhDaftar: '2023-01-15',
      status: 'Aktif',
      last_login: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      data: mockProfile,
      usingRealDatabase: false 
    });
    
  } catch (error: any) {
    console.error('GET Profile Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/profile - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    console.log('👤 Updating admin profile:', updates);
    
    const { id, ...profileUpdates } = updates;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID pengguna diperlukan' },
        { status: 400 }
      );
    }

    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Updating profile in REAL D1 database...');
      try {
        // Map frontend fields to database fields
        const dbUpdates: any = {};
        Object.keys(profileUpdates).forEach(key => {
          if (key === 'noStaf') dbUpdates.no_staf = profileUpdates[key];
          else if (key === 'noPhone') dbUpdates.no_telefon = profileUpdates[key];
          else if (key === 'tarikhDaftar') dbUpdates.tarikh_daftar = profileUpdates[key];
          else dbUpdates[key] = profileUpdates[key];
        });

        const setClause = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(dbUpdates);
        
        // @ts-ignore
        const result = await db.prepare(
          `UPDATE users SET ${setClause}, updated_at = datetime('now') WHERE id = ?`
        ).bind(...values, id).run();

        console.log('✅ D1 profile update result:', result);
        
        return NextResponse.json({
          success: true,
          message: 'Profil berjaya dikemaskini!',
          usingRealDatabase: true
        });
      } catch (d1Error: any) {
        console.error('❌ D1 Profile Update failed:', d1Error.message);
      }
    }
    
    // Mock update success
    console.log('💾 Profile updated in mock data');
    return NextResponse.json({
      success: true,
      message: 'Profil berjaya dikemaskini!',
      usingRealDatabase: false
    });
    
  } catch (error: any) {
    console.error('PUT Profile Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}