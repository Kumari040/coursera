const {Router}=require("express");
const userRouter=Router();
const {userModel,courseModel,purchaseModel}=require("../db");
userRouter.post("/signup",function(req,res){

});
userRouter.post("/signin",function(req,res){

});
userRouter.get("/courses",function(req,res){

});
userRouter.post("/purchase",function(req,res){

});
userRouter.post("/myCourses",function(req,res){

});
module.exports={
    userRouter
};
