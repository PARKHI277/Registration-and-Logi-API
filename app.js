const express = require('express');
const port = process.env.PORT || 3000;
require("./src/db/conn");
const UserRouter = require("./routers/User")


const dotenv = require('dotenv');

dotenv.config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(express.json());


app.use("/api/users",UserRouter);

console.log(process.env.TWILIO_SERVICE_SID);

app.listen(port,()=>
{
    console.log(`connection succesful  at port ${port}`);
})
