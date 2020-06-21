const mysql = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
var session = require('express-session');
const isLoggedin = require('../scripts/confirmLogin').isLoggedIn;
const router = express.Router();
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'algoalgo', //dbPassword
  database: 'project_algo'
};







module.exports = router;
