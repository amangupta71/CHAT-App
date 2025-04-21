const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    reciver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String,
        required:true
    }
},
{ timestamp:true }
);

module.exports = mongoose.model('Chat',chatSchema)