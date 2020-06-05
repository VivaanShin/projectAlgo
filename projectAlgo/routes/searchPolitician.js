// /search 라우터
const express=require('express');

var isLoggined=require('../scripts/confirmLogin').isLoggedIn;

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
    var h_area1=req.query.h_area1.replace(' ','');
    var h_area2=req.query.h_area2.replace(' ','');

    if(typeof h_area1 !='undefined' && typeof h_area2 !='undefined'){
        console.log('%'+h_area1+'%');
        console.log('%'+h_area2+'%');
    }
    var connection=mysql.createConnection(dbConfig);
    connection.query(`select * from tb_politician_info 
    where sdName like ? and sggName like ?` //선거구와 시도 이름으로 가져옴
    ['%'+h_area1+'%','%'+h_area2+'%'],(err,politicians)=>{
        var searchResult=[];
        var status={};
        var resultData={};
        if(err)
        {
            console.log(err.message);
            status={status:500};
        }
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


        resultData.searchResult=searchResult;
        
        if(isLoggined){
            resultData.user=req.user;
            console.log(resultData.user);
        }
         //세션 상태값+모든 검색된 정치인 정보 Row
        
        console.log(searchResult);
        console.log(resultData);
        connection.end();
        res.render('search.ejs', resultData); 
    });
});

module.exports=router;
