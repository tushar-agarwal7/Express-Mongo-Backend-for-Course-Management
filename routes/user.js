const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {User,Course}=require("../db");
const { JWT_secret } = require("../config");
const jwt=require("jsonwebtoken")
// User Routes
router.post('/signup',async (req, res) => {
   const username=req.body.username;
   const password=req.body.password;
   await User.create({username,password})
   res.json({
    msg:"user account created"
   })
});

router.post('/signin', async(req, res) => {
  const username=req.body.username;
  const password=req.body.password;
  const user=await User.find({username,password});
  if(user){
    const token=jwt.sign({username},JWT_secret)
    res.json({
        token
    })
  }
  else{
    res.status(400).json({
        msg:"Incorrect email and password"
    })
}
});

router.get('/courses', async(req, res) => {
    const response=await Course.find({})
    res.json({
        courses:response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.username; // Corrected from req.username
    console.log(username);
    
    if (!username) {
        return res.status(403).json({ msg: "You are not authenticated" });
    }

    try {
        await User.updateOne(
            { username: username },
            { "$push": { purchasedCourses: courseId } }
        );

        res.json({ msg: "Purchased successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
    }
});


router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    const user=await User.findOne({
        username:req.headers.username
        })
        console.log(user.purchasedCourses)
        const courses=await Course.find({
           _id:{
            "$in":user.purchasedCourses
           }
        })
        res.json({
          courses:courses
        })
});

module.exports = router