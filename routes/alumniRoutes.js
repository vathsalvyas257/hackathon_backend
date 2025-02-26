const express = require("express");
const router = express.Router();
const Alumni = require("../models/alumniModel");
const multer = require("multer");

// Multer storage setup (store file in memory, then convert to Base64)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ POST Route: Add Alumni with Base64 Image
router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name, email, package, url, jobRole } = req.body;
        const file = req.file;

        if (!name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        let imageBase64 = null;
        if (file) {
            imageBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`; // Convert to Base64
        }

        const newAlumni = new Alumni({
            name,
            email,
            image: imageBase64, // Store Base64 string in DB
            package,
            url,
            jobRole
        });

        await newAlumni.save();
        res.status(201).json({ message: "Alumni added successfully", alumni: newAlumni });

    } catch (error) {
        console.error("Error adding alumni:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/// ✅ GET Route: Fetch All Alumni
router.get("/", async (req, res) => {
    try {
        const alumniList = await Alumni.find();
        res.status(200).json(alumniList);
    } catch (error) {
        console.error("Error fetching alumni:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;


module.exports = router;
