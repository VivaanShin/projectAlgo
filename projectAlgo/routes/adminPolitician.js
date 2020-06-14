//admin/politician 라우터
const express=require('express');
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const mysql=require('mysql');
const { request } = require('express');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};
const pagingNum=10; //페이징 한 페이지에 10개
const insertPoliticianInfo=require('./queryPromise').insertPoliticianInfo;
const insertPoliticianInterest=require('./queryPromise').insertPoliticianInterest;
const updatePoliticianInfo=require('./queryPromise').updatePoliticianInfo;
const updatePoliticianInterest=require('./queryPromise').updatePoliticianInterest;
const deletePoliticianInfo=require('./queryPromise').deletePoliticianInfo;
const deletePoliticianInterest=require('./queryPromise').deletePoliticianInterest;
const unsetForeignKeyChecks=require('./queryPromise').unsetForeignKeyChecks;
const setForeignKeyChecks=require('./queryPromise').setForeignKeyChecks;
router.get('/',(req,res)=>{
  if(!isAdmin(req)){
    return res.redirect('/');
  }

    var page=req.query.page;
    if(typeof page=='undefined'){
        page=1;
    }

    page=Number(page);
  
    var connection=mysql.createConnection(dbConfig);  
    connection.query('select * from tb_politician_info as pol, tb_politician_interest as int where pol.politician_no=int.politician_no',(err,politicians)=>{ //정치인성향 계산이 필요
    //connection.query('select * from tb_politician_info',(err,politicians)=>{
        var resultData={};
        console.log(politicians);
        if(err){
            console.log(err.message);   
            resultData.status=500;
        }
      
        else{
            politicians=JSON.parse(JSON.stringify(politicians));
            console.log(politicians);
            resultData.status=200;
            var total=politicians.length;
            resultData.total=total;
            var startPage=(page-1)*pagingNum;

            if(page<=0 || page > Math.ceil(total/pagingNum)){ //잘 못된 페이지가 들어왔을 시
                page=1
            }
            else if(page == Math.ceil(total/pagingNum)){ //마지막 페이지 처리
                resultData.politicianResult=politicians.slice(startPage);
            }
            else{ //일반적인 페이지 처리
                var endPage=page*pagingNum;
                resultData.politicianResult=politicians.slice(startPage,endPage);

            }

            /*for(i=0;i<resultData.politicianResult.length;i++){ //임시이므로 성향 계산이 다 되면 삭제해야함
                resultData.politicianResult[i].itScience=0;
                resultData.politicianResult[i].economy=0;
                resultData.politicianResult[i].culture=0;
                resultData.politicianResult[i].society=0;
                resultData.politicianResult[i].politics=0;
            }*/

            connection.end();
            res.render('admin_page/candidate_info.ejs',resultData); //나중에 render할 view 설정
        } 
      
      });
});

router.put('/',async (req,res)=>{ //정치인 정보 등록
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가

    console.log(req.body);
    var politician_no=req.body.politician_no;
    var politician_name=req.body.politician_name;
    var sgId=20200415;
    var sgTypecode=2;
    var sggName=req.body.sdName;
    var sdName=req.body.sdName;
    var wiwName=req.body.wiwName;
    var jdName=req.body.jdName;
    var gender=1;
    var birthday=req.body.birthday;
    var age=50;
    var addr=sggName+" "+sdName;
    var jobId=0;
    var job=req.body.job;
    var eduId=0;
    var edu=req.body.edu;
    var career1=req.body.career2;
    var career2=req.body.career2;
    var dugsu=0;
    var dugyul=0;
    var prmsCnt=0;
    var prmsRate=0;
    var itScience=req.body.itScience;
    var economy=req.body.economy;
    var culture=req.body.culture;
    var society=req.body.society;
    var politics=req.body.politics;

    var connection=mysql.createConnection(dbConfig);
    /*connection.query(`insert into tb_politician_info values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                   [politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
                    age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate]
                   ,(err,result)=>{
                        if(err)
                            console.log(err.message);
        
                        res.redirect('/admin/politician?page=1');
                   });
    */

    try{
        await unsetForeignKeyChecks(connection);
        await insertPoliticianInfo(connection,politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate);
        await insertPoliticianInterest(connection,politician_no,itScience,economy,culture,society,politics);
        await setForeignKeyChecks(connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
    }
   
});

router.put('/:politician_no',async (req,res)=>{ //정치인 정보 수정
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가

    var politician_no=parseInt(req.params.politician_no);
    var politician_name=req.body.politician_name;
    var sgId=20200415;
    var sgTypecode=2;
    var sggName=req.body.sdName;
    var sdName=req.body.sdName;
    var wiwName=req.body.wiwName;
    var jdName=req.body.jdName;
    var gender=1;
    var birthday=req.body.birthday;
    var age=50;
    var addr=sggName+" "+sdName;
    var jobId=0;
    var job=req.body.job;
    var eduId=0;
    var edu=req.body.edu;
    var career1=req.body.career2;
    var career2=req.body.career2;
    var dugsu=0;
    var dugyul=0;
    var prmsCnt=0;
    var prmsRate=0;
    var itScience=req.body.itScience;
    var economy=req.body.economy;
    var culture=req.body.culture;
    var society=req.body.society;
    var politics=req.body.politics;
    
    connection=mysql.createConnection(dbConfig);

    try{
        await updatePoliticianInfo(connection,politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
            age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate);
        await updatePoliticianInterest(connection,politician_no,itScience,economy,culture,society,politics);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
        res.send(`<script type="text/javascript">alert("응답");window.location="/admin/politician";</script>`);
    }
});

router.delete('/:politician_no',async (req,res)=>{ //정치인 정보 삭제
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가
    var connection=mysql.createConnection(dbConfig);
    var politician_no=req.params.politician_no;
    

    try{
        await unsetForeignKeyChecks(connection);
        await deletePoliticianInfo(connection,politician_no);
        await deletePoliticianInterest(connection,politician_no);
        await setForeignKeyChecks(connection);
    }
    catch(err){
        console.log(err.message);
    }
    finally{
        connection.end();
    }
});
module.exports=router;