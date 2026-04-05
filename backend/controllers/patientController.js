const Patient = require('../models/patientModel');
const { getPatientId } = require('../utils/getIds');


// GET ALL
exports.getAllPatients = async (req, res) => {
    try {
        const data = await Patient.getAllPatients();

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
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (req.user.role === 'patient') {
      const patientId = await getPatientId(req.user.id);

      if (patient.patient_id !== patientId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.json({ data: patient });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
exports.createPatient = async (req, res) => {
    try {
        const newPatient = await Patient.create(req.body);

        res.status(201).json({
            status: "success",
            data: newPatient
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// UPDATE
exports.updatePatient = async (req, res) => {
    try {
        const updated = await Patient.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                status: "fail",
                message: "Patient not found"
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
exports.deletePatient = async (req, res) => {
    try {
        const deleted = await Patient.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Patient not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Patient deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};