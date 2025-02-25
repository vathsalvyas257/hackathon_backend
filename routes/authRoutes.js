const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const User = require("../models/userModel");
const multer = require("multer");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 📌 Register Route
// Multer storage setup (in memory, so we can process the file)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register Route
router.post("/api/auth/register", upload.single("image"), async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const file = req.file;

        // Validate input
        if (!name || !email || !password || !file) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Convert image to Base64
        const imageBase64 = file.buffer.toString("base64");

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: imageBase64,
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

// 📌 Google OAuth Route
router.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📌 Google OAuth Callback (Ensure Leading Slash `/auth/...`)
router.get(
  "/auth/google/callback", // ✅ Fixed (leading slash added)
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      user = new User({
        name: req.user.name,
        email: req.user.email,
        googleId: req.user.id, // ✅ Add Google ID for uniqueness
        role: "user"
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1-hour expiration
    });
    // Redirect user with token to frontend
    res.redirect(`http://localhost:5173`);
  }
);

module.exports = router;
