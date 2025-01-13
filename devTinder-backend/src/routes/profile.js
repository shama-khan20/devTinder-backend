const express = require('express');
const bcrypt = require('bcrypt');
const { validateProfileEditData } = require('../utils/helper.js');
const profileRouter = express.Router();
const User = require('../models/user.js');

const userAuth = require('../middleware/userAuth.js');

profileRouter.get("/profile", userAuth ,async(req, res) =>{
    try {
      const user = req.user
      res.send({status: "Success", data: user})
      
    } catch (error) {
        res.status(400).send({status: "Failed", message: error.message})
    }
})

profileRouter.patch('/profile-edit', userAuth ,async(req, res) =>{
  console.log(req.body);
 try {
  if(!validateProfileEditData(req)){
    throw new Error("Invalid edit request")
  }
  const loggedInUser = req.user;
  Object.keys(req.body).forEach(key => loggedInUser[key]= req.body[key]);
  await loggedInUser.save()
  res.send({message: "Profile updated successfully", status: "Success" ,data: loggedInUser})
 } catch (error) {
  res.status(400).send({status: "Failed", message: error.message})
}
})

profileRouter.patch('/profile/forgot-password', userAuth, async(req, res) =>{
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const loggedinUser = req.user;
    loggedinUser.password = hashedPassword;
    loggedinUser.save();
    res.send({status: "Success", message: "Password updated successfully"})
    
  } catch (error) {
    res.status(400).send({status: "Failed", message: error.message})
  }
})

module.exports = profileRouter;