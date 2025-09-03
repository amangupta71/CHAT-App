const express = require('express');
const user_route = express();

const bodyParser = require('body-parser');

const session = require('express-session');
const{ SESSION_SECRET } = process.env;
user_route.use(session({ 
    secret:SESSION_SECRET,
    resave: false,         
    saveUninitialized: false }));

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine', 'ejs');
user_route.set('views','./views');

//this is static folder
user_route.use(express.static('public'));


const path = require('path');
// const multer = require('multer');


// const storage = multer.diskStorage({
//     destination:function(req,file,cb){ 
//         cb(null , path.join(__dirname, '../public/images'));
//     },
//     filename:function(req,file,cb){
//         const name = Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
// });

// const upload = multer({storage:storage});

const userController = require('../controllers/userController');

//middleware
const auth = require('../middlewares/auth');

user_route.get('/', auth.isLogout, (req, res) => {
  res.render('home');     // Render the new homepage with buttons
});

user_route.get('/register', auth.isLogout, userController.registerLoad);
//user_route.post('/register',upload.single('image'), userController.register);
user_route.post('/register', userController.register);


user_route.get('/login',auth.isLogout,userController.loadlogin);
user_route.post('/login',userController.login);


user_route.get('/logout', auth.isLogin,userController.logout);

const User = require('../models/userModel'); // add this at the top of your route file

user_route.get('/dashboard', auth.isLogin, async (req, res) => {
  try {
    // fetch all users except current logged in user
    const users = await User.find({ _id: { $nin: [req.session.user._id] } });
    res.render('dashboard', { user: req.session.user, users: users, showSlider: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


user_route.post('/save-chat', userController.saveChat)

//if user any thing which is not defined then it goes to login page
user_route.get('/*all', function(req, res) {
    res.redirect('/');
  });

  


module.exports = user_route;