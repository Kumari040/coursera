const {Router}=require("express");
const adminRouter=Router();
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const jwt_secret="iloveindia";
const bcrypt=require("bcrypt");
const {courseModel,adminModel}=require("../db");

adminRouter.post("/signup",async function(req,res){
    const requiredbody=z.object({
        email:z.string().min(7).max(100).email(),
        password:z.string().min(4).max(100),
        firstName:z.string().min(3).max(50),
        lastName:z.string().min(3).max(50)
    });
    const safeParsedbody=requiredbody.safeParse(req.body);
    if(!safeParsedbody.success){
        res.json({
            message:"Invalid inputs",
            error:safeParsedbody.error
        })
        return;
    }
    const email=req.body.email;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const password=req.body.password;
    const hashedPassword=await bcrypt.hash(password,10);
    await adminModel.create({
        email,
        password:hashedPassword,
        firstName,
        lastName
    });
    res.json({
        message:"You are successfully signed up"
    });
});
adminRouter.post("/signin",async function(req,res){
    const requiredBody=z.object({
        email:z.string().min(7).max(100).email(),
        password:z.string().min(4).max(100)
    });
    const safeParsedbody=requiredBody.safeParse(req.body);
    if(!safeParsedbody.success){
        res.json({
            message:"incorrect format of email or passwords",
            error:safeParsedbody.error
        });
        return;
    }
    const email=req.body.email;
    const password=req.body.password;
    const admin=await adminModel.findOne({
        email
    });
    const passwordMatch=await bcrypt.compare(password,admin.password);
    if(!passwordMatch){
        res.json({
            message:"Incorrect credentials"
        });
        
    }else{
        const token=jwt.sign({
            id:admin._id.toString()
        },jwt_secret);
        res.json({
            token
        })
    }
    

});
adminRouter.post("/addcourses",function(req,res){

});
adminRouter.post("/deletecourses",function(){

});
adminRouter.put("/updateCourses",function(req,res){

});
adminRouter.get("/course/bulk",function(req,res){

});
module.exports={
    adminRouter
};