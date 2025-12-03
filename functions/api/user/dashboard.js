// User Dashboard API - Cloudflare Pages Function
export async function onRequestGET(context) {
  const { env, request } = context;
  const db = env.DB; // D1 database binding
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Test D1 connection and get user dashboard data
    const users = await db.prepare('SELECT * FROM users LIMIT 5').all();
    const barang = await db.prepare('SELECT * FROM barang LIMIT 5').all();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User Dashboard API - Connected to D1',
      data: {
        users: users.results || [],
        barang: barang.results || [],
        timestamp: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      api: 'User Dashboard'
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