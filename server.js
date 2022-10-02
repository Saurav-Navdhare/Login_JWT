require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/schema");
const cookieParser = require("cookie-parser");

const router = require("./router/route");
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
//configure ejs
app.set("view engine", "ejs");

app.get("/register", (req,res)=>{
    res.render("register");
})

app.get("/login", (req,res)=>{
    if(req.cookies.accessToken){    //fix this issue
        return res.status(200).json({status: "ok", data: "Already logged in"});
    }
    res.render("login");
});

app.delete("/logout", (req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    console.log(User.exists({token: refreshToken}));        //not working
    if(!User.exists({token: refreshToken})) return res.sendStatus(403);
    User.findOneAndUpdate({token: refreshToken}, {token: null}, {new: true},(err,user)=>{
        if(err) throw err;
        res.clearCookie();  //must needed to clear cookies
        res.status(200).json({status: "ok", data: "Logged out"});
    })
});

app.use(router);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true}, (err)=>{
    if(err) throw err;
    console.log("Connected to MongoDB");
    app.listen(PORT, ()=> {
        console.log(`App is running on port ${PORT}`);
    });
});