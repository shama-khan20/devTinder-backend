const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectRequestSchema = new Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"

    },
    status: {
        type: String,
        enum:{
            values: ["ignored", "interested", "accepted", "rejected", "pending"],
            message: `{Value} is not status type`
        },
        required: true
    }
},{
    timestamps: true
})


connectRequestSchema.pre('save', function(next){
    const connectRequest = this;
    if(connectRequest.fromUserId.equals(connectRequest.toUserId)){
        return resizeBy.status(401).json({status: "Failed", message: "Request can't send to yourself"})
    }
    next();
})

const ConnectRequest = mongoose.model("ConnectRequest",connectRequestSchema);
module.exports = ConnectRequest;