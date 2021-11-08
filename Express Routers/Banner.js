const express = require('express');
const router = express.Router();
const {Banner} = require('../models/Banner');
const fs = require('fs');
const upload = require('../middlewares/multer')



//adding the banner Image 

router.post('/addBannerImage',upload.single('bannerImage'), async(req, res)=>
{

    if(!req.file)
    {
        res.status(200).json(
            {
                status: false,
                message: "File is not present"
            }
        )

    }
    else 
    {
        const addImage = await new Banner({
            bannerImage: req.file.path,
            bannerLink: req.body.bannerLink

        })

        if(!addImage)
        {
            res.status(500).json(
                {
                    status: false,
                    message: "Image Not Added To the server"
                }
            )
        }
        else 
        {
            await addImage.save();
            res.status(200).json(
                {
                    status: true,
                    message: "Image is Added Successfully",
                    bannerImage: req.file.path
                }
            )
        }
    }

})

//delete the banner Image 
router.delete('/deleteImage/:bannerID', async(req, res)=>
{
    try {
        const banner = await Banner.findOne({_id: req.params.bannerID});
        if(!banner)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Image Not Found"
                }
            )
        }
        else 
        {
            const deleteBanner = await Banner.findOneAndDelete({_id: req.params.bannerID})

            if(!deleteBanner)
            {
                res.status(500).json(
                    {
                        status: false,
                        message: "Banner is not Deleted"
                    }
                )
            }
            else
            {
                try {
                    await fs.unlinkSync(banner.bannerImage);
                    
                    
                } catch (error) {
                    
                    console.log(error);
                }


                res.status(200).json(
                    {
                        status: true,
                        message: "Banner Is Deleted Successfully"
                        
                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

//edit the banner api 

router.put('/editBanner/:bannerID',upload.single('bannerImage') ,async(req, res)=>
{
    try {
        const bannerFind = await Banner.findOne({_id: req.params.bannerID});
        if(!bannerFind || bannerFind.length === 0)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "Banner Not Found"
                }
            )

        }
        else 
        {
            if(!req.file)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "File is Not Given"
                    }
                )
            }
            else 
            {
                try {
                    fs.unlinkSync(bannerFind.bannerImage);
                    
                } catch (error) {
                    
                    console.log(error);
                }
    
                const updateBanner = await Banner.updateMany({_id: req.params.bannerID}, 
                    {
                        bannerImage: req.file.path,
                        bannerLink: req.body.bannerLink
                    })
    
    
                    res.status(200).json(
                        {
                            status: true,
                            message: "Banner is Updated Successfully"
                        }
                    )

            }
           
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

//getting all the banners
router.get('/getAllBanner/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1)* limit;
    try {
        const getAllABanner = await Banner.find({},{},{sort:
        {
            'createdAt': -1
        }}).limit(limit).skip(offset);

        if(!getAllABanner)
        {
            res.status(200).json(
                {
                    stautus: false,
                    message: "Banners Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: getAllABanner
                    
                }
            )
        }

        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;