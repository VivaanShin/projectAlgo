/*getPoliticianBillId:function getPoliticianBillId(politician_no){ //동기형으로 정치인-입법 관계 테이블 조회
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select issue_id from tb_politician_legislation_rel
        where polician_no=${connection.escape(politician_no)}`,(err,issueId)=>{
            if(err) 
            {
                connection.end();
                reject(err);
            }  
            
            connection.end();
            resolve(issueId); //모든 정치인이 발의한 입법안의 코드를 가져옴
        });
    });
};
*/
const moment=require('moment');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'project_algo'
  };
  
exports.getBillInfo=function getBillInfo(politician_no,connection){ //여러번 호출되므로 connection 하나를 전달 받아서 사용,동기형으로 입법 정보를 가져옴 
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_legislation as pl, tb_politician_legislation_rel as rel 
        where pl.issue_id=rel.issue_id and rel.politician_no=${connection.escape(politician_no)}`,
        (err,legislation)=>{
            if(err)
                reject(err);
            resolve(legislation); //정치인에 관련 된 의안을 가져옴
        });
    })
};

exports.getPoliticianNameByNo=function getPoliticianNameByNo(politician_no){
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select politician_name from tb_politician_info
        where politician_no=${connection.escape(politician_no)}`,(err,issueId)=>{
            if(err) 
            {
                connection.end();
                reject(err);
            }   
            connection.end();
            resolve(issueId); //정치인 아이디를 가져옴
        });
    });
};

exports.getPoliticianAllAverageGrade=function getPoliticianAllAverageGrade(politician_no){ //정치인 평점을 모두 가져옴
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select arg(grade_score) from tb_user_politician_grade
        group by politician_no having politician_no=${connection.escape(politician_no)}`,(err,avg_grade)=>{
            if(err) 
            {
                connection.end();
                reject(err);
            }   
            connection.end();
            resolve(avg_grade); //해당 기간의 정치인 평점 평균
        });
    });
}

exports.getPoliticianWeekAverageGrade=function getPoliticianWeekAverageGrade(politician_no,weekDay){ //정치인 평점 중 두번째 인자와 주가 같은 값을 가져옴
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select arg(grade_score) from tb_gradeinfo_record 
        where year(grade_st_date)=${moment(weekDay).year()} and week(grade_st_date,1)=${moment(weekDay).week()}
        group by politician_no having politician_no=${connection.escape(politician_no)} `,(err,avg_grade)=>{
            if(err) 
            {
                connection.end();

                reject(err);

            }   

            connection.end();
            resolve(avg_grade); //해당 기간의 정치인 평점 평균
        });
    });
}

exports.getUserPoliticianGradeByWeek=function getUserPoliticianGradeByWeek(connection,user_id,politician_no,weekDay){ //이번주에 이미 평점을 줬는지 조회
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_gradeinfo_record where user_id=${connection.escape(user_id)}
                     and politician_no=${connection.escape(politician_no)} and 
                     year(grade_st_date)=${moment(weekDay).year()} and week(grade_st_date,1)=${moment(weekDay).week()}`,
                     (err,user_grade)=>{
            if(err) 
            {
                reject(err);
            }
            resolve(user_grade); //평점 정보 조회
        })
    });
}

exports.updateGradeInfoRecord=function updateGradeinfoRecord(connection,user_id,politician_no,weekDay,grade_score){ //tb_grade_info_record 업데이트
    return new Promise((resolve,reject)=>{
    connection.query(`update tb_gradeinfo_record set grade_score=${grade_score} 
                 where user_id=${connection.escape(user_id)}
                 and politician_no=${connection.escape(politician_no)} and 
                 year(grade_st_date)=${moment(weekDay).year()} and week(grade_st_date,1)=${moment(weekDay.week())}`,
                 (err,user_grade)=>{
            if(err) 
            {
                reject(err);
            }
            resolve(user_grade);
        })
    });
}

exports.updateUserPoliticianGrade=function updateUserPoliticianGrade(connection,user_id,politician_no,grade_score){ //tb_user_politician_grade 업데이트
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_politician_grade set grade_score=${grade_score} 
                     where user_id=${connection.escape(user_id)}
                     and politician_no=${connection.escape(politician_no)}`,
                     (err,user_grade)=>{
                if(err) 
                {
                    reject(err);
                }
                resolve(user_grade);
            })
        });    
}

exports.insertGradeInfoRecord=function insertGradeInfoRecord(connection,user_id,politician_no,grade_score){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_gradeinfo_record(grade_st_date,grade_ed_date,
            user_id,politician_no,
            grade_score values(${moment().day(0)},${moment().day(6)},${user_id},${politician_no},${grade_score})`,
                     (err,user_grade)=>{
                if(err) 
                {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 조회
            })
        });    
}

exports.insertUserPoliticianGrade=function insertUserPoliticianGrade(connection,user_id,politician_no,grade_score){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_user_politician_grade(
            user_id,politician_no,grade_score values(${user_id},${politician_no},${grade_score})`,
                     (err,user_grade)=>{
                if(err) 
                {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 조회
            })
        });    
}