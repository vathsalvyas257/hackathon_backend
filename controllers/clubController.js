const Club = require("../models/club");
const multer = require("multer");

// Configure Multer to store image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports.upload = upload; // Export multer upload middleware

// POST: Add a new club
module.exports.post_club = async (req, res) => {
    try {
        const { name, description, facultyCoordinator, studentCoordinator } = req.body;
        
        // Check if required fields are present
        if (!name || !facultyCoordinator || !studentCoordinator || !req.file) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        // Convert image to Base64
        const logoBase64 = req.file.buffer.toString("base64");

        // Create a new club instance
        const newClub = new Club({
            name,
            description,
            logo: logoBase64, // Store Base64 image
            facultyCoordinator,
            studentCoordinator
        });

        // Save to database
        await newClub.save();

        res.status(201).json({ message: "Club added successfully!", club: newClub });
    } catch (error) {
        console.error("Error adding club:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET: Fetch all clubs
module.exports.get_clubs = async (req, res) => {
    try {
        const clubs = await Club.find();
        res.status(200).json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
