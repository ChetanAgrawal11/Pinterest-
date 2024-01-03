var express = require('express');
var router = express.Router();
var userModel=require("./users");
var postModel=require("./posts");
const upload=require("./multer");

// Just used for authentication and creation of local strategy
const passport=require("passport");
const localStrategy=require("passport-local");
// const { redirect } = require('express/lib/response');
// passport.authenticate(new localStrategy(userModel.authenticate()));
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/1page', function(req, res, next) {
  res.render('1page');
});

router.post('/upload',isLoggedIn,upload.single('file'),async function(req, res, next) {
  if(!req.file){
    return res.status(404).send("No file created")
  }
  // res.send("File uploaded successfully ")
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  const post=await postModel.create({
    image:req.file.filename,
    posttext:req.body.postcaption,
    userID:user._id,
  })
  user.posts.push(post._id);
  await user.save()
  // res.send("Done image uploaded successfully ");
  res.redirect("/profile");

});

// router.get('/createUser', async function(req, res) {
//  let userdata=await userModel.create({
//   username: "chetan",
//   password: "Chetan",
//   email:"chetan@gmail.com",
 
//   fullname: "chetan Sanjay Agrawal"
//  })
//  res.send(userdata);
// });

// router.get('/display', async function(req, res) {
//   let userdata=await userModel.findOne({_id:"657b15090b340c40eb0731ea"}).populate('posts');
//   res.send(userdata);
//  });


// router.get('/createpost',async function(req, res) {
//  var postcreate= await postModel.create({
//     posttext:"Hello these is my first post please like ",
//     userId:"657b15090b340c40eb0731ea",
//   })
//   res.send(postcreate);
//  var user=await userModel.findOne({_id:"657b15090b340c40eb0731ea"})
//   user.posts.push(postcreate._id);
//   await user.save();


// });
router.get('/profile', isLoggedIn,async function(req, res, next) {
  // res.send("Hello welcome you are successfully logged in ");
  const user= await userModel.findOne({username:req.session.passport.user}).populate("posts");
  console.log(user);
  res.render('profile',{user});
}); 
router.get('/login',function(req, res, next) {
  // console.log(req.flash('error'));
    res.render('login',{error:req.flash('error')});
}); 
router.post('/register', function(req, res) {
  var userdate=new userModel({
    username:req.body.username,
    email: req.body.email,
    fullname:req.body.fullname,
  });

  userModel.register(userdate,req.body.password).then(
    function(){
      passport.authenticate("local")(req,res,function(){
        res.redirect("/profile");
      })
    }
  )
});

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash:true,
}),function(req,res){});

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
  return next();
  }
  res.redirect("/")
}


module.exports = router;
