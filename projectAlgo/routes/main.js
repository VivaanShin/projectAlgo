var express = require('express');
var isNotLoggined=require('../scripts/confirmLogin').isNotLoggedIn;
var router = express.Router();

router.get('/', function(req, res, next) {
  var user={};

  if(isNotLoggined){
    user={user_id:null}
  }
  else{
    user=req.user;
  }
  res.render('main',user);
});


module.exports = router;
