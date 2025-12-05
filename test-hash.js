const bcrypt = require('bcryptjs');

const productionHash = '$2b$10$07TjoI0KgDzLZm.ZSuZphuebf8sJevzjmTqPyAEFAharZHGhkGIg.';
const password = 'admin123';

console.log('Testing bcrypt verification:');
console.log('Password:', password);
console.log('Hash:', productionHash);
console.log('');

bcrypt.compare(password, productionHash)
  .then(result => {
    console.log('Result:', result);
    if (result) {
      console.log('✅ PASSWORD MATCHES!');
    } else {
      console.log('❌ PASSWORD DOES NOT MATCH');

      // Try generating a new hash and see if it matches
      return bcrypt.hash(password, 10).then(newHash => {
        console.log('\nNew hash generated for same password:', newHash);
        return bcrypt.compare(password, newHash);
      }).then(newResult => {
        console.log('New hash verification:', newResult ? '✅ WORKS' : '❌ FAILED');
      });
    }
  })
  .catch(err => console.error('Error:', err));
