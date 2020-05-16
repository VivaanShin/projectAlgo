//로그인 확인
exports.isLoggedIn= (req)=>{
    if(req.isAuthenticated())
        return true;
    else
        return false;
};
//비 로그인 확인
exports.isNotLoggedIn=(req)=>{
    if(!req.isAuthenticated())
        return true;
    else
        return false;
}