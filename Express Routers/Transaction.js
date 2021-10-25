const express = require('express');
const router = express.Router();
const validator = require('../Validators/bankValidator');
const {Admin} = require('../models/Auth');


router.post('/postTransaction/:userID/:transactionID', async (req, res)=>
{
    const {amount} = req.body;
    try {

        const checkUser = await Admin.findOne({_id: req.params.userID});
        if(!checkUser)
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
            // const addTransaction = await 
        }
        
        
    } catch (error) {
        
        console.log(error);
    }
    
})


module.exports = router;