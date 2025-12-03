// User Barang API - Cloudflare Pages Function
export async function onRequestGET(context) {
  const { env, request } = context;
  const db = env.DB;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Get all available barang for users
    const barang = await db.prepare(`
      SELECT b.*, k.nama_kategori 
      FROM barang b 
      LEFT JOIN kategori k ON b.kategori_id = k.id 
      WHERE b.status_ketersediaan = 'tersedia'
      ORDER BY b.nama_barang
    `).all();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Senarai Barang Tersedia',
      data: barang.results || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'User Barang'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOPTIONS() {
  return new Response(null, { 
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}