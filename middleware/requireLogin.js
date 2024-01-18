const jwt = require("jsonwebtoken");
const {Jwt_secret}=require("../db"); 
const mongoose = require("mongoose");
const USER = mongoose.model("USER");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" });
    }
    const token = authorization.replace("ffff ", "");
    jwt.verify(token, Jwt_secret, (err, payload) => {
        console.log("Received Token:", token);
        
    
        if (err) {
            return res.status(401).json({ error: "You must have logged in 2" });
        }
    
        const { _id } = payload;
        console.log("Decoded Payload:", payload);
        USER.findById(_id).then(userData => {
            req.user = userData;
            next();
        }).catch(error => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
    });
}    
