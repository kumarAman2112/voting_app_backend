const express=require('express');
const app=express();
const db=require('./db');
const bodyParser=require('body-parser');
app.use(bodyParser.json());
const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');
require('dotenv').config();
const PORT=process.env.PORT||3000;
app.use('/user',userRoutes)
app.use('/candidate',candidateRoutes)
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});