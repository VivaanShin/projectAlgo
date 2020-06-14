var express = require('express');
var router = express.Router();
var session = require('express-session');
const isAdmin = require('../scripts/confirmAdmin').isAdmin;
const getBlackUserInfo=require('./queryPromise').getBlackUserInfo;
const getBlackUserGradeCountAndAvg=require('./queryPromise').getBlackUserGradeCountAndAvg;
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo',
  database: 'project_algo'
}; //후에 DB설정에 맞게 변경

router.get('/', async (req, res) => {
  var resultData = {};
  if (!isAdmin(req)) {
    return res.redirect('/');
  }

  var connection = mysql.createConnection(dbConfig);
  var resultData = {};
  var memberList = [];

  try {
    var blackInfo = await getBlackUserInfo(connection);
    var gradeInfo = [];

    for (var i=0; i<userInfo.length; i++){
      var blackUser={};
      blackUser.user_id=blackInfo[i].user_id;
      blackUser.user_email=blackInfo[i].user_email;
      blackUser.user_black=blackInfo[i].user_black;
      var blackUsersGradeCountAndAvg =await getBlackUserGradeCountAndAvg(blackUser.user_id,connection);

      blackUser.count=blackUsersGradeCountAndAvg[0].count;
      blackUser.avg=(!blackUsersGradeCountAndAvg[0].avg) ? 0:blackUsersGradeCountAndAvg[0].avg;

      gradeInfo.push(blackUser);



    }

    resultData.gradeInfo=gradeinfo;
    console.log("resultData",resultData);
    /*
    var sql = 'select * from tb_user_black';
    connection.query(sql, function(err, rows, fields) {
      var blackinfo=[];

      for (var i=0; i<rows.length;i++){
        var blackUser={};
        blackUser.user
      }


    })

    */


  } catch (err) {
    console.log(err.message);
    resultData.status = 500;
  } finally {
    res.render('admin_page/block_user.ejs', resultData);
  }
});


router.post('/', async (req, res) => {
  var resultData = {};
  if (!isAdmin(req)) {
    return res.redirect('/');
  }

  var connection = mysql.createConnection(dbConfig);
  var resultData = {};
  var memberList = [];

  try {

  } catch (err) {
    console.log(err.message);
    resultData.status = 500;
  } finally {
    res.render('admin_page/block_user.ejs', resultData);
  }


});




module.exports = router;
