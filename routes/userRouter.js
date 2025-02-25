const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust the path as per your project structure
const router = express.Router();
const authenticate=require("../middlewares/authenticate");
router.get("/api/auth/user", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select("-password"); // Exclude sensitive fields like password
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  module.exports = router;