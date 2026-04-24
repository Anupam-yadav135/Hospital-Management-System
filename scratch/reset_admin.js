const bcrypt = require('bcrypt');
const db = require('./backend/config/db');

async function resetAdmin() {
  try {
    const email = 'admin@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Delete existing admin if any
    await db.query('DELETE FROM User WHERE email = ?', [email]);
    
    // Create new admin
    const [res] = await db.query(
      'INSERT INTO User (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'admin']
    );

    console.log(' Admin account reset successful!');
    console.log('User ID:', res.insertId);
    console.log('Email:', email);
    console.log('Password:', password);
    
    process.exit(0);
  } catch (err) {
    console.error(' Error resetting admin:', err);
    process.exit(1);
  }
}

resetAdmin();
