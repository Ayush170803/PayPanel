require('dotenv').config(); 
const express = require("express");
const app = express();
const connectdb = require('./Config/database');
const cookieParser = require('cookie-parser');
const mainRouter = require("./Routes/index");
const cors = require('cors');


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json()); 
app.use(cookieParser());


app.use('/api/v1',mainRouter);


connectdb().then(()=>{
    console.log("successfully connected to db");

    app.listen(3000,()=>
    {
        console.log("server started at 3000");
    })
}).catch((error) => {
    console.log("database not connected" + error);
  });