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
  console.log('matching_service join');
  res.render('matching_service');
});


router.get('/AImatching', (req, res) => {
  var resultData = {};
  if (isLoggedin(req)) { //로그인 정보
    resultData.user = req.user;
  }

  var user_id = req.user.user_id;

  var connection = mysql.createConnection(dbConfig);
  connection.connect();

  function AImathing() {
    return new Promise(function(resolve, reject) {

      var sql = 'select itScience,economy,culture,society,politics from tb_user_interest where user_id = ?';
      connection.query(sql, user_id, function(err, rows, fields) {
        console.log("query in");
        if (err) {
          console.log(err);
        } else {
          console.log("sql success");
          console.log(rows);

          /*
          Math.max.apply(Math, rows.map(function(o){
            return o.rows;
          }))
          var maxNum = o.rows;
          */
          /*
          const maxNum = Math.max(...arrayToSearchIn.map(o => o.rows), 0);
          console.log("maxNum", maxNum);
          */
          /*
          //유저 관심사 객체
          var user_interest = {
            itScience : rows[0].itScience,
            economy : rows[0].economy,
            culture : rows[0].culture,
            society : rows[0].society,
            politics : rows[0].politics
          }
          */
          var maxNum = _(rows)
            .groupBy(function(o) { // group by source and target
              return o.source + '-' + o.target;
            })
            .map(function(arr) { // map the groups to values
              return arr.reduce(function(max, o) { // get the object with the hight normal in each group
                return max.metrics.normal > o.metrics.normal ? max : o;
              });
            })
            .value();
          console.log("maxNum", maxNum);  
          //유저 관심사 각각 배열
          var user_itScience = rows[0].itScience;
          var user_economy = rows[0].economy;
          var user_culture = rows[0].culture;
          var user_society = rows[0].society;
          var user_politics = rows[0].politics;
          console.log(user_itScience, user_economy, user_culture, user_society, user_politics);
          var user_interest_max = "default"
          if (user_itScience = maxNum) {
            user_interest_max = "itScience"
          } else if (user_economy = maxNum) {
            user_interest_max = "economy"
          } else if (user_culture = maxNum) {
            user_interest_max = "culture"
          } else if (user_society = maxNum) {
            user_interest_max = "society"
          } else if (user_politics = maxNum) {
            user_interest_max = "politics"
          } else {
            console.log("maxNum error")
          }

          console.log("user_interest_max", user_interest_max);
          resolve(user_interest_max)
        }
      });

    })
  }
  AImathing().then(function(user_interest_max) {
    return new Promise(function(resolve, reject) {


      var sql2 = 'select * from tb_politician_interest order by ? limit 10';
      connection.query(sql2, user_interest_max, function(err, rows, fields) {
        console.log("query2 in");
        if (err) {
          console.log(err);
        } else {
          console.log("sql2 success");
          for (var i = 0; i < rows.length; i++) {
            for (var keyNm in rows[i]) {
              console.log("key: " + keyNm + ", value : " + rows[i][keyNm]);
            }
          }
          resolve()
        }
      })
    })
  }).then(function() {
    connection.end();
  }).catch(function(err) {
    console.log('error', err);
  })
  res.render('home', resultData);
})

module.exports = router;
