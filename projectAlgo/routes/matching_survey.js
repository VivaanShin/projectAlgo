var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경

  router.get('/', (req, res) => {
    console.log('survey join');
    res.render('matching_survey');
  });

 


module.exports = router;
