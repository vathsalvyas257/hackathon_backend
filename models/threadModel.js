const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { 
        type: String, 
        enum: ["Academics", "Events", "Clubs", "Placements"], 
        required: true 
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Thread", threadSchema);
