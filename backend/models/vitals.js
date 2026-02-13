const mongoose = require("mongoose");

const vitalSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    heartRate: {
      type: Number,
      required: true,
      min: 0,
      max: 300,
    },
    spo2: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    temperature: {
      type: Number,
      required: true,
      min: 30,
      max: 45,
    },
    recordedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vital", vitalSchema);
