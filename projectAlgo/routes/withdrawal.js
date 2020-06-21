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
  var user_id = req.body.user_id;
  var connection = mysql.createConnection(dbConfig);
  connection.connect();

  var sql = 'delete from tb_user_info where user_id = ?';
  connection.query(sql, [user_id], function(err, rows, fields) {
    console.log("query in");
    if (err) {
      console.log("query err",err);
    } else {
      console.log("회원탈퇴 완료")
      res.redirect(200,'/');

  }});

  connection.end();
});





module.exports = router;
