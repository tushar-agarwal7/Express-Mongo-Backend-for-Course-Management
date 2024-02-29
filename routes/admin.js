const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {JWT_secret}=require("../config");
const jwt =require("jsonwebtoken");
const {Admin,User,Course}=require("../db")
// Admin Routes
router.post('/signup', async(req, res) => {
     const username=req.body.username;
     const password=req.body.password;
     await Admin.create({username,password})
     res.json({
        msg:" Account created successfully"
     })

});

router.post('/signin',async (req, res) => {
   const username=req.body.username;
   const password=req.body.password;
    const user=await Admin.find({
        username,password
    })
    if(user){
        const token= jwt.sign({
            username
          },JWT_secret)
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

router.post('/courses', adminMiddleware,async (req, res) => {
    // Implement course creation logic
    const title=req.body.title;
    const description=req.body.description;
    const imageLink=req.body.imageLink;
    const price=req.body.price;
    const newCourses=await Course.create({
        title,description,imageLink,price
    })
    res.json({
        msg:"post created",
        courseId:newCourses._id,
    })
});

router.get('/courses', adminMiddleware,async (req, res) => {
  const response=await Course.find({});
  res.json({
    courses:response
  })
});

module.exports = router;