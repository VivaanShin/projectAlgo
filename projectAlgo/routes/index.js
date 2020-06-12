var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var isLoggined=require('../scripts/confirmLogin').isLoggedIn;
var session = require('express-session');
var flash = require('connect-flash');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(isLoggined(req)){
    var user={user:req.user};
    console.log("router get:"+user);
    console.log("router get:"+user.user_id);
    console.log("router get:"+user.user_interest_check);

    res.render('home.ejs',user);
  }
  else{

    var message=req.session.message;

    if(typeof message != 'undefined'){

      console.log(message);
      resultData.message=message;
      delete req.session.message;

      res.render('home.ejs',message);
    }
    else{
      res.render('home.ejs');
    }
  }
});


passport.use('local-join', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'pw',
  passReqToCallback: true
}, function (req, email, pw, done) {
  console.log('local-join');
}))

router.post('/register', passport.authenticate('local-join', {
  successRedirect: '/main',
  failureRedirect: '/register',
  failureFlash: true
}));




module.exports = router;
