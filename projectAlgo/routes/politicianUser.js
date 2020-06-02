///politician{politicianId} 라우터들
const express=require('express');
const fs=require('fs')
const mysql=require('mysql');
const getPoliticianNewsJSON=require('../scripts/getPoliticianNews').getPoliticianNewsJSON; //JSON방식으로 네이버 API에서 기사 정보를 가져오는 모듈함수
const moment=require('moment'); //시간 조작 모듈
const router=express.Router();
const isLoggedin=require('../scripts/confirmLogin').isLoggedin;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; 

//쿼리용 Promise들
const getBillInfo=require('./queryPromise').getBillInfo;
const getPoliticianNameByNo=require('./queryPromise').getPoliticianNameByNo;
const getPoliticianAllAverageGrade=require('./queryPromise').getPoliticianAllAverageGrade;
const getPoliticianWeekAverageGrade=require('./queryPromise').getPoliticianWeekAverageGrade;
const getUserPoliticianGradeByWeek=require('./queryPromise').getUserPoliticianGradeByWeek;
const updateGradeInfoRecord=require('./queryPromise').updateGradeInfoRecord;
const updateUserPoliticianGrade=require('./queryPromise').updateUserPoliticianGrade;
const insertGradeInfoRecord=require('./queryPromise').insertGradeInfoRecord;
const insertUserPoliticianGrade=require('./queryPromise').insertUserPoliticianGrade;

router.get('/:politician_no',async (req,res)=>{ //기본 신상 정보 라우터
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
    politician_no=req.params.politician_no;
    connection.query(`select * from tb_politician_info where politician_no=${connection.escape(politician_no)}`,
            (err,politicianInfo)=>{
                var resultData={};
                
                if(err)
                    resultData={status:500}; //DB 오류
                else if(politicianInfo[0])
                    resultData={status:404} ;//데이터가 없으므로 404로
                else{
                  //신상정보+이미지 파일 경로
                    politicianResult=politicianInfo[0];

                    let img='';
                    try{
                        fs.statSync(`./public/images/${politician_no}`); //public 폴더에서 image를 확인함
                        img={img:`/img/${politician_no}`};
                    }
                    catch{
                        if (err.code === 'ENOENT') {
                            img={img:`/images/default`}; //Default Image
                          }
                    }
                    returnPoliticianInfo=Object.assign(politicianResult,img);
                    resultData=Object.assign({status:200},returnPoliticianInfo);
                }
                connection.end();
                res.render('',resultData);// 나중에 render할 view 설정
            });
});

router.get('/:politician_no/billInfo',async (req,res)=>{ //입법정보 라우터
    var connection = mysql.createConnection(dbConfig);
    connection.connect();
    var billInfo={billInfo:[]}; //배열에 입법 정보 저장
    var politician_no=req.params.politician_no;
    var status={};

    try{
        //var billId=await getPoliticianBillId(politician_no);
        /*if(billId[0]){
            billId.foreach((id)=>{
                legislation_info=await getBillInfo(id.issueId,politician_no,connection);
                billInfo.billInfo.push(legislation_info);
            });//모든 입법정보를 가져옴
        }*/

        billInfo.billInfo=await getBillInfo(politician_no,connection);

        status={status:200};
    }
    catch(err){
        status={status:500};
    }
    finally{
        resultData=Object.assign(status,billInfo);
        res.render('',resultData); //나중에 프론트엔드 완성되면 view 지정
        connection.end();
    }
});

router.get('/:politician_no/news',async (req,res)=>{//정치인 뉴스 라우터
    try{
        var politician_name=await getPoliticianNameByNo(req.params.politician_no);
        var rawNewsData=await getPoliticianNewsJSON(politician_name[0].politician_name);
        var articleList={articleList:[]};
        var status={};

        for(let i=0;i<rawNewsData.length;i++){
            var push_news_data={
                articleTitle:rawNewsData[i].title,
                articleLink:rawNewsData[i].originallink,
                articleDay:String(moment(String(rawNewsData[i].pubDate)).format(YYYY.MM.DD))
            };

            articleList.articleList.push(push_news_data);
        }
        status={status:200};
    }
    catch(err){
        status={status:500};
    }

    finally{
        resultData=Object.assign(status,articleList);
        res.render('',resultData);//나중에 프론트엔드 완성되면 view 지정
    }
});

router.get('/:politician_no/grade',async (req,res)=>{ //정치인 평점 정보 라우터
    try{
        var status={};
        var resultData={};
        var politician_no=req.params.politician_no;
        var grade_score={grade_score : await getPoliticianAllAverageGrade(politician_no)};
        var gradeList={gradeList:[]};
        var weekDay=moment().day(0).format('YYYY-MM-DD'); //해당 주 월요일부터 4주까지 
        
        for (let i=0;i<4;i++){//4주 까지 가져옴
            weekGrade=await getPoliticianWeekAverageGrade(politician_no,weekDay);
            weekElements={weekGrade:weekGrade,weekDay:weekDay}
            gradeList.gradeList.push(weekElements);
            weekDay=moment.day(i*-7).format('YYYY-MM-DD');
        }
        status={status:200};
        resultData=Object.assign(grade_score,gradeList);
    }
    catch(err){
        status={status:500};
    }
    finally{
        resultData=Object.assign(status,resultData)
        res.render('',resultData) //나중에 프론트엔드 완성되면 view 지정
    }
});

router.put('/:politician_no/grade',async (req,res)=>{ //정치인 평점 등록

    if(!isLoggedin(req)){ //로그인 여부 확인
        res.render('',{status:500,message:"로그인 해 주세요."});
        return;
    }

    var connection = mysql.createConnection(dbConfig);
    var grade_score=req.body.grade_score;
    var user_id=req.body.grade;
    var politician_no=req.params.politician_no;
    var dayInfo=moment.format('YYYY-MM-DD');

    try{
        var grade_info=await getUserPoliticianGradeByWeek(connection,user_id,politician_no,dayInfo);

        if(grade_info.length){ //이미 이번주에 평점을 주었다면 업데이트
            await updateGradeInfoRecord(connection,user_id,politician_no,dayInfo,grade_score);
            await updateUserPoliticianGrade(connection,user_id,politician_no,grade_score);
        }
        else{ //아니면 값을 넣어줌
            await insertGradeInfoRecord(connection,user_id,politician_no,grade_score);
            await insertUserPoliticianGrade(connection,user_id,politician_no,grade_score);
        }

        var gradeAverage=await getPoliticianAllAverageGrade(politician_no);
        res.render('',{status:200,gradeAverage:gradeAverage});
        connection.end();
    }
    catch(err){
        res.render('',{status:500,message:"DB 에러!"});
        connection.end();
    }
});
module.exports=router;