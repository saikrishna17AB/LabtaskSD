const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);