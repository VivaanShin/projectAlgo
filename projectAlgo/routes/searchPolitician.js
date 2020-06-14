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
            h_area1=h_area1.replace(' ','');
            h_area2=h_area2.replace(' ','');
            var politicians=await searchPoliticianBySdNameAndSggName(h_area1,h_area2,connection);

            for(let i=0;i<politicians.length;i++){
                var politician={
                    politician_no:politicians[i].politician_no,
                    politician_name:politicians[i].politician_name,
                    jdName:politicians[i].jdName,
                    birthday:politicians[i].birthday,
                    career1:politicians[i].career1,
                    career2:politicians[i].career2,
                    img:"/images/"+politicians[i].politician_no+".jpg",
                    link:"/politician/"+politicians[i].politician_no
                };
                var politician_interest=await getPoliticianInterestByNo(politician.politician_no,connection); //정치인 관심사 정보를 가져옴
                politician.itScience=politician_interest[0].itScience;
                politician.economy=politician_interest[0].economy;
                politician.culture=politician_interest[0].culture;
                politician.society=politician_interest[0].society;
                politician.politics=politician_interest[0].politics;

                searchResult.push(politician);
            }
            resultData.searchResult=searchResult;
            console.log(searchResult);
        }

        if(isLoggined){
            resultData.user=req.user;
            resultData.user.user_interest_check=req.session.user_interest_check;
        }
         //세션 상태값+모든 검색된 정치인 정보 Row

         var message=req.session.message;

         if(typeof message != 'undefined'){
             resultData.message=message;
             delete req.session.message;
         }

         resultData.status=200;
    }
    catch(err){
        resultData.status=500;
        console.log(err.message);
    }

    finally{
        var nowUrl=req.session.nowUrl;
        if(typeof nowUrl != 'undefined'){
          delete req.session.nowUrl;
        }
        console.log(resultData);
        connection.end();
        res.render('search.ejs', resultData);
    }
});


module.exports=router;
