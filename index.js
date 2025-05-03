const express=require("express");
const app=new express();
const jwt=require("jsonwebtoken");
const {z}=require("zod");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
app.use(express.json());
const {userRouter}=require("./routes/users");
const {courseRouter}=require("./routes/course");
const {adminRouter}=require("./routes/admin");
app.use("/api/v2/user",userRouter);
app.use("/api/v2/course",courseRouter);
app.use("/api/v2/admin",adminRouter);

async function main(){
    mongoose.connect("mongodb+srv://kms745362:moni9473@cluster0.st6aub0.mongodb.net/coursera");
    app.listen(3000);
    console.log("Listening on port 3000");
}
main();