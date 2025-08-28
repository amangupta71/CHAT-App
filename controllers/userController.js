const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const bcrypt = require('bcrypt');


const registerLoad = async(req, res)=>{
    try {
        
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
}
const register = async(req, res)=>{
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);
    
        const user =  new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/' + req.file.filename,
            password: passwordHash,
            
        });

        await user.save();

        return res.render('register',{message:'your registration is completed!'});
    } catch (error) {
        console.log(error.message);
        
}
}

const loadlogin = async(req,res)=>{
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message)
        
    }
}


const login = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
                const passwordMatch = await bcrypt.compare(password,userData.password);
                if(passwordMatch){
                    console.log("user found");
                    req.session.user = userData;
                    console.log("user found with session");
                    return res.redirect('/dashboard');
                }
                else{
                   return res.render('login',{message:'password is Incorrect/wrong!!!'});
                }
        }
        else{
           return res.render('login',{message:'Email and password is Incorrect/wrong!!!'});
        }


        
    } catch (error) {
        console.log(error.message)
        return res.status(500).render('login',{message:'Server Error'});
    }
}


const logout = async(req,res)=>{
    try {

        req.session.destroy();
       return res.redirect('/');
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send('Server Error');
    }
}


const loadDashboard = async(req,res)=>{
    try {
       var users = await User.find({_id:{$nin:[req.session.user._id]}});//this line used to show all users except me
       return res.render('dashboard',{user:req.session.user , users:users});

    } catch (error) {
        console.log(error.message)
        return res.status(500).redirect('/');
    }
}


const saveChat = async(req,res)=>{
    try {
         var chat = new Chat({
            sender_id:req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message,
        });

        var newChat= await chat.save();
        return res.status(200).send({success:true,msg:'Chat inserted', data:newChat});

        
    } catch (error) {
       return  res.status(400).send({success:false,msg:error.message});
        
    }
}

module.exports = {
    registerLoad,
    register,
    loadDashboard,
    loadlogin,
    logout,
    login ,
    saveChat,   
}