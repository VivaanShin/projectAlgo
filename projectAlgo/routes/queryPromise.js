const moment=require('moment');
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
};
const mysql=require('mysql');

exports.getLegislationInfo=function getLegislationInfo(politician_no,connection){ //connection 하나를 전달 받아서 사용,동기형으로 입법 정보를 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_legislation as pl, tb_politician_legislation_rel as rel, tb_committee_info as com
        where pl.issue_id=rel.issue_id and rel.politician_no=? and com.committeeCode=pl.curr_committee order by procDt desc`,
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
        where politician_no=?`,[politician_no],(err,name)=>{
            if(err)
            {
                connection.end();
                reject(err);
            }
            connection.end();
            resolve(name); //정치인 아이디를 가져옴
        });
    });
};

exports.getPoliticianAllAverageGrade=function getPoliticianAllAverageGrade(politician_no){ //정치인 평점을 모두 가져옴
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select avg(grade_score) as grade_score from tb_gradeinfo_record
        group by politician_no having politician_no=?`,[politician_no],(err,avg_grade)=>{
            if(err)
            {
                connection.end();
                reject(err);
            }
            connection.end();
            resolve(avg_grade); //해당  정치인 평점 평균
        });
    });
};

exports.getPoliticianWeekAverageGrade=function getPoliticianWeekAverageGrade(politician_no,weekDay){ //정치인 평점 중 두번째 인자와 주가 같은 값을 가져옴
    return new Promise((resolve,reject)=>{
        var connection = mysql.createConnection(dbConfig);
        connection.connect();
        connection.query(`select avg(grade_score) as grade_score from tb_gradeinfo_record
        where year(grade_st_date)=? and week(grade_st_date,0)=?
        group by politician_no having politician_no=?`,[moment(weekDay).year(),moment(weekDay).isoWeek(),politician_no],(err,avg_grade)=>{
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
                     year(grade_st_date)=? and week(grade_st_date,0)=?`,[user_id,politician_no,moment(weekDay).year(),moment(weekDay).isoWeek()],
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
                 year(grade_st_date)=? and week(grade_st_date,0)=?`,[grade_score,user_id,politician_no,moment(weekDay).year(),moment(weekDay).isoWeek()],
                 (err,user_grade)=>{
            if(err) {
                reject(err);
            }
            resolve(user_grade);
        })
    });
}


/*exports.updateUserPoliticianGrade=function updateUserPoliticianGrade(connection,user_id,politician_no,grade_score){ //tb_gradeinfo_record 업데이트
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
}*/


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
        connection.query(`insert into tb_gradeinfo_record values(?,?,?,?,?)`,[moment().isoWeekday(0).format('YYYY-MM-DD'),moment().isoWeekday(6).format('YYYY-MM-DD'),user_id,politician_no,grade_score],
                     (err,user_grade)=>{
                if(err) {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 조회
            })
        });
}

/*exports.insertUserPoliticianGrade=function insertUserPoliticianGrade(connection,user_id,politician_no,grade_score){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_user_politician_grade values(?,?,?)`,[user_id,politician_no,grade_score],
                     (err,user_grade)=>{
                if(err)
                {
                    reject(err);
                }
                resolve(user_grade); //평점 정보 결과
            })
        });
}*/

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

exports.getUserInterest=function getUserInterest(user_id,connection){ //connection 하나를 전달 받아서 사용,동기형으로 유저관심사 정보를 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_user_interest where user_id=?`,[user_id],
        (err,user_info)=>{
            if(err)
                reject(err);
            resolve(user_info); //사용자의 관심사 정보를 가져옴
        });
    })
};

exports.updateAdminUserInfo=function updateAdminUserInfo(user,connection){ //connection 하나를 전달 받아서 사용,동기형으로 사용자 정보를 업데이트 어드민에서 회원정보 수정시 사용
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_info set user_email=?,user_phone=?,user_black=?
        where user_id=?`,[user.user_email,user.user_phone,user.user_black,user.user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.updateUserInterest=function updateUserInterest(user,connection){ //connection 하나를 전달 받아서 사용,동기형으로 tb_user_interest update
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_interest set itScience=?,economy=?,
        culture=?,society=?,politics=? where user_id=?`,[user.itScience,user.economy
            ,user.culture,user.society,user.politics,user.user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.insertUserInterest=function insertUserInterest(user,connection){ //connection 하나를 전달 받아서 사용,동기형으로 tb_user_interest insert
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_user_interest values(?,?,?,?,?,?)`,[user.user_id,user.itScience,user.economy
            ,user.culture,user.society,user.politics],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.deleteUserInfo=function deleteUserInfo(user_id,connection){ //connection 하나를 전달 받아서 사용,동기형으로 tb_user_info delete
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_user_info where user_id=?`,[user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.deleteUserInterest=function deleteUserInterest(user_id,connection){ //connection 하나를 전달 받아서 사용,동기형으로 tb_user_interest delete
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_user_interest where user_id=?`,[user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.getUserGradeCountAndAvg=function getUserGradeCountAndAvg(user_id,connection,orderBy){ //connection 하나를 전달 받아서 사용,동기형으로 사용자의 평점 부여 횟수와 평점 평균을 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select COUNT(*) as count,AVG(grade_score) as avg from tb_gradeinfo_record where user_id=?`,[user_id],
        (err,countAndAvg)=>{
            if(err)
                reject(err);
                console.log(countAndAvg);
            resolve(countAndAvg);
        });
    })
};

exports.getBlackUserInfo=function getBlackAllUserInfo(connection){ // connection 하나를 전달 받아서 사용,동기형으로 사용자 정보를 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_user_info where user_black = 1`,
        (err,black_info)=>{
            if(err)
                reject(err);
            resolve(black_info); //블랙 사용자 정보 가져옴
        });
    })
};

exports.getBlackUserGradeCountAndAvg=function getBlackUserGradeCountAndAvg(user_id,connection,orderBy){ //connection 하나를 전달 받아서 사용,동기형으로 사용자의 평점 부여 횟수와 평점 평균을 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select COUNT(*) as count,AVG(grade_score) as avg from tb_gradeinfo_record where user_id=?`,[user_id],
        (err,countAndAvg)=>{
            if(err)
                reject(err);
                console.log(countAndAvg);
            resolve(countAndAvg);
        });
    })
};

exports.getUserGrade=function getUserGrade(connection){ //connection 하나를 전달 받아서 사용,동기형으로 tn_user_politician_grade를 모두 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_gradeinfo_record as tr, tb_politician_info as pi where tr.politician_no=pi.politician_no`
        ,(err,userGrade)=>{
            if(err)
                reject(err);
            resolve(userGrade);
        });
    })
};

exports.getBlackUserGrade=function getBlackUserGrade(user_id, connection){ //connection 하나를 전달 받아서 사용,동기형으로 tn_user_politician_grade를 모두 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_gradeinfo_record as tr, tb_politician_info as pi where tr.politician_no=pi.politician_no and tr.user_id = ?`,[user_id]
        ,(err,userGrade)=>{
            if(err)
                reject(err);
            resolve(userGrade);
        });
    })
};

exports.updateBlackInUserInfo=function updateBlackInUserInfo(user_id,connection){ //connection 하나를 전달 받아서 사용,tb_user_info의 user_black을 1로 함
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_info set user_black= 1 and user_state = 9 where user_id=?`,[user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.insertBlackUser=function insertBlackUser(blackUser,connection){ //connection 하나를 전달 받아서 사용,tb_user_black에 블랙할 유저 삽입
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_user_black values(?,?,?,?)`,[blackUser.black_st_date,blackUser.black_ed_date,
        blackUser.user_id,blackUser.black_reason],
        (err,blackUser)=>{
            if(err)
                reject(err);
            resolve(blackUser);
        });
    })
};

exports.updateUnBlackInUserInfo=function updateBlackInUserInfo(user_id,connection){ //connection 하나를 전달 받아서 사용,tb_user_info의 user_black을 0으로 함
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_user_info set user_black= 0 where user_id=?`,[user_id],
        (err,user)=>{
            if(err)
                reject(err);
            resolve(user);
        });
    })
};

exports.deleteBlackUser=function deleteBlackUser(user_id,connection){ //connection 하나를 전달 받아서 사용,tb_user_black에 블랙해제할 유저 삭제
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_user_black where user_id=?`,[user_id],
        (err,blackUser)=>{
            if(err)
                reject(err);
            resolve(blackUser);
        });
    })
};

/*exports.getPoliticianGradeByUser=function getPoliticianGradeByUser(user_id,connection){ //connection 하나를 전달 받아서 사용,user_id로 조회
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_user_politician_grade where user_id=?`,[user_id],
        (err,grade)=>{
            if(err)
                reject(err);
            resolve(grade);
        });
    })
};*/

exports.deleteUserPoliticianGrade=function deleteUserPoliticianGrade(user_id,politician_no,connection){ //tb_politician_grade 삭제
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_gradeinfo_record where user_id=? and politician_no=?`,[user_id,politician_no],
        (err,grade)=>{
            if(err)
                reject(err);
            resolve(grade);
        });
    })
};

exports.getAllLegislation=function getAllLegislation(connection){ //tb_politician_legislation select
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_legislation`,
        (err,legislation)=>{
            if(err)
                reject(err);

            console.log(legislation);
            resolve(legislation);
        });
    })
};

exports.insertPoliticianLegislation=function insertPoliticianLegislation(legislation,connection){ //tb_politician_legislation insert
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_politician_legislation values(?,?,?,?,?,?,?,?,?,?,?)`,[legislation.issue_id,legislation.issue_no,
        legislation.issue_name,legislation.proposerKind,legislation.proposeDt,legislation.procDt,legislation.generalResult,
    legislation.summary,legislation.procStageCd,legislation.passGubn,legislation.curr_committee]
        ,(err,legislation)=>{
            if(err)
                reject(err);

            console.log(legislation);
            resolve(legislation);
        });
    })
};

exports.updatePoliticianLegislation=function updatePoliticianLegislation(legislation,connection){ //tb_politician_legislation update
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_politician_legislation set issue_id=?,issue_no=?,issue_name=?,proposerKind=?,
        proposeDt=?,procDt=?,generalResult=?,summary=?,procStageCd=?,passGubn=?,curr_committee=? where issue_id=?)`,[legislation.issue_id,legislation.issue_no,
        legislation.issue_name,legislation.proposerKind,legislation.proposeDt,legislation.procDt,legislation.generalResult,
    legislation.summary,legislation.procStageCd,legislation.passGubn,legislation.curr_committee,legislation.issue_id]
        ,(err,legislation)=>{
            if(err)
                reject(err);

            console.log(legislation);
            resolve(legislation);
        });
    })
};

exports.deletePoliticianLegislation=function deletePoliticianLegislation(issue_id,connection){ //tb_politician_legislation update
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_politician_legislation where issue_id=?`,[issue_id]
        ,(err,legislation)=>{
            if(err)
                reject(err);

            console.log(legislation);
            resolve(legislation);
        });
    })
};

exports.deletePoliticianLegislationRel=function deletePoliticianLegislationRel(issue_id,connection){ //tb_politician_legislation update
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_politician_legislation_rel where issue_id=?`,[issue_id]
        ,(err,legislation)=>{
            if(err)
                reject(err);

            console.log(legislation);
            resolve(legislation);
        });
    })
};

exports.getGradeInfoRecord=function getGradeInfoRecord(connection){ //tb_tb_gradeinfo_record select
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_gradeinfo_record`
        ,(err,grade)=>{
            if(err)
                reject(err);

            console.log(grade);
            resolve(grade);
        });
    })
};

exports.updateAdminGradeInfoRecord=function updateGradeInfoRecord(grade,connection){ //tb_gradeinfo_record update 어드민페이지용
    return new Promise((resolve,reject)=>{
        connection.query(`update tb_gradeinfo_record set grade_st_date=?, grade_ed_date=? user_id=?,politician_no=?,grade_score=? where grade_st_date=?
        and user_id=? and politician_no=?`,[grade.grade_st_date,grade.grade_ed_date,grade.user_id,grade.politician_no,grade.grade_score,grade.grade_st_date
            ,grade.user_id,grade.politician_no]
        ,(err,grade)=>{
            if(err)
                reject(err);

            console.log(grade);
            resolve(grade);
        });
    })
};

exports.deleteGradeInfoRecord=function deleteGradeInfoRecord(grade,connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`delect from tb_gradeinfo_record where where grade_st_date=?
        and user_id=? and politician_no=?`,[grade.grade_st_date
            ,grade.user_id,grade.politician_no]
        ,(err,grade)=>{
            if(err)
                reject(err);

            console.log(grade);
            resolve(grade);
        });
    })
};

exports.searchPoliticianBySdNameAndSggName=function searchPoliticianBySdNameAndSggName(sdName,sggName,connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_info
        where sdName like ? and sggName like ?`,
        ['%'+sdName+'%','%'+sggName+'%']
        ,(err,politicians)=>{
            if(err)
                reject(err);

            console.log(politicians);
            resolve(politicians);
        });
    })
};

exports.getPoliticianInterestByNo=function getPoliticianInterestByNo(politician_no,connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_interest where politician_no=?`,[politician_no]
        ,(err,politician)=>{
            if(err)
                reject(err);

            console.log(politician);
            resolve(politician);
        });
    })
};

exports.getPoliticianInfoByNo=function getPoliticianInfoByNo(politician_no,connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_info where politician_no=?`,[politician_no]
        ,(err,politician)=>{
            if(err)
                reject(err);

            console.log(politician);
            resolve(politician);
        });
    })
};

exports.deleteUserGrade=function deleteUserGrade(user_id,connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`delect from tb_gradeinfo_record where user_id=?`,[user_id]
        ,(err,user)=>{
            if(err)
                reject(err);

            resolve(user);
        });
    })
};

exports.unsetForeignKeyChecks=function unsetForeignKeyChecks(connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`SET foreign_key_checks = 0`
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
        });
    })
};

exports.setForeignKeyChecks=function setForeignKeyChecks(connection){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`SET foreign_key_checks = 1`
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
        });
    })
};

exports.insertPoliticianInfo=function insertPoliticianInfo(connection,politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
    age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate){
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_politician_info values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
            age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate]
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
        });
    })
};

exports.insertPoliticianInterest=function insertPoliticianInterest(connection,politician_no,itScience,economy,culture,society,politics){ //tb_gradeinfo_record delete
    return new Promise((resolve,reject)=>{
        connection.query(`insert into tb_politician_interest values(?.?,?,?,?,?)`,[politician_no,itScience,economy,culture,society,politics]
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
        });
    })
};

exports.updatePoliticianInfo=function updatePoliticianInfo(connection,politician_no,politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday,
    age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate){ //tb_gradeinfo_record delete
        return new Promise((resolve,reject)=>{
            connection.query(`update tb_politician_info set politician_name=?, sgId=?, sgTypecode=?, sggName=?, sdName=?, wiwName=?, jdName=?, gender=?, birthday=?, age=?,
            addr=?, jobId=?, job=?, eduId=?, edu=?, career1=?, career2=?, dugsu=?, dugyul=?, prmsCnt=?, prmsRate=? where politician_no=?`
            ,[politician_name,sgId,sgTypecode,sggName,sdName,wiwName,jdName,gender,birthday
                ,age,addr,jobId,job,eduId,edu,career1,career2,dugsu,dugyul,prmsCnt,prmsRate,politician_no]
            ,(err,result)=>{
                if(err)
                    reject(err);

                resolve(result);
         });
    })
};

exports.updatePoliticianInterest=function updatePoliticianInterest(connection,politician_no,itScience,economy,culture,society,politics){
        return new Promise((resolve,reject)=>{
            connection.query(`update tb_politician_interest set itScience=?, economy=?, culture=?, society=?, politics=? where politician_no=?`,[itScience,economy,culture,society,politics,politician_no]
            ,(err,result)=>{
                if(err)
                    reject(err);

                console.log(politician_no);
                resolve(result);
         });
    })
};

exports.deletePoliticianInfo=function deletePoliticianInfo(connection,politician_no){
        return new Promise((resolve,reject)=>{
            connection.query(`delete from tb_politician_info where politician_no=?`,[politician_no]
            ,(err,result)=>{
                if(err)
                    reject(err);

                resolve(result);
         });
    })
};

exports.deletePoliticianInterest=function deletePoliticianInterest(connection,politician_no){
    return new Promise((resolve,reject)=>{
        connection.query(`delete from tb_politician_interest where politician_no=?`,[politician_no]
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
     });
    })
};

exports.getAllPoliticianInfo=function getAllPoliticianInfo(connection){
    return new Promise((resolve,reject)=>{
        connection.query(`select * from tb_politician_info`
        ,(err,result)=>{
            if(err)
                reject(err);

            resolve(result);
     });
    })
};

exports.getPoliticianAllAverageGradeAndCount=function getPoliticianAllAverageGradeAndCount(connection,politician_no){ //정치인 평점을 모두 가져옴
    return new Promise((resolve,reject)=>{
        connection.query(`select avg(grade_score) as avg, count(*) as count from tb_gradeinfo_record
        where politician_no=?`,[politician_no],(err,avg_grade)=>{
            if(err) {
                reject(err);
            }
            resolve(avg_grade); //해당  정치인 평점 평균
        });
    });
};
