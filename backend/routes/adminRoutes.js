const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');

const adminController = require('../controllers/adminController');

// Promote user → doctor
router.post(
  '/make-doctor/:userId',
  verifyToken,
  roleAuthorization('admin'),
  adminController.makeDoctor
);

module.exports = router;