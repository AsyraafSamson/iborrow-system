// d1-proxy-server.mjs
// D1 Proxy Server - PECAH TELUR MODE! 🔥
// Run wrangler worker that exposes D1 via HTTP API

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🔥🔥🔥 D1 PROXY SERVER - PECAH TELUR MODE! 🔥🔥🔥\n');

// Create temporary worker untuk expose D1
const workerCode = `
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
`;

// Create wrangler.toml for proxy
const proxyWranglerConfig = `
name = "d1-proxy"
main = "d1-proxy-worker.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "iborrow"
database_id = "51ddaea3-c7f4-4c5c-ad87-0a4e592e0154"

[dev]
# Use remote D1 database for development
remote = true
`;

// Write files
try {
  mkdirSync('.d1-proxy', { recursive: true });
} catch {}

writeFileSync('.d1-proxy/d1-proxy-worker.js', workerCode);
writeFileSync('.d1-proxy/wrangler.toml', proxyWranglerConfig);

console.log('✅ Created D1 proxy worker files');
console.log('🚀 Starting D1 proxy server on http://localhost:8787\n');
console.log('📋 API Usage:');
console.log('   POST http://localhost:8787');
console.log('   Body: { "query": "SELECT * FROM users", "params": [] }\n');

// Start wrangler dev
const proxy = spawn('wrangler', ['dev'], {
  cwd: '.d1-proxy',
  stdio: 'inherit',
  shell: true
});

proxy.on('close', (code) => {
  console.log(`\n❌ Proxy server exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping D1 proxy server...');
  proxy.kill();
  process.exit(0);
});
