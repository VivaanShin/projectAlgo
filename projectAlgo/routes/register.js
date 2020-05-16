const mysql=require('mysql');
const express=require('express');
const bcrypt = require('bcrypt-nodejs');
const router=express.Router();
const fs=require('fs');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : '12345678', //dbPassword
    database : 'project_algo'
};
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');


passport.use('local-join', new LocalStrategy({
  usernameField: 'user_id',
  passwordField: 'pw',
  passReqToCallback: true
}, function (req, user_id, pw, done) {
  var sql = 'select * from test where user_id =?';
  var query = client.query(sql, [user_id], function (err, datas) {
    if (err) return done(err);
    if (datas.length) {
      console.log('existed user');
      return done(null, false, {
        message: 'your user_id is already used'
      });
    } else {

      var sql = 'insert into test(user_id, pw) values(?,?)';
      var query = client.query(sql, [user_id, pw], function (err, datas) {
        if (err) return done(err);
        return done(null, user_id)
      });
    }
  })
}))

router.get('/', function (req, res, next) {

  res.render('register', {
    title: 'register'
  });
});


module.exports = router;
