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
const pagingNum=10; //페이징 한 페이지에 10개 
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
    connection.query('select * from tb_politician_info',(err,politicians)=>{ //정치인 테이블에서 조회
        var resultData={};
        if(err)     
            resultData.status=500;
      
        else{
            politicians=JSON.parse(JSON.stringify(politicians));
            resultData.status=200;
            //resultData.politicianResult=politicians;//상태값+모든 정치인 정보 row
            var total=politicians.length;
            resultData.total=total;
            var startPage=(page-1)*pagingNum;

            if(page<=0 || page > total/pagingNum){ //잘 못된 페이지가 들어왔을 시
                res.redirect('/admin/politician?page=1');
                return;
            }
            else if(page == total/pagingNum){ //마지막 페이지 처리
                resultData.politicianResult=politicians.slice(startPage);
            }
            else{ //일반적인 페이지 처리
                var endPage=page*pagingNum;
                resultData.politicianResult=politicians.slice(startPage,endPage);

            }
        } 
        connection.end();
        res.render('admin_page/candidate_info.ejs',resultData); //나중에 render할 view 설정
      
      });
});

router.put('/',(req,res)=>{ //정치인 정보 등록
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가

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
        
                        res.redirect('/admin/politician?page=1');
                   });
    
});

router.put('/:politician_no',(req,res)=>{ //정치인 정보 수정
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가

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
                        
                        res.redirect('admin/politician?page=1');
                   });
});

router.delete('/:politician_no',(req,res)=>{ //정치인 정보 삭제
    if(!isAdmin(req)){
        return res.redirect('/');
    } //Admin이 아니면 접근 불가
    
    var politician_no=req.params.politician_no;
    
    connection.query(`delete from tb_politician_info where politician_no=?`,[politician_no],(err,result)=>{
        if(err)
            console.log(err.message);
        
        res.redirect('admin/politician?page=1');
    });
});
module.exports=router;