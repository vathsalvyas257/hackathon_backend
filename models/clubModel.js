const mongoose=require("mongoose");

const clubSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:String,
    logo:{
        type:String,
        required:true,
    },
    facultyCoordinator:{
        type:String,
        required:true
    },
    studentCoordinator:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("Club",clubSchema);