const localStrategy=require('./localStrategy');
const mysql=require('mysql');

module.exports=(passport)=>{
    const dbConfig={
        host     : 'localhost',
        user     : 'root',
        password : 'algoalgo', //dbPassword
        database : 'project_algo'
    };
    passport.serializeUser(function (user, done) {
        console.log("passport serializeUser")
        done(null, user)
    });
    
    passport.deserializeUser(function (user, done) {
        console.log("passport serializeUser")
        var connection=mysql.createConnection(dbConfig);
        connection.query(`select user_id,user_administrator from tb_user_info where user_id=${connection.escape(user.user_id)}`
        ,(err,user)=>{ //유저 정보 테이블에서 조회
            done(err,user[0]); // 세션에 admin 여부와 id만 저장
        });
    });

    localStrategy(passport);
};