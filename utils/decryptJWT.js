const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports =async (token) =>
{
    if(token == '')
    {
        return '';
    }
    
    if(!token){
        
        throw new Error("Token is not Given");
    }
    const publicKey = fs.readFileSync('JWT_keys/public.key');
    

    try 
    {
        
        const decrypt = await jwt.verify(token, publicKey);
        
        


        if(!decrypt)
        {
            return false;
        }
        else 
        {
            return decrypt;
        }

    }
    catch(err)
    {
        throw new Error(`Dycription ERROR : ${err}`);
    }
    

}