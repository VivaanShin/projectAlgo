var express = require('express');
var router = express.Router();
var session = require('express-session');
const isLoggedin = require('../scripts/confirmLogin').isLoggedIn;
const mysql = require('mysql');
var distance = require('euclidean-distance');
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
          //유저 관심사 객체
          var user_interest = {
            x: rows[0].itScience,
            x: rows[0].economy,
            x: rows[0].culture,
            x: rows[0].society,
            x: rows[0].politics
          }
          */


          //유저 관심사 각각 배열
          var user_itScience = rows[0].itScience;
          var user_economy = rows[0].economy;
          var user_culture = rows[0].culture;
          var user_society = rows[0].society;
          var user_politics = rows[0].politics;
          var user_interest = [rows[0].itScience, rows[0].economy, rows[0].culture, rows[0].society, rows[0].politics];
          console.log(user_itScience, user_economy, user_culture, user_society, user_politics);
          //최대값 찾기
          var maxNum = Math.max(user_itScience, user_economy, user_culture, user_society, user_politics);
          console.log("maxNum", maxNum);

          var user_interest_max = "default"
          if (user_itScience == maxNum) {
            user_interest_max = "itScience"
          } else if (user_economy == maxNum) {
            user_interest_max = "economy"
          } else if (user_culture == maxNum) {
            user_interest_max = "culture"
          } else if (user_society == maxNum) {
            user_interest_max = "society"
          } else if (user_politics == maxNum) {
            user_interest_max = "politics"
          } else {
            console.log("maxNum error")
          }

          console.log("user_interest_max", user_interest_max);
          resolve(user_interest, user_interest_max)
        }
      });

    })
  }
  AImathing().then(function(user_interest, user_interest_max) {
    return new Promise(function(resolve, reject) {


      var sql2 = 'select * from tb_politician_interest order by "?" desc limit 10';
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
          var politician1 = [rows[0].itScience, rows[0].economy, rows[0].culture, rows[0].society, rows[0].politics];
          var politician2 = [rows[1].itScience, rows[1].economy, rows[1].culture, rows[1].society, rows[1].politics];
          var politician3 = [rows[2].itScience, rows[2].economy, rows[2].culture, rows[2].society, rows[2].politics];
          var politician4 = [rows[3].itScience, rows[3].economy, rows[3].culture, rows[3].society, rows[3].politics];
          var politician5 = [rows[4].itScience, rows[4].economy, rows[4].culture, rows[4].society, rows[4].politics];
          var politician6 = [rows[5].itScience, rows[5].economy, rows[5].culture, rows[5].society, rows[5].politics];
          var politician7 = [rows[6].itScience, rows[6].economy, rows[6].culture, rows[6].society, rows[6].politics];
          var politician8 = [rows[7].itScience, rows[7].economy, rows[7].culture, rows[7].society, rows[7].politics];
          var politician9 = [rows[8].itScience, rows[8].economy, rows[8].culture, rows[8].society, rows[8].politics];
          var politician10 = [rows[9].itScience, rows[9].economy, rows[9].culture, rows[9].society, rows[9].politics];

          var politician1_score = distance(user_interest, politician1);
          var politician2_score = distance(user_interest, politician2);
          var politician3_score = distance(user_interest, politician3);
          var politician4_score = distance(user_interest, politician4);
          var politician5_score = distance(user_interest, politician5);
          var politician6_score = distance(user_interest, politician6);
          var politician7_score = distance(user_interest, politician7);
          var politician8_score = distance(user_interest, politician8);
          var politician9_score = distance(user_interest, politician9);
          var politician10_score = distance(user_interest, politician10);

          var matching_result = {
            children: [{
                politician_no: rows[0].politician_no,
                politician_match_rate: politician1_score,
                itScience: rows[0].itScience,
                economy: rows[0].economy,
                culture: rows[0].culture,
                society: rows[0].society,
                politics: rows[0].politics
              },
              {
                politician_no: rows[1].politician_no,
                politician_match_rate: politician2_score,
                itScience: rows[1].itScience,
                economy: rows[1].economy,
                culture: rows[1].culture,
                society: rows[1].society,
                politics: rows[1].politics
              },
              {
                politician_no: rows[2].politician_no,
                politician_match_rate: politician3_score,
                itScience: rows[2].itScience,
                economy: rows[2].economy,
                culture: rows[2].culture,
                society: rows[2].society,
                politics: rows[2].politics
              },
              {
                politician_no: rows[3].politician_no,
                politician_match_rate: politician4_score,
                itScience: rows[3].itScience,
                economy: rows[3].economy,
                culture: rows[3].culture,
                society: rows[3].society,
                politics: rows[3].politics
              },
              {
                politician_no: rows[4].politician_no,
                politician_match_rate: politician5_score,
                itScience: rows[4].itScience,
                economy: rows[4].economy,
                culture: rows[4].culture,
                society: rows[4].society,
                politics: rows[4].politics
              },
              {
                politician_no: rows[5].politician_no,
                politician_match_rate: politician6_score,
                itScience: rows[5].itScience,
                economy: rows[5].economy,
                culture: rows[5].culture,
                society: rows[5].society,
                politics: rows[5].politics
              },
              {
                politician_no: rows[6].politician_no,
                politician_match_rate: politician7_score,
                itScience: rows[6].itScience,
                economy: rows[6].economy,
                culture: rows[6].culture,
                society: rows[6].society,
                politics: rows[6].politics
              },
              {
                politician_no: rows[7].politician_no,
                politician_match_rate: politician8_score,
                itScience: rows[7].itScience,
                economy: rows[7].economy,
                culture: rows[7].culture,
                society: rows[7].society,
                politics: rows[7].politics
              },
              {
                politician_no: rows[8].politician_no,
                politician_match_rate: politician9_score,
                itScience: rows[8].itScience,
                economy: rows[8].economy,
                culture: rows[8].culture,
                society: rows[8].society,
                politics: rows[8].politics
              },
              {
                politician_no: rows[9].politician_no,
                politician_match_rate: politician10_score,
                itScience: rows[9].itScience,
                economy: rows[9].economy,
                culture: rows[9].culture,
                society: rows[9].society,
                politics: rows[9].politics
              }
            ]
          }

          console.log(matching_result)

          //matching_result 객체 배열 정렬

          matching_result.children.sort(function(a, b) {
            return a.politician_match_rate < b.politician_match_rate ? -1 : a.seq > b.seq ? 1 : 0;
          });

          console.log(matching_result)

          resultData.matching_result = matching_result.children;
          resultData.user_interest = user_interest;
          console.log(resultData);
          //rows 가 10개 나옴
          resolve(resultData)
        }
      })
    })
  }).then(function(resultData) {
    return new Promise(function(resolve, reject) {
      var politician_no_list = [];
      console.log("politician_no_list",typeof(politician_no_list))
      console.log("resultData.matching_result[0].politician_no",typeof(resultData.matching_result[0].politician_no))
      for (var i = 0; i < resultData.matching_result.length;i++){
        var politician_no_search = resultData.matching_result[i].politician_no;
        console.log(typeof(politician_no_search))
        politician_no_list.push(politician_no_search);
      }
      console.log(politician_no_list);





      var sql3 = 'select * from tb_politician_info where politician_no IN (?) ';
      connection.query(sql3, politician_no_list, function(err, rows, fields) {
        console.log("query3 in");
        if (err) {
          console.log(err);
        } else {
          for(var i = 0; i<rows.length; i++){
            var politician={
              politician_no:rows[i].politician_no,
              politician_name:rows[i].politician_name,
              jdName:rows[i].jdName,
              birthday:rows[i].birthday,
              career1:rows[i].career1,
              career2:rows[i].career2,
              img:"/images/"+rows[i].politician_no+".jpg",
              link:"/politician/"+rows[i].politician_no
            }
          }
          for(var i = 0; i<politician.length; i++){
            politician[i].push(resultData.matching_result[i].itScience)
            politician[i].push(resultData.matching_result[i].economy)
            politician[i].push(resultData.matching_result[i].culture)
            politician[i].push(resultData.matching_result[i].society)
            politician[i].push(resultData.matching_result[i].politics)
            politician[i].push(resultData.matching_result[i].politician_match_rate)
          }
          console.log("politician final console", politician)

          resultData.searchResult=politician;

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
