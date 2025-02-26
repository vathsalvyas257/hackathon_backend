const Club = require("../models/clubModel");
const multer = require("multer");

// Set up multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

exports.upload = upload;

// Get all clubs
exports.get_clubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
};

// Create a new club
exports.post_club = async (req, res) => {
  try {
    const { name, description, facultyCoordinator, studentCoordinator } = req.body;

    if (!name || !facultyCoordinator || !studentCoordinator) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newClub = new Club({
      name,
      description,
      facultyCoordinator,
      studentCoordinator,
      logo: req.file ? req.file.buffer.toString("base64") : null, // Store as Base64 (or use Cloudinary)
    });

    await newClub.save();
    res.status(201).json({ message: "Club created successfully", club: newClub });

  } catch (error) {
    res.status(500).json({ error: "Error creating club" });
  }
};
