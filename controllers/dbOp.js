const User = require("../models/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const regenToken = (req,res)=>{
    const refreshToken = req.body.token;
    if(refreshToken == null) return res.sendStatus(401);
    if(!User.exists({token: refreshToken})) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign({id: user._id, email: user.email}, process.env.ACCESS_TOKEN);
        res.cookie("accessToken", accessToken);
        res.status(200).json({accessToken: accessToken});
    });
}

const loginUser = (req,res)=>{
    if(req.cookies.accessToken){
        return res.status(200).json({status: "ok", data: "Already logged in"});
    }
    const {email, password} = req.body;
    const user = User.findOne({email: email}, (err, user)=>{
        if(err) throw err;
        if(!user) res.status(400).send({
            status:"error",
            data:"User does not exist"
        });
        else {
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    const accessToken = jwt.sign({
                        id: user._id,
                        email: user.email
                    }, process.env.ACCESS_TOKEN);
                    const refreshToken = jwt.sign({
                        id: user._id,
                        email: user.email
                    }, process.env.REFRESH_TOKEN);
                    console.log(accessToken);
                    User.updateOne({email: email}, {token: refreshToken});
                    res.cookie("accessToken", accessToken, {
                        expires: new Date('03 10 2022'),
                        secure: false,
                        httpOnly: true,
                        sameSite: 'lax'
                    });
                    res.json({status: "ok", data: [accessToken, refreshToken]});
                }else{
                    res.status(403).json({
                        status: "error",
                        data: "Incorrect Pass"
                    });
                }
            });
        }
    });
}

const registerUser = (req, res) => {
    try{
        console.log(req.body);
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
            if(err){
                throw err;
            }
            const user = {
                name: req.body.name,
                email: req.body.email,
                phoneNo : req.body.phoneNo,
                password: hash,
                position: req.body.position || "Student"
            };
            const newUser = User.create(user);
            console.log("User created");
            res.redirect("/login");
        });
    }catch(err){
        res.status(500).json({ msg: err.message });
    }
}

module.exports = {loginUser, registerUser, regenToken};