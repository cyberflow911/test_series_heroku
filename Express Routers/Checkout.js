
const express = require('express');

const router = express.Router();

const {Checkout} = require('../models/transactionHistory')
const validator = require('../Validators/bankValidator');
const {Admin} = require('../models/Auth');
const { Transaction } = require('../models/Transactions');



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
                const checkCheckout = await Checkout.findOne({$and: [{userID: req.params.userID}, {statusRequest: 'Pending'}]})
                if(checkCheckout)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "Pending Request In the Queue"
                        }
                    )
                }
                else
                {
                    const checkBalance = await Transaction.findOne({userID: req.params.userID},{},{ $orderBy:
                        {
                            'createdAt': -1
                        }});
                        if(!checkBalance)
                        {
                            res.status(200).json(
                                {
                                    status: false,
                                    message: "Balance Not Found"
                                }
                            )
                        }
                        else 
                        {
                            if(amount > checkBalance.wallet)
                            {
                                res.status(200).json(
                                    {
                                        status: false,
                                        message: "Wallet Has insufficient Balance"
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
                        }

                }
                
                
               
            }

           
            
        } catch (error) {
            console.log(error);
            
        }
        

    }

    

  
})
//change status Checkout 

router.put('/updateCheckoutStatus/:userID', async(req, res)=>
{
    
    try {
        const findUser = await Admin.findOne({_id: req.params.userID});
        if(!findUser)
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
            const checkoutFind = await Checkout.findOne({userID: req.params.userID});
            if(!checkoutFind || checkoutFind.statusRequest != "Pending")
            {
                res.status(200).json(

                    {
                        status: false,
                        message: "Checkout Not Found"
                    }
                )

            }
            else 
            {
                const transaction =await Transaction.findOne({userID: req.params.userID},{},{sort:
                {
                    'createdAt': -1
                }})

                if(!transaction)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "Transaction Not Found"
                        }
                    )
                }
                else 
                {
                    const createTransaction = await new Transaction({
                        wallet: transaction.wallet - checkoutFind.amount,
                                userID: findUser._id,
                                email: findUser.email,
                                transactionType: 'Redeem',
                                userType: findUser.typeUser,
                                previousWallet: transaction.wallet,
                                now: transaction.wallet - checkoutFind.amount,                                
                                log: "Redeem",
                                description: `${findUser.userName} got the mondey Delivered!!`

                        


                    })


                    if(!createTransaction)
                    {
                        res.status(200).json(
                            {
                                status: false,
                                message: "Transaction Not Created"
                            }
                        )
                    }
                    else
                    {
                        const updateTransaction = await Checkout.updateOne({userID: req.params.userID}, 
                            {
                                statusRequest: 'Success'
                            })
                            await createTransaction.save();
                        res.status(200).json(
                            {

                                status: true,
                                message: "Updated The Checkout Status"
                            }
                        )
                    }
                }
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

router.get('/getAllCheckout/:offset/:limit', async (req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const checkout = await Checkout.find({},{},{sort:
        {
            'createdAt': -1
        }}).limit(limit).skip(offset);


        if(!checkout)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Checkout Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    checkout: checkout
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


router.get('/getCheckoutByID/:checkoutID', async(req, res)=>
{
    try {
        const checkout = await Checkout.findOne({_id: req.params.checkoutID});
        if(!checkout)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Checkout not Found"
                }
            )
            
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    checkout: checkout
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;