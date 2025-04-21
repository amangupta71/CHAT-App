const mongoose = require('mongoose');
var chatSchema= mongoose.Schema({
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
         },
    

},
{timestamps:true}
);


module.exports = mongoose.model('Chat',chatSchema);