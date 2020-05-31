const mysql=require('mysql');
const bcrypt = require('bcrypt-nodejs');
const LocalStrategy=require('passport-local').Strategy;
const isNotLoggedIn=require('../scripts/confirmLogin').isNotLoggedIn;
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo', //dbPassword
    database : 'project_algo'
};
var connection=mysql.createConnection(dbConfig);

module.exports=(passport)=>{
    passport.use(new LocalStrategy({ //후에 Admin 여부도 같이 삽입
    usernameField: 'user_id',
    passwordField: 'user_pw',
    passReqToCallback: true
  }, function (req, user_id, user_pw, done) {
        console.log("passport start.")
        connection.query(`select * from tb_user_info where user_id=${connection.escape(user_id)}`,(err,user)=>{ //유저 정보 테이블에서 조회
            if(err){
                console.log('DB 오류!')
                return done(null,false, {message:'DB 오류!'});
            }    
            else if(!isNotLoggedIn(req))
            {
                console.log('이미 로그인 된 상태입니다!');
                return done(null,false, {message:'이미 로그인 된 상태입니다!'});
            }
            else if(!user[0])
            {
                console.log('이미 로그인 된 상태입니다!');
                return done(null,false,{message:'존재하지 않는 아이디 입니다!'});
            }
            //비밀번호 회원가입 시 bcrypt로 암호화
            bcrypt.compare(user_pw,user[0].user_pw,(err,result)=>{
               
                if(result){
                    console.log('로그인 성공');
                    return done(null,{user_id:user[0].user_id,user_administratordmin:user[0].user_administrator}) //유저 아이디와 admin 여부를 저장
                }
                else{
                    console.log('로그인 실패');
                    return done(null,false,{message:'비밀번호가 틀립니다!.'})
                }
        }).catch((err)=>{
                console.log('bcrypt error!');
                return done(null,false, {messsage:'bcrypt error!'});
            });
        connection.end();
        });
    }));
};
