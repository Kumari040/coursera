const jwt=require("jsonwebtoken");
const {user_jwt_key}=require("../config");
function userMiddleware(req,res,next){
    const token=req.headers.authorization;
    const decoded=jwt.verify(token,user_jwt_key);
    if(decoded){
        req.userId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message:"You are not signed in"
        })
    }
}
module.exports={
    userMiddleware
};