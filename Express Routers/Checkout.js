
const express = require('express');

const router = express.Router();

const {Checkout} = require('../models/transactionHistory')
const validator = require('../Validators/bankValidator');
const {Admin} = require('../models/Auth');


router.post('/addCheckout/:userID', async(req, res)=>
{

    const {amount} = req.body;

    const resultFromJoi = await validator('amount', req.body);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message: "Invalid Credential Details",
                amount: "Amount must be a Number"
            }
        )
    }
    else 
    {
        
        try {

            const user= await Admin.findOne({_id: req.params.userID});
            console.log(user);
            if(!user)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "User is not found"
                    }
                )
            }
            else 
            {
                const addCheckout = await new Checkout({
                    amount: amount,
                    userID: req.params.userID
                })
        
                if(!addCheckout)
                {
                    res.status(200).json(
        
                        {
                            status: false,
                            message: "Checkout not Created"
                        }
                    )
                }
                else{
                    console.log(addCheckout);
                    await addCheckout.save();
                    res.status(200).json(
                        {
                            
                            status: true,
                            message: "Checkout is created",
                            checkout: addCheckout
                        }
                    )
                }

            }

           
            
        } catch (error) {
            console.log(error);
            
        }
        

    }

    

  
})



module.exports = router;