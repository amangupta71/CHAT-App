require('dotenv').config();

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app');

const app = require('express')();

const http = require('http').Server(app);

const User = require('./models/userModel');//for socket 

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
});

http.listen(3000, function(){
    console.log('Server is running');
});

