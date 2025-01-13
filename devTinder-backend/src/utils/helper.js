var validator = require('validator');

const signUpValidate = (req) =>{
    const {firstName, lastName, email, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name Not valid")
    }
    else if(!validator.isEmail(email)){
        throw new Error("Please enter correct email");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong pasword")
    }
}

const validateProfileEditData = (req) =>{
    const allowedKeys = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];
    const isAllowed = Object.keys(req.body).every(data => allowedKeys.includes(data));
    return isAllowed;
}

module.exports = {signUpValidate, validateProfileEditData};