const express = require('express');
const bcrypt = require('bcryptjs');
const router = new express.Router();
const User = require("../src/models/Users");
const jwt = require('jsonwebtoken');
var checkauth = require('../routers/verifytoken');
 const dotenv = require('dotenv'); 
 dotenv.config();


 router.post("/register",async(req,res)=>
{      
    //check email exixt
    const  emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exixts');
    
    const userpassword = req.body.password;
    const strongPasswords = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if(strongPasswords.test(userpassword))
    {
    //Hash Passwords
    const salt =  await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userpassword,salt);
    const user = new User({
       name:req.body.name,
        rollno:req.body.rollno,
        email:req.body.email,
        password:hashPassword,
        address:req.body.address,
        phone:req.body.phone
      } 
       );
   user.save().then(()=>
   {  
       res.status(201).send({
         user:user._id,
         message : "User registered succesfully",
         password:hashPassword
        });
   }).catch((e)=>{
       res.status(400).send(e);
   })
}
else
{
    res.send("Weak password");
}


});

router.post("/login",async(req,res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("This email is not registred");
    //password is correct
    const validpass = await bcrypt.compare(req.body.password,user.password);
    if(!validpass)
    {
     return res.status(400).send('wrong password');
    }
    else
    { 
     res.send("Login sucess");
     const token = jwt.sign({_id:user.id},'secret');
     res.header("auth-token",token).send(token);
    }
})

router.get("/register",async(req,res)=>
{
     try{
         const Usersdata = await User.find();
         res.send(Usersdata);
     }catch(e)
     {
      res.send(e);
     }
})
module.exports = router;

