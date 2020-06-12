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
const getGradeInfoRecord=require('./queryPromise').getGradeInfoRecord;
const updateAdminGradeInfoRecord=require('./queryPromise').updateAdminGradeInfoRecord;
const deleteGradeInfoRecord=require('./queryPromise').deleteGradeInfoRecord;
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
router.get('/',async (req,res)=>{ //tb_gradeinfo_record에서 가져옴
    if(!isAdmin(req)){
        return res.redirect('/');
    }

    var connection=mysql.createConnection(dbConfig);
    var resultData={};
    var page=req.query.page;

    if(typeof page =='undefined'){
        page=1
    }

    page=Number(page);

    try{
        var gradeInfoRecord=await getGradeInfoRecord(connection);
        var total=gradeInfoRecord.length;
        var startPage=(page-1)*10;
        
        if(page <=0 || page >total/pagingNum){//잘 못된 페이지 처리
            page=1
            return;
        }
        else if(page==total/pagingNum) { //마지막 페이지 처리
            resultData.gradeInfoRecord=gradeInfoRecord.slice(startPage);
        }
        else{
            var endPage=page*10;
            resultData.gradeInfoRecord=gradeInfoRecord.slice(startPage,endPage);
        }
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

router.put('/',async (req,res)=>{ //정치인 평점 정보 수정
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가
        
    
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
        res.redirect('/admin/politician_grade?page=1'); //view 설정
    }
});

router.delete('/',async (req,res)=>{ //정치인 평점 정보 삭제
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가
    
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
        res.redirect('/admin/politician_grade?page=1'); //view 설정
    }
});
module.exports=router;
