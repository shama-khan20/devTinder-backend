const express = require('express');
const bcrypt = require('bcrypt');

const authRouter = express.Router();

const User = require('../models/user.js');
const { signUpValidate } = require('../utils/helper.js');

authRouter.post("/signup", async (req, res) => {
    try {
      //Validate of data
      signUpValidate(req);
      const {firstName, lastName, email, password} = req.body;
      const isEmail = await User.findOne({email});
      if(isEmail){
          throw new Error("User already exist")
      }
      //encrypt password
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({
          firstName,
          lastName,
          email,
          password: hashedPassword
      });
      const token = await isUser.getJWT();
      res.cookie("token" ,token);
      await user.save();
      res.send({status: "Success", message: "User created successfully", });
    } catch (err) {
      res.status(400).send({status: "Failed", message: err.message});
    }
});


authRouter.post("/login", async(req, res) =>{
    try {
    const {email, password} = req.body;
    const isUser = await User.findOne({email});
    if(!isUser){
        throw new Error("Username or password invalid")
    }
    const isPasswordValid = await  isUser.passwordValidate(password);
    if(isPasswordValid){
      const token = await isUser.getJWT();
      res.cookie("token" ,token);
      res.send({status:"Success", message: "Login successful", data: isUser});
    }else{
        throw new Error("Username or password invalid")
    }
    } catch (error) {
        res.status(400).send({status: "Failed", message: error.message})
    }
})

authRouter.post("/logout", async(req, res) =>{
    res.cookie("token", null, {
        expires: new Date(Date.now())
    });
    res.send({status:"Success", message: "Logout successfully"});
})

module.exports = authRouter;