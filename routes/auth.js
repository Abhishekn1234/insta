const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const{Jwt_secret}=require("../db");
const requireLogin = require("../middleware/requireLogin");
router.use(express.json());

router.get('/', (req, res) => {
    res.send("hello");
});
router.post('/login',(req,res)=>{
    const {email,password}=req.body;

    if(!email||!password){
        return res.status(422).json({error:"please Add Email and Password"})
    }
    USER.findOne({email:email}).then((saveUser)=>{
        if(!saveUser){
            return res.status(422).json({error:"Invalid Email"});
            
        }
        bcrypt.compare(password,saveUser.password).then((match)=>{
          if(match){
            // return res.status(200).json({message:"Login Successfully"})
            const token=jwt.sign({_id:saveUser.id},Jwt_secret)
            const {_id,name,email,userName}=saveUser;
            
            res.json({token,user:{_id,name,email,userName}});
            console.log({token,user:{_id,name,email,userName}});
          }
          else{
            return res.status(422).json({error:"Invalid Password"});
          }
        })
        .catch(err=>console.log(err));
    })
})

router.post('/signup', async (req, res) => {
    const { name, userName, email, password } = req.body;
    if (!name || !password || !email || !userName) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    try {
        const saveUser = await USER.findOne({ $or: [{ email: email }, { userName: userName }] });
        if (saveUser) {
            return res.status(422).json({ error: "User already exists with email or userName" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new USER({
            name,
            email,
            userName,
            password: hashedPassword
        });

        await user.save();
        res.status(200).json({ message: "Registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
