var express = require('express');
var router = express.Router();
var session = require('express-session');
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo',
  database: 'project_algo'
}; //후에 DB설정에 맞게 변경

router.get('/', async(req, res) => {
  var resultData = {};
  if(!isAdmin(req)){
      return res.redirect('/');
  }
  console.log('adminBlackMember join');
  res.render('admin_page/block_user.ejs', resultData);
});







module.exports = router;
