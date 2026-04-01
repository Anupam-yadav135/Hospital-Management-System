const Appointment = require('../models/appointmentModel');


// 200 - ok successful GET requests 
// 500 - server error 

// GET ALL
exports.getAllAppointments = async (req, res) => {
    try {
        const data = await Appointment.getAll();

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
exports.getAppointmentById = async (req, res) => {
    try {
        const Appointment = await Appointment.getAppointmentById(req.params.id);

        // if no such Appointment id  found in db -> 404 not found 
        if (!Appointment) {
            return res.status(404).json({
                status: "fail",
                message: "Appointment not found"
            });
        }
        res.status(200).json({
            status: "success",
            data: Appointment
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// CREATE
exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);

        res.status(201).json({
            status: "success",
            data: newAppointment
        });

    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message
        });
    }
};

// UPDATE
exports.updateAppointment = async (req, res) => {
    try {
        const updated = await Appointment.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                status: "fail",
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: updated
        });

    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message
        });
    }
};

// DELETE
exports.deleteAppointment = async (req, res) => {
    try {
        const deleted = await Appointment.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Appointment deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};