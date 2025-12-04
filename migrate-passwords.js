// Migration script to hash existing passwords in D1 database
// Run this ONCE to migrate plain text passwords to bcrypt hashes

const bcrypt = require('bcryptjs');

// Existing users and their passwords
const users = [
  { id: 'user_001', email: 'admin@ilkkm.edu.my', password: 'admin123' },
  { id: 'user_002', email: 'staffict@ilkkm.edu.my', password: 'staffict123' },
  { id: 'user_003', email: 'ahmad@ilkkm.edu.my', password: 'user123' },
  { id: 'user_004', email: 'siti@ilkkm.edu.my', password: 'pengajar123' },
  { id: 'user_005', email: 'ali@ilkkm.edu.my', password: 'staff123' },
];

async function generateMigrationSQL() {
  console.log('🔐 Generating password hashes...\n');

  const sqlCommands = [];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    const sql = `UPDATE users SET password_hash = '${hash}' WHERE id = '${user.id}';`;
    sqlCommands.push(sql);

    console.log(`✅ ${user.email} (${user.password}) -> ${hash.substring(0, 20)}...`);
  }

  console.log('\n📝 SQL Migration Commands:\n');
  console.log('-- Copy and paste these commands to migrate passwords\n');
  console.log(sqlCommands.join('\n'));

  console.log('\n\n🚀 To apply migration, run:');
  console.log('wrangler d1 execute iborrow --remote --command="<paste SQL above>"\n');
  console.log('OR use the generated file: migration-passwords.sql');

  // Write to file
  const fs = require('fs');
  const migrationFile = '-- Password Migration SQL\n-- Generated: ' + new Date().toISOString() + '\n\n';
  fs.writeFileSync('migration-passwords.sql', migrationFile + sqlCommands.join('\n') + '\n');

  console.log('\n✅ Migration SQL saved to: migration-passwords.sql');
}

generateMigrationSQL().catch(console.error);
