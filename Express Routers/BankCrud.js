const express = require('express');
const router = express.Router();
const {Wallet} = require('../models/Wallet');
const bankValidator = require('../Validators/bankValidator');
const {Admin} = require('../models/Auth');


router.post('/addBankAccount/:userID', async (req,res)=>
{
    const {accountHolder, bankName, accountNumber , ifsc}= req.body;
    
    console.log(req.body);

    const resultFromJoi = bankValidator('accountHolder bankName accountNumber ifsc', req.body);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message : "Validation Error"
                

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
                        message : "User not Found"
                    }
                )
            }
            else 

            {
                const data = {
                    accountNumber: accountNumber,
                    accountHolder: accountHolder,
                    ifsc: ifsc,
                    bankName: bankName,
                    userType: user.typeUser
                
                }
                const bankAdd = await Wallet.updateMany(data);
                if(!bankAdd)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "Bank Details not added!!"
                        }
                    )
                }
                else 
                {
                    res.status(200).json(
                        {
                            status: true,
                            message: "Bank Details Updated Successfully!!"
                        }
                    )
                }

            }
            
        } catch (error) {
            
            console.log(error);
        }
        

    }

    
    
    
})

router.get('/getBankDetails/:userID', async (req, res)=>
{
    try {
        const bank = await Wallet.findOne({userID: req.params.userID});
        if(!bank)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Bank Details not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    message: "Bank Found !!",
                    details: bank
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

router.post('/editBankAccount/:userID', async (req, res)=>

{
    const {accountHolder, bankName, accountNumber , ifsc}= req.body;
    console.log(req.body);

    const resultFromJoi = bankValidator('accountHolder bankName accountNumber ifsc', req.body);

    if(!resultFromJoi)
    {
        res.status(200).json(
            {
                status: false,
                message : "Validation Error"
                

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
                        message : "User not Found"
                    }
                )
            }
            else 

            {
                const bankAdd = await Wallet.updateMany(req.body);
                if(!bankAdd)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "Bank Details not added!!"
                        }
                    )
                }
                else 
                {
                    res.status(200).json(
                        {
                            status: true,
                            message: "Bank Details Updated Successfully!!"
                        }
                    )
                }

            }
            
        } catch (error) {
            
            console.log(error);
        }
        

    }


})

router.get('/getAllBankAccount/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const user = await Wallet.find({},{},{sort:
            {
                'createdAt': -1
            }}).limit(limit).skip(offset);
        if(!user)
        {
            res.status(200).json(
                {
                    status: false,
                    message : "Users not Found!!"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: user
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})
router.get('/getAllBankAccount/teachers', async (req, res)=>
{
    try {
        const teacher = await Wallet.find({userType: 1}, {}, {sort:
            {
                'createdAt': -1
            }});
        if(!teacher)
        {
            res.status(200).json(
            {
                status: false,
                message: "Teachers ACcount not found"
            })
        }
        else 
        {
            res.status(200).json(
            {
                status: true,
                data: teacher
            })
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

module.exports = router;