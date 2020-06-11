const mysql=require('mysql');
const express=require('express');
const passportModule=require('../passport');
const passport=require('passport');
const router=express.Router();

passportModule(passport);
router.post('/',function(req,res){
  passport.authenticate('local', function(err,user,info){
    if(err){
      console.log(err.message);
    }

    if(!user){
      req.session.message = info.message;
    }

    return res.redirect('/');
  })(req, res, next);
});
// 인증 실패 시 401 리턴

module.exports=router;
