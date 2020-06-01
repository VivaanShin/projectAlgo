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
  const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678', //dbPassword
    database: 'project_algo'
  });
  conn.connect();

  var user_email = req.param("user_email");
  var user_token = req.param("user_token");

  var sql = `select 'user_token' from tb_user_info where user_email=?`;
  var query = conn.query(sql, [user_email], function(err, rows, fields){
    if(err){
      console.log(err);
    }else{
      if(user_token != rows[0].user_token){
        console.log('token mismatch');
        res.send('token mismatch');
        res.render('/');
      }else{
        var sql2 = `update tb_user_info set user_state=1 where user_email=? `;
        var query2 = conn.query(sql2, [user_email], function(err,rows, fields){
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

conn.end();
})




module.exports = router;
