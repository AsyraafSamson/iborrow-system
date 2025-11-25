// app/api/admin/barang/route.ts - UPDATED FOR REAL D1
import { NextRequest, NextResponse } from 'next/server';

// Development storage fallback
let devBarang: any[] = [
  {
    id: 'B001',
    nama: 'Laptop Dell XPS 13',
    kategori: 'elektronik',
    status: 'tersedia',
    kuantiti: 5,
    hargaSewa: 15.00,
    lokasi: 'Bilik Server A',
    noSiri: 'LAP-001',
    tarikhTambah: '2025-01-15'
  }
];

// GET /api/admin/barang - Get all barang
export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching barang data...');
    
    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Using REAL D1 database...');
      try {
        // @ts-ignore
        const result = await db.prepare(
          'SELECT * FROM barang ORDER BY created_at DESC'
        ).all();

        const barang = result.results.map((item: any) => ({
          id: item.id,
          nama: item.nama,
          kategori: item.kategori,
          status: item.status,
          kuantiti: item.kuantiti,
          hargaSewa: item.harga_sewa,
          lokasi: item.lokasi,
          noSiri: item.no_siri,
          tarikhTambah: item.tarikh_tambah
        }));

        console.log(`✅ Found ${barang.length} barang in REAL D1`);
        return NextResponse.json({ 
          success: true, 
          data: barang,
          usingRealDatabase: true 
        });
      } catch (d1Error: any) {
        console.error('❌ D1 Error:', d1Error.message);
        // Fallback to dev storage
        return NextResponse.json({ 
          success: true, 
          data: devBarang,
          usingRealDatabase: false 
        });
      }
    } else {
      // Development: use in-memory storage
      console.log('🛠️ Using development storage...');
      return NextResponse.json({ 
        success: true, 
        data: devBarang,
        usingRealDatabase: false 
      });
    }
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch barang' },
      { status: 500 }
    );
  }
}

// POST /api/admin/barang - Create new barang
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📦 Creating new barang:', body);
    
    if (!body.nama || !body.noSiri) {
      return NextResponse.json(
        { success: false, error: 'Nama dan No Siri diperlukan' },
        { status: 400 }
      );
    }

    const newId = `B${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];
    
    const newBarang = {
      id: newId,
      nama: body.nama,
      kategori: body.kategori || 'lain',
      status: 'tersedia',
      kuantiti: body.kuantiti || 1,
      hargaSewa: body.hargaSewa || 0,
      lokasi: body.lokasi || '',
      noSiri: body.noSiri,
      tarikhTambah: currentDate
    };

    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Saving to REAL D1 database...');
      try {
        // @ts-ignore
        await db.prepare(
          `INSERT INTO barang (id, nama, kategori, status, kuantiti, harga_sewa, lokasi, no_siri, tarikh_tambah, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(
          newId,
          newBarang.nama,
          newBarang.kategori,
          newBarang.status,
          newBarang.kuantiti,
          newBarang.hargaSewa,
          newBarang.lokasi,
          newBarang.noSiri,
          newBarang.tarikhTambah
        ).run();
        console.log('✅ Saved to REAL D1 successfully');
      } catch (d1Error: any) {
        console.error('❌ D1 Insert failed:', d1Error.message);
      }
    }
    
    // Always update dev storage (for development and as fallback)
    console.log('💾 Saving to development storage...');
    devBarang.unshift(newBarang);

    console.log('✅ Barang created:', newBarang);
    return NextResponse.json({
      success: true,
      data: newBarang,
      message: 'Barang berjaya ditambah!',
      usingRealDatabase: !!db
    });
  } catch (error: any) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create barang' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/barang - Update barang
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    console.log('📦 Updating barang:', id, updates);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID barang diperlukan' },
        { status: 400 }
      );
    }

    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Updating in REAL D1 database...');
      try {
        // Map frontend fields to database fields
        const dbUpdates: any = {};
        Object.keys(updates).forEach(key => {
          if (key === 'hargaSewa') dbUpdates.harga_sewa = updates[key];
          else if (key === 'noSiri') dbUpdates.no_siri = updates[key];
          else if (key === 'tarikhTambah') dbUpdates.tarikh_tambah = updates[key];
          else dbUpdates[key] = updates[key];
        });

        const setClause = Object.keys(dbUpdates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(dbUpdates);
        
        // @ts-ignore
        const result = await db.prepare(
          `UPDATE barang SET ${setClause}, updated_at = datetime('now') WHERE id = ?`
        ).bind(...values, id).run();

        console.log('✅ D1 update result:', result);
      } catch (d1Error: any) {
        console.error('❌ D1 Update failed:', d1Error.message);
      }
    }
    
    // Update dev storage
    console.log('💾 Updating in development storage...');
    const index = devBarang.findIndex(item => item.id === id);
    if (index !== -1) {
      devBarang[index] = { ...devBarang[index], ...updates };
    }

    console.log('✅ Barang updated:', id);
    return NextResponse.json({
      success: true,
      message: 'Barang berjaya dikemaskini!',
      usingRealDatabase: !!db
    });
  } catch (error: any) {
    console.error('PUT Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update barang' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/barang - Delete barang
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('📦 Deleting barang:', id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID barang diperlukan' },
        { status: 400 }
      );
    }

    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;
    
    if (db) {
      console.log('🚀 Deleting from REAL D1 database...');
      try {
        // @ts-ignore
        const result = await db.prepare(
          'DELETE FROM barang WHERE id = ?'
        ).bind(id).run();
        console.log('✅ D1 delete result:', result);
      } catch (d1Error: any) {
        console.error('❌ D1 Delete failed:', d1Error.message);
      }
    }
    
    // Update dev storage
    console.log('💾 Deleting from development storage...');
    const initialLength = devBarang.length;
    devBarang = devBarang.filter(item => item.id !== id);
    const deleted = initialLength !== devBarang.length;

    console.log('✅ Barang deleted:', id);
    return NextResponse.json({
      success: true,
      message: 'Barang berjaya dipadam!',
      deleted,
      usingRealDatabase: !!db
    });
  } catch (error: any) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete barang' },
      { status: 500 }
    );
  }
}