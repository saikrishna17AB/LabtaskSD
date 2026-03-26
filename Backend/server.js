const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Routes
const authRoutes = require("./Routes/authRoutes");
const projectRoutes = require("./Routes/Projectroutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// =====================
// 🔗 MongoDB Connection
// =====================
mongoose.connect("mongodb://127.0.0.1:27017/Labtaskc")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
// =====================
// 🔀 Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/project", projectRoutes);

// =====================
// 🧪 Test Route (optional)
// =====================
app.get("/", (req, res) => {
    res.send("API is running...");
});

// =====================
// 🚀 Start Server
// =====================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});