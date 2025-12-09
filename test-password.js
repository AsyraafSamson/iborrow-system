// Verify izat password hash
const bcrypt = require('bcryptjs');

async function verifyHash() {
  const password = 'password123';
  const newHash = '$2b$10$8o53PSfFmhaVd74GjhFfnulgDK7x3wuCZJRRRjXll6AMU3ZsD3yee';

  console.log('Testing password hash for izat@ilkkm.edu.my\n');
  console.log('Password:', password);
  console.log('Hash:', newHash);

  const isValid = await bcrypt.compare(password, newHash);
  console.log('\nVerification:', isValid ? '✅ PASS - Login should work!' : '❌ FAIL - Still broken');

  if (isValid) {
    console.log('\n✅ Password hash is correct!');
    console.log('User izat@ilkkm.edu.my can now login with password123');
  }
}

verifyHash().catch(console.error);
