const jwt = require('jsonwebtoken');

exports.verifyToken =(req,res,next) =>{
  try{
      
    const token = req.headers.authorization?.split(' ')[1];  // extract token from "Bearer token " format 
    if(!token){
        return res.status(401).json({
            message : "No token provided",
            status: "fail"
        });
    }

    // now we verify token  by decoding it using jwt verrify method
    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    req.user =decoded;   // attaching the user info  
    next();
    
}catch(err){
    res.status(500).json({
        message: "authentication failed",
        status: "error"
    });
}
};