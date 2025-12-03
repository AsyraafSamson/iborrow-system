// Cloudflare Pages Function for API routes with D1 database
export async function onRequest(context) {
  const { env, request } = context;
  const db = env.DB; // D1 database binding
  
  const url = new URL(request.url);
  const path = url.pathname;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Import all API logic from worker.js
  // For now, return basic response to test D1 connection
  if (path.startsWith('/api/')) {
    try {
      // Test D1 connection
      const result = await db.prepare('SELECT COUNT(*) as count FROM users').first();
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'D1 connected successfully',
        userCount: result.count 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // Let Next.js handle other routes
  return new Response('Not found', { status: 404 });
}