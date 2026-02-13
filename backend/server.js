const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const patientRoutes = require("./routes/patientRoutes");
const vitalRoutes = require("./routes/vitalRoutes");

require("dotenv").config();

const app = express();




// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/vitals", vitalRoutes);


// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running 🚀" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
