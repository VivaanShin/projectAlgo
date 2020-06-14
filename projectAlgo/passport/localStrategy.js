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

module.exports=(passport)=>{
    passport.use(new LocalStrategy({ //후에 Admin 여부도 같이 삽입
    usernameField: 'user_id',
    passwordField: 'user_pw',
    passReqToCallback: true
  }, function (req, user_id, user_pw, done) {
        console.log("passport start.");
        var connection=mysql.createConnection(dbConfig);
        connection.query(`select * from tb_user_info where user_id=?`,[user_id],(err,user)=>{ //유저 정보 테이블에서 조회
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
                console.log('존재하지 않는 아이디 입니다.');
                return done(null,false,{message:'존재하지 않는 아이디 입니다!'});
            }
            //비밀번호 회원가입 시 bcrypt로 암호화
            bcrypt.compare(user_pw,user[0].user_pw,(err,result)=>{
                    bcrypt.hash(user_pw, null, null, function(err, hash) {
                        console.log("user_hash="+hash);
                    });
                    console.log("login_hash="+user[0].user_pw);
                    if(result){
                        if(!user[0].user_state){
                            console.log("이메일 미인증");
                            return done(null,false,{message:'이메일 인증을 먼저 해주세요!'});
                        }
                        else{
                            console.log('로그인 성공');
                            req.session.user_interest_check=user[0].user_interest_check;
                            return done(null,{user_id:user[0].user_id,user_state:user[0].user_state}) //유저 아이디와 admin 여부를 저장
                        }
                    }
                    else{
                        console.log('비밀번호가 틀립니다!');
                        return done(null,false,{message:'비밀번호가 틀립니다!.'})
                    }
                }
            );
            connection.end();
        })
  }))
}
