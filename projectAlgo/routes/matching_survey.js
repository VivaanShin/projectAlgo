var express = require('express');
var router = express.Router();
const isLoggedin=require('../scripts/confirmLogin').isLoggedIn;
const mysql = require('mysql');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경

  router.get('/', (req, res) => {
    var resultData={};
    if(isLoggedin(req)){ //로그인 정보
            resultData.user=req.user;
        }
    console.log('survey join');
    res.render('matching_survey', resultData);
  });

router.post('/', (req,res) => {

/*
   var itScience_sec = $('input:radio[name="itScience_sec"]:checked).val();
   var mobile = $('input:radio[name="mobile"]:checked).val();
   var internet_sns = $('input:radio[name="internet_sns"]:checked).val();
   var communication = $('input:radio[name="communication"]:checked).val();
   var it_common = $('input:radio[name="it_common"]:checked).val();
   var security = $('input:radio[name="security"]:checked).val();
   var computer = $('input:radio[name="computer"]:checked).val();
   var game = $('input:radio[name="game"]:checked).val();
   var science_common = $('input:radio[name="science_common"]:checked).val();
   var economy_sec = $('input:radio[name="economy_sec"]:checked).val();
   var finance = $('input:radio[name="finance"]:checked).val();
   var stock = $('input:radio[name="stock"]:checked).val();
   var industry = $('input:radio[name="industry"]:checked).val();
   var small_venture = $('input:radio[name="small_venture"]:checked).val();
   var property = $('input:radio[name="property"]:checked).val();
   var global_economy = $('input:radio[name="global_economy"]:checked).val();
   var living_economy = $('input:radio[name="living_economy"]:checked).val();
   var economy_common = $('input:radio[name="economy_common"]:checked).val();
   var culture_sec = $('input:radio[name="culture_sec"]:checked).val();
   var health = $('input:radio[name="health"]:checked).val();
   var exhibit_performance = $('input:radio[name="exhibit_performance"]:checked).val();
   var art_architecture = $('input:radio[name="art_architecture"]:checked).val();
   var traffic = $('input:radio[name="traffic"]:checked).val();
   var travel = $('input:radio[name="travel"]:checked).val();
   var religion = $('input:radio[name="religion"]:checked).val();
   var culture_common = $('input:radio[name="culture_common"]:checked).val();
   var food = $('input:radio[name="food"]:checked).val();
   var society_sec = $('input:radio[name="society_sec"]:checked).val();
   var event_accident = $('input:radio[name="event_accident"]:checked).val();
   var education = $('input:radio[name="education"]:checked).val();
   var work = $('input:radio[name="work"]:checked).val();
   var media = $('input:radio[name="media"]:checked).val();
   var environment = $('input:radio[name="environment"]:checked).val();
   var humanrights_welfare = $('input:radio[name="humanrights_welfare"]:checked).val();
   var food_medical = $('input:radio[name="food_medical"]:checked).val();
   var society_common = $('input:radio[name="society_common"]:checked).val();
   var politics_sec = $('input:radio[name="politics_sec"]:checked).val();
   var bluehouse = $('input:radio[name="bluehouse"]:checked).val();
   var assembly_party = $('input:radio[name="assembly_party"]:checked).val();
   var northkorea = $('input:radio[name="northkorea"]:checked).val();
   var administration = $('input:radio[name="administration"]:checked).val();
   var defense_diplomacy = $('input:radio[name="defense_diplomacy"]:checked).val();
   var politics_common = $('input:radio[name="politics_common"]:checked).val();
*/
 });




module.exports = router;
