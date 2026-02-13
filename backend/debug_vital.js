const mongoose = require("mongoose");
const Vital = require("./models/vitals");
const Patient = require("./models/Patient");
require("dotenv").config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to DB");
        try {
            console.log("Fetching all patients...");
            const patients = await Patient.find({});
            console.log(`Found ${patients.length} patients.`);

            for (const p of patients) {
                console.log(`Patient: ${p.name} (${p._id})`);
                const vital = await Vital.findOne({ patientId: p._id }).sort({ recordedAt: -1 });
                console.log(`  Latest Vital: ${vital ? JSON.stringify(vital) : "None"}`);
            }

        } catch (err) {
            console.error("Error:", err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch((err) => console.error("DB Connection Error:", err));
