const referralCodes = require('referral-codes');

module.exports = () =>


{        
    const referral = referralCodes.generate({
        length: 6,
        count: 1,
        charset: referralCodes.charset("alphanumeric"),
        
        
    });
    console.log(referral[0]);
    const mainReferral = referral[0].toUpperCase();
    return mainReferral;
}