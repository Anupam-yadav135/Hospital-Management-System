const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const appointmentController = require('../controllers/appointmentController');


// Get all appointments -> admin, doctor, patient
router.get('/getAll', verifyToken, roleAuthorization("admin", "doctor", "patient"), appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/getById/:id',verifyToken, roleAuthorization("admin", "doctor"), appointmentController.getAppointmentById);

// Create appointment
router.post('/createAppointment', verifyToken,roleAuthorization("patient"), appointmentController.createAppointment);

// Update appointment 
router.put('/updateAppointment/:id', verifyToken,roleAuthorization("admin", "doctor"), appointmentController.updateAppointment);

// Delete appointment
router.delete('/deleteAppointment/:id', verifyToken,roleAuthorization("admin"), appointmentController.deleteAppointment);

module.exports = router;