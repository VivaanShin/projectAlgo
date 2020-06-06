const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config(); //.env파일 사용(인증메일정보)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo', //dbPassword
  database: 'project_algo'
};
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');
var twoFactor = require('node-totp');


router.post('/', passport.authenticate('local-join', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  }), // 인증 실패 시 401 리턴
  function(req, res) {
    console.log("redirect")
    res.redirect('/');
  });


//라우터 처리
router.get('/', (req, res) => {
  console.log('get join url'); //로그인 인증 실패시 다시 이리로 들어옴.
  var msg;
  var errMsg = req.flash('error');
  if (errMsg) msg = errMsg;
  res.render('register', {
    'message': msg
  })
});

//serialize 처리 해주어야함.(세션에 넣어줘야함)
passport.serializeUser(function(user, done) {
  console.log('passport session save : ', user.id)
  done(null, user.id);
});

//요청시 세션값 뽑아서 페이지 전달
passport.deserializeUser(function(id, done) {
  console.log('passport session get id : ', id)
  done(null, id);
})



//user_id, user_email, user_pw, user_pw_check, user_phone,

passport.use('local-join', new LocalStrategy({
  usernameField: 'user_id',
  passwordField: 'user_pw',
  passwordcheckField: 'user_pw_check',
  emailField: 'user_email',
  phoneFiled: 'user_phone',
  passReqToCallback: true
}, function(req, user_id, user_pw, done) {
  console.log("local-join in");
  console.log(req.body);
  var user_id = req.body.user_id;
  var user_pw = req.body.user_pw;
  var user_pw_check = req.body.user_re_pw;
  var user_email = req.body.user_email;
  var user_phone = req.body.user_phone;
  console.log("user_id: ", user_id);
  console.log("user_pw: ", user_pw);
  console.log("user_pw_check: ", user_pw_check);
  console.log("user_email: ", user_email);
  console.log("user_phone: ", user_phone);
  var connection = mysql.createConnection(dbConfig);
  connection.connect();
  var sql = 'select * from tb_user_info where user_id =?';
  connection.query(sql, [user_id], function(err, datas) {
    if (err) return done(null, false, {
      message: 'DB error'
    });
    if (datas.length) {
      console.log('existed user');
      return done(null, false, {
        message: 'your user_id is already used'
      });
    } else {
      if (user_pw != user_pw_check) {
        console.log('password mismatch');
        return done(null, false, {
          message: 'your password is mismatch'
        });
      } else {
        console.log("등록절차")
        // 이메일 인증 토큰값 생성
        var newSecret = twoFactor.generateSecret();
        var newToken = twoFactor.generateToken(newSecret.secret);
        var user_token = newToken.token;
        var email_url = 'ec2-3-34-124-6.ap-northeast-2.compute.amazonaws.com' + '/register_check' + '?user_email=' + user_email + '&user_token=' + user_token;

        //비밀번호 해쉬값변경
        bcrypt.hash(user_pw, null, null, function(err, hash) {
          console.log("user_hash=" + hash);
        });

        //DB에 회원정보 저장
        var sql2 = 'insert into tb_user_info(user_id, user_pw, user_phone, user_email, user_state, user_token) values(?,?,?,?,?,?)';
        var params2 = [user_id, user_pw, user_phone, user_email, 0, user_token];
        console.log("params2", params2);
        //var query2 =
        connection.query(sql2, params2, function(err, rows, fields) {
          if (err) {
            return done(null, false, {
              message: 'DB2 error'
            });
          } else {
            console.log("회원정보 입력 데이터", rows.insertId);
            return done(null, user_id)
          }

        });

        function sendMail(user_email, email_url) {
          const mailConfig = {
            service: 'Naver',
            host: 'smtp.naver.com',
            port: 587,
            auth: {
              user: process.env.MAIL_EMAIL,
              pass: process.env.MAIL_PASSWORD
            }
          }
          let message = {
            from: process.env.MAIL_EMAIL,
            to: user_email,
            subject: '알고뽑자사이트 이메일 인증 요청 메일입니다.',
            html: '<p><h1>해당 url 클릭시 인증이 완료됩니다. </h1> </p>' + email_url
          }
          let transporter = nodemailer.createTransport(mailConfig);
          transporter.sendMail(message);


        };
        sendMail(user_email, email_url);

        /*
                  async sendMail(user_email) {
                    try {
                      const mailConfig = {
                        service: 'Naver',
                        host: 'smtp.naver.com',
                        port: 587,
                        auth: {
                          user: process.env.MAIL_EMAIL,
                          pass: process.env.MAIL_PASSWORD
                        }
                      }
                      let message = {
                        from: process.env.MAIL_EMAIL,
                        to: user_email,
                        subject: '알고뽑자사이트 이메일 인증 요청 메일입니다.',
                        html: '<p><h1>해당 url 클릭시 인증이 완료됩니다. </h1> </p>' + email_url
                      }
                      let transporter = nodemailer.createTransport(mailConfig);
                      transporter.sendMail(message);

                    } catch (error) {
                      console.log(error)
                    }
                  }
        */
        setTimeout(function() {
          console.log("DB connection end");
          connection.end();
        }, 20000);
        //connection.end();
        //res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/";</script>');
      }
    }
  })
}))


module.exports = router;
