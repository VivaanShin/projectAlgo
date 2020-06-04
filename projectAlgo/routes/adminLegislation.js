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
    var new_legislation={};
    new_legislation.issue_id=req.body.issue_id;
    new_legislation.issue_no=req.body.issue_no;
    new_legislation.issue_name=req.body.issue_name;
    new_legislation.proposerKind=req.body.proposerKind;
    new_legislation.proposeDt=req.body.proposeDt;
    new_legislation.procDt=req.body.procDt;
    new_legislation.generalResult=req.body.generalResult;
    new_legislation.summary=req.body.summary;
    new_legislation.procStageCd=req.body.procStageCd;
    new_legislation.passGubn=req.body.passGubn;
    new_legislation.curr_committee=req.body.curr_committee;

    try{
        await insertPoliticianLegislation(new_legislation,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/legislation')
    }
});
router.put('/:issue_id',async (req,res)=>{ //입법정보 수정
    /*if(!isAdmin(req)){
        return;
    }*/

    var connection = mysql.createConnection(dbConfig);
    var update_legislation={};
    update_legislation.issue_id=req.pa.issue_id;
    update_legislation.issue_no=req.body.issue_no;
    update_legislation.issue_name=req.body.issue_name;
    update_legislation.proposerKind=req.body.proposerKind;
    update_legislation.proposeDt=req.body.proposeDt;
    update_legislation.procDt=req.body.procDt;
    update_legislation.generalResult=req.body.generalResult;
    update_legislation.summary=req.body.summary;
    update_legislation.procStageCd=req.body.procStageCd;
    update_legislation.passGubn=req.body.passGubn;
    update_legislation.curr_committee=req.body.curr_committee;
    try{
        await updatePoliticianLegislation(update_legislation,connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.redirect('/admin/legislation')
    }
});

router.delete('/',async (req,res)=>{
    var connection = mysql.createConnection(dbConfig);
});

module.exports=router;