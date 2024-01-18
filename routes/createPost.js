const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST");
router.get("/allposts",requireLogin,(req,res)=>{
    POST.find()
    .populate("postedBy","_id name")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err))
})


router.post("/createPost", requireLogin, (req, res) => {
    const { body, pic } = req.body;
    console.log(pic);
    
    

    if (!pic || !body) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    console.log("User:", req.user);

    const post = new POST({
        body,
        photo: pic,
        postedBy: req.user
    });

    post.save()
        .then(result => {
            return res.json({ post: result });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Internal Server Error" });
        });
});
router.put('/like', requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id }
    }, {
        new: true
    })
    .exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});

router.put('/unlike', requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id }
    }, {
        new: true
    })
    .exec()
    .then(result => {
        res.json(result);
    })
    .catch(err => {
        res.status(422).json({ error: err });
    });
});

router.get('/myposts',requireLogin,(req,res)=>{
 POST.find({postedBy:req.user._id})
 .populate("postedBy","_id name")
 .then(myposts=>{
    res.json(myposts)
 })
})

module.exports = router;
