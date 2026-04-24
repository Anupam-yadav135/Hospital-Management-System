const Patient = require('../models/patientModel');
const { getPatientId, getDoctorId } = require('../utils/helpers');

// GET ALL
exports.getAllPatients = async (req, res) => {
    try {

        if (!['admin', 'doctor'].includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied"
            });
        }

        let data;
        if (req.user.role === 'doctor') {
            const doctorId = await getDoctorId(req.user.id);
            data = await Patient.getPatientsByDoctor(doctorId);
        } else {
            data = await Patient.getAllPatients();
        }
        
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

    if(req.user.role=='admin' ){
        // admin can see all so do nothing 
    }else if (req.user.role === 'patient') {
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

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Only admin can create patient"
      });
    }

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

    // const patientID = req.params.id;
    // console.log(patientID);
    const patient = await Patient.getById(req.params.id);
    console.log(patient);

    if (!patient.patient_id) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    // patient → only own
    if (req.user.role === 'patient') {
      const patientId = await getPatientId(req.user.id);

      if (patient.patient_id !== patientId) {
        return res.status(403).json({
          message: "Access denied"
        });
      }
    }

    // admin → allowed always
    const updated = await Patient.update(req.params.id, req.body);

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

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: "Only admin can delete patients"
      });
    }

    const deleted = await Patient.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
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