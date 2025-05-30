const {Router}=require("express");
const userRouter=Router();
const {z}=require("zod");
const jwt=require("jsonwebtoken");
const {user_jwt_key}=require("../config");
const bcrypt=require("bcrypt");
const {userModel,courseModel,purchaseModel}=require("../db");
const {userMiddleware}=require("../middleware/user");
userRouter.post("/signup",async function(req,res){
    const requiredbody=z.object({
        email:z.string().min(9).max(50).email(),
        password:z.string().min(5).max(50),
        firstName:z.string().min(3).max(99),
        lastName:z.string().min(3).max(99)
    })
    const parsedbody=requiredbody.safeParse(req.body);
    if(!parsedbody.success){
        res.json({
            message:"Incorrect formats",
            error:parsedbody.error
        });
        return;
    }
    const{email,password,firstName,lastName}=req.body;
    const hashedpassword=await bcrypt.hash(password,10);
    await userModel.create({
        email,
        password:hashedpassword,
        firstName,
        lastName
    });
    res.json({
        message:"You are successfully signed up"
    });
});
userRouter.post("/signin",async function(req,res){
    const requiredbody=z.object({
        email:z.string().min(9).max(50).email(),
        password:z.string().min(5).max(50)
    });
    const parsedbody=requiredbody.safeParse(requiredbody);
    if(!parsedbody.success){
        res.json({
            message:"Incorrect format of email or password"
        });
        return;
    }
    const {email,password}=req.body;
    const user=await userModel.findOne({
        email
    });
    if(!user){
        res.json({
            message:"email is not signed up"
        })
    }else{
        const passwordmatch=await bcrypt.compare(password,user.password);
        if(!passwordmatch){
            res.json({
                message:"email or password is not matching"
            });
        }else{
            const token=jwt.sign({
                id:user._id.toString()
            },user_jwt_key);
            res.json({
                token
            })
        }
    }
    
});
userRouter.get("/courses",userMiddleware,async function(req,res){
    const result=await courseModel.find({});
    if(result){
        res.json({
            result
        });
    }else{
        res.json({
            message:"No courses are available !!"
        });
    }

});

userRouter.post("/myCourses",userMiddleware,async function(req,res){
    const userId=req.userId;
    const purchases=await purchaseModel.find({
        userId
    });
    const courses=await courseModel.find({
        _id:{$in:purchases.map(x=>x.courseId)}
    })
    res.json({
        courses
    });
});
module.exports={
    userRouter
};
