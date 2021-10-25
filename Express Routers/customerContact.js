const express = require('express');

const contactValidator = require('../Validators/contactValidator');
const {Contact} = require('../models/contactForm');

const router = express.Router();


router.post('/createQuery', async(req, res)=>{
    const {nameCustomer,emailCustomer,query} = req.body;
    const data = {nameCustomer, emailCustomer, query};

    const resultFromJoi = contactValidator('nameCustomer emailCustomer query', data);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message: "Invalid Credentia Details",
                name: "Name field Should have atleast 3 Characters",
                email: "email must be email",
                query: "This field must have atleast 8 characters"
            }
        )
    }
    else 
    {
        try {
            const contactCustomer = await new Contact({
                nameCustomer: nameCustomer,
                emailCustomer: emailCustomer,
                query: query
            })

            if(!contactCustomer)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Query is not Submitted"
                    }
                )
            }
            else 
            {
                await contactCustomer.save()
                res.status(200).json(
                    {
                        status: true,
                        message: "Query is Added Successfully!!",
                        data: contactCustomer

                    }
                )
            }

            
        } catch (error) {
            
            console.log(error);
        }
    }

    
})


router.get('/getStatusQueries/:status/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const query = await Contact.find({replyStatus: req.params.status}, {}, {
            sort:
            {
                'createdAt': -1
            }
        }).limit(limit).skip(offset);

        if(!query)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Queries Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    message:"Queries Are Found",
                    query: query
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

router.post('/postReply/:queryID', async(req, res)=>
{
    const {reply} = req.body;
    try {
        const queryFind= await Contact.findOne({_id: req.params.queryID});
        if(!queryFind)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Query Not found"
                }
            )
        }
        else 
        
        {
            const replyChange = await Contact.updateMany({_id: req.params.queryID}, 
                {
                    replyStatus: true,
                    reply: reply
                })
            res.status(200).json(
                {
                    status: true,
                    message: "Query Is replied",
                    replyPosted: reply,
                    replyStatus: true
                }
            )

        

        }
        
       
    } catch (error) {
        
        console.log(error);
    }
})
router.delete('/deleteQuery/:queryID', async(req, res)=>
{
    try {
        const deleteQuery = await Contact.findOneAndDelete({_id: req.params.queryID});
        if(!deleteQuery)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Query is not deleted"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status:true,
                    message: 'Query Is deleted Successfully'
                }
            )
        }
        
    } catch (error) {
        
        console.log(error)
    }
})



router.get('/getQueries', async(req, res)=>
{
    try {
        const queries = await Contact.find();

        if(!queries)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Queries not Found!!"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    queries: queries
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;