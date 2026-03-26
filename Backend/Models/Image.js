const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
    label: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number
});

const imageSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    name: String,
    data: String, // base64
    type: String,
    boxes: [boxSchema]
});

module.exports = mongoose.model("Image", imageSchema);