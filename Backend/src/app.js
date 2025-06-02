require('dotenv').config(); 
const express = require("express");
const app = express();
const connectdb = require('./Config/database');
const cookieParser = require('cookie-parser');
const mainRouter = require("./Routes/index");
const cors = require('cors');
const {Timetaken} = require('./Middlewares/Timetaken');
const client = require("prom-client");
const { metricsMiddleware } = require('./metrics/index.js');


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json()); 
app.use(cookieParser());
app.use(Timetaken);
app.use(metricsMiddleware);


app.use('/api/v1',mainRouter);

app.get("/metrics",async (req, res)=>
{
    const metrics=await client.register.metrics();
    res.set('Content-Type',client.register.contentType);
    res.end(metrics);
})



connectdb().then(()=>{
    console.log("successfully connected to db");

    app.listen(3000,()=>
    {
        console.log("server started at 3000");
    })
}).catch((error) => {
    console.log("database not connected" + error);
  });