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
  if (isLoggedin(req)) { //로그인 정보
    resultData.user = req.user;
  }
  console.log('survey join');
  res.render('matching_survey', resultData);
});

router.post('/', (req, res) => {
      console.log("req.body: ", req.body);
      var resultData = {};
      if (isLoggedin(req)) { //로그인 정보
        resultData.user = req.user;
      }

      var user_id = resultData.user.user_id;

      var itScience_sec = parseInt(req.body.itScience_sec);
      var mobile = parseInt(req.body.mobile);
      var internet_sns = parseInt(req.body.internet_sns);
      var communication = parseInt(req.body.communication);
      var it_common = parseInt(req.body.it_common);
      var security = parseInt(req.body.security);
      var computer = parseInt(req.body.computer);
      var game = parseInt(req.body.game);
      var science_common = parseInt(req.body.science_common);
      var economy_sec = parseInt(req.body.economy_sec);
      var finance = parseInt(req.body.finance);
      var stock = parseInt(req.body.stock);
      var industry = parseInt(req.body.industry);
      var small_venture = parseInt(req.body.small_venture);
      var property = parseInt(req.body.property);
      var global_economy = parseInt(req.body.global_economy);
      var living_economy = parseInt(req.body.living_economy);
      var economy_common = parseInt(req.body.economy_common);
      var culture_sec = parseInt(req.body.culture_sec);
      var health = parseInt(req.body.health);
      var exhibit_performance = parseInt(req.body.exhibit_performance);
      var art_architecture = parseInt(req.body.art_architecture);
      var traffic = parseInt(req.body.traffic);
      var travel = parseInt(req.body.travel);
      var religion = parseInt(req.body.religion);
      var food = parseInt(req.body.food);
      var culture_common = parseInt(req.body.culture_common);

      var society_sec = parseInt(req.body.society_sec);
      var event_accident = parseInt(req.body.event_accident);
      var education = parseInt(req.body.education);
      var work = parseInt(req.body.work);
      var media = parseInt(req.body.media);
      var environment = parseInt(req.body.environment);
      var humanrights_welfare = parseInt(req.body.humanrights_welfare);
      var food_medical = parseInt(req.body.food_medical);
      var society_common = parseInt(req.body.society_common);
      var politics_sec = parseInt(req.body.politics_sec);
      var bluehouse = parseInt(req.body.bluehouse);
      var assembly_party = parseInt(req.body.assembly_party);
      var northkorea = parseInt(req.body.northkorea);
      var administration = parseInt(req.body.administration);
      var defense_diplomacy = parseInt(req.body.defense_diplomacy);
      var politics_common = parseInt(req.body.politics_common);

      /*
          var itScience_func = function(itScience_sec, mobile, internet_sns, communication, it_common, security, computer, game, science_common){
            var itScience = Number(itScience_sec) * ((Number(mobile) + Number(internet_sns) + Number(communication) + Number(it_common) + Number(security) + Number(computer) + Number(game) + Number(science_common))/8);
            return itScience;
          }

          var economy_func = function(economy_sec, finance, stock, industry, small_venture, property, global_economy, living_economy, economy_common){
            var economy = Number(economy_sec) * {(Number(finance) + Number(stock) + Number(industry) + Number(small_venture) + Number(property) + Number(global_economy) + Number(living_economy) + Number(economy_common))/8};
            return economy;
          }

          var culture_func = function(culture_sec, health, exhibit_performance, art_architecture, traffic, travel, religion, food, culture_common){
            var culture = Number(culture_sec) * {(Number(health) + Number(exhibit_performance) + Number(art_architecture) + Number(traffic) + Number(travel) + Number(religion) + Number(food) + Number(culture_common))/8};
            return culture;
          }

          var society_func = function(society_sec, event_accident, education, work, media, environment, humanrights_welfare, food_medical, society_common){
            var society = Number(society_sec) * {(Number(event_accident) + Number(education) + Number(work) + Number(media) + Number(environment) + Number(humanrights_welfare) + Number(food_medical) + Number(society_common))/8};
            return society;
          }

          var politics_func = function(politics_sec, bluehouse, assembly_party, northkorea, administration, defense_diplomacy, politics_common){
            var politics = Number(politics_sec) * {(Number(bluehouse) + Number(assembly_party) + Number(northkorea) + Number(administration) + Number(defense_diplomacy) + Number(politics_common))/8};
            return politics;
          }
          */

      var itScience = Number(itScience_sec) * ((Number(mobile) + Number(internet_sns) + Number(communication) + Number(it_common) + Number(security) + Number(computer) + Number(game) + Number(science_common)) / 8);
      var economy = Number(economy_sec) * ((Number(finance) + Number(stock) + Number(industry) + Number(small_venture) + Number(property) + Number(global_economy) + Number(living_economy) + Number(economy_common)) / 8);
      var culture = Number(culture_sec) * ((Number(health) + Number(exhibit_performance) + Number(art_architecture) + Number(traffic) + Number(travel) + Number(religion) + Number(food) + Number(culture_common)) / 8);
      var society = Number(society_sec) * ((Number(event_accident) + Number(education) + Number(work) + Number(media) + Number(environment) + Number(humanrights_welfare) + Number(food_medical) + Number(society_common)) / 8);
      var politics = Number(politics_sec) * ((Number(bluehouse) + Number(assembly_party) + Number(northkorea) + Number(administration) + Number(defense_diplomacy) + Number(politics_common)) / 6);

      console.log("itScience, economy, culture, society, politics", itScience, economy, culture, society, politics);

        itScience = parseInt(itScience); economy = parseInt(economy); culture = parseInt(culture); society = parseInt(society); politics = parseInt(politics_sec);

        console.log("parseInt - itScience, economy, culture, society, politics", itScience, economy, culture, society, politics);

        var connection = mysql.createConnection(dbConfig); connection.connect();

        function user_interest_sql() {
          return new Promise(function(resolve, reject) {
            var params = [
              itScience_sec, mobile, internet_sns, communication, it_common, security, computer, game, science_common,
              economy_sec, finance, stock, industry, small_venture, property, global_economy, living_economy,
              economy_common, culture_sec, health, exhibit_performance, art_architecture, traffic, travel,
              religion, food, culture_common, society_sec, event_accident, education, work, media,
              environment, humanrights_welfare, food_medical, society_common, politics_sec, bluehouse,
              assembly_party, northkorea, administration, defense_diplomacy, politics_common
            ];

            var sql = 'insert into tb_user_interest_moreinfo(user_id, itScience_sec, mobile, internet_sns, communication, it_common, security, computer, game, science_common, economy_sec, finance, stock, industry, small_venture, property, global_economy, living_economy, economy_common, culture_sec, health, exhibit_performance, art_architecture, traffic, travel, religion, food, culture_common, society_sec, event_accident, education, work, media, environment, humanrights_welfare, food_medical, society_common, politics_sec, bluehouse, assembly_party, northkorea, administration, defense_diplomacy, politics_common) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            console.log("params", params);
            connection.query(sql, params, function(err, rows, fields) {
              console.log("query in");
              if (err) {
                console.log(error);
              } else {
                console.log("sql success");
              }
            });

          })
        }
        user_interest_sql().then(function(user_id) {
          var params2 = [itScience, economy, culture, society, politics];
          var sql2 = 'insert into tb_user_interest(user_id, itScience, economy, culture, society, politics) values(?,?,?,?,?,?)';
          connection.query(sql2, params2, function(err, rows, fields) {
            console.log("query2 in");
            if (err) {
              console.log(error);
            } else {
              console.log("sql success");
            }
          });
        }).then(function(user_id) {
          var sql3 = `update tb_user_info set user_interest_check=1
                  where user_id=?`;
          connection.query(sql3, user_id, function(err, rows, fields) {
            console.log("query3 in");
            if (err) {
              console.log(error);
            } else {
              console.log("sql success");
            }
          });
        }).catch(function(err) {
          console.log('error', err);
        })









        connection.end();




        res.render('home', resultData);
      });




    module.exports = router;
