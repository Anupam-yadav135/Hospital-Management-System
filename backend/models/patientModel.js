const db = require('../config/db');
const Patient = {

  // Get all patients
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM Patient');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Get patient by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Patient WHERE patient_id = ?',
        [id]
      );

      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  // Create patient
  create: async (data) => {
    try {
      const sql = `
        INSERT INTO Patient (name, age, gender, phone, email, address)
        VALUES (?, ?, ?, ?, ?, ?)`;

      const [result] = await db.query(sql, [
        data.name,
        data.age,
        data.gender,
        data.phone,
        data.email,
        data.address
      ]);
       return result;
    } catch (err) {
      throw err;
    }
  },

  // Update patient
  update: async (id, data) => {
    try {
      const sql = `
        UPDATE Patient
        SET name=?, age=?, gender=?, phone=?, email=?, address=?
        WHERE patient_id=?
      `;

      const [result] = await db.query(sql, [
        data.name,
        data.age,
        data.gender,
        data.phone,
        data.email,
        data.address,
        id
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Patient not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Delete patient
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Patient WHERE patient_id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Patient not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  }

};

module.exports = Patient;