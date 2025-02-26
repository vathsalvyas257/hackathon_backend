const express = require("express");
const multer = require("multer");
const scheduleController = require("../controllers/scheduleController");

const router = express.Router();

// Multer setup for storing files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all schedules
router.get("/", scheduleController.get_schedules);
router.get("/:id",scheduleController.get_scheduleByid);

// POST a new schedule (Apply multer middleware)
router.post("/", upload.single("pdfFile"), scheduleController.post_schedule);

module.exports = router;
