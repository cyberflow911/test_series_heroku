const { totp } = require('otplib');
const crypto = require('crypto');
module.exports = () =>
{
    const secret = crypto.randomBytes(128).toString('hex');
    const token = totp.generate(secret);
    console.log(typeof(token));
    const isValid = totp.check(token, secret);
    console.log(isValid);
    
    
    
    return {token, secret}
}
