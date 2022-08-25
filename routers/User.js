require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const router = new express.Router();
const User = require("../src/models/Users");
const jwt = require("jsonwebtoken");
const { auth } = require("../routers/verifytoken");
// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
const cookieparser = require("cookie-parser");
const nodemailer = require("nodemailer");

//middeleware
router.use(cookieparser());
// //jwt
//  const maxAge = 3*24*60*60;
// const createtoken = (id) => {
//     return jwt.sign({id},'secret',{
//         expiresIn:maxAge
//   });
// }

router.get("/", (req, res) => {
  res.send("API is working properley");
});

router.post("/register", async (req, res) => {
  //check if email exixt already
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exixts");
  const userpassword = req.body.password;
  const otp = Math.floor(Math.floor(100000 + Math.random() * 900000));
  const strongPasswords =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if (strongPasswords.test(userpassword)) {
    //Hash Passwords
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(userpassword, salt);
    const user = new User({
      name: req.body.name,
      rollno: req.body.rollno,
      email: req.body.email,
      password: hashPassword,
      address: req.body.address,
      phone: req.body.phone,
      year: req.body.year,
      branch: req.body.branch,
      gen: req.body.gen,
      isverified: false,
      plainpassword: userpassword,
      otpuser: otp,
    });
    /*const token = jwt.sign({_id:user.id},'secret');
    const token = createtoken(user._id);
    //adding cookie
    res.cookie('jwtg',token,{httpOnly:true,maxAge:maxAge*1000});*/

    console.log(otp);
    user
      .save()
      .then(() => {
        res.status(201).send({
          user: user._id,
          message: "User registered succesfully",
          phone: user.phone,
          rollno: user.rollno,
        });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } else {
    return res.send("Please enter strong password");
  }
});

router.post("/otp-send", async (req, res, next) => {
  const userexixt = await User.findOne({ email: req.body.email });

  if (userexixt) {
    try {
      console.log(userexixt.otpuser);
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "testapi277@gmail.com",
          pass: process.env.pass,
        },
      });
      const mailOptions = {
        from: "testapi277@gmail.com",
        to: userexixt.email,
        subject: "Your otp for verification",
        text: userexixt.otpuser,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Otp sent to your entered email");
        }
      });
      res.status(201).send("otp has been sent to your email");
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  } else {
    res.send("Please enter valid email id");
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("This email is not registred");
  //password is correct

  const validpass = await bcrypt.compare(req.body.password, user.password);
  // const maxAge = 3*24*60*60;
  // const token = await user.generateAuthToken();
  // res.cookie('jwt',token,
  // {httpOnly:true,
  //    exprires:maxAge,
  // });
  if (!validpass) {
    return res.status(400).send("wrong password");
  } else {
    res.send("Login sucess");
    res.status(200).send({ user: user._id });
    //  return res.status(201).send(token);
  }
});

router.get("/register", async (req, res) => {
  try {
    const Usersdata = await User.find();
    res.send(Usersdata);
  } catch (e) {
    res.send(e);
  }
});

router.get("/login", async (req, res) => {
  try {
    const userdetail = await User.find();
    res.send(userdetail);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Forgot password router
router.get("/forgot-password", (req, res, next) => {
  res.send("Password has been lost");
});
router.post("/forgot-password", async (req, res, next) => {
  try {
    const userexixt = await User.findOne({ email: req.body.email });
    if (!userexixt) {
      return res.status(400).send("This email is not registred");
    } else if (userexixt) {
      const orginalpass = userexixt.plainpassword;
      console.log(orginalpass);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "testapi277@gmail.com",
          pass: "process.env.pass",
        },
      });
      const mailOptions = {
        from: "testapi277@gmail.com",
        to: userexixt.email,
        subject: "YOUR ORIGINAL PASSWORD",
        text: userexixt.plainpassword,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Password sent");
        }
      });
      res.status(201).send("Password has been sent to ur email...");
    }
  } catch (err) {
    res.status(400).send("User has been enterd invalid details");
  }
});

router.get("/logout", async (req, res) => {
  // res.cookie('jwt','',{maxAge:1});
  res.redirect("/login");
});

module.exports = router;
//otp generate
/*router.get('/signup', (req,res) => {
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
        //    res.status(200).send('otp has been set to ur phonenumber');
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
            //   res.status(200).send('otp verified');
          }) 
   } else {
       res.status(400).send("Invalid otp")
    }
  })*/
