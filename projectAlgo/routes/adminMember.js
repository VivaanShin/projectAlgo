//admin/member 라우터
const express=require('express');
const getAllUserInfo=require('./queryPromiseAdmin').getAllUserInfo();
const mysql=require('mysql');
const router=express.Router();
const dbConfig={
    host     : 'localhost',
    user     : 'root',
    password : 'algoalgo',
    database : 'project_algo'
  }; //후에 DB설정에 맞게 변경
//후에 Admin 로그인 확인
router.get('/',async (req,res)=>{
    /*if(!isAdmin(req)){
        res.render({status:401,message:"접근불가"});
    }*/

    var connection=mysql.createConnection(dbConfig);
    var memberList=[];
    var status={};


});

router.put('/',(req,res)=>{
    var connection=mysql.createConnection(dbConfig);

});

module.exports=router;