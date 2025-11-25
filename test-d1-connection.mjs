// test-d1-connection.mjs
// Test D1 database connection directly with Wrangler

console.log('🔥 Testing D1 Connection - PECAH TELUR MODE!\n');

const { spawn } = await import('child_process');

// Test query ke D1
const testQuery = 'SELECT id, email, nama, peranan FROM users LIMIT 3';

console.log('📊 Running query:', testQuery);
console.log('Database: iborrow (remote)\n');

const wrangler = spawn('wrangler', [
  'd1', 'execute', 'iborrow',
  '--remote',
  '--command=' + testQuery
], {
  stdio: 'inherit',
  shell: true
});

wrangler.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ D1 connection working!');
    console.log('\n💡 NEXT STEP: Kita buat API proxy untuk connect Next.js dengan D1!');
  } else {
    console.log('\n❌ D1 connection failed!');
  }
  process.exit(code);
});
