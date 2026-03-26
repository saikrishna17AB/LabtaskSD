const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import the Controller
const ProjectController = require("../Controllers/Projectcontroller");

// Import the Image Model (needed for the CSV function if it's defined in this file)
const Image = require("../Models/Image"); 

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- PROJECT MANAGEMENT ROUTES ---
router.post("/", ProjectController.createProject);
router.get("/", ProjectController.getProjects);
router.delete("/:id", ProjectController.deleteProject);

// --- IMAGE & ANNOTATION ROUTES ---
// Field name "images" must match the frontend FormData
router.post("/upload", upload.array("images"), ProjectController.uploadImages);
router.get("/images/:projectId", ProjectController.getProjectImages);
router.post("/box", ProjectController.saveBox);
router.post('/save-annotations', ProjectController.saveAnnotations);

// --- EXPORT ROUTE ---
router.get("/export/:projectId", async (req, res) => {
    try {
        const images = await Image.find({ projectId: req.params.projectId });
        
        let csvContent = "image_name,label,x_min,y_min,width,height\n";
        
        images.forEach(img => {
            if (img.boxes) {
                img.boxes.forEach(box => {
                    csvContent += `${img.name},${box.label},${box.x},${box.y},${box.width},${box.height}\n`;
                });
            }
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=annotations.csv');
        res.status(200).send(csvContent);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;