//admin/member 라우터
const express=require('express');
const getAllUserInfo=require('./queryPromise').getAllUserInfo();
const getUserInterest=require('./queryPromise').getUserInterest();
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; 
  
//후에 Admin 로그인 확인
router.get('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        res.render({status:401,message:"접근불가"});
    }*/

    var resultData={};
    var connection=mysql.createConnection(dbConfig);
    var memberList=[];

    try{
        var user_info=await getAllUserInfo(connection); //모든 유저 정보 가져옴
    
        for(let i=0;i<user_info.length;i++){ //유저 정보를 하나씩 조회하여
            var one_user_info=user_info[i];
            var one_user_interest={}; //관심사 정보 temp

            console.log("User:"+one_user_info);

            if(one_user_info.user_interest_check){
                one_user_interest=await getUserInterest(one_user_info.user_id,connection); //관심사 매칭을 수행 한 적이 있다면, 테이블에서 가져옴
                one_user_info.user_job=one_user_interest.user_job;
                one_user_info.user_age=one_user_interest.user_age;
                one_user_info.itScience=one_user_interest.itScience;
                one_user_info.economy=one_user_interest.economy;
                one_user_info.culture=one_user_interest.culture;
                one_user_info.politics=one_user_interest.politics;
                one_user_info.society=one_user_interest.society;
                one_user_info.interest_date=one_user_interest.interest_date;

                memberList.push(one_user_info);
            }
            else{ //없으면 Default 값으로 저장
                one_user_info.user_job="없음";
                one_user_info.user_age=0;
                one_user_info.itScience=0;
                one_user_info.economy=0;
                one_user_info.culture=0;
                one_user_info.politics=0;
                one_user_info.society=0
                one_user_info.interest_date="0000-00-00";
            }
        }

        resultData.status=200;
    }
    catch(err){
        console.log(err.message);
        resultData.status=500;
    }
    finally{
        res.render('/admin_page/admin.ejs',resultData);
    }
});

router.put('/',(req,res)=>{
    var connection=mysql.createConnection(dbConfig);

});

module.exports=router;