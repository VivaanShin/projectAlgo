const express=require('express');
const mysql=require('mysql');
const moment=require('moment');
const router=express.Router();
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserGradeCountAndAvg=require('./queryPromise').getUserGradeCountAndAvg;
//const getUserGrade=require('./queryPromise').getUserGrade;
const updateBlackInUserInfo=require('./queryPromise').updateBlackInUserInfo;
const insertBlackUser=require('./queryPromise').insertBlackUser;
const updateUnBlackInUserInfo=require('./queryPromise').updateUnBlackInUserInfo;
const deleteBlackUser=require('./queryPromise').deleteBlackUser;
//const updateUserPoliticianGrade=require('./queryPromise').updateUserPoliticianGrade;
//const updateGradeinfoRecord=require('./queryPromise').updateGradeInfoRecord;
//const deleteUserPoliticianGrade=require('./queryPromise').deleteUserPoliticianGrade;
const deleteUserGrade=require('./queryPromise').deleteUserGrade;
const pagingNum=10;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};

router.get('/',async (req,res)=>{
    if(!isAdmin(req)){
        return res.redirect('/');
    }
    var connection=mysql.createConnection(dbConfig);
    var resultData={};
    var gradePage=req.query.page; //유저 평점 관리 페이지
    //var detailPage=req.query.detail_page; //유저 평점 상세정보 페이지
    try{
        var userInfo=await getAllUserInfo(connection);
        var gradeInfo=[];

        for (let i=0;i<userInfo.length;i++){ //유저평점관리 render
            var oneUser={};
            oneUser.user_id=userInfo[i].user_id;
            oneUser.user_email=userInfo[i].user_email;
            oneUser.user_black=userInfo[i].user_black;
            var usersGradeCountAndAvg=await getUserGradeCountAndAvg(oneUser.user_id,connection);

            oneUser.count=usersGradeCountAndAvg[0].count;
            oneUser.avg=(!usersGradeCountAndAvg[0].avg) ? 0:usersGradeCountAndAvg[0].avg;

            gradeInfo.push(oneUser);
        }

        resultData.gradeInfo=gradeInfo;
        var gradeDetailInfo=await getUserGrade(connection,user_id); // 유저 평점 상세정보 render
        resultData.gradeDetailInfo=gradeDetailInfo;

        console.log(resultData);
        resultData.status=200;
    }
    catch(err){
        resultData.status=500;
        console.log(err.message);
    }
    finally{
        connection.end();
        res.render('admin_page/grade_user.ejs',resultData);
    }
});

router.post('/black',async (req,res)=>{ //사용자 블랙등록
    if(!isAdmin(req)){ //Admin이 아니면 접근 불가
        return res.redirect('/');
    }
    var connection=mysql.createConnection(dbConfig);
    var blackUser={};
    blackUser.user_id=req.body.user_id;
    blackUser.black_st_date=moment().format('YYYY-MM-DD');
    blackUser.black_ed_date=moment().add(1, 'months').format('YYYY-MM-DD')//한 달 뒤
    blackUser.black_reason=req.body.black_reason;

    try{
        await updateBlackInUserInfo(blackUser.user_id,connection); //tb_user_info 업데이트
        await insertBlackUser(blackUser,connection); //tb_user_black에 데이터를 넣음
        await deleteUserGrade(blackUser.user_id,connection); //black된 사용자의 평점 정보 삭제
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member_grade');
    }
});

router.post('/unblack',async (req,res)=>{ //사용자 블랙해제
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가
    var connection=mysql.createConnection(dbConfig);
    var blackUserId=req.body.user_id;

    try{
        await updateUnBlackInUserInfo(blackUserId,connection);//tb_user_info 업데이트
        await deleteBlackUser(blackUserId,connection); //tb_user_black에 데이터를 삭제
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member_grade');
    }
});

module.exports=router;