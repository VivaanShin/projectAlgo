///politician{politicianId} 라우터들
const express=require('express');
const pathUtil=require('path');
const fs=require('fs')
const mysql=require('mysql');
const getPoliticianNewsJSON=require('../scripts/getPoliticianNews').getPoliticianNewsJSON; //JSON방식으로 네이버 API에서 기사 정보를 가져오는 모듈함수
const moment=require('moment'); //시간 조작 모듈
const router=express.Router();
const isLoggedin=require('../scripts/confirmLogin').isLoggedIn;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; 

//쿼리용 Promise들
const getLegislationInfo=require('./queryPromise').getLegislationInfo;
//const getPoliticianNameByNo=require('./queryPromise').getPoliticianNameByNo;
const getPoliticianAllAverageGrade=require('./queryPromise').getPoliticianAllAverageGrade;
const getPoliticianWeekAverageGrade=require('./queryPromise').getPoliticianWeekAverageGrade;
const getUserPoliticianGradeByWeek=require('./queryPromise').getUserPoliticianGradeByWeek;
const updateGradeInfoRecord=require('./queryPromise').updateGradeInfoRecord;
//const updateUserPoliticianGrade=require('./queryPromise').updateUserPoliticianGrade;
const insertGradeInfoRecord=require('./queryPromise').insertGradeInfoRecord;
//const insertUserPoliticianGrade=require('./queryPromise').insertUserPoliticianGrade;
//const getPoliticianGradeByUser=require('./queryPromise').getPoliticianGradeByUser;
const getPoliticianInterestByNo=require('./queryPromise').getPoliticianInterestByNo;
const getPoliticianInfoByNo=require('./queryPromise').getPoliticianInfoByNo;
router.get('/:politician_no',async (req,res)=>{ //기본 신상 정보 라우터
    var resultData={};
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
    var politician_no=req.params.politician_no;
    try{
        var tempPoliticianInfo=await getPoliticianInfoByNo(politician_no,connection);
        var politicianInfo=tempPoliticianInfo[0];

        try{
            fs.statSync(pathUtil.resolve(__dirname, `../public/images/${politician_no}.jpg`));
            politicianInfo.img=`/images/${politician_no}.jpg`;
        }
        catch(err){
            if (err.code === 'ENOENT') {
                politicianInfo.img=`/images/default.jpg`; //Default Image
            }
        }

        var politicianInterest=await getPoliticianInterestByNo(politician_no,connection); //정치인 관심사 정보
        //politicianInfo.itScience=politicianInterest[0].itScience;
        //politicianInfo.economy=politicianInterest[0].economy;
        //politicianInfo.culture=politicianInterest[0].culture;
        //politicianInfo.society=politicianInterest[0].society;
        //politicianInfo.politics=politicianInterest[0].politics;

        politicianInfo.itScience=4;
        politicianInfo.economy=7;
        politicianInfo.culture=6;
        politicianInfo.society=8;
        politicianInfo.politics=3;

        resultData.politicianInfo=politicianInfo;
        var politicianLegislationInfo=await getLegislationInfo(politician_no,connection);
        resultData.politicianLegislationInfo=politicianLegislationInfo; //정치인 기본 정보
        var rawNewsData=await getPoliticianNewsJSON(politicianInfo.politician_name);
        var articleList=[];

        for(let i=0;i<rawNewsData.length;i++){ 
            var title=String(rawNewsData[i].title);

            title=title.replace(/<br\/>/ig,"\n");
            title=title.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig," ");
            title=title.replace(/[&quot;]/g," ");

            var push_news_data={
                articleTitle:title,
                articleLink:rawNewsData[i].originallink,
                articleDay:String(moment(String(rawNewsData[i].pubDate)).format('YYYY.MM.DD'))
            };

            articleList.push(push_news_data);
        }
        resultData.articleList=articleList;//정치인 뉴스 정보

        var tempGradeScore=await getPoliticianAllAverageGrade(politician_no); //정치인 전체 평균
        var gradeScore=0;

        if(tempGradeScore.length > 0){
            gradeScore=tempGradeScore[0].grade_score;
        }
        resultData.gradeScore=gradeScore;
        var gradeList=[]; //정치인 주당 평균

        var weekDay=moment().isoWeekday(0).format('YYYY-MM-DD');; //해당 주 일요일부터 4주까지
        console.log(moment(weekDay).isoWeek())
        
        for (let i=0;i<4;i++){//4주 까지 가져옴
            var tempWeekGrade=await getPoliticianWeekAverageGrade(politician_no,weekDay);
            var weekGrade=0;
            if(tempWeekGrade.length > 0){
                weekGrade=tempWeekGrade[0].grade_score;
            }
            weekElements={weekGrade:weekGrade,weekDay:weekDay};
            gradeList.push(weekElements);
            weekDay=moment().isoWeekday((i+1)*-7).format('YYYY-MM-DD');
        }
        resultData.gradeList=gradeList.reverse();

        if(isLoggedin(req)){ //로그인 정보
            resultData.user=req.user;
        }
        resultData.status=200;

        var isGivedGrade=req.session.isGivedGrade;

        if(typeof isGivedGrade !='undefined'){
            resultData.isGivedGrade=isGivedGrade;
            delete req.session.isGivedGrade;
            console.log(isGivedGrade);
        }

        var message=req.session.message;

        if(typeof message != 'undefined'){
            resultData.message=message;
            delete req.session.message;
        }
    }
    catch(err){
         resultData.status=500;
         console.log(err.message);
    }
    finally{
        connection.end();
        res.render('candidate_info.ejs',resultData);
    }
});

/*router.get('/:politician_no/legislation_info',async (req,res)=>{ //입법정보 라우터
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
    var resultData={}; //배열에 입법 정보 저장
    var politician_no=req.params.politician_no;

    try{
       resultData.legislation_info=await getLegislationInfo(politician_no,connection);
       resultData.status=200;

       if(isLoggedin(req)){
           resultData.user=req.user;
       }
    }
    catch(err){
        resultData.status=500;
    }
    finally{
        connection.end();
        res.render('',resultData); //나중에 프론트엔드 완성되면 view 지정
        
    }
});*/

/*router.get('/:politician_no/news',async (req,res)=>{//정치인 뉴스 라우터
    try{
        var politician_name=await getPoliticianNameByNo(req.params.politician_no);
        var rawNewsData=await getPoliticianNewsJSON(politician_name[0].politician_name);
        var articleList=[];
        var status={};

        for(let i=0;i<rawNewsData.length;i++){
            var push_news_data={
                articleTitle:rawNewsData[i].title,
                articleLink:rawNewsData[i].originallink,
                articleDay:String(moment(String(rawNewsData[i].pubDate)).format(YYYY.MM.DD))
            };

            articleList.push(push_news_data);
        }
        status=200;

        if(isLoggedin(req)){
            resultData.user=req.user;
        }
    }
    catch(err){
        console.log(err.message);
        status=500;
    }

    finally{
        resultData.articleList=articleList;
        resultData.status=status;
        res.render('',resultData);//나중에 프론트엔드 완성되면 view 지정
    }
});
*/
/*router.get('/:politician_no/grade',async (req,res)=>{ //정치인 평점 정보 라우터
    try{
        var status={};
        var resultData={};
        var politician_no=req.params.politician_no;
        var gradeAllAveragescore=await getPoliticianAllAverageGrade(politician_no);
        var gradeList=[];
        var weekDay=moment().day(0).format('YYYY-MM-DD'); //해당 주 월요일부터 4주까지 
        
        for (let i=0;i<4;i++){//4주 까지 가져옴
            weekGrade=await getPoliticianWeekAverageGrade(politician_no,weekDay);
            weekElements={weekGrade:weekGrade,weekDay:weekDay};
            gradeList.push(weekElements);
            weekDay=moment.day(i*-7).format('YYYY-MM-DD');
        }
        status=200;
        resultData.grade_score=gradeAllAveragescore;
        resultData.gradeList=gradeList;

        if(isLoggedin(req)){
            resultData.user=req.user;
        }
    }
    catch(err){
        status=500;
    }
    finally{
        res.render('',resultData) //나중에 프론트엔드 완성되면 view 지정
    }
});*/

router.put('/:politician_no/grade',async (req,res)=>{ //정치인 평점 등록

    if(!isLoggedin(req)){ //로그인 여부 확인
        res.redirect(`/politician/${req.params.politician_no}`);
        return;
    }

    var connection = mysql.createConnection(dbConfig);
    var grade_score=Number(req.body.grade);
    var user_id=req.user.user_id;
    var politician_no=req.params.politician_no;
    var dayInfo=moment().isoWeekday(0).format('YYYY-MM-DD');
    var isGivedGrade=0;
    var sendAlert="";
    console.log(grade_score);

    try{
        var grade_info=await getUserPoliticianGradeByWeek(connection,user_id,politician_no,dayInfo);

        if(grade_info.length > 0){ //이미 이번주에 평점을 주었다면 업데이트
            isGivedGrade=1;
            await updateGradeInfoRecord(connection,user_id,politician_no,dayInfo,grade_score);
            sendAlert=`<script type="text/javascript">alert("이번주 평점을 업데이트 했습니다.");window.location ="/politician/${politician_no}";</script>`;
            //await updateUserPoliticianGrade(connection,user_id,politician_no,grade_score);
        }
        else{ //아니면 값을 넣어줌
            //var userGrade=await getPoliticianGradeByUser(user_id,connection);
            
            /*if(userGrade.length > 0){//해당 정치인에게 평점을 준 적이 있다면
                await updateUserPoliticianGrade(connection,user_id,politician_no,grade_score);
            }
            else{ // 아니라면
                await insertUserPoliticianGrade(connection,user_id,politician_no,grade_score);
            }*/
            await insertGradeInfoRecord(connection,user_id,politician_no,grade_score);
            sendAlert=`<script type="text/javascript">alert("이번주 평점을 주었습니다.");window.location ="/politician/${politician_no}";</script>`;
        }
        
    }
    catch(err){
        console.log(err.message)
    }

    finally{
        connection.end();
        //res.redirect(`/${req.params.politician_no}/grade`);
        req.session.isGivedGrade=isGivedGrade;
        res.send(sendAlert);
        //res.redirect(`/politician/${req.params.politician_no}`);
    }
});
module.exports=router;