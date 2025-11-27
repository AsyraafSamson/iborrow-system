// Cloudflare Worker entry point for Next.js
export default {
  async fetch(request, env, ctx) {
    // Make D1 database available globally
    globalThis.process = globalThis.process || {};
    globalThis.process.env = globalThis.process.env || {};
    globalThis.process.env.DB = env.DB;

    try {
      // Import Next.js server handler
      const { default: handler } = await import('./.next/server/app/api/auth/login/route.js');
      
      // Handle request
      return await handler(request);
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Worker error', 
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}
