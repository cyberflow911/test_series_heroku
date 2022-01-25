const express = require('express');
const router = express.Router();

const {Configuration}= require('../models/ConfigModal'); 
router.post('/initilizeConfig',async(req,res)=>{
    const data = await  Configuration.create(req.body)
    if(!data)
    {
        res.status(200).json({status:false, message:"unable to initialize config"})
    }
    res.status(200).json({status: true,data});
}) 

router.put('/update-reffererCommission/:amount',async (req, res)=>{

            const {amount} = req.params
            try
            {
                console.log(process.env.ConfigurationDocumentId," configurationId")
                const Updatedconfiguration = await Configuration.findOneAndUpdate(
                    { _id: process.env.ConfigurationDocumentId},
                    {
                        reffererCommission:amount
                    })
    
                    res.status(200).json({
                        status: true,
                        message: "updated Successfully",
                        category: Updatedconfiguration,
                      });
            }catch(err)
            {
                res.status(400).json({
                    status: false,
                    error: "Update Validator Failed",
                  });
            }
            

})

router.put('/update-refferedComissions/:amount',async (req, res)=>{

            const {amount} = req.params
            try
            {
                console.log(process.env.ConfigurationDocumentId," configurationId")
                const Updatedconfiguration = await Configuration.findOneAndUpdate(
                    { _id: process.env.ConfigurationDocumentId},
                    {
                        refferedComissions:amount
                    })
    
                    res.status(200).json({
                        status: true,
                        message: "updated Successfully",
                        category: Updatedconfiguration,
                      });
            }catch(err)
            {
                res.status(400).json({
                    status: false,
                    error: "Update Validator Failed",
                  });
            }
            

})

router.get('/getConfiguration', async (req, res)=>
{
    try {
        const config = await Configuration.findOne({_id: process.env.ConfigurationDocumentId});
        if(!config)
        {
            res.status(400).json(
                {
                    status: false,
                    message: "config Not Found"
                }
            )
        }
        else 
        {
             
                res.status(200).json(
                    {
                        status: true,
                        message: "config Found",
                        user: config
                    }
                )
            
        }
        
    } catch (error) {
        
        console.log(error);
        res.status(400).json(
            {
                status: false,
                message: "config Not Found "+error
            }
        )
        

    }
})

module.exports = router;