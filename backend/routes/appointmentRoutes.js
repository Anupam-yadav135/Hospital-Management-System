const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const appointmentController = require('../controllers/appointmentController');


// Get all appointments -> admin , doctor 
router.get('/', verifyToken ,roleAuthorization("admin", "doctor"), appointmentController.getAllAppointments);

// Get appointment by ID
router.get('/:id',verifyToken, roleAuthorization("admin", "doctor"), appointmentController.getAppointmentById);

// Create appointment
router.post('/', verifyToken,roleAuthorization("patient"), appointmentController.createAppointment);

// Update appointment 
router.put('/:id', verifyToken,roleAuthorization("admin", "doctor"), appointmentController.updateAppointment);

// Delete appointment
router.delete('/:id', verifyToken,roleAuthorization("admin"), appointmentController.deleteAppointment);

module.exports = router;