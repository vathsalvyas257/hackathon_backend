const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const User = require("../models/userModel");
const multer = require("multer");
const authController=require("../controllers/authController");
const authenticate=require("../middlewares/authenticate");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({ storage: storage }); 
router.post("/api/auth/register", upload.single("image"),authController.apiAuthRegister);

// 📌 Login Route
router.post("/api/auth/login", authController.login_post);

// 📌 Google OAuth Route
router.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📌 Google OAuth Callback (Ensure Leading Slash `/auth/...`)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleAuthCallback
);
router.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

router.post("/api/auth/sendOTP",authController.sendOtp);

router.post("/api/auth/verifyOTP",authController.verifyOtp);


// Logout API - Remove cookies (JWT)
router.post('/api/auth/logout', authController.logout);

router.get("/api/user", authenticate, authController.fetchUser);
module.exports = router;
