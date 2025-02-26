const express = require("express");
const { createThread, getThreads, getThreadById } = require("../controllers/threadController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Routes
router.post("/", authenticate, createThread);  // Create a thread (protected)
router.get("/", getThreads);              // Get all threads
router.get("/:id", getThreadById);         // Get a single thread by ID

module.exports = router;
