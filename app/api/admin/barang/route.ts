// app/api/admin/barang/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Development storage - akan reset bila server restart
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
  },
  {
    id: 'B002',
    nama: 'Projector Epson EB-X41',
    kategori: 'elektronik', 
    status: 'tersedia',
    kuantiti: 3,
    hargaSewa: 20.00,
    lokasi: 'Bilik Media',
    noSiri: 'PROJ-001',
    tarikhTambah: '2025-02-10'
  }
];

// Helper function untuk D1 connection
async function getD1Connection() {
  // Dalam production, D1 akan available melalui process.env.DB
  if (process.env.NODE_ENV === 'production' && process.env.DB) {
    return {
      db: process.env.DB,
      isProduction: true
    };
  }
  return {
    db: null,
    isProduction: false
  };
}

// GET /api/admin/barang - Get all barang
export async function GET(request: NextRequest) {
  try {
    console.log('📦 Fetching barang data...');
    
    const { db, isProduction } = await getD1Connection();
    
    if (isProduction && db) {
      console.log('🚀 Using REAL D1 database...');
      try {
        // @ts-ignore - D1 available in production
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

        console.log(`✅ Found ${barang.length} barang in D1`);
        return NextResponse.json({ success: true, data: barang });
      } catch (d1Error) {
        console.error('D1 Error, falling back to dev storage:', d1Error);
        // Fallback to dev storage if D1 fails
        return NextResponse.json({ success: true, data: devBarang });
      }
    } else {
      // Development: use in-memory storage
      console.log('🛠️ Using development storage...');
      return NextResponse.json({ success: true, data: devBarang });
    }
  } catch (error) {
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
    const newBarang = {
      id: newId,
      nama: body.nama,
      kategori: body.kategori,
      status: 'tersedia',
      kuantiti: body.kuantiti,
      hargaSewa: body.hargaSewa,
      lokasi: body.lokasi,
      noSiri: body.noSiri,
      tarikhTambah: new Date().toISOString().split('T')[0]
    };

    const { db, isProduction } = await getD1Connection();
    
    if (isProduction && db) {
      console.log('🚀 Saving to REAL D1 database...');
      try {
        // @ts-ignore - D1 available in production
        await db.prepare(
          `INSERT INTO barang (id, nama, kategori, status, kuantiti, harga_sewa, lokasi, no_siri, tarikh_tambah) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          newId,
          body.nama,
          body.kategori,
          'tersedia',
          body.kuantiti,
          body.hargaSewa,
          body.lokasi,
          body.noSiri,
          new Date().toISOString().split('T')[0]
        ).run();
      } catch (d1Error) {
        console.error('D1 Insert failed:', d1Error);
        // Continue with dev storage fallback
      }
    }
    
    // Always update dev storage (for development and as fallback)
    console.log('💾 Saving to development storage...');
    devBarang.push(newBarang);

    console.log('✅ Barang created:', newBarang);
    return NextResponse.json({
      success: true,
      data: newBarang,
      message: 'Barang berjaya ditambah!'
    });
  } catch (error) {
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
    const { id, updates } = await request.json();
    console.log('📦 Updating barang:', id, updates);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID barang diperlukan' },
        { status: 400 }
      );
    }

    const { db, isProduction } = await getD1Connection();
    
    if (isProduction && db) {
      console.log('🚀 Updating in REAL D1 database...');
      try {
        // Build dynamic update query
        const setClause = Object.keys(updates).map(key => {
          // Map frontend field names to database column names
          const dbField = key === 'hargaSewa' ? 'harga_sewa' : 
                         key === 'noSiri' ? 'no_siri' : 
                         key === 'tarikhTambah' ? 'tarikh_tambah' : key;
          return `${dbField} = ?`;
        }).join(', ');
        
        const values = Object.values(updates);
        
        // @ts-ignore - D1 available in production
        await db.prepare(
          `UPDATE barang SET ${setClause} WHERE id = ?`
        ).bind(...values, id).run();
      } catch (d1Error) {
        console.error('D1 Update failed:', d1Error);
      }
    }
    
    // Always update dev storage
    console.log('💾 Updating in development storage...');
    const index = devBarang.findIndex(item => item.id === id);
    if (index !== -1) {
      devBarang[index] = { ...devBarang[index], ...updates };
    }

    console.log('✅ Barang updated:', id);
    return NextResponse.json({
      success: true,
      message: 'Barang berjaya dikemaskini!'
    });
  } catch (error) {
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

    const { db, isProduction } = await getD1Connection();
    
    if (isProduction && db) {
      console.log('🚀 Deleting from REAL D1 database...');
      try {
        // @ts-ignore - D1 available in production
        await db.prepare(
          'DELETE FROM barang WHERE id = ?'
        ).bind(id).run();
      } catch (d1Error) {
        console.error('D1 Delete failed:', d1Error);
      }
    }
    
    // Always update dev storage
    console.log('💾 Deleting from development storage...');
    devBarang = devBarang.filter(item => item.id !== id);

    console.log('✅ Barang deleted:', id);
    return NextResponse.json({
      success: true,
      message: 'Barang berjaya dipadam!'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete barang' },
      { status: 500 }
    );
  }
}