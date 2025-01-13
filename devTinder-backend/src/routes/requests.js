const express = require('express');
const userAuth = require('../middleware/userAuth.js');
const ConnectRequest = require('../models/connectRequest.js');
const User = require('../models/user.js');

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:userId", userAuth, async(req, res) =>{
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)){
        return res.status(401).json({status: "Failed", message: `${status} not acceptable`})

      }
      const toUserIdExist = await User.findById({_id:toUserId});
      if(!toUserIdExist){
        return res.status(401).json({status: "Failed", message: `touserid does not exist`})
      }
    
      const existingRequest = await ConnectRequest.findOne({$or: [
        {fromUserId, toUserId}, {fromUserId:toUserId, toUserId: fromUserId}]});
      if(existingRequest){
        return res.status(401).json({status: "Failed", message: `Request already sent`})
      } 
      if(fromUserId != toUserId){
        const connectionRequest = await new ConnectRequest({
          fromUserId, toUserId, status
        })
        const data = await connectionRequest.save();
        res.json({Status: "Success", message: `Connection request ${status}`, data: data})


      }else{
        return res.status(401).json({status: "Failed", message: `Request can't  send to themself`})
      }
     
     
     
    } catch (error) {
      res.status(400).send({status: "Failed", message: error.message})
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) =>{
  const { status, requestId} = req.params;
  const loggedInUser = req.user._id;
  const allowedStatus = ["accepted", "rejected"];
  const isAllowedStatus = allowedStatus.includes(status);
  if(!isAllowedStatus){
    return res.status(400).send({status: "Failed", message: "No Status Found"})
  }
  const user = await ConnectRequest.findOne({
    _id: requestId,
    status: "interested",
    toUserId: loggedInUser
  })
 
  if(!user){
    return res.status(400).send({status: "Failed", message: "No User Found"})
  }
   user.status = status;
   const data = await user.save()
  res.status(201).json({Status: "Success", message: "Request "+ status, data: data })
})

module.exports = requestRouter;  