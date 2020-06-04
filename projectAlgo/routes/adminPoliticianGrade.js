const express=require('express');
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};
const getGradeInfoRecord=require('./queryPromise').getGradeInfoRecord;
router.get('/',async (req,res)=>{ //tb_gradeinfo_record에서 가져옴
    /*if(!isAdmin(req)){
        res.render({status:401, message="접근불가"});
    }*/

    var connection=mysql.createConnection(dbConfig);
    var resultData={};

    try{
        resultData.gradeInfoRecor=await getGradeInfoRecord(connection); 
    }
    catch(err){
        console.log(err.message);
        resultData.status=500;
    }
    finally{
        connection.end();
        res.render('',resultData); //view 설정
    }
})