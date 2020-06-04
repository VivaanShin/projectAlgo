const isLoggedIn=require('./confirmLogin').isLoggedIn;

exports.isAdmin=(req)=>{
    if(!isLoggedIn(req) || req.user.user_state != 2) 
        return false;
    else 
        return true;
}