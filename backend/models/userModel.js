const db = require('../config/db');

const User = {

  // Create new user (Signup)
  create: async (data) => {
    try {
      const sql = `
        INSERT INTO User (email, password, role)
        VALUES (?, ?, ?)
      `;

      const [result] = await db.query(sql, [
        data.email,
        data.password,
        data.role
      ]);

      return result;

    } catch (err) {
      throw err;
    }
  },

  // Get user by email (Login)
  getByEmail: async (email) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );

      return rows[0];

    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM User WHERE user_id = ?',
        [id]
      );

      return rows[0];

    } catch (err) {
      throw err;  
    }
  }

};

module.exports = User;