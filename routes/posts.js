const mongoose = require("mongoose");

// mongoose.connect("mongodb:127.0.0.1:27017/pinterest2")
var post=mongoose.Schema({
    posttext:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    userID:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    like:{
        type:Array,
        default:[]
    },
    cretedat:{
        type:Date,
        default:Date.now()
    }
})

module.exports=mongoose.model("postModel",post)