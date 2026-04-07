const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/db');


// ================= SIGNUP ======================================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Name, email and password are required"
      });
    }

    // 2. check existing user
    const existingUser = await User.getByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists, please login"
      });
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user (NO name here)
    const result = await User.create({
      email,
      password: hashedPassword,
      role: 'patient'
    });

    const userId = result.insertId;

    // 5. create patient profile
    await db.query(
      `INSERT INTO Patient (user_id, name)
       VALUES (?, ?)`,
      [userId, name]
    );

    res.status(201).json({
      status: "success",
      message: "Signup successful"
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};



// ================= LOGIN =========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check user
    const user = await User.getByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    // 2. compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password"
      });
    }

    // 3. generate token
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4. send response
    res.status(200).json({
      status: "success",
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};