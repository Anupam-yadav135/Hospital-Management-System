const express = require('express');
const  dotenv = require('dotenv');
// const db= require('./config/db');

dotenv.config();

const app= express();

app.use(express.json());


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