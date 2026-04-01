const Bill = require('../models/billModel');

// GET ALL BILLS
exports.getAllBills = async (req, res) => {
    try {
        const data = await Bill.getAllBills();

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

// GET BILL BY ID
exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.getBillById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                status: "fail",
                message: "Bill not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: bill
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};

// CREATE BILL
exports.createBill = async (req, res) => {
    try {
        const newBill = await Bill.create(req.body);

        res.status(201).json({
            status: "success",
            data: newBill
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};

// UPDATE BILL
exports.updateBill = async (req, res) => {
    try {
        const updated = await Bill.update(req.params.id, req.body);

        if (!updated) {
            return res.status(404).json({
                status: "fail",
                message: "Bill not found"
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

// DELETE BILL
exports.deleteBill = async (req, res) => {
    try {
        const deleted = await Bill.delete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                status: "fail",
                message: "Bill not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Bill deleted"
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};