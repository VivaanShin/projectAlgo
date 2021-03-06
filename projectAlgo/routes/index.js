var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var isLoggined=require('../scripts/confirmLogin').isLoggedIn;
var session = require('express-session');
var flash = require('connect-flash');
/* GET home page. */
router.get('/', function(req, res, next) {
  var nowUrl=req.session.nowUrl;
  if(typeof nowUrl != 'undefined'){
    delete req.session.nowUrl;
  }
  
  if(isLoggined(req)){
    var user={user:req.user};
    user.user.user_interest_check=req.session.user_interest_check;
    res.render('home.ejs',user);
  }
  else{ 
    res.render('home.ejs');
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
