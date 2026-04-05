const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/db');


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. check if user exists
    const existingUser = await User.getByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists, please login'
      });
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create user (default role = patient)
    const result = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'patient'
    });

    // 4. create patient entry
    await db.query(
      'INSERT INTO Patient (user_id) VALUES (?)',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Signup successful'
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. find user
    const user = await User.getByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    // 3. generate token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. send response
    res.json({
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};