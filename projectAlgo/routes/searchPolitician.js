// /search 라우터
const express=require('express');
var isLoggined=require('../scripts/confirmLogin').isLoggedIn;
const searchPoliticianBySdNameAndSggName=require('./queryPromise').searchPoliticianBySdNameAndSggName;
const getPoliticianInterestByNo=require('./queryPromise').getPoliticianInterestByNo;
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경


//router.get('/') querystring 사용시 사용
router.get('/',async (req,res)=>{
    var h_area1=req.query.h_area1;
    var h_area2=req.query.h_area2;
    var resultData={};
    var connection=mysql.createConnection(dbConfig);
    try{
        if(typeof h_area1 !='undefined' && typeof h_area2 !='undefined'){
            var searchResult=[];
            h_area1=h_area1.replace('+',' ');
            h_area2=h_area2.replace('+',' ');
            var politicians=await searchPoliticianBySdNameAndSggName(h_area1,h_area2,connection);

            for(let i=0;i<politicians.length;i++){
                politician={
                    politician_no:politicians[i].politician_no,
                    politician_name:politicians[i].politician_name,
                    jdName:politicians[i].jdName,
                    birthday:politicians[i].birthday,
                    career1:politicians[i].career1,
                    career2:politicians[i].career2,
                    img:"/images/"+politicians[i].politician_no,
                    link:"/politician/"+politicians[i].politician_no
                };
                var politician_interest=await getPoliticianInterestByNo(politician.politician_no,connection); //정치인 관심사 정보를 가져옴
                //politician.itScience=politician_interest[0].itScience;
                //politician.economy=politician_interest[0].economy;
                //politician.culture=politician_interest[0].culture;
                //politician.society=politician_interest[0].society;
                //politician.politics=politician_interest[0].politics;

                politician.itScience=5;
                politician.economy=7;
                politician.culture=6;
                politician.society=3;
                politician.politics=8;
                searchResult.push(politician);
            }                                           
            resultData.searchResult=searchResult;
            console.log(searchResult);
        }

        if(isLoggined){
            resultData.user=req.user;
            console.log(resultData.user);
        }
         //세션 상태값+모든 검색된 정치인 정보 Row

         resultData.status=200;
    }
    catch(err){
        resultData.status=500;
        console.log(err.message);
    }

    finally{
        console.log(resultData);
        connection.end();
        res.render('search.ejs', resultData);
    }
});
   

module.exports=router;
