const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

//Send connection request api
requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res) => {
   
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignored','interested'];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message:"invalid status type" + status})
        }

        //check if the user whome request is sent is present in DB or not.
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            return res.status(404).json({message:"User not Found"});
        }

        //check if there is an existing connection request
        const checkExistingConnectionRequest =await ConnectionRequest.findOne({
            $or :[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });
        if(checkExistingConnectionRequest) {
            return res.status(400).send({message:"COnnection Request already exists !"})
        }



        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });


        const data = await connectionRequest.save();
        res.json({
            message:'connection req sent successfully',
            data
        });

    }catch(err){
        res.status(400).send('ERROR'+err.message);
    }

});

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=> {

    try{
        const loggedInUser = req.user;
        const {status,requestId } = req.params;

        //validate the status
        const allowedStatus = ["accepted","rejected"];
        if(!allowedStatus.includes(status)) {
            return res.send(400).send({message:"Status is incorrect"})
        }
        
        //loggedInUSer id should be toUserId
        //status should be interested
        const connectionRequest =  await ConnectionRequest.findOne({
            fromUserId:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        });

        if(!connectionRequest){
            res.status(404).send({message:"connection req. not found"});
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.send({
            message: "connection request " + status,
            data
        })

    }catch(err){
        res.status(400).send('ERROR '+err.message);
    }

});

module.exports = {requestRouter};