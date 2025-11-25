
export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { query, params } = await request.json();
      
      console.log('📊 Query:', query);
      console.log('📝 Params:', params);

      const stmt = env.DB.prepare(query);
      const result = params ? await stmt.bind(...params).all() : await stmt.all();

      return new Response(JSON.stringify({
        success: true,
        data: result.results,
        meta: result.meta
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
};
