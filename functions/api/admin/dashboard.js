// Admin Dashboard API - Cloudflare Pages Function
export async function onRequestGET(context) {
  const { env, request } = context;
  const db = env.DB;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Get dashboard statistics for admin
    const stats = await Promise.all([
      db.prepare('SELECT COUNT(*) as count FROM users').first(),
      db.prepare('SELECT COUNT(*) as count FROM barang').first(),
      db.prepare('SELECT COUNT(*) as count FROM tempahan WHERE status = "pending"').first(),
      db.prepare('SELECT COUNT(*) as count FROM tempahan WHERE status = "diluluskan"').first()
    ]);
    
    const [totalUsers, totalBarang, pendingBookings, approvedBookings] = stats;
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Admin Dashboard Statistics',
      data: {
        totalUsers: totalUsers?.count || 0,
        totalBarang: totalBarang?.count || 0,
        pendingBookings: pendingBookings?.count || 0,
        approvedBookings: approvedBookings?.count || 0,
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'Admin Dashboard'
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