const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String }, // Base64 format
    package: { type: Number },
    url: { type: String }, // LinkedIn or Company Profile URL
    jobRole: { type: String }
}, { timestamps: true });

const Alumni = mongoose.model("Alumni", alumniSchema);
module.exports = Alumni;
