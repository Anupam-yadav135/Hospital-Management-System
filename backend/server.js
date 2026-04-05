const express = require('express');
const dotenv = require('dotenv').config();   // loads environment variables from .env file into process.env 
const {logger} = require('./middlewares/loggerMiddleware');
const authRouter = require('./routes/authRoutes');
const {verifyToken} = require('./middlewares/authMiddleware');
const authorizeRoles  = require('./middlewares/roleMiddleware');


const app= express(); // create express app 
app.use(express.json());  // for parsing application/json in request body

app.use('/api/auth', authRouter);   // for authentication routes (sign, login);
app.use(logger);   // for the logging all the incoming request to the server 

// const { verifyToken } = require('./middlewares/authMiddleware');

app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user
  });
});


app.get(
  '/admin',
  verifyToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.json({ message: 'Welcome Admin' });
  }
);

// app.use('/protected' ,verifyToken ,(req,res,next) =>{
//      res.status(201).json({
//         Message: "Access granted",
//         status: "success",
//         user :req.user
//     });
//     next();
// });

// db coonection test 

// const db = require('./config/db');

// (async () => {
//   try {
//     await db.query('SELECT 1');
//     console.log('Database connected successfully');
//   } catch (err) {
//     console.error(' Database connection failed:', err.message);
//   }
// })();


// Routes
// const patientRoutes = require('./routes/patientRoutes');
// const doctorRoutes = require('./routes/doctorRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const roomRoutes = require('./routes/roomRoutes');
// const billRoutes = require('./routes/billRoutes');
// const medicalRecordRoutes = require('./routes/medicalRecordRoutes');

// app.use('/api/patients', patientRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/bills', billRoutes);
// app.use('/api/medical-records', medicalRecordRoutes);

// // Error handling middleware
// const errorMiddleware = require('./middlewares/errorMiddleware');
// app.use(errorMiddleware);

// const bcrypt = require('bcrypt');

// bcrypt.hash('admin12345', 10).then(console.log);

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => { 
    console.log(`Backend is running on PORT ${PORT}`);
});