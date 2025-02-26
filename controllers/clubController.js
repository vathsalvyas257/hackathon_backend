const Club = require("../models/club");
const multer = require("multer");
const{sendCustomEmail}=require("../utils/emailUtil");
const User=require("../models/userModel");

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

        // 📧 Fetch all users from the database
        const users = await User.find({}, "email"); // Retrieve only email fields
        const emails = users.map(user => user.email); // Extract emails as an array

        // Send email notification to all users
        if (emails.length > 0) {
            const subject = `New Club Created: ${name}`;
            const text = `A new club "${name}" has been created. Faculty Coordinator: ${facultyCoordinator}. Student Coordinator: ${studentCoordinator}.`;
            const html = `
                <h2>New Club Created: ${name}</h2>
                <p>${description}</p>
                <p><strong>Faculty Coordinator:</strong> ${facultyCoordinator}</p>
                <p><strong>Student Coordinator:</strong> ${studentCoordinator}</p>
            `;

            // Send emails asynchronously to all users
            const emailPromises = emails.map(email => sendCustomEmail(email, subject, text, html));
            await Promise.all(emailPromises);
        }

        res.status(201).json({ message: "Club added successfully and email sent!", club: newClub });
    } catch (error) {
        console.error("Error adding club:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
;


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
