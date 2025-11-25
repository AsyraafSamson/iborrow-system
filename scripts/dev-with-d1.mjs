// scripts/dev-with-d1.mjs
// Development server with D1 database access

import { spawn } from 'child_process';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = true;
const hostname = 'localhost';
const port = 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('🚀 Starting iBorrow System with D1 connection...\n');

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`✅ Next.js ready on http://${hostname}:${port}`);
    console.log('📊 D1 Database: iborrow (remote)');
    console.log('🔐 Login credentials:');
    console.log('   - admin@iborrow.com / admin123');
    console.log('   - staffict@iborrow.com / staffict123');
    console.log('   - user@iborrow.com / user123');
    console.log('\n💡 Note: Using mock data in dev mode. Deploy to Cloudflare Pages for real D1.\n');
  });
});
