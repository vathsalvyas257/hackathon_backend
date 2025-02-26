const OTP = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");
const{otpVerify}=require("../utils/verifyOtp")
const User=require("../models/userModel");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const{userValidationSchema}=require("../Schema.js");

module.exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body; // Get email from request body

        // Validate email
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Generate 6-digit OTP
        const otp = sendEmail.generateOTP(); 

        // Save OTP in database with expiration time (5 minutes)
        


        // Send OTP via email
        await sendEmail.sendOTPEmail(email, otp);
        const newOtp = new OTP({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        });
        await newOtp.save();


        res.status(200).json({ msg: "OTP sent successfully" });

    } catch (error) {
        console.error("OTP Error:", error);
        res.status(500).json({ error: "Error sending OTP" });
    }
};

// 📌 Verify OTP
module.exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("otp details:",otp,email);
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const isValid = await otpVerify(email, otp);
        console.log(isValid);
        if (!isValid) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error verifying OTP" });
    }
};




module.exports.apiAuthRegister = async (req, res) => {
    try {
        const { name, email, password, role, googleId } = req.body;
        const file = req.file; // Image file (optional)

        // ✅ Validate input using Joi
        const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ error: error.details.map((err) => err.message) });
        }

        // ✅ Convert email to lowercase for consistency
        const lowerCaseEmail = value.email.toLowerCase();

        // ✅ Check if user already exists
        const existingUser = await User.findOne({ email: lowerCaseEmail });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        // ✅ Hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(value.password, salt);

        // ✅ Handle image properly (Use Cloud Storage Instead of Base64)
        let imageUrl = null;
        if (file) {
            // Example: Upload to Cloudinary (Recommended)
            // const uploadResponse = await cloudinary.uploader.upload(file.path);
            // imageUrl = uploadResponse.secure_url;

            imageUrl = file.buffer.toString("base64"); // TEMPORARY (Replace with cloud storage logic)
        }

        // ✅ Create new user
        const newUser = new User({
            name: value.name,
            email: lowerCaseEmail,
            password: hashedPassword,
            role: value.role, // Joi assigns default role if not provided
            googleId: value.googleId || null,
            image: imageUrl,
        });

        await newUser.save();

        // ✅ Generate JWT Token
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token);
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, image: newUser.image },
            token,
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports.login_post=async (req, res) => {
    const { email, password } = req.body;
    console.log("details",email,password);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
    res.cookie("token",token);
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  }

module.exports.googleAuthCallback=async (req, res) => {
    let user = await User.findOne({ email: req.user.email });

    if (!user) {
      user = new User({
        name: req.user.name,
        email: req.user.email, 
        googleId: req.user.id,
        role: "user",
        image: profile.photos[0].value
        
      });
      await user.save();
    }
    // Generate JWT
    const token = jwt.sign({name:user.name,email:user.email,image:user.image, userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: false, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "Strict", // Prevent CSRF attacks
      maxAge: 60 * 60 * 1000, // 1-hour expiration
    });
    // Redirect user with token to frontend
    res.redirect(`http://localhost:5173/auth-success?token=${token}`);
  }


  module.exports.logout=(req, res) => {
    // Remove cookies
    console.log("logout")
    res.clearCookie('token');
  
    // Send a response indicating successful logout
    res.status(200).json({ message: 'Logged out successfully' });
  }