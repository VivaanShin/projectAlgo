const mysql=require('mysql');
const express=require('express');
const passportModule=require('../passport');
const passport=require('passport');
const router=express.Router();

passportModule(passport);
router.post('/',passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), // 인증 실패 시 401 리턴
  function (req, res) {
    console.log("redirect")
    res.redirect('/');
  });

module.exports=router;
