const Doctor = require('../models/doctorModel');
const { getDoctorId } = require('../utils/helpers');

// GET ALL docotrs 
exports.getAllDoctors = async (req, res) => {
    try {
        const data = await Doctor.getAllDoctors();

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
exports.getDoctorById =async (req,res) =>{
  try {
    const doctor = await Doctor.getDoctorById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // doctor can only see himself
    if (req.user.role === 'doctor') {
      const doctorId = await getDoctorId(req.user.id);

      if (doctor.doctor_id !== doctorId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.json({ data: doctor });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE
// exports.createDoctor = async (req, res) => {
//     try {
//         const newDoctor = await Doctor.create(req.body);

//         res.status(201).json({
//             status: "success",
//             data: newDoctor
//         });

//     } catch (err) {
//         res.status(400).json({
//             status: "fail",
//             message: err.message
//         });
//     }
// };

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