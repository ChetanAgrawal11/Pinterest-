


const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pinterest")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"postModel",
    }
  ],
  dp: {
    type: String, // Assuming dp is a URL to the user's profile picture
  },
  fullname: {
    type: String,
  },
});

// Create the User model

userSchema.plugin(plm);
module.exports=  mongoose.model('User', userSchema);

// Export the User model


// const mongoose=require("mongoose");
// var schema2=mongoose.Schema({
//   username:
//   {
//     type:String,
//     required:true,
//     unique:true
//   }
// })
// module.exports=mongoose.model(schema2,"userModel")