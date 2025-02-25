const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const User = require("../models/userModel");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 📌 Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
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
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📌 Google OAuth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
      // Check if the user already exists
      let user = await User.findOne({ email: req.user.email });
  
      // If user doesn't exist, create a new user
      if (!user) {
        const newUser = new User({
          name: req.user.name,
          email: req.user.email,
          // other Google profile fields like picture can also be saved here
          role: 'user' // You can adjust this based on your logic
        });
        user = await newUser.save();  // Save new user to MongoDB
      }
  
      // Generate JWT for the user
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  
      // Redirect user with the token
      res.redirect(`http://localhost:3000?token=${token}`);
    }
  );
  
module.exports = router;
