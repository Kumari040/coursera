const {Router}=require("express");
const adminRouter=Router();
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const {admin_jwt_key}=require("../config");
const bcrypt=require("bcrypt");
const {courseModel,adminModel}=require("../db");
const {adminMiddleware}=require("../middleware/admin");
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
            message:"incorrect format of email or password",
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
        },admin_jwt_key);
        res.json({
            token
        })
    }
    

});
adminRouter.post("/addcourses",adminMiddleware,async function(req,res){
    const creatorId=req.adminId;
    const {title,description,price,imageUrl}=req.body;
    const course=await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId
    });
    res.json({
        message:"Course is created",
        courseId: course._id
    })

});
adminRouter.post("/deletecourses",adminMiddleware,async function(req,res){
    const creatorId=req.adminId;
    const courseId=req.body;
    const result=await courseModel.deleteOne({
        _id:courseId,
        creatorId
    });if(result.deletedCount===0){
        return res.status(404).json({message:"Course is not found or unauthorized"});
    }else{
        res.json({
            message:"Course is deleted",
            courseId
        });
    }
    
});
adminRouter.put("/updateCourses",adminMiddleware,async function(req,res){
    const creatorId=req.adminId;
    const {title,description,price,imageUrl}=req.body;
    const {courseId}=req.body;
    const result=await courseModel.updateOne({
        _id:courseId,
        creatorId:creatorId
    },{
        title,
        description,
        imageUrl,
        price
    });
    if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Course not found or unauthorized" });
    }else{
        res.json({
            message:"Course updated",
            courseId
        });
    }
    
});
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const creatorId=req.adminId;
    const courses=await courseModel.find({
        creatorId
    })
    res.json({
        courses
    });
});
module.exports={
    adminRouter
};