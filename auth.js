const jwt=require("jsonwebtoken");
const jwt_key="ilovemyself";
function authenticate(req,res,next){
    const token=req.headers.authorization;
    const response=jwt.verify(token,jwt_key);
    if(response){

    }
}
module.exports={
    authenticate
};