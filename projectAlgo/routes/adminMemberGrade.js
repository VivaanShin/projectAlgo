const express=require('express');
const mysql=require('mysql');
const moment=require('moment');
const router=express.Router();
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserGradeCountAndAvg=require('./queryPromise').getUserGradeCountAndAvg;
const getUserGrade=require('./queryPromise').getUserGrade;
const updateBlackInUserInfo=require('./queryPromise').updateBlackInUserInfo;
const insertBlackUser=require('./queryPromise').insertBlackUser;
const updateUnBlackInUserInfo=require('./queryPromise').updateUnBlackInUserInfo;
const deleteBlackUser=require('./queryPromise').deleteBlackUser;
const updateUserPoliticianGrade=require('./queryPromise').updateUserPoliticianGrade;
const deleteUserPoliticianGrade=require('./queryPromise').deleteUserPoliticianGrade;
const pagingNum=10;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};

router.get('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        res.render({status:401, message="접근불가"});
    }*/
    var connection=mysql.createConnection(dbConfig);
    var resultData={};
    var gradePage=req.query.grade_page; //유저 평점 관리 페이지
    var detailPage=req.query.detail_page; //유저 평점 상세정보 페이지
    try{
        var userInfo=await getAllUserInfo(connection);
        var gradeTotal=userInfo.length;
        resultData.gradeTotal=gradeTotal;
        var gradeInfo=[];

        if(typeof gradePage=='undefined' || typeof detailPage =='undefined'){
            gradePage=1;
            detailPage=1;
        }

        gradePage=Number(gradePage);
        detailPage=Number(detailPage);

        var startGradePage=(gradePage-1)*pagingNum;

        if(gradePage <=0 || gradePage>gradeTotal/pagingNum){//잘 못된 페이지처리
            res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
            return;
        }
        else if(gradePage==gradeTotal/pagingNum){ //마지막 페이지 처리
            var endGradePage=gradeTotal;
        }
        else{ //일반적인 페이지처리
            var endGradePage=gradePage*pagingNum;
        }
        for (let i=startGradePage;i<endGradePage;i++){ //유저평점관리 render
            var oneUser={};
            oneUser.user_id=userInfo[i].user_id;
            oneUser.user_email=userInfo[i].user_email;
            oneUser.user_black=userInfo[i].user_black;
            var usersGradeCountAndAvg=await getUserGradeCountAndAvg(oneUser.user_id,connection);

            oneUser.count=usersGradeCountAndAvg.count;
            oneUser.avg=usersGradeCountAndAvg.avg;

            gradeInfo.push(oneUser);
        }

        resultData.gradeInfo=gradeInfo;
        var gradeDetailInfo=await getUserGrade(connection); // 유저 평점 상세정보 render
        var detailTotal=gradeDetailInfo.length;
        resultData.detailTotal=detailTotal;

        var startDetailPage=(detailPage-1)*pagingNum;

        if(detailPage <=0 || detailPage>detailTotal/pagingNum){
            res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
            return;
        }
        else if(detailPage==detailTotal/pagingNum){
            resultData.gradeDetailInfo=gradeDetailInfo.slice(startDetailPage);
        }
        else{
            var endDetailPage=detailPage*pagingNum;
            resultData.gradeDetailInfo=gradeDetailInfo.slice(startDetailPage,endDetailPage);
        }
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

router.put('/black',async (req,res)=>{ //사용자 블랙등록
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    var connection=mysql.createConnection(dbConfig);
    var blackUser={};
    blackUser.user_id=req.body.user_id;
    blackUser.black_st_date=moment().format('YYYY-MM-DD');
    blackUser.black_ed_date=moment().add(1, 'months').format('YYYY-MM-DD')//한 달 뒤
    blackUser.black_reason=req.body.black_reason;

    try{
        await updateBlackInUserInfo(blackUser.user_id,connection); //tb_user_info 업데이트
        await insertBlackUser(blackUser,connection); //tb_user_black에 데이터를 넣음
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
    }
});

router.put('/unblack',async (req,res)=>{ //사용자 블랙해제
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
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
        res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
    }
});

router.put('/',async (req,res)=>{ //tb_user_politician_grade update
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    var connection=mysql.createConnection(dbConfig);
    var updateUserGrade={};
    updateUserGrade.user_id=req,body.user_id;
    updateUserGrade.politician_no=req.body.politician_no;
    updateUserGrade.grade_score=req.body.grade_score;

    try{
        await updateUserPoliticianGrade(connection,updateUserGrade.user_id,updateUserGrade.politician_no,updateUserGrade.grade_score);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
    }

});

router.delete('/',async (req,res)=>{ //tb_user_politician_grade delete
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    var connection=mysql.createConnection(dbConfig);
    var deleteUserGrade={};
    deleteUserGrade.user_id=req,body.user_id;
    deleteUserGrade.politician_no=req.body.politician_no;

    try{
        await deleteUserPoliticianGrade(deleteUserGrade.user_id,deleteUserGrade.politician_no,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/member_grade?grade_page=1&detail_page=1');
    }

});
module.exports=router;