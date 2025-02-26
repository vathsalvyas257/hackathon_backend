const Schedule = require("../models/scheduleModel");
const { sendCustomEmail } = require("../utils/emailUtil");
const User=require("../models/userModel");

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
 // Ensure you have the correct model path
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

        // Email notification logic
        const users = await User.find({}, "email"); // Fetch only the email field
        const emailList = users.map(user => user.email); // Replace with actual user emails from DB
        const subject = "New Schedule Uploaded!";
        const messageBody = `A new schedule "${req.file.originalname}" has been uploaded.\n\nDescription: ${req.body.description || "No description provided."}`;

        // Send email to all users
        for (const email of emailList) {
            try {
                await sendCustomEmail(email, subject, messageBody);
                console.log(`📧 Email sent to ${email}`);
            } catch (error) {
                console.error(`❌ Failed to send email to ${email}:`, error.message);
            }
        }

        res.json({ message: "Schedule uploaded successfully and emails sent!" });
    } catch (error) {
        console.error(" Upload Error:", error);
        res.status(500).json({ error: "Failed to upload schedule" });
    }
};

exports.delete_schedule = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and delete the schedule
        const deletedSchedule = await Schedule.findByIdAndDelete(id);

        if (!deletedSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        res.status(200).json({ message: "Schedule deleted successfully", schedule: deletedSchedule });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};