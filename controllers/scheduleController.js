const Schedule = require("../models/scheduleModel");

// ✅ GET Schedules
module.exports.get_schedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();

        const scheduleArray = schedules.map(schedule => ({
            id: schedule._id,
            filename: schedule.filename,
            description: schedule.description,
            fileUrl: `/schedule/${schedule._id}` // URL to access the file
        }));

        res.json(scheduleArray);
    } catch (error) {
        console.error("Error fetching schedules:", error);
        res.status(500).json({ error: "Failed to retrieve schedules" });
    }
};
// get single schedule

module.exports.get_scheduleByid = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule || !schedule.pdfFile) {
            return res.status(404).json({ error: "Schedule or PDF not found" });
        }

        // Set headers for the response
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${schedule.filename}"`, // or "attachment;" for download
        });

        // Send the PDF file as a binary stream
        res.send(schedule.pdfFile);
    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.status(500).json({ error: "Failed to retrieve schedule" });
    }
};



// ✅ POST Schedule (Handled by Multer in Routes)
module.exports.post_schedule = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No PDF file uploaded" });
        }

        console.log(req.file.originalname);
        const newSchedule = new Schedule({
            filename: req.file.originalname,
            description: req.body.description || "",
            pdfFile: req.file.buffer, // Stores PDF in binary format
        });

        await newSchedule.save();
        res.json({ message: "Schedule uploaded successfully!" });
    } catch (error) {
        console.error("❌ Upload Error:", error);
        res.status(500).json({ error: "Failed to upload schedule" });
    }
};
