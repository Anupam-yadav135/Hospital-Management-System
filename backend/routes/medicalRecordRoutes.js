const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const medicalRecordController = require('../controllers/medicalRecordController');

// Get all medical records
router.get('/', verifyToken, roleAuthorization('admin') ,medicalRecordController.getAllMedicalRecords);

// Get medical record by ID
router.get('/:id', verifyToken, medicalRecordController.getMedicalRecordById);

// Create medical record
router.post('/',  verifyToken , roleAuthorization('doctor'),  medicalRecordController.createMedicalRecord);

// Update medical record
router.put('/:id', verifyToken, roleAuthorization('doctor'), medicalRecordController.updateMedicalRecord);

// Delete medical record
router.delete('/:id', verifyToken, roleAuthorization('admin'), medicalRecordController.deleteMedicalRecord);

module.exports = router;