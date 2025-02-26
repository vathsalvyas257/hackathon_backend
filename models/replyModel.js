const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    thread: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reply", replySchema);
