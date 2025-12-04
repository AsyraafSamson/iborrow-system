// Test script to verify password hashing works correctly
const bcrypt = require('bcryptjs');

// Test passwords and their hashes from the database
const testCases = [
  {
    email: 'admin@ilkkm.edu.my',
    password: 'admin123',
    hash: '$2b$10$07TjoI0KgDzLZm.ZSuZphuebf8sJevzjmTqPyAEFAharZHGhkGIg.'
  },
  {
    email: 'staffict@ilkkm.edu.my',
    password: 'staffict123',
    hash: '$2b$10$nkaoq.66KpBWptHcl96Mbe4FMEeZ3OWNid6Zp.Sq3KKqh2ZKKF4z2'
  },
  {
    email: 'ahmad@ilkkm.edu.my',
    password: 'user123',
    hash: '$2b$10$aJ4pSNY9i.A3WZ8nY3qCPuEdzAiagSMivQUPqPO3w7kID0AwUlaaq'
  }
];

async function testPasswords() {
  console.log('🔐 Testing Password Verification\n');

  for (const test of testCases) {
    const isValid = await bcrypt.compare(test.password, test.hash);
    const status = isValid ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.email}`);
    console.log(`   Password: ${test.password}`);
    console.log(`   Hash: ${test.hash.substring(0, 30)}...`);
    console.log(`   Verified: ${isValid}\n`);
  }

  // Test wrong password
  console.log('🔒 Testing Wrong Password (should fail):');
  const wrongTest = await bcrypt.compare('wrongpassword', testCases[0].hash);
  console.log(`   ${wrongTest ? '❌ FAIL - accepted wrong password!' : '✅ PASS - rejected wrong password'}\n`);

  console.log('✅ All tests completed!');
}

testPasswords().catch(console.error);
