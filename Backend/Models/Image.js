const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    label: String
});

const imageSchema = new mongoose.Schema({
    name: String,
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    data: String, // base64
    type: String,
    boxes: [boxSchema]
});

module.exports = mongoose.model("Image", imageSchema);