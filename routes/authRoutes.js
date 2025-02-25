const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const User = require("../models/userModel");
const multer = require("multer");
const authController=require("../controllers/authController");

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

module.exports = router;
