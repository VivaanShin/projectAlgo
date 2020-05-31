// /search 라우터
const express=require('express');
var isNotLoggined=require('../scripts/confirmLogin').isNotLoggedIn;
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경


//router.get('/') querystring 사용시 사용
router.get('/',(req,res)=>{
    var user={};

    if(isNotLoggined(req)){
      user={user:null}
    }
    else{
      user={user:req.user};
    }

    var h_area1=req.query.h_area1;
    var h_area2=req.query.h_area2;
    var connection=mysql.createConnection(dbConfig);
    connection.query(`select * from tb_politician_info 
    where sdName like '%s${connection.escape(h_area1)}%s' and sggName like '%s${connection.escape(h_area2)}%s'` //queryString은 req.query.politicianName
    ,(err,politicians)=>{
        var searchResult=[];
        var status={};
        var resultData={};
        if(err)
            status={status:500};
        else{
            status={status:200};
            for(let i=0;i<politicians.length;i++){
                politician={
                    politician_name:politicians[i].politician_name,
                    jdName:politicians[i].jdName,
                    birthday:politicians[i].birthday,
                    career2:politicians[i].career2,
                    img:"/images/"+politicians[i].politician_no,
                    link:"/poltician/"+politicians[i].politician_no
                }

                searchResult.push(politician);
            }                                           
        }

        resultData=Object.assign(status,[searchResult,user]);
         //상태값+모든 검색된 정치인 정보 Row
        
        console.log(h_area1);
        console.log(h_area2);
        console.log(resultData);
        res.render('home.ejs', user); //나중에 render할 view 설정
        connection.end();
    });
});

module.exports=router;