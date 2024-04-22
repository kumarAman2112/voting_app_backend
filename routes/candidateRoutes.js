const express=require('express');
const router=express.Router();
const {jwtAuthMiddleware}=require('../jwt');
const Candidate=require('../models/candidate');
const User = require('../models/user');
const checkAdmin=async(userId)=>{
    try{
           const user=await User.findById(userId);
           return user.role==='admin';
    }catch(err){
        return false;
    }
}
router.post('/add',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdmin(req.userPayload.id)){
            res.status(401).json({err:"user is not admin"})
        }
        const candidateData=req.body;
        const newCandidate=new Candidate(candidateData);
        const response=await newCandidate.save();
        res.status(200).json(response)
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
});
router.put('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdmin(req.userPayload.id)){
            res.status(401).json({err:"user is not admin"})
        }
            const candidateId=req.params.candidateId;
            const updatedCandidateData=req.body;
            const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData,{new:true,runValidators:true});
            res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
})
router.delete('/:candidateId',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdmin(req.userPayload.id)){
            res.status(401).json({err:"user is not admin"})
        }
        const candidateId=req.params.candidateId;
        const response=await Candidate.findByIdAndDelete(candidateId);
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
})
router.post("/vote/:candidateId",jwtAuthMiddleware,async(req,res)=>{
    const candidateId=req.params.candidateId;
    const userId=req.userPayload.id;
    try{
            const candidate=await Candidate.findById(candidateId);
            if(!candidate){
                res.status(404).json({err:"Candidate not found"});
            }
            const user=await User.findById(userId);
            if(!user){
                res.status(404).json({err:"User not found"});
            }
            if(user.isVoted){
                res.status(400).json({err:"User already voted"});
            }
            if(user.role==='admin'){
                res.status(400).json({err:"Admin cannot vote"});
            }
        
            candidate.voteCount+=1;
            candidate.votes.push({user:userId});
            await candidate.save();
            user.isVoted=true;
            await user.save();
            res.status(200).json({message:"Voted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
})
router.get('/vote/voteCount',async (req,res)=>{
    try{
          const candidate=await Candidate.find().sort({voteCount:-1});
          const voteRecord=candidate.map((data)=>{
            return {
                party:data.party,
                voteCount:data.voteCount
            }
          });
          res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
})
router.get('/',async(req,res)=>{
    try{
        const candidate=await Candidate.find();
        const record=candidate.map((data)=>{
            return {
                name:data.name,
                party:data.party,
                voteCount:data.voteCount
            }
        });
        res.status(200).json(record);
    }catch(err){
        console.log(err);
        res.status(500).json({err:"Internal server error"});
    }
})
module.exports=router;
    