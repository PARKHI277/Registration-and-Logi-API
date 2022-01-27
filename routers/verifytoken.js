const jwt = require('jsonwebtoken');
module.exports = function(req,res,next)
{    
   const token = req.header("auth-token");
   if(!token)
   return res.send("Acess denied");
   try{
       const verified = jwt.verify(token,'secret');
       req.user = verified;
       next();
   }
   catch(err){res.send("Invalid token")};
}
