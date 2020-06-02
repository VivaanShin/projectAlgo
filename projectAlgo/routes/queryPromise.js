const moment=require('moment');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};
  
exports.getBillInfo=function getBillInfo(politician_no,connection){ //여러번 호출되므로 connection 하나를 전달 받아서 사용,동기형으로 입법 정보를 가져옴 
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_legislation as pl, tb_politician_legislation_rel as rel 
        where pl.issue_id=rel.issue_id and rel.politician_no=?`,
        [politician_no],(err,legislation)=>{
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
        where politician_no=?`,[politician_no],(err,issueId)=>{
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
        group by politician_no having politician_no=?`,[politician_no],(err,avg_grade)=>{
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
        where year(grade_st_date)=? and week(grade_st_date,1)=?
        group by politician_no having politician_no=?`,[moment(weekDay).year(),moment(weekDay).week(),politician_no],(err,avg_grade)=>{
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
        connection.query(`select * from tb_gradeinfo_record where user_id=?
                     and politician_no=? and 
                     year(grade_st_date)=? and week(grade_st_date,1)=?`,[user_id,politician_no,moment(weekDay).week()],
                     (err,user_grade)=>{
            if(err) {
                reject(err);
            }
            resolve(user_grade); //평점 정보 조회
        })
    });
}


exports.updateGradeInfoRecord=function updateGradeinfoRecord(connection,user_id,politician_no,weekDay,grade_score){ //tb_grade_info_record 업데이트
    return new Promise((resolve,reject)=>{
    connection.query(`update tb_gradeinfo_record set grade_score=?
                 where user_id=?
                 and politician_no=? and 
                 year(grade_st_date)=? and week(grade_st_date,1)=?`,[grade_score,user_id,politician_no,moment(weekDay).year(),moment(weekDay).week()],
                 (err,user_grade)=>{
            if(err) {
                reject(err);
            }
            resolve(user_grade);
        })
    });
}


exports.updateUserPoliticianGrade=function updateUserPoliticianGrade(connection,user_id,politician_no,grade_score){ //tb_user_politician_grade 업데이트
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_politician_grade set grade_score=?
                     where user_id=?
                     and politician_no=?`,[grade_score,user_id,politician_no],
                     (err,user_grade)=>{
                if(err) 
                {
                    reject(err);
                }
                resolve(user_grade);
            })
        });    
}


/*exports.insertGradeInfoRecord=function insertGradeInfoRecord(connection,user_id,politician_no,grade_score){
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
}*/

exports.insertGradeInfoRecord=function insertGradeInfoRecord(connection,user_id,politician_no,grade_score){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_gradeinfo_record(grade_st_date,grade_ed_date,
            user_id,politician_no,
            grade_score values(?,?,?,?,?)`,[moment().day(0),moment().day(6),user_id,politician_no,grade_score],
                     (err,user_grade)=>{
                if(err) {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 조회
            })
        });    
}

exports.insertUserPoliticianGrade=function insertUserPoliticianGrade(connection,user_id,politician_no,grade_score){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_user_politician_grade(
            user_id,politician_no,grade_score values(?,?,?)`,[user_id,politician_no,grade_score],
                     (err,user_grade)=>{
                if(err) 
                {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 결과
            })
        });    
}

exports.getAllUserInfo=function getAllUserInfo(connection){ // connection 하나를 전달 받아서 사용,동기형으로 사용자 정보를 가져옴 
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_user_info`,
        (err,user_info)=>{
            if(err)
                reject(err);
            resolve(user_info); //모든 사용자 정보 가져옴
        });
    })
};

exports.getUserInterest=function getUserInterest(user_id,connection){ //connection 하나를 전달 받아서 사용,동기형으로 입법 정보를 가져옴 
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_user_interest where user_id=?`,[user_id],
        (err,user_info)=>{
            if(err)
                reject(err);
            resolve(user_info); //정치인에 관련 된 의안을 가져옴
        });
    })
};