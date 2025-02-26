const Club = require("../models/clubModel");
const multer = require("multer");
const{sendCustomEmail}=require("../utils/emailUtil");
const User=require("../models/userModel");

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
  
      // Fetch all users from the database
      const users = await User.find({}, "email");
      const emails = users.map(user => user.email);
  
      if (emails.length > 0) {
        const subject = `New Club Created: ${name}`;
        const text = `A new club "${name}" has been created. Faculty Coordinator: ${facultyCoordinator}. Student Coordinator: ${studentCoordinator}.`;
        const html = `
            <h2>New Club Created: ${name}</h2>
            <p>${description}</p>
            <p><strong>Faculty Coordinator:</strong> ${facultyCoordinator}</p>
            <p><strong>Student Coordinator:</strong> ${studentCoordinator}</p>
        `;
  
        // Send emails asynchronously
        await Promise.all(emails.map(email => sendCustomEmail(email, subject, text, html)));
      }
  
      // Send response after everything is completed
      res.status(201).json({ message: "Club added successfully and email sent!", club: newClub });
      
    } catch (error) {
      console.error("Error adding club:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


// GET: Fetch all clubs
module.exports.get_clubs = async (req, res) => {
    try {
        const clubs = await Club.find();

        // Format the image properly
        const formattedClubs = clubs.map(club => ({
            ...club._doc,
            logo: `data:image/png;base64,${club.logo}` // Add prefix to Base64 image
        }));

        res.status(200).json(formattedClubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
