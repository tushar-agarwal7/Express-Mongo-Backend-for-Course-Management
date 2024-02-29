const jwt=require("jsonwebtoken")
const { JWT_secret}=require("../config")

function userMiddleware(req, res, next) {
    const token=req.headers.authorization;
    const words=token.split(" ");
    const jwtToken=words[1];
    const decodedValue=jwt.verify(jwtToken,JWT_secret);
    if(decodedValue.username){
        req.username=decodedValue.username;
        next();
    }
    else{
        res.status(403).json({
            msg:"you are not authenticated"
        })
    }
}

module.exports = userMiddleware;