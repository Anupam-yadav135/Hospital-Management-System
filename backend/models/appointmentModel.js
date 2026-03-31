const db = require('../config/db');
const Appointment = {
  getAll: async () => {
    try {
      const sql = `
        SELECT 
          a.*,
          p.name AS patient_name,
          d.name AS doctor_name
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.patient_id
        JOIN Doctor d ON a.doctor_id = d.doctor_id
      `;

      const [rows] = await db.query(sql);
      return rows;

    } catch (err) {
      throw err;
    }
  },

  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Appointment WHERE appointment_id = ?',
        [id]
      );
      return rows[0];

    } catch (err) {
      throw err;
    }
  },

  create: async (data) => {
    try {
      // Doctor check
      const [doctor] = await db.query(
        'SELECT * FROM Doctor WHERE doctor_id = ?',
        [data.doctor_id]
      );

      if (doctor.length === 0) {
        throw new Error('Doctor not found');
      }

      // Patient check
      const [patient] = await db.query(
        'SELECT * FROM Patient WHERE patient_id = ?',
        [data.patient_id]
      );

      if (patient.length === 0) {
        throw new Error('Patient not found');
      }

      // Double booking check
      const [existing] = await db.query(
        `SELECT * FROM Appointment 
         WHERE doctor_id = ? 
         AND appointment_date = ? 
         AND appointment_time = ?`,
        [data.doctor_id, data.appointment_date, data.appointment_time]
      );

      if (existing.length > 0) {
        throw new Error('Doctor already booked at this time');
      }

      // Insert
      const sql = `
        INSERT INTO Appointment 
        (patient_id, doctor_id, appointment_date, appointment_time, status)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(sql, [
        data.patient_id,
        data.doctor_id,
        data.appointment_date,
        data.appointment_time,
        data.status || 'Scheduled'
      ]);

      return result;

    } catch (err) {
      throw err;
    }
  },

  update: async (id, data) => {
    try {
      const sql = `
        UPDATE Appointment
        SET patient_id=?, doctor_id=?, appointment_date=?, appointment_time=?, status=?
        WHERE appointment_id=?
      `;

      const [result] = await db.query(sql, [
        data.patient_id,
        data.doctor_id,
        data.appointment_date,
        data.appointment_time,
        data.status,
        id
      ]);

      return result;

    } catch (err) {
      throw err;
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Appointment WHERE appointment_id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Appointment not found');
      }

      return result;

    } catch (err) {
      throw err;
    }
  }

};

module.exports = Appointment;