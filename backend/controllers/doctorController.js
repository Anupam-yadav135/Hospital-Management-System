const Doctor = require('../models/doctorModel');

// GET ALL
exports.getAllDoctors = async (req, res) => {
    try {
        const data = await Doctor.getAllDoctor();

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
exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.getDoctorById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                status: "fail",
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: doctor
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// CREATE
exports.createDoctor = async (req, res) => {
    try {
        const newDoctor = await Doctor.create(req.body);

        res.status(201).json({
            status: "success",
            data: newDoctor
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// UPDATE
exports.updateDoctor = async (req, res) => {
    try {
        const updated = await Doctor.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                status: "fail",
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: updated
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// DELETE
exports.deleteDoctor = async (req, res) => {
    try {
        const deleted = await Doctor.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Doctor not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Doctor deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};