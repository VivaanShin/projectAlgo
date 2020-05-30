const mysql=require('mysql');
const express=require('express');
const passport=require('passport');
const router=express.Router();

router.post('/',passport.authenticate('local', {failureRedirect: '/', failureFlash: true}), // 인증 실패 시 401 리턴
  function (req, res) {
    res.redirect('/');
  });

module.exports=router;
