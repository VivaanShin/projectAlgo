const isLoggedIn=require('./confirmLogin').isLoggedIn;

exports.isAdmin=(req)=>{
    if(!isLoggedIn(req)) 
        return false;
    else if (!(req.user.user_administrator)) 
        return false;
    else 
        return true;
}