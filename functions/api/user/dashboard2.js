
// User Dashboard API - Converted from route.ts to Pages Function  
export async function onRequestGET(context) {
  const { env } = context;
  const db = env.DB; // D1 database binding
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Mock data for testing (same as your route.ts)
    if (!db || typeof db.prepare !== 'function') {
      return new Response(JSON.stringify({
        success: true,
        data: {
          totalTempahan: 5,
          tempahanAktif: 2,
          barangTersedia: 128
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Real D1 query (same logic as your route.ts)
    const userId = 'user_003'; // TODO: Get from session/auth
    const stats = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM tempahan WHERE userId = ?) as totalTempahan,
        (SELECT COUNT(*) FROM tempahan WHERE userId = ? AND status = 'Aktif') as tempahanAktif,
        (SELECT COUNT(*) FROM barang WHERE status = 'Tersedia') as barangTersedia
    `).bind(userId, userId).first();
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: stats
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('User dashboard error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error'
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