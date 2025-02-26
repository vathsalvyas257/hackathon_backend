const express = require("express");
const { addReply, getReplies } = require("../controllers/replyController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Add a reply to a thread (Protected)
router.post("/:threadId", authenticate, addReply);

// Get all replies for a thread (Public)
router.get("/:threadId", getReplies);

module.exports = router;
