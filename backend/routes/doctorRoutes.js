const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const doctorController = require('../controllers/doctorController');

// Get all Doctor
router.get('/getAllDoctors', verifyToken, doctorController.getAllDoctors);

// Get doctor by ID
router.get('/doc/:id',verifyToken,roleAuthorization('admin', 'doctor') , doctorController.getDoctorById);

// Create Doctor
router.post('/createDoctor',  verifyToken, roleAuthorization('admin'), doctorController.createDoctor);    

// Update Doctor
router.put('/updateDoctor/:id', verifyToken , roleAuthorization('admin', 'doctor'), doctorController.updateDoctor);

// Delete Doctor
router.delete('/deleteDoctor/:id', verifyToken , roleAuthorization('admin'), doctorController.deleteDoctor);

module.exports = router;