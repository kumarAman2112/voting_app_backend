const jwt=require('jsonwebtoken');
require('dotenv').config();
const jwtAuthMiddleware=(req,res,next)=>{
    const authorization=req.headers.authorization;
    if(!authorization){
        res.status(401).json({err:"token not found"});
    }
    const token=req.headers.authorization.split(' ')[1];
    if(!token){
        res.status(401).json({err:"Unauthorized"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.userPayload=decoded;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({err:"Invalid token"});
    }
   
    };

    const generateToken=(payload)=>{
        return jwt.sign(payload,process.env.JWT_SECRET);     
    }
module.exports={jwtAuthMiddleware,generateToken};