const express=require('express');
const mysql=require('mysql');
const moment=require('moment');
const router=express.Router();
const getAllUserInfo=require('./queryPromise').getAllUserInfo;
const getUserGradeCountAndAvg=require('./queryPromise').getUserGradeCountAndAvg;
const getUserGrade=require('./queryPromise').getUserGrade;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};

router.get('/',async (req,res)=>{
    var connection=mysql.createConnection(dbConfig);
    var gradeInfoSet={};

    try{
        var userInfo=await getAllUserInfo(connection);
        var gradeInfo=[];

        for (let i=0;i<userInfo.length;i++){ //유저평점관리 render
            var oneUser={};
            oneUser.user_id=userInfo[i].user_id;
            oneUser.user_email=userInfo[i].user_email;
            var usersGradeCountAndAvg=await getUserGradeCountAndAvg(oneUser.user_id,connection);

            oneUser.count=usersGradeCountAndAvg.count;
            oneUser.avg=usersGradeCountAndAvg.avg;

            gradeInfo.push(oneUser);
        }

        gradeInfoSet.gradeInfo=gradeInfo;
        gradeInfoSet.gradeDetailInfo=await getUserGrade(connection); // 유저 평점 상세정보 render
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.render('admin/grade_user.ejs',gradeInfoSet)
    }
});

module.exports=router;