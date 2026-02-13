const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const Vital = require("./models/vitals");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");

        // Clear existing data (optional, maybe just add?)
        // await Patient.deleteMany({});
        // await Vital.deleteMany({});

        // Create Patient
        let patient = await Patient.findOne({ name: "John Doe" });
        if (!patient) {
            patient = await Patient.create({ name: "John Doe" });
            console.log("Created patient: John Doe");
        } else {
            console.log("Using existing patient: John Doe");
        }

        // Create Vitals (Normal)
        await Vital.create({
            patientId: patient._id,
            heartRate: 72,
            spo2: 98,
            temperature: 36.5,
            recordedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        });
        console.log("Added normal vitals");

        // Create Vitals (Abnormal - Recent)
        await Vital.create({
            patientId: patient._id,
            heartRate: 105,
            spo2: 92,
            temperature: 38.1,
            recordedAt: new Date(), // Now
        });
        console.log("Added abnormal (recent) vitals");

        console.log("Seeding complete!");
        mongoose.disconnect();
    })
    .catch((err) => console.error("Error:", err));
