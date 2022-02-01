require('dotenv').config();
const express = require('express');
const cors = require('cors');
require("./src/db/conn");
const UserRouter = require("./routers/User")

// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());
app.use(cors());

// app.use((req ,res ,next)=>{
//     res.setHeader('Access-Control-Allow-Origin','*');
//     res.setHeader('Access-Control-Allow-Methods',
//     'OPTION,GET,POST,PUT,PATCH,DELETE');
//     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
//     next();
// })

//middlewares
app.use("/api/users",UserRouter);

const  port = process.env.PORT || 3000;

app.listen(port,()=>
{
    console.log(`connection succesful  at port ${port}`);
})
