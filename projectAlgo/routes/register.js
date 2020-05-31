const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const fs = require('fs');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345678', //dbPassword
  database: 'project_algo'
};
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');



router.get('/', function(req, res, next) {
  res.render('register.ejs', {
    title: 'register'
  });
});


router.post('/idcheck', function(req, res, next) {
  console.log('req.body: ', req.body);
  var id = req.body.user_id;

  function idcheck(id){
    return new Promise(function(resolve, reject) {
    var sql = 'SELECT * FROM `tb_user_info` WHERE `user_id`=?';
    var dbOptions = {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database
    };
    var conn = mysql.createConnection(dbOptions);
    console.log(dbOptions);
    conn.connect();
    conn.query(sql, id, function(err, results, fields) {
      if (err) {
        console.log(err);
      }
      if (!results[0]) {
        console.log("중복없음")
        return res.send('아이디 사용이 가능합니다!');
      }
    })
  })
};
});

/*
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
      //현재 여기서 이메일 인증이 이루어진다음 패스워드 넣는건
      var sql = 'insert into test(user_id, pw) values(?,?)';
      var query = client.query(sql, [user_id, pw], function (err, datas) {
        if (err) return done(err);
        return done(null, user_id)
      });
    }
  })
}))
*/




module.exports = router;
