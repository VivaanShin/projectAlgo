const express=require('express');
const router=express.Router();
//로그아웃 라우터
router.post('/',function(req,res){
    req.logout();
    req.session.destroy(function (err){
        res.redirect('/');
    });
});

module.exports=router;