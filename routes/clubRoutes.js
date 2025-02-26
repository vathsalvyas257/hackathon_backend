const express = require("express");
const router=express.Router();
const clubController=require("../controllers/clubController");


router.get("/",clubController.get_clubs);
router.post("/", clubController.upload.single("logo"), clubController.post_club);

module.exports=router;