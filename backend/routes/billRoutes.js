const express = require('express');
const router = express.Router();

const billController = require('../controllers/billController');

// Get all bills
router.get('/', billController.getAllBills);

// Get bill by ID
router.get('/:id', billController.getBillById);

// Create bill
router.post('/', billController.createBill);

// Update bill
router.put('/:id', billController.updateBill);

// Delete bill
router.delete('/:id', billController.deleteBill);

module.exports = router;