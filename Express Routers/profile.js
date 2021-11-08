const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const {Admin}= require('../models/Auth');
const profileValidator = require('../Validators/adminValidator');

router.post('/profileUser/:userID',upload.fields([
    {
        name: 'profileImage', maxCount: 1
    }
]), async(req, res)=>
{

    const {name, mobileNumber, about} = req.body;
    const data = {name, mobileNumber, about};
    console.log(data);
    const resultFromJoi = await profileValidator('name mobileNumber about', data);
    console.log(req.files);
    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message: "Validation Error",
                name: "Min 3 values required",
                mobileNumber: "Mobile Number should be valid Number",
                about: "Minimum 8 values Required"
            }
        )
    }
    else 
    {
        try {

            const user = await Admin.findOne({_id: req.params.userID});
            if(!user)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "User not Found"
                    }
                )
            }
            else 
            {
                const userProfile = await Admin.updateMany({_id: req.params.userID}, 
                    {
                        name: name,
                        mobileNumber: mobileNumber,
                        about: about,
                        profileImage: req.files.profileImage[0].path
    
                    })

                    if(!userProfile)
                    {
                        res.status(200).json(
                            {
                                status: false,
                                message: "User is not Updated"
                            }
                        )
                    }
                    else 
                    {
                        res.status(200).json(
                            {
                                status: true,
                                message: "Profile is updated!!",

                            }
                        )
                    }
            }
    
            
            
        } catch (error) {
            console.log(error);
            
        }

    }
    

})


router.get('/getProfileDetails/:userID', async (req, res)=>
{
    try {
        const profileDetails = await Admin.findOne({_id: req.params.userID});
        if(!profileDetails)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Profile Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    name: profileDetails.name,
                    profilePhoto: profileDetails.profileImage,
                    about: profileDetails.about,
                    mobileNumber: profileDetails.mobileNumber

                }
            )
        }

        
    } catch (error) {
        
        console.log(error);
    }

})

router.put('/editProfileImage/:userID',upload.fields([
    {
        name: 'profileImage', maxCount: 1
    }
]), async(req, res)=>
{
    console.log(req.files.profileImage[0]);
    try {
        
        const user = await Admin.findOne({_id: req.params.userID});
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
            try {
                const userProfile = await Admin.updateOne({_id: req.params.userID}, 
                    {

                        profileImage: req.files.profileImage[0].path

                    })

                    if(!userProfile)
                    {
                        res.status(200).json(
                            {
                                status: false,
                                message: "User Profile not Updated!!"
                            }
                        )

                    }
                else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Profile Image is updated Sucessfully",
                        imagePath: req.files.profileImage[0].path
                    }
                )

            }
                
                
            } catch (error) {
            
                console.log(error);
            }
        }
    } catch (error) {
        
        console.log(error);
    }
    
})


router.put('/updateProfileSection/:userID', async(req, res)=>
{
    const {name, mobileNumber, about} = req.body;

    try {

        const user = await Admin.findOne({_id: req.params.userID});
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
            const userUpdate = await Admin.updateMany({_id: req.params.userID},req.body);
            if(!userUpdate)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "User is not Updated"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "User Data Updated!!",
                        
                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
    
})
module.exports = router;