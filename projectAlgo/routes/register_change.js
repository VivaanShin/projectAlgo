const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
const isLoggedin = require('../scripts/confirmLogin').isLoggedIn;
const router = express.Router();
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo', //dbPassword
  database: 'project_algo'
};


router.get('/', (req, res) => {
  var resultData = {};
  /*
  if (isLoggedin(req)) { //로그인 정보
    resultData.user = req.user;
  }
  */

  if (isLoggedin(req)) {
    resultData.user = req.user;
    resultData.user.user_interest_check = req.session.user_interest_check;
  }
  var user_id = req.user.user_id;
  console.log("user_id:",user_id);
  var connection = mysql.createConnection(dbConfig);
  connection.connect();
  var sql = 'select * from tb_user_info where `user_id` = ?';
  connection.query(sql, [user_id], function(err, rows, fields) {
    if(err){
      console.log(err);
    }else{
      console.log("success");
      var user_email = rows[0].user_email;
      var user_phone = rows[0].user_phone;
      resultData.searchResult.user_id = user_id;
      resultData.searchResult.user_email = user_email;
      resultData.searchResult.user_phone = user_phone;
      res.render('home', resultData);
      connection.end();
    }


  })








  res.render('register_change', resultData);

});


router.post('/', (req, res) => {
  var resultData = {};
  /*
  if (isLoggedin(req)) { //로그인 정보
    resultData.user = req.user;
  }
  */

  if (isLoggedin(req)) {
    resultData.user = req.user;
    resultData.user.user_interest_check = req.session.user_interest_check;
  }
  console.log("req.body",req.body);
  var user_id = req.user.user_id;
  var user_pw = req.body.user_pw;
  var user_pw_check = req.body.user_pw_check;
  var user_email = req.body.user_email;
  var user_phone = req.body.user_phone;
  var hash_pw;
  var connection = mysql.createConnection(dbConfig);
  connection.connect();

  function userinfo_change(){
    return new Promise(function(resolve, reject){
      if(user_pw == user_pw_check){
        bcrypt.hash(user_pw, null, null, function(err, hash){
          hash_pw = hash
        })
        resolve(hash_pw)
      }
      else {
        console.log(error)
      }
    })
  }
  userinfo_change().then(function(hash_pw){
    return new Promise(function(resolve, reject){
      var sql = 'update tb_user_info set user_pw = ? , user_email = ? , user_phone = ? where user_id = ?';
      var params = [hash_pw, user_email, user_phone, user_id];
      connection.query(sql, params, function(err, results, fields) {
        if(err){
          console.log(err);
        }else{
          console.log("success");
          resolve();
          res.render('home', resultData);
          connection.end();
        }


      })
    })
  }).catch(function(err){
    console.log('error',err);
  })











});

module.exports = router;
