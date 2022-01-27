const express = require('express');
const port = process.env.PORT || 3000;
require("./db/conn");
const UserRouter = require("../routers/User")

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/users",UserRouter);

app.listen(port,()=>
{
    console.log(`connection succesful  at port ${port}`);
})
