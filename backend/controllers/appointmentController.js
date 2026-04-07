const Appointment = require('../models/appointmentModel');
const db = require('../config/db');

// GET ALL appointments
exports.getAllAppointments= async(req, res)=>{
    try{

        // Only admin + doctor allowed
        if (!['admin', 'doctor'].includes(req.user.role)) {
            return res.status(403).json({
                status: "fail",
                message: "Access denied"
            });
        }
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
    const appointment = await Appointment.getAppointmentById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found"
      });
    }

    // PATIENT CHECK
    if (req.user.role === 'patient') {
      const [rows] = await db.query(
        'SELECT patient_id FROM Patient WHERE user_id = ?',
        [req.user.id]
      );

      const patientId = rows[0]?.patient_id;
      if (appointment.patient_id !== patientId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // DOCTOR CHECK
    if (req.user.role === 'doctor') {
      const [rows] = await db.query(
        'SELECT doctor_id FROM Doctor WHERE user_id = ?',
        [req.user.id]
      );

      const doctorId = rows[0]?.doctor_id;

      if (appointment.doctor_id !== doctorId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json({
      status: "success",
      data: appointment
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

    if (req.user.role !== 'patient') {
      return res.status(403).json({
        message: "Only patients can create appointments"
      });
    }

    //Get patient_id from user_id 
    const [rows] = await db.query(
      'SELECT patient_id FROM Patient WHERE user_id = ?',
      [req.user.id]
    );

    const patientId = rows[0]?.patient_id;
    console.log("Patient ID:", patientId);

    // attach to body
    req.body.patient_id = patientId;

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

    if (!['doctor', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const appointment = await Appointment.getAppointmentById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    // Doctor can only update own appointments
    if (req.user.role === 'doctor') {
      const [rows] = await db.query(
        'SELECT doctor_id FROM Doctor WHERE user_id = ?',
        [req.user.id]
      );

      const doctorId = rows[0]?.doctor_id;

      if (appointment.doctor_id !== doctorId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const updated = await Appointment.update(req.params.id, req.body);

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
    const appointmentId = req.params.id;

    //Only admin can delete
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: "fail",
        message: "Only admin can delete appointments"
      });
    }

    // Check if appointment exists
    const appointment = await Appointment.getAppointmentById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        status: "fail",
        message: "Appointment not found"
      });
    }

    // Delete appointment
    const result = await Appointment.delete(appointmentId);

    res.status(200).json({
      status: "success",
      message: "Appointment deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};