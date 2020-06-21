var express = require('express');
var router = express.Router();
var session = require('express-session');
const isLoggedin = require('../scripts/confirmLogin').isLoggedIn;
const getPoliticianinfoByName = require('./queryPromise').getPoliticianinfoByName;
const getPoliticianInterestByNo = require('./queryPromise').getPoliticianInterestByNo;
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo',
  database: 'project_algo'
}; //후에 DB설정에 맞게 변경

router.post('/', async (req, res) => {
  var resultData = {};

  if (isLoggedin(req)) {
    resultData.user = req.user;
    resultData.user.user_interest_check = req.session.user_interest_check;
  }
  var politician_name = req.body.politician_name;
  var connection = mysql.createConnection(dbConfig);
  connection.connect();
  try {

    var sql = 'select * from tb_politician_info where politician_name = ?';
    var searchResult = [];

    var politician_info = await getPoliticianinfoByName(politician_name);
    if (politician_info.length == 0) {
      console.log("검색결과 없음")
      searchResult.state = '1';
      resultData.searchResult = searchResult;
    } else {
      console.log("politician_info",politician_info);
      var politician = {
        politician_no: politician_info[0].politician_no,
        politician_name: politician_info[0].politician_name,
        jdName: politician_info[0].jdName,
        birthday: politician_info[0].birthday,
        career1: politician_info[0].career1,
        career2: politician_info[0].career2,
        img: "/images/" + politician_info[0].politician_no + ".jpg",
        link: "/politician/" + politician_info[0].politician_no
      };
      var politician_interest = await getPoliticianInterestByNo(politician_info[0].politician_no, connection); //정치인 관심사 정보를 가져옴
      politician.itScience = politician_interest[0].itScience;
      politician.economy = politician_interest[0].economy;
      politician.culture = politician_interest[0].culture;
      politician.society = politician_interest[0].society;
      politician.politics = politician_interest[0].politics;

      searchResult.push(politician);
      resultData.searchResult = searchResult;
    }

  } catch (err) {
    resultData.status = 500;
    console.log(err);
  } finally {
    connection.end();
    res.render('search.ejs', resultData);
  }




});





module.exports = router;
