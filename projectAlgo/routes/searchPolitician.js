// /search 라우터
const express=require('express');
<<<<<<< HEAD
var isNotLoggined=require('../scripts/confirmLogin').isNotLoggedIn;
=======

>>>>>>> 04d255e8d9aae116785cc48ba2492e6b55e1bb81
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
<<<<<<< HEAD
    password : 'algoalgo',
=======
    password : '12345678',
>>>>>>> 04d255e8d9aae116785cc48ba2492e6b55e1bb81
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경


//router.get('/') querystring 사용시 사용
<<<<<<< HEAD
router.get('/',(req,res)=>{
    var user={};

    if(isNotLoggined(req)){
      user=null
    }
    else{
      user=req.user;
    }

    var h_area1=req.query.h_area1;
    var h_area2=req.query.h_area2;
    var connection=mysql.createConnection(dbConfig);
    connection.query(`select * from tb_politician_info 
    where sdName like '%${h_area1}%' and sggName like '%${h_area2}%'` //나중에 sql injection 확인
    ,(err,politicians)=>{
        var searchResult=[];
        var status={};
        var resultData={};
        if(err)
        {
            console.log(err.message);
            status={status:500};
        }
=======
router.get('/:politicanName',(req,res)=>{
    var connection=mysql.createConnection(dbConfig);
    
    connection.query(`select * from tb_politician_info 
    where politician_name like '%s${connection.escape(req.params.politicianName)}%s'` //queryString은 req.query.politicianName
    ,(err,politicians)=>{ //정치인 이름 검색만 구현 조회
        var searchResult={searchResult:[]};
        var status={};
        var resultData={};
        if(err)
            status={status:500};
>>>>>>> 04d255e8d9aae116785cc48ba2492e6b55e1bb81
        else{
            status={status:200};
            for(let i=0;i<politicians.length;i++){
                politician={
<<<<<<< HEAD
                    politician_name:politicians[i].politician_name,
                    jdName:politicians[i].jdName,
                    birthday:politicians[i].birthday,
                    career2:politicians[i].career2,
=======
                    name:politicians[i].politician_name,
                    party:politicians[i].jdName,
                    district:politicians[i].sggName, //or politician.sdName+" "+politician.wiwName;
>>>>>>> 04d255e8d9aae116785cc48ba2492e6b55e1bb81
                    img:"/images/"+politicians[i].politician_no,
                    link:"/poltician/"+politicians[i].politician_no
                }

<<<<<<< HEAD
                searchResult.push(politician);
            }                                           
        }

        resultData={
            searchResult:searchResult,
            user:user
        };
         //상태값+모든 검색된 정치인 정보 Row
        
        console.log(searchResult);
        console.log(user);
        console.log(resultData);
        res.render('home.ejs', resultData); //나중에 render할 view 설정
=======
                searchResult.searchResult.push(politician);
            }
        }

        resultData=Object.assign(status,searchResult); //상태값+모든 검색된 정치인 정보 Row
        res.render('',resultData); //나중에 render할 view 설정
>>>>>>> 04d255e8d9aae116785cc48ba2492e6b55e1bb81
        connection.end();
    });
});

module.exports=router;