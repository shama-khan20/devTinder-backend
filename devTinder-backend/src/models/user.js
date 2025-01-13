const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 12
    },
    lastName: {
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id" + value)
            }
        }
    },
    password:{
        type: String,
        required: true,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
       
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqS1zzmq7mg7JtFBexXgM9NWrR_DEjJkvp8g&s',
        // validate(value){
        //     if(!validator.isEmail(value)){
        //         throw new Error("Invalid Photo url" + value)
        //     }
        // }
    },
    about: {
        type: String,
        default: "This is the default detail of the user"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
})

userSchema.methods.passwordValidate = async function(password){
        const user = this;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid
}

userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id},"testing");
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;