const Project = require("../Models/Project");

// Create project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = new Project({ name, description });
        await project.save();

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete project
exports.deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};





const Image = require("../Models/Image");

// Upload images to project
exports.uploadImages = async (req, res) => {
    try {
        const { projectId } = req.body;

        const files = req.files;
        let images = [];

        for (let file of files) {
            const img = new Image({
                name: file.originalname,
                projectId,
                data: file.buffer.toString("base64"),
                type: file.mimetype
            });

            await img.save();
            images.push(img);
        }

        res.json({ images });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Save bounding box
exports.saveBox = async (req, res) => {
    try {
        const { imageId, box } = req.body;

        const image = await Image.findById(imageId);
        image.boxes.push(box);
        await image.save();

        res.json({ message: "Saved" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get images of project
exports.getProjectImages = async (req, res) => {
    const images = await Image.find({ projectId: req.params.projectId });
    res.json(images);
};



// Add this to your image controller
exports.saveAnnotations = async (req, res) => {
    try {
        const { imageId, boxes } = req.body;

        // Find the image and update the entire boxes array
        const updatedImage = await Image.findByIdAndUpdate(
            imageId,
            { $set: { boxes: boxes } },
            { new: true }
        );

        if (!updatedImage) {
            return res.status(404).json({ error: "Image not found" });
        }

        res.json({ message: "Coordinates saved successfully", data: updatedImage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};