const User = require("../models/user");
const jwt = require('jsonwebtoken');
const userAuth = async(req, res, next) =>{
    try {
        const token = req.cookies.token;
        if(!token){
            throw new Error("Please Login");
        }
        const decodedId = await jwt.verify(token, "testing");
        const {_id} = decodedId;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("No user Exist");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send({status: "Failed", message: error.message})
    }
}

module.exports = userAuth;