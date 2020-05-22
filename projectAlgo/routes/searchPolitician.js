// /search 라우터
const express=require('express');

const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경


//router.get('/') querystring 사용시 사용
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
        else{
            status={status:200};
            for(let i=0;i<politicians.length;i++){
                politician={
                    name:politicians[i].politician_name,
                    party:politicians[i].jdName,
                    district:politicians[i].sggName, //or politician.sdName+" "+politician.wiwName;
                    img:"/images/"+politicians[i].politician_no,
                    link:"/poltician/"+politicians[i].politician_no
                }

                searchResult.searchResult.push(politician);
            }
        }

        resultData=Object.assign(status,searchResult); //상태값+모든 검색된 정치인 정보 Row
        res.render('',resultData); //나중에 render할 view 설정
        connection.end();
    });
});

module.exports=router;