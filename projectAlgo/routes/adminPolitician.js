//admin/politician 라우터
const express=require('express');
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; 
//Admin 로그인 테스트 필요
router.get('/',(req,res)=>{
  /*if(!isAdmin(req))
    render({status:401,message:"접근불가"});*/
  
  var connection=mysql.createConnection(dbConfig);  
  connection.query('select * from tb_politician_info',(err,politicians)=>{ //정치인 테이블에서 조회
      var politicianResult={};
      var status={};
      var resultData={};
      if(err)     
          status={status:500};
      
      else{
          status={status:200};
          politicianResult=politicians;//JSON->Javascript 객체로 전환
      }

      resultData.status=status;
      resultData.politicianResult=politicianResult; //상태값+모든 정치인 정보 row
      connection.end();
      res.render('admin_page/candidate_info.ejs',resultData); //나중에 render할 view 설정
      
    });
});

router.put('/insert',(req,res)=>{ //정치인 정보 등록
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
          return;*/

    var politician_no=req.body.politician_no;
    var politician_name=req.body.politician_name;
    var sgId=req.body.sgId;
    var sgTypecode=req.bdoy.sgTypecode;
    var sggName=req.body.sggName;
    var sdName=req.body.sdName;
    var wiwName=req.body.wiwName;
    var jdName=req.body.jdName;
    var gender=req.body.gender;
    var birthday=req.body.birthday;
    var age=req.body.age;
    var addr=req.body.addr;
    var jobId=req.body.jobId;
    var job=req.body.job;
    var eduId=req.body.eduId;
    var edu=req.body.edu;
    var career1=req.body.career1;
    var career2=req.body.career2;
    var dugsu=req.body.dugsu;
    var dugyul=req.body.dugyul;
    var prmsCnt=req.body.prmsCnt;
    var prmsRate=req.body.prmsCnt;

    var connection=mysql.createConnection(dbConfig);
    connection.query(`insert into tb_politician_info values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                   [politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
                    ,age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate]
                   ,(err,result)=>{
                        if(err)
                            console.log(err.message);
        
                        res.redirect('/admin/politician');
                   });
    
});

router.put('/:politician_no',(req,res)=>{ //정치인 정보 수정
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/

    var politician_no=req.params.politician_no;
    var politician_name=req.body.politician_name;
    var sgId=req.body.sgId;
    var sgTypecode=req.bdoy.sgTypecode;
    var sggName=req.body.sggName;
    var sdName=req.body.sdName;
    var wiwName=req.body.wiwName;
    var jdName=req.body.jdName;
    var gender=req.body.gender;
    var birthday=req.body.birthday;
    var age=req.body.age;
    var addr=req.body.addr;
    var jobId=req.body.jobId;
    var job=req.body.job;
    var eduId=req.body.eduId;
    var edu=req.body.edu;
    var career1=req.body.career1;
    var career2=req.body.career2;
    var dugsu=req.body.dugsu;
    var dugyul=req.body.dugyul;
    var prmsCnt=req.body.prmsCnt;
    var prmsRate=req.body.prmsCnt;

    var connection=mysql.createConnection(dbConfig);
    connection.query(`update tb_politician_info set politician_no=?,politician_name=?,
    sgId=?,sgTypecode=?,sggName=?,sdName=?,wiwName=?,
    jdName=?,gender=?,birthday=?,age=?,addr=?,jobId=?,job=?,
    eduId=?,edu=?,career1=?,career2=?,dugsu=?,
    dugyul=?,prmsCnt=?,prmsRate=? 
    where politician_no=?`,  [politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
        ,age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate,politician_no],(err,result)=>{

                        if(err)
                            console.log(err.message);
                        
                        res.redirect('admin/politician');
                   });
});

router.delete('/:politician_no',(req,res)=>{ //정치인 정보 삭제
    /*if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;*/
    
    var politician_no=req.params.politician_no;
    
    connection.query(`delete from tb_politician_info where politician_no=?`,[politician_no],(err,result)=>{
        if(err)
            console.log(err.message);
        
        res.redirect('admin/politician');
    });
});
module.exports=router;