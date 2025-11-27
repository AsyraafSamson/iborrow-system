// app/api/admin/barang/route.ts - UPDATED FOR REAL D1
import { NextRequest, NextResponse } from 'next/server';

// ✅ Edge Runtime for Cloudflare Workers/Pages
export const runtime = 'edge';

// Development storage fallback
let devBarang: any[] = [
  {
    id: 'B001',
    namaBarang: 'Laptop Dell XPS 13',
    kategori: 'Komputer',
    kodBarang: 'LAP-DEV-001',
    status: 'tersedia',
    kuantitiTersedia: 5,
    kuantitiTotal: 10,
    hargaPerolehan: 3500.00,
    lokasi: 'Bilik Server A',
    tarikhPerolehan: '2025-01-15',
    createdBy: 'user_001'
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

        // ✅ CORRECT FIELD MAPPING - Match dengan schema.sql
        const barang = result.results.map((item: any) => ({
          id: item.id,
          namaBarang: item.nama_barang,              // ✅ nama_barang dari DB
          kategori: item.kategori,
          kodBarang: item.kod_barang,                // ✅ kod_barang dari DB
          status: item.status,
          kuantitiTersedia: item.kuantiti_tersedia,  // ✅ kuantiti_tersedia dari DB
          kuantitiTotal: item.kuantiti_total,        // ✅ kuantiti_total dari DB
          hargaPerolehan: item.harga_perolehan,      // ✅ harga_perolehan dari DB
          lokasi: item.lokasi,
          tarikhPerolehan: item.tarikh_perolehan,    // ✅ tarikh_perolehan dari DB
          catatan: item.catatan,
          gambarUrl: item.gambar_url,
          createdBy: item.created_by,
          createdAt: item.created_at,
          updatedAt: item.updated_at
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

    // ✅ VALIDATE REQUIRED FIELDS - Match dengan schema.sql
    if (!body.namaBarang || !body.kodBarang) {
      return NextResponse.json(
        { success: false, error: 'Nama Barang dan Kod Barang diperlukan' },
        { status: 400 }
      );
    }

    const newId = `brg_${Date.now()}`;
    const currentDate = new Date().toISOString().split('T')[0];

    // ✅ CORRECT FIELD NAMES - Match dengan schema.sql
    const newBarang = {
      id: newId,
      namaBarang: body.namaBarang,
      kategori: body.kategori || 'Lain-lain',
      kodBarang: body.kodBarang,                           // ✅ REQUIRED
      status: 'tersedia',
      kuantitiTersedia: body.kuantitiTersedia || 0,        // ✅ kuantiti_tersedia
      kuantitiTotal: body.kuantitiTotal || body.kuantitiTersedia || 0, // ✅ REQUIRED
      hargaPerolehan: body.hargaPerolehan || 0,            // ✅ harga_perolehan
      lokasi: body.lokasi || '',
      tarikhPerolehan: body.tarikhPerolehan || currentDate, // ✅ tarikh_perolehan
      catatan: body.catatan || '',
      gambarUrl: body.gambarUrl || '',
      createdBy: body.createdBy || 'user_001',             // ✅ REQUIRED - default admin
      createdAt: currentDate
    };

    // 🚀 REAL D1 CONNECTION
    // @ts-ignore
    const db = process.env.DB;

    if (db) {
      console.log('🚀 Saving to REAL D1 database...');
      try {
        // ✅ CORRECT FIELD NAMES IN SQL - Match dengan schema.sql
        // @ts-ignore
        await db.prepare(
          `INSERT INTO barang (
            id, nama_barang, kategori, kod_barang,
            kuantiti_tersedia, kuantiti_total, lokasi, status,
            harga_perolehan, tarikh_perolehan, catatan, gambar_url,
            created_by, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(
          newBarang.id,
          newBarang.namaBarang,
          newBarang.kategori,
          newBarang.kodBarang,
          newBarang.kuantitiTersedia,
          newBarang.kuantitiTotal,
          newBarang.lokasi,
          newBarang.status,
          newBarang.hargaPerolehan,
          newBarang.tarikhPerolehan,
          newBarang.catatan,
          newBarang.gambarUrl,
          newBarang.createdBy
        ).run();
        console.log('✅ Saved to REAL D1 successfully');
      } catch (d1Error: any) {
        console.error('❌ D1 Insert failed:', d1Error.message);
        return NextResponse.json(
          { success: false, error: `D1 Error: ${d1Error.message}` },
          { status: 500 }
        );
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
        // ✅ Map frontend fields to database fields - Match dengan schema.sql
        const dbUpdates: any = {};
        Object.keys(updates).forEach(key => {
          if (key === 'namaBarang') dbUpdates.nama_barang = updates[key];
          else if (key === 'kodBarang') dbUpdates.kod_barang = updates[key];
          else if (key === 'kuantitiTersedia') dbUpdates.kuantiti_tersedia = updates[key];
          else if (key === 'kuantitiTotal') dbUpdates.kuantiti_total = updates[key];
          else if (key === 'hargaPerolehan') dbUpdates.harga_perolehan = updates[key];
          else if (key === 'tarikhPerolehan') dbUpdates.tarikh_perolehan = updates[key];
          else if (key === 'gambarUrl') dbUpdates.gambar_url = updates[key];
          else if (key === 'createdBy') dbUpdates.created_by = updates[key];
          else dbUpdates[key] = updates[key]; // kategori, status, lokasi, catatan - same name
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
        return NextResponse.json(
          { success: false, error: `D1 Error: ${d1Error.message}` },
          { status: 500 }
        );
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