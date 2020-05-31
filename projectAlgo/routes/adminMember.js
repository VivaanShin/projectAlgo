//admin/member 라우터
const express=require('express');

const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : '12345678',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경
//후에 Admin 로그인 확인
router.get('/',(req,res)=>{
    /*if(!isAdmin(req))
        render({status:401,message:"접근불가"});*/
    var connection=mysql.createConnection(dbConfig);
    
    connection.query('select * from tb_user_info',(err,members)=>{ //유저 정보 테이블에서 조회
        var memberResult={memberList:[]};
        var status={};
        var resultData={};
        if(err)
            status={status:500};
        else{
            status={status:200};
            memberResult.memberList=members; //Row 삽입
        }

        resultData=Object.assign(status,memberResult); //상태값+모든 회원 Row
        res.render('admin_page/admin.ejs',resultData); //나중에 render할 view 설정
        connection.end();
    });
});

module.exports=router;