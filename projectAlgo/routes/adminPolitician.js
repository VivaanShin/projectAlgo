//admin/politician 라우터
const express=require('express');
const isAdmin=require('../scripts/confirmAdmin').isAdmin;
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'project_algo'
  }; 
//Admin 로그인 테스트 필요
router.get('/',(req,res)=>{
  if(!isAdmin(req))
    render({status:401,message:"접근불가"});
  
  var connection=mysql.createConnection(dbConfig);  
  connection.query('select * from tb_politician_info',(err,politicians)=>{ //정치인 테이블에서 조회
      var politicianResult={personalInfo:[]};
      var status={};
      var resultData={};
      if(err)     
          status={status:500};
      
      else{
          status={status:200};
          politicianResult.personalInfo=politicians;//JSON->Javascript 객체로 전환
      }

      resultData=Object.assign(status,policitianResult); //상태값+모든 정치인 정보 row
      res.render('',resultData); //나중에 render할 view 설정
      connection.end();
    });
});

router.put('/insert',(req,res)=>{ //정치인 정보 등록
    if(!isAdmin(req)) //Admin이 아니면 접근 불가
          return;

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
    connection.query(`insert into tb_politician_info values(
                   ${connection.escape(politician_no)},${connection.escape(politician_name)},
                   ${connection.escape(sgId)},${connection.escape(sgTypecode)},${connection.escape(sggName)},
                   ${connection.escape(sdName)},${connection.escape(wiwName)},
                   ${connection.escape(jdName)},${connection.escape(gender)},${connection.escape(birthday)},${connection.escape(age)},
                   ${connection.escape(addr)},${connection.escape(jobId)},${connection.escape(job)},
                   ${connection.escape(eduId)},${connection.escape(edu)},
                   ${connection.escape(career1)},${connection.escape(career2)},${connection.escape(dugsu)},
                   ${connection.escape(dugyul)},${connection.escape(prmsCnt)},${connection.escape(prmsRate)})`,(err,result)=>{

                        if(err)
                            res.render('',{status:500});
                        else
                            res.render('',{status:200});
                   });
});

router.put('/:politician_no',(req,res)=>{ //정치인 정보 수정
    if(!isAdmin(req)) //Admin이 아니면 접근 불가
        return;

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
    connection.query(`update tb_politician_info set
    politician_no=${connection.escape(politician_no)},politician_name=${connection.escape(politician_name)},
    sgId=${connection.escape(sgId)},sgTypecode=${connection.escape(sgTypecode)},sggName=${connection.escape(sggName)},
    sdName=${connection.escape(sdName)},wiwName=${connection.escape(wiwName)},
    jdName=${connection.escape(jdName)},gender=${connection.escape(gender)},birthday=${connection.escape(birthday)},age=${connection.escape(age)},
    addr=${connection.escape(addr)},jobId=${connection.escape(jobId)},job=${connection.escape(job)},
    eduId=${connection.escape(eduId)},edu=${connection.escape(edu)},
    career1=${connection.escape(career1)},career2=${connection.escape(career2)},dugsu=${connection.escape(dugsu)},
    dugyul=${connection.escape(dugyul)},prmsCnt=${connection.escape(prmsCnt)},prmsRate=${connection.escape(prmsRate)} 
    where politician_no=${connection.escape(req.params.politician_no)}`,(err,result)=>{

                        if(err)
                            res.render('',{status:500});
                        else
                            res.render('',{status:200});
                   });
});

module.exports=router;