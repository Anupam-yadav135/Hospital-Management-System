const db = require('../config/db');
const Room = {

  // Get all rooms
  getAll: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM Room');
      return rows;
    } catch (err) {
      throw err;
    }
  },


  // Get room by ID
  getById: async (id) => {
    try {
      const [rows] = await db.query(
        'SELECT * FROM Room WHERE room_id = ?',
        [id]
      );
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  // Get available rooms
  getAvailableRooms: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM Room WHERE status = "Available"');
      return rows;
    } catch (err) {
      throw err;
    }
  },

  // Create room
  create: async (data) => {
    try {
      const sql = `
        INSERT INTO Room (room_number, room_type, status)
        VALUES (?, ?, ?)`;

      const [result] = await db.query(sql, [
        data.room_number,
        data.room_type,
        data.status || 'Available'
      ]);
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Update room
  update: async (id, data) => {
    try {
      const sql = `
        UPDATE Room
        SET room_number=?, room_type=?, status=?
        WHERE room_id=?
      `;

      const [result] = await db.query(sql, [
        data.room_number,
        data.room_type,
        data.status,
        id
      ]);

      if (result.affectedRows===0) {
        throw new Error('Room not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  },

  // Delete room
  delete: async (id) => {
    try {
      const [result] = await db.query(
        'DELETE FROM Room WHERE room_id = ?',
        [id]
      );

      if(result.affectedRows === 0){
        throw new Error('Room not found');
      }
      return result;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = Room;