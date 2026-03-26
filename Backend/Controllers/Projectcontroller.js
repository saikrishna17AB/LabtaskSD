const Project = require("../Models/Project");
const Image = require("../Models/Image");

// Create Project
exports.createProject = async (req, res) => {
    const { userId, name } = req.body;

    try {
        const project = new Project({ userId, name });
        await project.save();

        res.json({ success: true, project });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
};

// Upload Images to Project
exports.uploadImages = async (req, res) => {
    const { projectId } = req.body;

    try {
        const images = [];

        for (let file of req.files) {
            const img = new Image({
                projectId,
                name: file.originalname,
                data: file.buffer.toString("base64"),
                type: file.mimetype,
                boxes: []
            });

            await img.save();
            images.push(img);
        }

        res.json({ success: true, images });

    } catch (err) {
        res.json({ success: false, error: err.message });
    }
};

// Add Bounding Box
exports.addBox = async (req, res) => {
    const { imageId, label, x, y, width, height } = req.body;

    try {
        const image = await Image.findById(imageId);

        image.boxes.push({ label, x, y, width, height });
        await image.save();

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false });
    }
};

// Get Images of Project
exports.getProjectImages = async (req, res) => {
    const { projectId } = req.params;

    const images = await Image.find({ projectId });
    res.json(images);
};

// Download CSV
exports.downloadCSV = async (req, res) => {
    try {
        const images = await Image.find();

        let csv = "image,label,x,y,width,height\n";

        images.forEach(img => {
            img.boxes.forEach(box => {
                csv += `${img.name},${box.label},${box.x},${box.y},${box.width},${box.height}\n`;
            });
        });

        res.header("Content-Type", "text/csv");
        res.attachment("annotations.csv");
        res.send(csv);

    } catch (err) {
        res.send("Error");
    }
};