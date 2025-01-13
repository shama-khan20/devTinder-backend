const mongoose = require('mongoose');


const connectDB = async () =>{
    await mongoose.connect("mongodb+srv://shamaneosoft20:khankhan@cluster0.fdpof.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devTinder")
}

module.exports = connectDB;

// khankhan