const express = require('express');
const router = express.Router();

const medicalRecordController = require('../controllers/medicalRecordController');

// Get all medical records
router.get('/', medicalRecordController.getAllMedicalRecords);

// Get medical record by ID
router.get('/:id', medicalRecordController.getMedicalRecordById);

// Create medical record
router.post('/', medicalRecordController.createMedicalRecord);

// Update medical record
router.put('/:id', medicalRecordController.updateMedicalRecord);

// Delete medical record
router.delete('/:id', medicalRecordController.deleteMedicalRecord);

module.exports = router;