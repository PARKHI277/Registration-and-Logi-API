const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin_parkhi:Parkhi123@cluster0.ycvd3.mongodb.net/userdata",{useNewUrlParser:true},()=>
    console.log("Successfully connected to mongodb database")
   
  
);