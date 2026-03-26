const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    createProject,
    uploadImages,
    addBox,
    getProjectImages,
    downloadCSV
} = require("../Controllers/Projectcontroller");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post("/project", createProject);
router.post("/upload", upload.array("images"), uploadImages);
router.post("/add-box", addBox);
router.get("/project/:projectId/images", getProjectImages);
router.get("/download", downloadCSV);

module.exports = router;