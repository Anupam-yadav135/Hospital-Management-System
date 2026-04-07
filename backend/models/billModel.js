// models/billModel.js

const db = require('../config/db');

const Bill = {

  // Get all bills (with JOIN for useful data)
  getAllBills: async () => {
    try{
      const sql = `
        SELECT 
          b.*,
          p.name AS patient_name,
          a.appointment_date,
          r.room_number
        FROM Bill b
        JOIN Patient p ON b.patient_id = p.patient_id
        JOIN Appointment a ON b.appointment_id = a.appointment_id
        LEFT JOIN Room r ON b.room_id = r.room_id
      `;

      const [rows] = await db.query(sql);
      return rows;

    } catch (err) {
      throw err;
    }
  },

  // Get bill by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Bill WHERE bill_id = ?',
        [id]
      );

      return rows[0];

    } catch (err) {
      throw err;
    }
  },

  // Create bill (with fk validation)
  create: async (data) => {
    try {

      //  Check patient
      const [patient] = await db.query(
        'SELECT * FROM Patient WHERE patient_id = ?',
        [data.patient_id]
      );
      console.log(patient);

      if (patient.length===0){
        throw new Error('Patient not found');
      }

      // Check appointment
      const [appointment] = await db.query(
        'SELECT * FROM Appointment WHERE appointment_id = ?',
        [data.appointment_id]
      );
      console.log(appointment);

      if(appointment.length===0){
        throw new Error('Appointment not found');
      }

      // Check room ( if provided)
      if (data.room_id) {
        const [room] = await db.query(
          'SELECT * FROM Room WHERE room_id = ?',
          [data.room_id]
        );

        if (room.length === 0) {
          throw new Error('Room not found');
        }
      }

      //  Insert bill
      const sql = `
        INSERT INTO Bill 
        (patient_id, appointment_id, room_id, total_amount, payment_status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      const [result] = await db.query(sql, [
        data.patient_id,
        data.appointment_id,
        data.room_id || null,  // if given else input null 
        data.total_amount,
        data.payment_status || 'Pending'  // pending status 
      ]);

      return result;

    } catch (err) {
      throw err;
    }
  },

  //  Update bill
  update: async (id, data) => {
    try {
      const sql = `
        UPDATE Bill
        SET patient_id=?, appointment_id=?, room_id=?, total_amount=?, payment_status=?
        WHERE bill_id=?
      `;

      const [result] = await db.query(sql, [
        data.patient_id,
        data.appointment_id,
        data.room_id || null,
        data.total_amount,
        data.payment_status,
        id
      ]);

      if (result.affectedRows===0) {
        throw new Error('Bill not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  //  Delete bill
  delete: async (id) => {
    try {
      const [result] =await db.query(
        'DELETE FROM Bill WHERE bill_id = ?',
        [id]
      );

      if (result.affectedRows===0){
        throw new Error('Bill not found');
      }
      return result;
    }catch (err){
      throw err;
    }
  }
};

module.exports = Bill;