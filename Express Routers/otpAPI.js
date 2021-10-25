const express = require('express');
const router = express.Router();
const generateOtp = require('../otpAlgorithm/otp');
const {Admin} = require('../models/Auth');

const otpmailer = require('../Nodemailer Configuration/otpmailer');



router.put('/getotp/:email', async (req, res)=>
{
    
    try {
        const user = await Admin.findOne({email: req.params.email})
        if(!user)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "User not present"
                }
            )
        }
        else 
        {
            const {token, secret} = generateOtp();
            const otpUpdate = await Admin.updateMany({email: req.params.email}, 
                {
                    "otp.token": token ,
                    "otp.secret": secret,
                    "otp.time": Date.now()
                })
            try {
                const mail = await otpmailer(user.email, token);
                
            } catch (error) {
                console.log(error);
                
            }

            res.status(200).json(
                {
                    status: true,
                    message: "Mail is sent to the registered mail",
                    id: user._id
                }
            )


        }
        
    } catch (error) {
        
        console.log(error);
    }
    
})

router.post('/otpVerify/:email', async(req, res)=>
{
    const {otp} = req.body;
    try {
        const user = await Admin.findOne({email: req.params.email});
        console.log(user);
        if(!user)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "User Not Found"
                }
            )
        }
        else 
        {
            if((Date.now() - user.otp.time)> 900000)
            {
                res.status(200).json(
                    {
                        status: false,
                        message : "OTP Expired!!"
                    }
                )
            }
            else 
            {

                if(otp === user.otp.token)
                {
                    res.status(200).json(
                        {
                            status: true,
                            message : "OTP Verified",
                            id: user._id
                        }
                    )
                }
                else 
                {
                    res.status(200).json(
                        {
                            status: false,
                            message :"OTP Not verified",
                            id: user._id
                        }
                    )

                }
            
                
               
                
                
            }
            
        }
        
    } catch (error) {
        
        console.log(error);
    }
    
})


module.exports = router;