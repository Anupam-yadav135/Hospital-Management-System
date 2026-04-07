const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const {verifyToken} = require('../middlewares/authMiddleware');
const roleAuthorization = require('../middlewares/roleMiddleware');
// Get all rooms
router.get('/', verifyToken, roleAuthorization('admin'),  roomController.getAllRooms);

// Get room by ID
router.get('/:id', verifyToken, roleAuthorization('admin'), roomController.getRoomById);

// Create room
router.post('/', verifyToken, roleAuthorization('admin'), roomController.createRoom);

// Update room
router.put('/:id',verifyToken,  roleAuthorization('admin'), roomController.updateRoom);

// Delete room
router.delete('/:id', verifyToken, roleAuthorization('admin'), roomController.deleteRoom);

module.exports = router;        