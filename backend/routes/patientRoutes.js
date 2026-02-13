const express = require("express");
const Patient = require("../models/Patient");
const Vital = require("../models/vitals");

const router = express.Router();

// Get all patients (with latest vitals)
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.aggregate([
            {
                $lookup: {
                    from: "vitals",
                    let: { patientId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$patientId", "$$patientId"] } } },
                        { $sort: { recordedAt: -1 } },
                        { $limit: 1 },
                    ],
                    as: "latestVital",
                },
            },
            {
                $unwind: {
                    path: "$latestVital",
                    preserveNullAndEmptyArrays: true,
                },
            },
            { $sort: { createdAt: -1 } },
        ]);
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch patients" });
    }
});

// Add a new patient
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const patient = await Patient.create({ name });
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a patient and all their vitals
router.delete("/:patientId", async (req, res) => {
    try {
        const { patientId } = req.params;

        console.log("Deleting patient:", patientId);

        // Delete all vitals for this patient first
        const vitalsDeleted = await Vital.deleteMany({ patientId });
        console.log(`Deleted ${vitalsDeleted.deletedCount} vitals for patient ${patientId}`);

        // Delete the patient
        const patient = await Patient.findByIdAndDelete(patientId);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        console.log("Successfully deleted patient:", patient.name);

        res.json({ message: "Patient and all vitals deleted successfully", patient });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Failed to delete patient" });
    }
});

module.exports = router;
