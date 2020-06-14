const mysql=require('mysql');
const express=require('express');
const passportModule=require('../passport');
const passport=require('passport');
const router=express.Router();

passportModule(passport);
router.post('/',function(req,res,next){
  passport.authenticate('local', function(err,user,info){
    if(err){
      console.log(err.message);
    }

    var tempNowUrl=req.session.nowUrl; //정치인 상세페이지 들어갔을 때 로그인 시
    var nowUrl=""
    if(typeof tempNowUrl !='undefined'){
      nowUrl=tempNowUrl;
    }
    else{
      nowUrl="/"
    }
    
    if(!user){
      res.send(`<script type="text/javascript">alert("${info.message}");window.location="${nowUrl}";</script>`); //done(null,false,messsage에 들어가는 메세지)
    }
    else{
      return req.login(user, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        return res.redirect(nowUrl);
      });
    }
  })(req, res, next);
});
// 인증 실패 시 401 리턴

module.exports=router;
