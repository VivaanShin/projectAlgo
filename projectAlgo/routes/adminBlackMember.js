var express = require('express');
var router = express.Router();
var session = require('express-session');
const isLoggedin = require('../scripts/confirmLogin').isLoggedIn;
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo',
  database: 'project_algo'
}; //후에 DB설정에 맞게 변경

router.get('/', (req, res) => {
  var resultData = {};
  if (isLoggedin(req)) {
    resultData.user = req.user;
    resultData.user.user_interest_check = req.session.user_interest_check;
  }
  console.log('adminBlackMember join');
  res.render('block_user', resultData);
});







module.exports = router;
