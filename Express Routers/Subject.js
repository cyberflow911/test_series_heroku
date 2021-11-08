const express = require('express');
const router = express.Router();
const {Subject} = require('../models/Subject');




router.post('/createSubject', async(req, res)=>
{
    console.log(req.body);
    
    
        try {
            const newTag = await new Subject(
                {
                    subjectName: req.body.subjectName,
                    
    
                }
            )


            if(!newTag)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Subject Not Created"
                    }
                )
            }
            else 
            {
                await newTag.save()
                res.status(200).json(
                    {
                        status: true,
                        message: "Subject Created!!",
                        data: newTag
                    }
                )
            }
            
        } catch (error) {
            
            console.log(error);
        }

    
   
})



//edit Tag 
router.put('/editSubject/:subjectID', async(req, res)=>
{

        try {

            const findsubject = await Subject.findOne({_id: req.params.subjectID});
            if(!findsubject)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Subject Not Found"
                    }
                )
            }
            else 
            {
                const updatesubject = await Subject.updateMany({_id: req.params.subjectID}, 
                    {
                        subjectName: req.body.subjectName,
                        
                    })


                    res.status(200).json(
                        {
                            status: true,
                            message: `subject is Updated for ID: ${req.params.subjectID} `
                        }
                    )
            }
            
        } catch (error) {
            
            console.log(error);
        }
        
    
    
})


//delete subject
router.delete('/deletesubject/:subjectID', async(req, res)=>
{
    try {

        const deletesubject = await Subject.findOneAndDelete({_id: req.params.subjectID});
        if(!deletesubject)
        {
            res.status(500).json(
                {
                    status: false,
                    message: "subject is not Deleted"
                }
            )
        }
        else 

        {
            res.status(200).json(
                {
                    status: false,
                    message: "subject is deleted Successfully!!"
                }
            )

        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//get all subjects
router.get('/getAllSubjects/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {

        const getAll = await Subject.find().limit(limit).skip(offset);

        if(!getAll)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "subjects Not Found"
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

//get subject By ID 

router.get('/getsubjectByID/:subjectID', async(req, res)=>
{

    try {
        const findsubject = await Subject.findOne({_id: req.params.subjectID});
        if(!findsubject)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "subject not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: findsubject
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//delete subject

router.delete('/deletesubject/:subjectID', async(req, res)=>
{
    try {

        const findsubject = await Subject.findOne({_id: req.params.subjectID});
        if(!findsubject)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "subject Not Found"
                }
            )
        }
        else 
        {

            const deletesubject = await Subject.findOneAndDelete({_id: req.params.subjectID});
            if(!deletesubject)
            {
                res.status(200).json(
                    {
                        status: false,
                        messsage: "subject Not Deleted"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "subject is deleted Successfully!!"
                    }
                )
            }

        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;