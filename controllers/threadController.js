const Thread = require("../models/threadModel");


const createThread = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }
    console.log(req.user);
    const newThread = new Thread({
      title,
      category,
      creator: req.user.userId, // Retrieved from authMiddleware
    });

    await newThread.save();
    res.status(201).json({ message: "Thread created successfully", thread: newThread });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all threads
// @route   GET /api/threads
// @access  Public
const getThreads = async (req, res) => {
  try {
    const threads = await Thread.find().populate("creator", "name email"); // Populate user details
    res.status(200).json(threads);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single thread by ID
// @route   GET /api/threads/:id
// @access  Public
const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate("creator", "name email");
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.status(200).json(thread);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createThread, getThreads, getThreadById };
