//admin/member 라우터
const express=require('express');
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserInterest=require('./queryPromise').getUserInterest;
const updateAdminUserInfo=require('./queryPromise').updateAdminUserInfo;
const updateUserInterest=require('./queryPromise').updateUserInterest;
//const insertUserInterest=require('./queryPromise').insertUserInterest;
const deleteUserInfo=require('./queryPromise').deleteUserInfo;
const deleteUserInterest=require('./queryPromise').deleteUserInterest;
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const unsetForeignKeyChecks=require('./queryPromise').unsetForeignKeyChecks;
const setForeignKeyChecks=require('./queryPromise').setForeignKeyChecks;
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

    var page=req.query.page;
    
    try{
        if(typeof page == 'undefined'){
            page=1;
        }

        var userInfo=await getAllUserInfo(connection); //모든 유저 정보 가져옴
        var startPage=(page-1)*pagingNum;
        var endPage;
        var total=userInfo.length;
        resultData.total=total;

        page=Number(page);

        if(page <=0 || page> Math.ceil(total/pagingNum)){ //잘 못된 페이지 처리
            if(total % paingNum <=0 || page >=(total/pagingNum)+2){
                page=1
            }
        }

        else if(page==Math.ceil(total/pagingNum)){ //마지막페이지 처리
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
                oneUserInfo.itScience=oneUserInterest[0].itScience;
                oneUserInfo.economy=oneUserInterest[0].economy;
                oneUserInfo.culture=oneUserInterest[0].culture;
                oneUserInfo.politics=oneUserInterest[0].politics;
                oneUserInfo.society=oneUserInterest[0].society;
            }
            else{ //없으면 Default 값으로 저장
                oneUserInfo.itScience=0;
                oneUserInfo.economy=0;
                oneUserInfo.culture=0;
                oneUserInfo.politics=0;
                oneUserInfo.society=0;
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
    console.log(req.body);
    var connection=mysql.createConnection(dbConfig);
    var user={};
    user.user_id=req.body.user_id;
    //var user_pw=bcrypt.hash(req.body.user_pw, null, null);
    user.user_email=req.body.user_email;
    user.user_phone=req.body.user_phone;
    user.user_black=req.body.user_black;

    try{
        var isInterest= await getUserInterest(user.user_id,connection);
        console.log(user);
        await updateAdminUserInfo(user,connection);
        
        if(isInterest.length > 0){ //interest_check가 true라면 tb_user_interest도 업데이트
            user.itScience=req.body.user_itScience;
            user.economy=req.body.user_economy;
            user.culture=req.body.user_culture;
            user.society=req.body.user_society;
            user.politics=req.body.user_politics;
            await updateUserInterest(user,connection); //update
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
    if(!isAdmin(req)){
        return res.redirect('/');
    }
    var connection=mysql.createConnection(dbConfig);
    var user_id=req.body.user_id;

    try{ //우선 사용자 정보부터 삭제
        var isInterest= await getUserInterest(user_id,connection);
        if(isInterest.length > 0){ //만약 사용자가 관심사 매칭을 수행한 적이 있다면 그것도 삭제
            await deleteUserInterest(user_id,connection);
        }
        await unsetForeignKeyChecks(connection);
        await deleteUserInfo(user_id,connection);
        await setForeignKeyChecks(connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        //res.redirect('/admin/member');
    }
})

module.exports=router;