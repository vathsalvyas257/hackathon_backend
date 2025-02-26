const Reply = require("../models/replyModel");
const Thread = require("../models/threadModel");

// @desc    Add a reply to a thread
// @route   POST /api/replies/:threadId
// @access  Private
const addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const { threadId } = req.params;

        if (!content) {
            return res.status(400).json({ message: "Reply content is required" });
        }

        const threadExists = await Thread.findById(threadId);
        if (!threadExists) {
            return res.status(404).json({ message: "Thread not found" });
        }

        const newReply = new Reply({
            thread: threadId,
            user: req.user.userId,
            content
        });

        await newReply.save();
        res.status(201).json(newReply);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get all replies for a thread
// @route   GET /api/replies/:threadId
// @access  Public
const getReplies = async (req, res) => {
    try {
        const { threadId } = req.params;

        const replies = await Reply.find({ thread: threadId }).populate("user", "name");
        res.json(replies);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { addReply, getReplies };
