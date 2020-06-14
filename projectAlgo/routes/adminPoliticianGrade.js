const express=require('express');
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};
const pagingNum=10; //한 페이지 갯수 10개
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const getAllPoliticianInfo=require('./queryPromise').getAllPoliticianInfo;
const getPoliticianAllAverageGradeAndCount=require('./queryPromise').getPoliticianAllAverageGradeAndCount;
router.get('/',async (req,res)=>{ //tb_gradeinfo_record에서 가져옴
    if(!isAdmin(req)){
        return res.redirect('/');
    }

    var connection=mysql.createConnection(dbConfig);
    var resultData={};

    try{
        var politicians=await getAllPoliticianInfo(connection);
        var gradeList=[];

        for(let i=0;i<politicians.length;i++){
            var onePolitician=politicians[i];
            var averageAndCount=await getPoliticianAllAverageGradeAndCount(connection,one_politician.politician_no);
            onePolitician.avg=(!averageAndCount[0].avg) ? 0:averageAndCount[0].avg;
            onePolitician.count=averageAndCount[0].count;

            gradeList.push(onePolitician);
            console.log(onePolitician);
        }

        console.log(gradeList);
        resultData.gradeList=gradeList;
    }
    catch(err){
        console.log(err.message);
        resultData.status=500;
    }
    finally{
        connection.end();
        res.render('admin_page/grade_candidate.ejs',resultData); //view 설정
    }
});
module.exports=router;
