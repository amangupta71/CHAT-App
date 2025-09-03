require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const app = require('express')();

const http = require('http').Server(app);

const User = require('./models/userModel');  //for socket 
const Chat = require('./models/chatModel'); // to load old chat

const userRoute = require('./routes/userRoute');
app.use('/',userRoute); //define as middleware

const io = require('socket.io')(http);
var usp = io.of('/user-namespace');

usp.on('connection', async function(socket){
    console.log('User Connected with socket_id');
    //console.log(socket.handshake.auth.token);

    var userId = socket.handshake.auth.token;

    await User.findByIdAndUpdate({_id: userId},{$set:{is_online:'1'}});
     
    //user broadcast online status whole project can listen to this broadcast
    socket.broadcast.emit('getOnlineUser',{user_id: userId});

    socket.on('disconnect', async function(){
        console.log('Usser Disconnected from socket');
        await User.findByIdAndUpdate({_id: userId},{$set:{is_online:'0'}});

    socket.broadcast.emit('getOfflineUser',{user_id: userId});

    });


    //chatting implementation
    socket.on('newChat', function(data){
        socket.broadcast.emit('loadNewChat',data);
    });

    // load old chat
    socket.on('existsChat', async function(data){
          var chats =  await Chat.find({$or:[
                { sender_id : data.sender_id,receiver_id: data.receiver_id },
                { sender_id : data.receiver_id,receiver_id: data.sender_id },
            ]});
            socket.emit('loadChats',{chats:chats});
    });
    });



http.listen(3000, function(){
    console.log('Server is running');
});

