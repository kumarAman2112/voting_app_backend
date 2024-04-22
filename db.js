const mongoose=require('mongoose');
require('dotenv').config();
const MONGODB_URL=process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL);
const db=mongoose.connection;
db.on("connected",()=>{
    console.log("server is connected to mongodb");
})
db.on("disconnected",()=>{
    console.log("server is disconnected to mongodb");
})
db.on("error",()=>{
    console.log("error in connecting to mongodb");
})
module.exports=db;
