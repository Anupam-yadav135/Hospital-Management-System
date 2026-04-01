const express = require('express');
const router = express.Router();

const patientController = require('../controllers/patientController');

// Get all patients
router.get('/', patientController.getAllPatients);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

// Create patient
router.post('/', patientController.createPatient);

// Update patient
router.put('/:id', patientController.updatePatient);

// Delete patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;