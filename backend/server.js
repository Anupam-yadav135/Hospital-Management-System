const express = require('express');
require('dotenv').config();
const app = express();

// Middlewares
app.use(express.json());
const { logger } = require('./middlewares/loggerMiddleware');
app.use(logger);

// Auth + Middleware
const authRouter = require('./routes/authRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');
const authorizeRoles = require('./middlewares/roleMiddleware');

// Routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const billRoutes = require('./routes/billRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route Mounting
app.use('/api/auth', authRouter);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/admin', adminRoutes);

// Test Protected Route
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});

// Admin Test Route
app.get(
  '/admin',
  verifyToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: 'Welcome Admin' });
  }
);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend is running on PORT ${PORT}`);
});