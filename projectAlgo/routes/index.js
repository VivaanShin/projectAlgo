var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var isNotLoggined=require('../scripts/confirmLogin').isNotLoggedIn;
var session = require('express-session');
var flash = require('connect-flash');
/* GET home page. */
router.get('/', function(req, res, next) {
  var user={};

  if(isNotLoggined(req)){
    user={user:null}
  }
  else{
    user={user:req.user};
  }

  res.render('home.ejs',user);
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
