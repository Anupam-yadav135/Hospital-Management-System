const Room = require('../models/roomModel');

// GET ALL
exports.getAllRooms = async (req, res) => {
    try {
        const data = await Room.getAllRooms();

        res.status(200).json({
            status: "success",
            results: data.length,
            data
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// GET BY ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.getRoomById(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: "fail",
                message: "Room not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: room
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// CREATE
exports.createRoom = async (req, res) => {
    try {
        const newRoom = await Room.create(req.body);

        res.status(201).json({
            status: "success",
            data: newRoom
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// UPDATE
exports.updateRoom = async (req, res) => {
    try {
        const updatedRoom = await Room.update(req.params.id, req.body);

        if (!updatedRoom) {
            return res.status(404).json({
                status: "fail",
                message: "Room not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: updatedRoom
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// DELETE
exports.deleteRoom = async (req, res) => {
    try {
        const deleted = await Room.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Room not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Room deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};