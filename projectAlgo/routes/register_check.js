const request = require('request');
const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config(); //.env파일 사용(인증메일정보)




router.get('/', (req, res) => {
  console.log('register_check join url');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'algoalgo', //dbPassword
    database: 'project_algo'
  });
  connection.connect();

  var user_email = req.param('user_email');
  var user_token = req.param('user_token');
  var sql = 'select `user_token` from `tb_user_info` where `user_email`=? and `user_state`=0';
  connection.query(sql, user_email, function(err, rows, fields) {
    console.log("register_check_rows",rows);
    console.log("register_check_rows_user_token",rows[0].RowDataPacket.user_token);
    if (err) {
      console.log(err);
    } else {
      if (user_token != rows[0].user_token) {

        console.log('token mismatch');
        res.render('register');
      } else {
        var sql2 = 'update `tb_user_info` set `user_state`=1 where `user_email`=? and `user_state`=0';
        connection.query(sql2, [user_email], function(err, rows, fields) {
          if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            console.log("register success!");
            res.redirect('/');
          }
        })
      }
    }
  })

  setTimeout(function() {
    console.log("DB connection end");
    connection.end();
  }, 2000);
})




module.exports = router;
