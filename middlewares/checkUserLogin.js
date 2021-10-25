var jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = async (req, res, next)=>
{
    const tokenHeader = req.headers['authorization'];

    const token = tokenHeader && tokenHeader.split(' ')[1];

            if(token == null)
            {
                res.status(401).json({
                    status: false,
                    message:"Token Not provided"
                })
            }
            
        const publicKey = fs.readFileSync('JWT_keys/public.key');
            
            const decrypt = await jwt.verify(token, publicKey);

            const isLoggedIN = decrypt ? true : false;
            
            
    
    
            if(!decrypt)
            {
                res.status(200).json({
                    status: false,
                    message: "Invalid Token Entered!!"
                })
            }
            else 
            {
                req.user = decrypt;
                req.status = decrypt ? decrypt.paidStatus : false
                req.isLoggedIN = isLoggedIN
            }


            next();



    
     
 }


