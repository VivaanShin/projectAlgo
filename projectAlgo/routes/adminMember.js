//admin/member 라우터
const express=require('express');
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserInterest=require('./queryPromise').getUserInterest;
const updateAdminUserInfo=require('./queryPromise').updateAdminUserInfo;
const updateUserInterest=require('./queryPromise').updateUserInterest;
const insertUserInterest=require('./queryPromise').insertUserInterest;
const deleteUserInfo=require('./queryPromise').deleteUserInfo;
const deleteUserInterest=require('./queryPromise').deleteUserInterest;

const mysql=require('mysql');
const router=express.Router();
//const bcrypt=require('bcrypt-nodejs');
const moment=require('moment');
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
        res.render('admin_page/admin.ejs',resultData);
    }
});

router.put('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        return;
    }*/
    var connection=mysql.createConnection(dbConfig);
    var user={};
    user.user_id=req.body.id;
    //var user_pw=bcrypt.hash(req.body.user_pw, null, null);
    user.user_email=req.body.user_email;
    user.user_phone=req.body.user_phone;
    user.user_state=req.body.user_state;
    user.user_interest_check=req.body.user_interest_check;

    try{
        await updateAdminUserInfo(user,connection);
        
        if(user_interest_check){ //interest_check가 true라면 tb_user_interest도 업데이트
            user.user_job=req.body.user_job;
            user.user_age=req.body.user_age;
            user.itScience=req.body.itScience;
            user.economy=req.body.economy;
            user.culture=req.body.culture;
            user.society=req.body.society;
            user.politics=req.body.politics;
            user.interest_date=moment().format('YYYY-MM-DD');

            var user_interest=await getUserInterest(connection);

            if(user_interest.length > 0){ //이미 관심사 매칭을 수행한 적이 있다면
                await updateUserInterest(user,connection); //update
            }
            else{ //아니면 insert
                await insertUserInterest(user,connection);
            }
        }
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member');
    }
});

router.delete('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        return;
    }*/
    var connection=mysql.createConnection(dbConfig);

    var user_id=req.body.user_id;
    var user_interest_check=req.body.user_interest_check;

    try{
        await deleteUserInfo(user_id,connection); //우선 사용자 정보부터 삭제

        if(user_interest_check){ //만약 사용자가 관심사 매칭을 수행한 적이 있다면 그것도 삭제
            await deleteUserInterest(user_id,connection);

        }//나중에 사용자가 준 평점도 삭제 할 것인지 생각
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member');
    }
})

module.exports=router;