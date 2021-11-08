const express = require('express');
const router = express.Router();
const {Tag} = require('../models/Tags');
const upload = require('../middlewares/multer');



router.post('/createTag', upload.single('tagImage'), async(req, res)=>
{
    console.log(req.body);
    console.log(req.file);
    if(!req.file)
    {
        res.status(200).json(
            {
                status: false,
                message: "File not Shared"
            }
        )
    }
    else 
    {
        try {
            const newTag = await new Tag(
                {
                    tagName: req.body.tagName,
                    tagImage: req.file.path
    
                }
            )


            if(!newTag)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Tag Not Created"
                    }
                )
            }
            else 
            {
                await newTag.save()
                res.status(200).json(
                    {
                        status: true,
                        message: "Tag Created!!",
                        data: newTag
                    }
                )
            }
            
        } catch (error) {
            
            console.log(error);
        }

    }
   
})



//edit Tag 
router.put('/editTag/:tagID',upload.single('tagImage'), async(req, res)=>
{

    if(!req.file)
    {
        res.status(200).json(
            {
                status: false,
                message: "File Not Provided"
            }
        )
    }
    else 

    {
        try {

            const findTag = await Tag.findOne({_id: req.params.tagID});
            if(!findTag)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Tag Not Found"
                    }
                )
            }
            else 
            {
                const updateTag = await Tag.updateMany({_id: req.params.tagID}, 
                    {
                        tagName: req.body.tagName,
                        tagImage: req.file.path
                    })


                    res.status(200).json(
                        {
                            status: true,
                            message: `Tag is Updated for ID: ${req.params.tagID} `
                        }
                    )
            }
            
        } catch (error) {
            
            console.log(error);
        }
        
    }
    
})


//delete Tag
router.delete('/deleteTag/:tagID', async(req, res)=>
{
    try {

        const deletetag = await Tag.findOneAndDelete({_id: req.params.tagID});
        if(!deletetag)
        {
            res.status(500).json(
                {
                    status: false,
                    message: "Tag is not Deleted"
                }
            )
        }
        else 

        {
            res.status(200).json(
                {
                    status: false,
                    message: "Tag is deleted Successfully!!"
                }
            )

        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//get all tags
router.get('/getAlltags/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {

        const getAll = await Tag.find().limit(limit).skip(offset);

        if(!getAll)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Tags Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: getAll
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

//get Tag By ID 

router.get('/getTagByID/:tagID', async(req, res)=>
{

    try {
        const findTag = await Tag.findOne({_id: req.params.tagID});
        if(!findTag)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Tag not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: findTag
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//delete Tag

router.delete('/deleteTag/:tagID', async(req, res)=>
{
    try {

        const findTag = await Tag.findOne({_id: req.params.tagID});
        if(!findTag)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Tag Not Found"
                }
            )
        }
        else 
        {

            const deletetag = await Tag.findOneAndDelete({_id: req.params.tagID});
            if(!deletetag)
            {
                res.status(200).json(
                    {
                        status: false,
                        messsage: "Tag Not Deleted"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Tag is deleted Successfully!!"
                    }
                )
            }

        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;