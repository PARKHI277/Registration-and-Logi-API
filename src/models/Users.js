const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
  },
  rollno: {
    type: Number,
    required: true,
    maxlength: 13,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  phone: {
    type: Number,
    min: 10,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
    unique: true,
    lowercase: true,
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 2,
  },
  branch: {
    type: String,
    required: true,
  },
  gen: {
    type: String,
    required: true,
  },
  isverified: {
    type: "boolean",
  },
  plainpassword: {
    type: String,
  },
  otpuser: {
    type: String,
  },
});

//validate unique email

// create new collection

const User = new mongoose.model("User", UserSchema);
module.exports = User;
