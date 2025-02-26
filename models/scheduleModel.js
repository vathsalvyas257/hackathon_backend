const mongoose = require("mongoose");
const ScheduleSchema = new mongoose.Schema({
    filename:{
        type:String,
        required:true
    },
    description:{ 
        type:String},
    pdfFile: {
        type:Buffer,
        required:true // Stores PDF as Binary
    }
});

module.exports=mongoose.model("Schedule",ScheduleSchema);