const express = require('express');
const userAuth = require('../middleware/userAuth');
const userRouter = express.Router();
const ConnectRequest = require('../models/connectRequest.js');
const User = require('../models/user.js');

userRouter.get('/request/recieved', userAuth ,async(req, res) =>{
  try {
    const loggedInUser = req.user;
    const userList = await ConnectRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
    }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "photoUrl"])
    res.status(201).json({Status: "Success", message: "Data fetched successfully", data: userList})
  } catch (error) {
    res.status(400).send({status: "Failed", message: error.message})
  }
})

userRouter.get('/user/connection', userAuth, async(req, res) =>{
    try {
        const loggedInUser = req.user;
        const connections = await ConnectRequest.find({$or:[
            {fromUserId: loggedInUser._id, status: "accepted"},
            {toUserId: loggedInUser._id, status: "accepted"}
        ]})
        .populate("fromUserId", "firstName lastName photoUrl age about gender")
        .populate("toUserId", "firstName lastName photoUrl age about gender");
        const data = connections.map(connection => {
            if(connection.fromUserId.equals(loggedInUser._id)){
                return connection.toUserId
            }
            return connection.fromUserId;
        });

        
        res.status(201).json({Status: "Success", message: "Data fetched successfully", data})
    } catch (error) {
        res.status(400).send({status: "Failed", message: error.message})
    }
})


userRouter.get('/user/feed', userAuth, async(req, res) =>{

    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) ||1;
        const limit = parseInt(req.query.limit) || 2;
        limit > 50 ? 50: limit;
         const skip = (page-1)*limit;

        const connectionRequest = await ConnectRequest.find({$or:[
            {fromUserId: loggedInUser._id},
            {toUserId: loggedInUser._id}
        ]}).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequest.forEach(req =>{
            hideUserFromFeed.add(req.fromUserId.toString());
            hideUserFromFeed.add(req.toUserId.toString());
        })

        const users = await User.find({
          $and:  [{_id: {$nin: Array.from(hideUserFromFeed)}} , {_id: {$ne: loggedInUser._id}}]
        }).select("firstName lastName photoUrl about").skip(skip).limit(limit)
        res.status(201).send(users);


        
    } catch (error) {
        res.status(400).send({status: "Failed", message: error.message})
    }

})

module.exports = userRouter;