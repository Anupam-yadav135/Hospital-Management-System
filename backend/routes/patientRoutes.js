const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const patientController = require('../controllers/patientController');

// Get all patients
router.get('/', verifyToken, roleAuthorization('admin','doctor'), patientController.getAllPatients);

// Get patient by ID
router.get('/:id', verifyToken, roleAuthorization('admin' , 'patient'), patientController.getPatientById);

// Create patient
// router.post('/createPatient', verifyToken , roleAuthorization('admin'),  patientController.createPatient);

// Update patient 
router.put('/updatePatient/:id', verifyToken ,roleAuthorization('admin','patient', 'doctor'), patientController.updatePatient);

// Delete patient
router.delete('/deletePatient/:id', verifyToken ,roleAuthorization('admin'), patientController.deletePatient);

module.exports = router;