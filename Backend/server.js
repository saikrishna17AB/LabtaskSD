// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express(); // ✅ MUST come first

// // Routes
// const authRoutes = require("./Routes/authRoutes");
// const projectRoutes = require("./Routes/Projectroutes"); // ✅ fix name

// // Middleware
// app.use(cors());
// app.use(express.json());

// // =====================
// // 🔗 MongoDB Connection
// // =====================
// mongoose.connect("mongodb://127.0.0.1:27017/Labtaskc")
// .then(() => console.log("MongoDB Connected"))
// .catch(err => console.log(err));

// // =====================
// // 🔀 Routes
// // =====================
// app.use("/api/auth", authRoutes);
// app.use("/api/projects", projectRoutes); // ✅ use ONE consistent route



// const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() }); // Store in memory to convert to Base64

// app.post('/api/projects/upload', upload.array('images'), async (req, res) => {
//     try {
//         const { projectId } = req.body;
        
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).send("No files uploaded.");
//         }

//         const imageDocs = req.files.map(file => ({
//             projectId: projectId,
//             name: file.originalname,
//             data: file.buffer.toString('base64'),
//             type: file.mimetype,
//             boxes: []
//         }));

//         // Bulk insert into MongoDB (more efficient than a loop)
//         await Image.insertMany(imageDocs);
        
//         res.status(200).json({ message: "Images saved successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });
// // =====================
// // 🧪 Test Route
// // =====================
// app.get("/", (req, res) => {
//     res.send("API is running...");
// });

// // =====================
// // 🚀 Start Server
// // =====================
// const PORT = 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express(); 

// 1. Middleware
app.use(cors());
// IMPORTANT: Increase limits for image data
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 2. MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Labtaskc")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// 3. Import Routes
const authRoutes = require("./Routes/authRoutes");
const projectRoutes = require("./Routes/Projectroutes"); 

// 4. Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes); 

// 🧪 Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// 🚀 Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});