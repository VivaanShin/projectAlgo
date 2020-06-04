const express=require('express');
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};

const getAllLegislation=require('./queryPromise').getAllLegislation;
const insertPoliticianLegislation=require('./queryPromise').insertPoliticianLegislation;
const deletePoliticianLegislation=require('./queryPromise').deletePoliticianLegislation;
const deletePoliticianLegislationRel=require('./queryPromise').deletePoliticianLegislationRel;

router.get('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        res.render({status:401,message:"접근불가"});
    }*/

    var connection = mysql.createConnection(dbConfig);
    var resultData={};
    try{
        resultData.legislation=await getAllLegislation(connection); //tb_politician_legislation
    }
    catch(err){
        console.log(err.message);
        resultData.status=500;
    }
    finally{
        connection.end();
        res.render()//view 설정
    }
});
router.put('/',async (req,res)=>{ //입법정보 저장
    /*if(!isAdmin(req)){
        return;
    }*/
    var connection = mysql.createConnection(dbConfig);
    var newLegislation={};
    newLegislation.issue_id=req.body.issue_id;
    newLegislation.issue_no=req.body.issue_no;
    newLegislation.issue_name=req.body.issue_name;
    newLegislation.proposerKind=req.body.proposerKind;
    newLegislation.proposeDt=req.body.proposeDt;
    newLegislation.procDt=req.body.procDt;
    newLegislation.generalResult=req.body.generalResult;
    newLegislation.summary=req.body.summary;
    newLegislation.procStageCd=req.body.procStageCd;
    newLegislation.passGubn=req.body.passGubn;
    newLegislation.curr_committee=req.body.curr_committee;

    try{
        await insertPoliticianLegislation(new_legislation,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/legislation');
    }
});
router.put('/:issue_id',async (req,res)=>{ //입법정보 수정
    /*if(!isAdmin(req)){
        return;
    }*/

    var connection = mysql.createConnection(dbConfig);
    var updateLegislation={};
    updateLegislation.issue_id=req.pa.issue_id;
    updateLegislation.issue_no=req.body.issue_no;
    updateLegislation.issue_name=req.body.issue_name;
    updateLegislation.proposerKind=req.body.proposerKind;
    updateLegislation.proposeDt=req.body.proposeDt;
    updateLegislation.procDt=req.body.procDt;
    updateLegislation.generalResult=req.body.generalResult;
    updateLegislation.summary=req.body.summary;
    updateLegislation.procStageCd=req.body.procStageCd;
    updateLegislation.passGubn=req.body.passGubn;
    updateLegislation.curr_committee=req.body.curr_committee;
    try{
        await updatePoliticianLegislation(update_legislation,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/legislation');
    }
});

router.delete('/',async (req,res)=>{ //입법정보 삭제
    var connection = mysql.createConnection(dbConfig);
    var deleteLegislationId=req.body.issue_id;

    try{
        await deletePoliticianLegislation(deleteLegislationId,connection);
        await deletePoliticianLegislationRel(deleteLegislationId,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/legislation');
    }
});

module.exports=router;