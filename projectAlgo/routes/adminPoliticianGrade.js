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
const updateAdminGradeInfoRecord=require('./queryPromise').updateAdminGradeInfoRecord;
const deleteGradeInfoRecord=require('./queryPromise').deleteGradeInfoRecord;
router.get('/',async (req,res)=>{ //tb_gradeinfo_record에서 가져옴
    /*if(!isAdmin(req)){
        res.render({status:401, message="접근불가"});
    }*/

    var connection=mysql.createConnection(dbConfig);
    var resultData={};

    try{
        resultData.gradeInfoRecord=await getGradeInfoRecord(connection); 
    }
    catch(err){
        console.log(err.message);
        resultData.status=500;
    }
    finally{
        connection.end();
        res.render('',resultData); //view 설정
    }
});

router.put('/',async (req,res)=>{ //정치인 평점 정보 수정
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    
    var connection=mysql.createConnection(dbConfig);
    var updateGrade={};

    updateGrade.grade_st_date=req.body.grade_st_date;
    updateGrade.grade_ed_date=req.body.grade_ed_date;
    updateGrade.user_id=req.body.user_id;
    updateGrade.politician_no=req.body.politician_no;
    updateGrade.grade_score=req.body.grade_score;

    try{
        await updateAdminGradeInfoRecord(updateGrade,connection); 
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/politician_grade'); //view 설정
    }
});

router.delete('/',async (req,res)=>{ //정치인 평점 정보 삭제
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    
    var connection=mysql.createConnection(dbConfig);
    var deleteGrade={};

    deleteGrade.grade_st_date=req.body.grade_st_date;
    deleteGrade.grade_ed_date=req.body.grade_ed_date;
    deleteGrade.user_id=req.body.user_id;
    deleteGrade.politician_no=req.body.politician_no;
    deleteGrade.grade_score=req.body.grade_score;

    try{
        await deleteGradeInfoRecord(deleteGrade,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/politician_grade'); //view 설정
    }
});
module.exports=router;
