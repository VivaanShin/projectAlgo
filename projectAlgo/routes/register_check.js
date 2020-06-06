const request = require('request');
const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const router = express.Router();
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config(); //.env파일 사용(인증메일정보)




router.get('/', (req, res)=>{
  console.log('register_check join url');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'algoalgo', //dbPassword
    database: 'project_algo'
  });
  connection.connect();

  var user_email = req.params("user_email");
  var user_token = req.params("user_token");

  var sql = 'select `user_token` from `tb_user_info` where `user_email`=?';
  var query = connection.query(sql, [user_email], function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      if(user_token != rows[0].user_token){
        console.log('token mismatch');
        res.render('/');
      }else{
        var sql2 = `update tb_user_info set user_state=1 where user_email=? `;
        var query2 = connection.query(sql2, [user_email], function(err,rows, fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            console.log("register success!");
            res.render('/');
          }
        })
      }
    }
  })

connection.end();
})




module.exports = router;
