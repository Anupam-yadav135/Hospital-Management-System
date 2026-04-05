const MedicalRecord = require('../models/medicalRecordModel');
const { getPatientId, getDoctorId } = require('../utils/getIds');

// GET ALL
exports.getAllMedicalRecords = async (req, res) => {
    try {
        const data = await MedicalRecord.getAll();

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
exports.getMedicalRecordById = async (req, res) => {
  try {
    const record = await MedicalRecord.getById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // patient → own record
    if (req.user.role === 'patient') {
      const patientId = await getPatientId(req.user.id);

      if (record.patient_id !== patientId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // doctor → assigned record
    if (req.user.role === 'doctor') {
      const doctorId = await getDoctorId(req.user.id);

      if (record.doctor_id !== doctorId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.json({ data: record });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// CREATE
exports.createMedicalRecord = async (req, res) => {
    try {
        const newMedicalRecord = await MedicalRecord.create(req.body);

        res.status(201).json({
            status: "success",
            data: newMedicalRecord
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// UPDATE
exports.updateMedicalRecord = async (req, res) => {
    try {
        const updated = await MedicalRecord.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                status: "fail",
                message: "Medical record not found"
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
exports.deleteMedicalRecord = async (req, res) => {
    try {
        const deleted = await MedicalRecord.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Medical record not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Medical record deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};