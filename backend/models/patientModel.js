const db = require('../config/db');
const Patient = {

  // Get all patients
 getAllPatients: async () => {
  const [rows] = await db.query(`
    SELECT 
      p.patient_id,
      p.age,
      p.gender,
      p.phone,
      p.address,
      u.user_id,
      u.name,
      u.email
    FROM Patient p
    JOIN User u ON p.user_id = u.user_id
  `);

  return rows;
},

  // Get patient by ID
 getById: async (id) => {
  const [rows] = await db.query(`
    SELECT 
      p.*,
      u.name,
      u.email
    FROM Patient p
    JOIN User u ON p.user_id = u.user_id
    WHERE p.patient_id = ?
  `, [id]);

  return rows[0];
},

  // Create patient
  // createPatient: async (data) => {
  //   try {
  //     const sql = `
  //       INSERT INTO Patient (name, age, gender, phone, email, address)
  //       VALUES (?, ?, ?, ?, ?, ?)`;

  //     const [result] = await db.query(sql, [
  //       data.name,
  //       data.age,
  //       data.gender,
  //       data.phone,
  //       data.email,
  //       data.address
  //     ]);
  //      return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // },

  // Update patient
update: async (id, data) => {
  try {
    const sql = `
      UPDATE Patient
      SET age=?, gender=?, phone=?, address=?
      WHERE patient_id=?
    `;

    const [result] = await db.query(sql, [
      data.age || null,
      data.gender || null,
      data.phone || null,
      data.address || null,
      id
    ]);

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