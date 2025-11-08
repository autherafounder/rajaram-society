// Helper script to generate admin password hash
// Run: node scripts/generate-admin-password.js [password]

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin123';

bcrypt.hash(password, 10).then((hash) => {
  console.log('\nPassword:', password);
  console.log('Hash:', hash);
  console.log('\nUpdate data/admin.json with this hash\n');
});

