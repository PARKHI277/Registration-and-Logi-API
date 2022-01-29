require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const router = new express.Router();
const User = require("../src/models/Users");
const jwt = require('jsonwebtoken');
const {auth}= require('../routers/verifytoken');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
const cookieparser = require("cookie-parser");
const nodemailer = require('nodemailer');


//middeleware
router.use(cookieparser());

//jwt

// const maxAge = 3*24*60*60;
// const createtoken = (id) => {
//     return jwt.sign({id},'secret',{
//         expiresIn:maxAge
//     });
// }

 router.post("/register",async(req,res)=>
{      
    //check email exixt
    const  emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exixts');
    
    const plainpassword = req.body.password;
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
    //    const token = jwt.sign({_id:user.id},'secret');
    // const token = createtoken(user._id);
    // res.cookie('jwtg',token,{httpOnly:true,maxAge:maxAge*1000});
    user.save().then(()=>
   {  
       res.status(201).send({
         user:user._id,
         message : "User registered succesfully",
         password:plainpassword,
        //  token:token
        });
   }).catch((e)=>{
       res.status(400).send(e);
   })
}
else
{
    res.send("Please enter strong password");
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
        //  const token = createtoken(user._id);
        //  res.cookie('jwtg',token,{httpOnly:true,maxAge:maxAge*1000});
         res.status(200).send({user:user._id});
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

router.get("/login",async(req,res)=>
{
    try{
        const userdetail = await User.find();
        res.send(userdetail);
          }catch(err)
          {
          res.status(400).send(err); 
          }
})

//otp generate
router.get('/signup', (req,res) => {
    if (req.query.phonenumber) {
       client
       .verify
       .services(process.env.TWILIO_SERVICE_SID)
       .verifications
       .create({
           to: `+${req.query.phonenumber}`,
           channel: req.query.channel
       })
       .then(data => {
           res.status(200).send(data);
       })
      }
       else {
        res.status(400).send("wrong phone number")
     } 
  })
  
  //otp verify
  router.get('/verify', (req, res) => {
    if (req.query.phonenumber && req.query.code) {
        client
            .verify
            .services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({
                to: `+${req.query.phonenumber}`,
                code: req.query.code
            })
            .then(data => {
              res.status(200).send(data);
          }) 
   } else {
       res.status(400).send("Invalid otp")
    }
  })

  //Forgot password rout

    router.get("/logout",async(req,res)=>{
        // res.cookie('jwt','',{maxAge:1});
        res.redirect('/login');
    })
module.exports = router;