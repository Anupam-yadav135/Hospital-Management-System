const db = require('../config/db');

exports.makeDoctor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { specialization, phone } = req.body;

    // 1. check user
    const [userRows] = await db.query(
      'SELECT * FROM User WHERE user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userRows[0];

    if (user.role === 'doctor') {
      return res.status(400).json({ message: 'Already a doctor' });
    }

    // 2. update role
    await db.query(
      'UPDATE User SET role = ? WHERE user_id = ?',
      ['doctor', userId]
    );

    // 3. REMOVE from Patient table 
    await db.query(
      'DELETE FROM Patient WHERE user_id = ?',
      [userId]
    );

    // 4. ADD to Doctor table
    await db.query(
      'INSERT INTO Doctor (user_id, specialization, phone) VALUES (?, ?, ?)',
      [userId, specialization, phone]
    );

    res.json({
      message: 'User promoted to doctor successfully'
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};