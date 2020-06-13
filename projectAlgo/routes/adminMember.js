//admin/member 라우터
const express=require('express');
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserInterest=require('./queryPromise').getUserInterest;
const updateAdminUserInfo=require('./queryPromise').updateAdminUserInfo;
const updateUserInterest=require('./queryPromise').updateUserInterest;
const insertUserInterest=require('./queryPromise').insertUserInterest;
const deleteUserInfo=require('./queryPromise').deleteUserInfo;
const deleteUserInterest=require('./queryPromise').deleteUserInterest;
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
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

const pagingNum=10; //페이지 하나당 10개
  
//후에 Admin 로그인 확인
router.get('/',async (req,res)=>{
    if(!isAdmin(req)){
        return res.redirect('/');
    }

    var resultData={};
    var connection=mysql.createConnection(dbConfig);
    var memberList=[];

    try{
        var userInfo=await getAllUserInfo(connection); //모든 유저 정보 가져옴
        var page=req.query.page;
        var startPage=(page-1)*pagingNum;
        var endPage;
        var total=userInfo.length;
        resultData.total=total;

        if(typeof page == 'undefined'){
            page=1;
        }

        page=Number(page);

        if(page <=0 || page> total/pagingNum){ //잘 못된 페이지 처리
            page=1
        }

        else if(page==total/pagingNum){ //마지막페이지 처리
            endPage=total;
        }
        else{
            endPage=page*pagingNum;
        }
    
        for(let i=startPage;i<endPage;i++){ //유저 정보를 하나씩 조회하여
            var oneUserInfo=JSON.parse(JSON.stringify(userInfo[i]));
            var oneUserInterest={}; //관심사 정보 temp

            if(oneUserInfo.user_interest_check){//관심사 매칭을 수행 한 적이 있다면, 테이블에서 가져옴
                oneUserInterest=await getUserInterest(oneUserInfo.user_id,connection); 
                oneUserInfo.user_job=oneUserInterest[0].user_job;
                oneUserInfo.user_age=oneUserInterest[0].user_age;
                oneUserInfo.itScience=oneUserInterest[0].itScience;
                oneUserInfo.economy=oneUserInterest[0].economy;
                oneUserInfo.culture=oneUserInterest[0].culture;
                oneUserInfo.politics=oneUserInterest[0].politics;
                oneUserInfo.society=oneUserInterest[0].society;
                oneUserInfo.interest_date=oneUserInterest[0].interest_date;
            }
            else{ //없으면 Default 값으로 저장
                oneUserInfo.user_job="없음";
                oneUserInfo.user_age=0;
                oneUserInfo.itScience=0;
                oneUserInfo.economy=0;
                oneUserInfo.culture=0;
                oneUserInfo.politics=0;
                oneUserInfo.society=0
                oneUserInfo.interest_date="0000-00-00";
            }
            memberList.push(oneUserInfo);
        }

        resultData.status=200;
        resultData.memberList=memberList;
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
    if(!isAdmin(req)){
        return res.redirect('/');
    }
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
        res.redirect('/admin/member?page=1');
    }
});

router.delete('/',async (req,res)=>{
    if(!isAdmin(req)){
        return res.redirect('/');
    }
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
        res.redirect('/admin/member?page=1');
    }
})

module.exports=router;