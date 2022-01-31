require('dotenv').config();
const express = require('express');
const cors = require('cors');
require("./src/db/conn");
const UserRouter = require("./routers/User")

// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());
app.use(cors());

//middlewares
app.use("/api/users",UserRouter);

const  port = process.env.PORT || 3000;

app.listen(port,()=>
{
    console.log(`connection succesful  at port ${port}`);
})
