const db = require('../config/db');
const MedicalRecord={

  // Get all records (with JOIN for context)
  getAll: async () => {
    try {
      const sql = `
        SELECT 
          mr.*,
          p.name AS patient_name,
          d.name AS doctor_name,
          a.appointment_date
        FROM MedicalRecord mr
        JOIN Patient p ON mr.patient_id = p.patient_id
        JOIN Doctor d ON mr.doctor_id = d.doctor_id
        LEFT JOIN Appointment a ON mr.appointment_id = a.appointment_id`;

      const [rows] = await db.query(sql);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getByDoctor: async (doctorId) => {
    try {
      const sql = `
        SELECT 
          mr.*,
          p.name AS patient_name,
          d.name AS doctor_name,
          a.appointment_date
        FROM MedicalRecord mr
        JOIN Patient p ON mr.patient_id = p.patient_id
        JOIN Doctor d ON mr.doctor_id = d.doctor_id
        LEFT JOIN Appointment a ON mr.appointment_id = a.appointment_id
        WHERE mr.doctor_id = ?
      `;
      const [rows] = await db.query(sql, [doctorId]);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  getByPatient: async (patientId) => {
    try {
      const sql = `
        SELECT 
          mr.*,
          p.name AS patient_name,
          d.name AS doctor_name,
          a.appointment_date
        FROM MedicalRecord mr
        JOIN Patient p ON mr.patient_id = p.patient_id
        JOIN Doctor d ON mr.doctor_id = d.doctor_id
        LEFT JOIN Appointment a ON mr.appointment_id = a.appointment_id
        WHERE mr.patient_id = ?
      `;
      const [rows] = await db.query(sql, [patientId]);
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Get record by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM MedicalRecord WHERE record_id = ?',
        [id]
      );
      return rows[0]; // return single object 
    } catch (err) {
      throw err;
    }
  },

  // Create medical record (with FK validation)
  create: async (data) => {
    try {

      // Check patient
      const [patient] = await db.query(
        'SELECT * FROM Patient WHERE patient_id = ?',
        [data.patient_id]
      );

      if (patient.length === 0) {
        throw new Error('Patient not found');
      }

      // Check doctor
      const [doctor] = await db.query(
        'SELECT * FROM Doctor WHERE doctor_id = ?',
        [data.doctor_id]
      );

      if (doctor.length === 0) {
        throw new Error('Doctor not found');
      }

      // Check appointment (if provided)
      if (data.appointment_id) {
        const [appointment] = await db.query(
          'SELECT * FROM Appointment WHERE appointment_id = ?',
          [data.appointment_id]
        );
        if (appointment.length === 0) {
          throw new Error('Appointment not found');
        }
      }

      // Insert record
      const sql = `
        INSERT INTO MedicalRecord
        (patient_id, doctor_id, appointment_id, diagnosis, prescription, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;

      const [result] = await db.query(sql, [
        data.patient_id,
        data.doctor_id,
        data.appointment_id || null,
        data.diagnosis,
        data.prescription,
        data.notes || null   // optional 
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Update record
  update: async (id, data) => {
    try {
      const sql = `
        UPDATE MedicalRecord
        SET diagnosis=?, prescription=?, notes=?
        WHERE record_id=?`;

      const [result] = await db.query(sql, [
        data.diagnosis,
        data.prescription,
        data.notes || null,
        id
      ]);

      if (result.affectedRows === 0) {
        throw new Error('Medical record not found');
      }

      return result;
    } catch (err) {
      throw err;
    }
  },

  // Delete record
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM MedicalRecord WHERE record_id = ?',
        [id]
      );
      if (result.affectedRows === 0) {
        throw new Error('Medical record not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = MedicalRecord;