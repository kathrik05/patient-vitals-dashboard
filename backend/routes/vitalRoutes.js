const express = require("express");
const Vital = require("../models/vitals");

const router = express.Router();

// Add vitals for a patient
router.post("/", async (req, res) => {
  try {
    const { patientId, heartRate, spo2, temperature, recordedAt } = req.body;

    console.log("Received vitals POST request:", req.body);

    if (!patientId || !recordedAt) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recordTime = new Date(recordedAt);
    if (isNaN(recordTime.getTime()) || recordTime > new Date()) {
      return res
        .status(400)
        .json({ message: "Invalid or future timestamp" });
    }

    const vital = await Vital.create({
      patientId,
      heartRate,
      spo2,
      temperature,
      recordedAt: recordTime,
    });

    console.log("Successfully created vital:", vital);

    res.status(201).json(vital);
  } catch (error) {
    console.error("Error creating vital:", error);
    res.status(400).json({ message: error.message });
  }
});

// Get latest vitals for a patient
router.get("/latest/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const latestVital = await Vital.findOne({ patientId })
      .sort({ recordedAt: -1 })
      .limit(1);

    if (!latestVital) {
      return res
        .status(404)
        .json({ message: "No vitals found for this patient" });
    }

    res.json(latestVital);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest vitals" });
  }
});

// Get vitals history for a patient
router.get("/history/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log("Fetching history for patientId:", patientId);

    const history = await Vital.find({ patientId })
      .sort({ recordedAt: -1 });

    console.log(`Found ${history.length} vitals records for patient ${patientId}`);

    res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Failed to fetch vitals history" });
  }
});

module.exports = router;
