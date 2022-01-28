const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:6
    },
    rollno:
    {
        type:Number,
        required:true,
        maxlength:13,
        
    },
    password:
    {
       type:String,
       required:true,
       max:1024,
       min:6
    },
    phone:
    {
        type:Number,
        min:10,
        required:true,
        unique:true
    },
    address:
    {
        type:String,
        required:true
    },
    email:
    {
        type:String,
        required:true,
        max:255,
        min:6,
        unique:true,
        lowercase:true

    },
    token:
    {
        type:String,
        reqired:true,
    }
    
    
});

// create new collection

const User = new mongoose.model('User',UserSchema);
module.exports = User; 