const express = require('express');
const dotenv = require('dotenv');
const {logger} = require('./middlewares/loggerMiddleware');
// const db= require('./config/db');

dotenv.config();  // loads environment variables from .env file into process.env 

const app= express(); // create express app 

app.use(logger);   // for the logging all the incoming request to the server 
app.use(express.json());  // for parsing application/json in request body


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



const PORT = process.env.PORT || 5000;

app.listen(PORT , () => { 
    console.log(`Backend is running on PORT ${PORT}`);
});