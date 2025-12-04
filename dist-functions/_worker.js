// _worker.js
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname.startsWith("/api/")) {
      try {
        const db = env.DB;
        const result = await db.prepare("SELECT COUNT(*) as count FROM users").first();
        return new Response(JSON.stringify({
          success: true,
          message: "API working with D1",
          path: url.pathname,
          userCount: result.count
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message,
          path: url.pathname
        }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  worker_default as default
};
