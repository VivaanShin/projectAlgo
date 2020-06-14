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

/*
router.get('/', (req, res) => {
  console.log('matching_service join');
  res.render('matching_service');
});
*/

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







          //유저 관심사 각각 배열
          var user_itScience = rows[0].itScience;
          var user_economy = rows[0].economy;
          var user_culture = rows[0].culture;
          var user_society = rows[0].society;
          var user_politics = rows[0].politics;

          var user_itScience_sqrt = Math.sqrt(user_itScience);
          var user_economy_sqrt = Math.sqrt(user_economy);
          var user_culture_sqrt = Math.sqrt(user_culture);
          var user_society_sqrt = Math.sqrt(user_society);
          var user_politics_sqrt = Math.sqrt(user_politics);

          var user_itScience_sqrt = Math.floor(user_itScience_sqrt);
          var user_economy_sqrt = Math.floor(user_economy_sqrt);
          var user_culture_sqrt = Math.floor(user_culture_sqrt);
          var user_society_sqrt = Math.floor(user_society_sqrt);
          var user_politics_sqrt = Math.floor(user_politics_sqrt);
          //console.log("sqrt score", user_itScience_sqrt, user_economy_sqrt, user_culture_sqrt, user_society_sqrt, user_politics_sqrt);

          //유저 관심사 객체
          var user_interest = {
            itScience: user_itScience_sqrt,
            economy: user_economy_sqrt,
            culture: user_culture_sqrt,
            society: user_society_sqrt,
            politics: user_politics_sqrt
          }

          resultData.user_interest = user_interest;

          var user_interest_score = [rows[0].itScience, rows[0].economy, rows[0].culture, rows[0].society, rows[0].politics];
          //console.log(user_itScience, user_economy, user_culture, user_society, user_politics);
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

          //console.log("user_interest_max", user_interest_max);
          resolve(user_interest_score, user_interest_max)
        }
      });

    })
  }
  AImathing().then(function(user_interest_score, user_interest_max) {
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

          var politician1_score = distance(user_interest_score, politician1);
          var politician2_score = distance(user_interest_score, politician2);
          var politician3_score = distance(user_interest_score, politician3);
          var politician4_score = distance(user_interest_score, politician4);
          var politician5_score = distance(user_interest_score, politician5);
          var politician6_score = distance(user_interest_score, politician6);
          var politician7_score = distance(user_interest_score, politician7);
          var politician8_score = distance(user_interest_score, politician8);
          var politician9_score = distance(user_interest_score, politician9);
          var politician10_score = distance(user_interest_score, politician10);

          var politician1_percent = 100*(1-(distance(user_interest_score, politician1)/224));
          var politician2_percent = 100*(1-(distance(user_interest_score, politician2)/224));
          var politician3_percent = 100*(1-(distance(user_interest_score, politician3)/224));
          var politician4_percent = 100*(1-(distance(user_interest_score, politician4)/224));
          var politician5_percent = 100*(1-(distance(user_interest_score, politician5)/224));
          var politician6_percent = 100*(1-(distance(user_interest_score, politician6)/224));
          var politician7_percent = 100*(1-(distance(user_interest_score, politician7)/224));
          var politician8_percent = 100*(1-(distance(user_interest_score, politician8)/224));
          var politician9_percent = 100*(1-(distance(user_interest_score, politician9)/224));
          var politician10_percent = 100*(1-(distance(user_interest_score, politician10)/224));



          var matching_result = {
            children: [{
                politician_no: rows[0].politician_no,
                politician_match_rate: politician1_score,
                politician_match_percent: politician1_percent,
                itScience: rows[0].itScience,
                economy: rows[0].economy,
                culture: rows[0].culture,
                society: rows[0].society,
                politics: rows[0].politics
              },
              {
                politician_no: rows[1].politician_no,
                politician_match_rate: politician2_score,
                politician_match_percent: politician2_percent,
                itScience: rows[1].itScience,
                economy: rows[1].economy,
                culture: rows[1].culture,
                society: rows[1].society,
                politics: rows[1].politics
              },
              {
                politician_no: rows[2].politician_no,
                politician_match_rate: politician3_score,
                politician_match_percent: politician3_percent,
                itScience: rows[2].itScience,
                economy: rows[2].economy,
                culture: rows[2].culture,
                society: rows[2].society,
                politics: rows[2].politics
              },
              {
                politician_no: rows[3].politician_no,
                politician_match_rate: politician4_score,
                politician_match_percent: politician4_percent,
                itScience: rows[3].itScience,
                economy: rows[3].economy,
                culture: rows[3].culture,
                society: rows[3].society,
                politics: rows[3].politics
              },
              {
                politician_no: rows[4].politician_no,
                politician_match_rate: politician5_score,
                politician_match_percent: politician5_percent,
                itScience: rows[4].itScience,
                economy: rows[4].economy,
                culture: rows[4].culture,
                society: rows[4].society,
                politics: rows[4].politics
              },
              {
                politician_no: rows[5].politician_no,
                politician_match_rate: politician6_score,
                politician_match_percent: politician6_percent,
                itScience: rows[5].itScience,
                economy: rows[5].economy,
                culture: rows[5].culture,
                society: rows[5].society,
                politics: rows[5].politics
              },
              {
                politician_no: rows[6].politician_no,
                politician_match_rate: politician7_score,
                politician_match_percent: politician7_percent,
                itScience: rows[6].itScience,
                economy: rows[6].economy,
                culture: rows[6].culture,
                society: rows[6].society,
                politics: rows[6].politics
              },
              {
                politician_no: rows[7].politician_no,
                politician_match_rate: politician8_score,
                politician_match_percent: politician8_percent,
                itScience: rows[7].itScience,
                economy: rows[7].economy,
                culture: rows[7].culture,
                society: rows[7].society,
                politics: rows[7].politics
              },
              {
                politician_no: rows[8].politician_no,
                politician_match_rate: politician9_score,
                politician_match_percent: politician9_percent,
                itScience: rows[8].itScience,
                economy: rows[8].economy,
                culture: rows[8].culture,
                society: rows[8].society,
                politics: rows[8].politics
              },
              {
                politician_no: rows[9].politician_no,
                politician_match_rate: politician10_score,
                politician_match_percent: politician10_percent,
                itScience: rows[9].itScience,
                economy: rows[9].economy,
                culture: rows[9].culture,
                society: rows[9].society,
                politics: rows[9].politics
              }
            ]
          }

          //console.log(matching_result)

          //matching_result 객체 배열 정렬

          matching_result.children.sort(function(a, b) {
            return a.politician_match_rate < b.politician_match_rate ? -1 : a.seq > b.seq ? 1 : 0;
          });

          //console.log(matching_result)

          resultData.matching_result = matching_result.children;

          //console.log(resultData);
          //rows 가 10개 나옴
          resolve(resultData)
        }
      })
    })
  }).then(function(resultData) {
    return new Promise(function(resolve, reject) {
      /*
      var politician_no_list = [];
      console.log("typeof politician_no_list",typeof(politician_no_list))
      console.log("resultData.matching_result[0].politician_no",typeof(resultData.matching_result[0].politician_no))
      for (var i = 0; i < resultData.matching_result.length;i++){
        var politician_no_search = resultData.matching_result[i].politician_no;
        console.log(typeof(politician_no_search))
        politician_no_list.push(politician_no_search);
      }
      */

      var politician_no1 = resultData.matching_result[0].politician_no;
      var politician_no2 = resultData.matching_result[1].politician_no;
      var politician_no3 = resultData.matching_result[2].politician_no;
      var politician_no4 = resultData.matching_result[3].politician_no;
      var politician_no5 = resultData.matching_result[4].politician_no;
      var politician_no6 = resultData.matching_result[5].politician_no;
      var politician_no7 = resultData.matching_result[6].politician_no;
      var politician_no8 = resultData.matching_result[7].politician_no;
      var politician_no9 = resultData.matching_result[8].politician_no;
      var politician_no10 = resultData.matching_result[9].politician_no;


      var politician_no_list = [politician_no1, politician_no2, politician_no3, politician_no4, politician_no5, politician_no6, politician_no7, politician_no8, politician_no9, politician_no10]
      var politician = {};
      var searchResult = [];
      var sql3 = 'select * from tb_politician_info where politician_no IN (?,?,?,?,?,?,?,?,?,?) ';
      connection.query(sql3, politician_no_list, function(err, rows, fields) {
        console.log("query3 in");
        if (err) {
          console.log(err);
        } else {
          console.log("query3 rows: ", rows);
          for (var i = 0; i < rows.length; i++) {
            politician = {
              politician_no: rows[i].politician_no,
              politician_name: rows[i].politician_name,
              jdName: rows[i].jdName,
              birthday: rows[i].birthday,
              career1: rows[i].career1,
              career2: rows[i].career2,
              img: "/images/" + rows[i].politician_no + ".jpg",
              link: "/politician/" + rows[i].politician_no,
              itScience: resultData.matching_result[i].itScience,
              economy: resultData.matching_result[i].economy,
              culture: resultData.matching_result[i].culture,
              society: resultData.matching_result[i].society,
              politics: resultData.matching_result[i].politics,
              politician_match_rate: resultData.matching_result[i].politician_match_rate,
              politician_match_percent: resultData.matching_result[i].politician_match_percent
            }
            searchResult.push(politician);
          }
          /*
          for(var i = 0; i<politician.length; i++){
            politician[i].push(resultData.matching_result[i].itScience)
            politician[i].push(resultData.matching_result[i].economy)
            politician[i].push(resultData.matching_result[i].culture)
            politician[i].push(resultData.matching_result[i].society)
            politician[i].push(resultData.matching_result[i].politics)
            politician[i].push(resultData.matching_result[i].politician_match_rate)
          }
          */
          //console.log("politician final console", politician)

          resultData.searchResult = searchResult;
          //console.log("searchResult final console", searchResult);
          resolve()
        }
      })
    })
  }).then(function() {
    connection.end();
    req.session.user_interest_check = 1;
    res.render('matching_service', resultData);
  }).catch(function(err) {
    console.log('error', err);
  })

})

module.exports = router;
