const db = require('../config/db');

const Doctor = {

    // getting all the doctor
  getAllDoctors: async () => {
    try {
      const [rows] = await db.query(`
        SELECT d.*, u.email 
        FROM Doctor d 
        LEFT JOIN User u ON d.user_id = u.user_id
        ORDER BY d.doctor_id DESC
      `);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // get doctor by id 
  getDoctorById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Doctor WHERE doctor_id = ?',
        [id]
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  // create doctor 
  create: async (data) => {
    try {
      const sql = `
        INSERT INTO Doctor (user_id, name, specialization, phone)
        VALUES (?, ?, ?, ?)
      `;

      const [result] = await db.query(sql, [
        data.user_id,
        data.name,
        data.specialization,
        data.phone || null
      ]);

      return result;

    } catch (err) {
      throw err;
    }
  },

  // update doctor data 
  update: async (id, data) => {
    try {
      const sql = `
        UPDATE Doctor
        SET name=?, specialization=?, phone=?
        WHERE doctor_id=?
      `;

      const [result] = await db.query(sql, [
        data.name,
        data.specialization,
        data.phone,
        id
      ]);

      if(result.affectedRows === 0){
        throw new Error('Doctor not found');
      }

      return result;

    }catch (err){
      throw err;
    }
  },

  // delete doctor
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Doctor WHERE doctor_id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Doctor not found');
      }

      return result;

    } catch (err) {
      throw err;
    }
  }

};

module.exports = Doctor;