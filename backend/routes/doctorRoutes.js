const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');

// Get all Doctor
router.get('/', doctorController.getAllDoctor);

// Get bill by ID
router.get('/:id', doctorController.getDoctorById);

// Create Doctor
router.post('/', doctorController.createDoctor);

// Update Doctor
router.put('/:id', doctorController.updateDoctor);

// Delete Doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;