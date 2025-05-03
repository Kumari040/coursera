const jwt=require("jsonwebtoken");
const {admin_jwt_key}=require("../config");

function adminMiddleware(req,res,next){
    const token=req.headers.authorization;
    const decoded=jwt.verify(token,admin_jwt_key);
    if(decoded){
        req.adminId=decoded.id;
        next();
    }else{
        res.status(403).json({
            message:"You are not signed in"
        })
    }
}
module.exports={
    adminMiddleware
};