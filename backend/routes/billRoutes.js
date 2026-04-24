const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
const billController = require('../controllers/billController');


// Get all bills
router.get('/', verifyToken, roleAuthorization('admin', 'patient'), billController.getAllBills);

// Get bill by ID
router.get('/personalBills/:id', verifyToken , roleAuthorization('admin', 'patient'), billController.getBillById);

// Create bill
router.post('/',  verifyToken , roleAuthorization('admin'),billController.createBill);

// Update bill
router.put('/:id', verifyToken , roleAuthorization('admin'), billController.updateBill);

// Delete bill
router.delete('/:id', verifyToken , roleAuthorization('admin') ,  billController.deleteBill);

module.exports = router;