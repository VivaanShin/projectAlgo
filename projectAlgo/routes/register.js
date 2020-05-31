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



//라우터 처리
router.get('/', (req, res)=>{
  console.log('get join url');//로그인 인증 실패시 다시 이리로 들어옴.
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('register.ejs',{'message' : msg})
});

//serialize 처리 해주어야함.(세션에 넣어줘야함)
passport.serializeUser(function(user, done){
  console.log('passport session save : ', user.id)
  done(null, user.id);
});

//요청시 세션값 뽑아서 페이지 전달
passport.deserializeUser(function(id, done){
  console.log('passport session get id : ', id)
  done(null, id);
})



//user_id, user_email, user_pw, user_pw_check, user_phone,

passport.use('local-join', new LocalStrategy({
  usernameField: 'user_id',
  passwordField: 'user_pw',
  passReqToCallback: true
}, function (req, user_id, user_email, user_pw, user_pw_check, user_phone, done) {
  var sql = 'select * from test where user_id =?';
  var query = client.query(sql, [user_id], function (err, datas) {
    if (err) return done(err);
    if (datas.length) {
      console.log('existed user');
      return done(null, false, {
        message: 'your user_id is already used'
      });
    } else {
        if (user_pw != user_pw_check ){
          console.log('password mismatch');
          return done(null, false, {
            message: 'your password is mismatch'
          });
        }else {
          bcrypt.hash(user_pw, null, null, function(err, hash) {
                        console.log("user_hash="+hash);
                    });
          var sql = 'insert into tb_user_info(user_id, user_pw, user_phone, user_email, user_state) values(?,?,?,?,?)';
          var query = client.query(sql, [user_id, user_pw, user_phone, user_email, 0], function (err, datas) {
            if (err) return done(err);
            return done(null, user_id)
          });
        }
      //현재 여기서 이메일 인증이 이루어진다음 패스워드 넣는건

    }
  })
}))

/*
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
*/

module.exports = router;