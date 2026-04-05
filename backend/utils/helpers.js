const db = require('../config/db');

exports.getPatientId = async (userId) => {
  const [rows] = await db.query(
    'SELECT patient_id FROM Patient WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.patient_id;
};

exports.getDoctorId = async (userId) => {
  const [rows] = await db.query(
    'SELECT doctor_id FROM Doctor WHERE user_id = ?',
    [userId]
  );
  return rows[0]?.doctor_id;
};