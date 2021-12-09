const express = require('express');
const router = express.Router();


const {Payout} = require('../models/Payout');
const {Admin} = require('../models/Auth');

const {Transaction} = require('../models/Transactions');



// posting the purchase Update

router.post('/payoutUser/:userID', async(req, res)=>
{
    const {name, purchaseType , email, contact, orderID, amount} = req.body;
    try {

        //add Transaction to the database 
        const findUser = await Admin.findOne({_id: req.params.userID});
        if(!findUser)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "User Not Found"
                }
            )
        }
        else 
        {
           if(purchaseType === 'SubCategory')
           {
            const updateTransaction = await new Payout({
                name: name,
                email: email,
                userID: req.params.userID,
                purchaseType: purchaseType,
                subCategoryID: req.body.subCategoryID,
                contact: contact,                
                orderID: orderID,
                amount: amount

            });
            if(!updateTransaction)
                {
                    res.status(500).json(
                        {
                            status: false.valueOf,
                            message: "Transaction Not Created"
                        }
                    )
                }
                else 
                {
                    await updateTransaction.save();
                    res.status(200).json(
                        {
                            status: true,
                            message : "Transaction is Added",
                            data: updateTransaction
                        }
                    )
                }

           }
           else 
           {
            const updateTransaction = await new Payout({
                name: name,
                email: email,
                userID: req.params.userID,
                purchaseType: purchaseType,
                testID: req.body.testID,
                contact: contact,                
                orderID: orderID,
                amount: amount

            });
            if(!updateTransaction)
                {
                    res.status(500).json(
                        {
                            status: false,
                            message: "Transaction Not Created"
                        }
                    )
                }
                else 
                {
                    await updateTransaction.save();
                    res.status(200).json(
                        {
                            status: true,
                            message : "Transaction is Added",
                            data: updateTransaction
                        }
                    )
                }

           }

        
        }

        
        
    } catch (error) {
        
        console.log(error);
    }
})


//edit the status

router.put('/editStatusPayout/:status/:transactionID', async(req, res)=>
{
    try {
        console.log(req.body);
        console.log(req.params.status);

        const updateStatus = await Payout.findOne({_id: req.params.transactionID});
        console.log(updateStatus);
        if(!updateStatus)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Payout not Found"
                }
            )
        }
        else 
        {
            if(updateStatus.purchaseType === 'SubCategory')
            {
                const updateAdmin = await Admin.updateMany({_id: updateStatus.userID}, 
                    {
                        $push:

                        {
                            purchasedSubCategories: updateStatus.subCategoryID
                            

                            
                        }
                    })
                const updateTransaction = await Payout.updateMany({_id: req.params.transactionID}, 
                    {
                        status: req.params.status
                        
                    })



                    // res.status(200).json(
                    //     {
                    //         status: true,
                    //         message: "Transaction is Updated"
                    //     }
                    // )

            }
            else 
            {
                
                const updateAdmin = await Admin.updateMany({_id: updateStatus.userID}, 
                    {
                        $push:

                        {
                            purchasedTest: updateStatus.testID
                            

                            
                        }
                    })
                const updateTransaction = await Payout.updateMany({_id: req.params.transactionID}, 
                    {
                        status: req.params.status
                        
                    })
                    console.log(updateTransaction);



                    // res.status(200).json(
                    //     {
                    //         status: true,
                    //         message: "Transaction is Updated"
                    //     }
                    // )




            }


            try {
                //getting the user aand the referral user
                    const userMain= await Admin.findOne({_id: updateStatus.userID});
                    const checkReferral = await Admin.findOne({referral: userMain.referralUsed});
                    
                    console.log(checkReferral);

                    if(userMain.referralUsed === '' || checkReferral === null)
                    {
                        res.status(200).json(
                            {
                                status: false,
                                message: "Transaction Updated"
                            }
                        )

                    }
                    else 
                    {
                        const updateReferral = await Admin.updateMany({_id: updateStatus.userID}, 
                            {
                                referralStatus: true
                            })
                            const price = updateStatus.amount;
                                        const nowPayment = price * (checkReferral.commisionPercent/100)
                                        console.log(nowPayment);
                                        
                                        const transaction = await Transaction.findOne({email: checkReferral.email}, {}, {sort:{
                                            'createdAt': -1
                                        }});
                                        if(!transaction)
                                        {
                                            const firstTransaction = await new Transaction(
                                                {
                                                    wallet: nowPayment,
                                                    userID: checkReferral._id,
                                                    email: checkReferral.email,
                                                    userType: checkReferral.userType,
                                                    previousWallet: 0,
                                                    transactionType: 'Referral',
                                                    now: nowPayment,
                                                    comission: checkReferral.commisionPercent,
                                                    studentID: userMain._id,
                                                    studentName: userMain.userName,
                                                    log: "Credit",
                                                    description: `${userMain.userName} has used your referral`
                    
                    
                    
                    
                                                }
                                                
                                            )
                    
                                            if(!firstTransaction)
                                            {
                                                
                                                res.status(200).json(
                                                    {
                                                        status: false,
                                                        message: "Transaction Not Created!!"
                                                    }
                                                )
                                            }
                                            else 
                                            {
                                                await firstTransaction.save();
                                                res.status(200).json(
                                                    {
                                                        status: true,
                                                        message: "Transaction is applied!!"
                                                    }
                                                )
                                            }
                                        
                                            
                    
                                        }
                                        else 
                                        {
                                            
                                            const nextTransaction = await new Transaction(
                                                {
                                                    wallet: transaction.wallet + nowPayment,
                                                    userID: checkReferral.userID,
                                                    email: checkReferral.email,
                                                    transactionType: 'Referral',
                                                    userType: checkReferral.userType,
                                                    previousWallet: transaction.wallet,
                                                    now: transaction.wallet + nowPayment,
                                                    studentID: req.params.userID,
                                                    comission: checkReferral.commisionPercent,
                                                    studentName: userMain.userName,
                                                    log: "Credit",
                                                    description: `${userMain.userName} has used ${checkReferral.userName} (${checkReferral.referral}) referral`
                    
                    
                                                }
                                                
                                            )
                                            if(!nextTransaction)
                                            {
                                                
                                                res.status(200).json(
                                                    {
                                                        status: false,
                                                        message: 'Transaction Not Applied'
                                                    }
                                                )
                                            }
                                            else 
                    
                                            {
                                                await nextTransaction.save();
    
    
                                                
                                                res.status(200).json(
                                                    {
                                                        status: true,
                                                        message: "Transaction is Updated"
                                                    }
                                                )
                    
                                            }
                    
                                                console.log(transaction);
                                            
                                        }
                        

                    }
                    

                                   
                                  
                                    
                                } catch (error) {
                                    
                                    console.log(error);
                                }
                            

        }
        
    } catch (error) {
        
        console.log(error);
    }
})




//update the transaction

router.put('/updateWallet/:userID', async(req,res)=>

{
    try {
        //getitng the amount and the description from the request body
        const {amount, description} = req.body;
        console.log(amount, description);

        //finding the latest payment off the user
        const findLatest = await Transaction.findOne({}, {}, {sort:
        {
            'createdAt': -1
        }})

        if(!findLatest)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "No Wallet Found"
                }
            )
        }
        else 

        {
            try {

                const createTransaction = await new Transaction(
                    {
        
                        wallet: findLatest.wallet - amount,
                        userID: req.params.userID,
                        email: findLatest.email,
                        transactionType: 'Debit',
                        userType: findLatest.userType,
                        previousWallet: findLatest.wallet,
                        now: findLatest.wallet - amount,                
                        comission: findLatest.comission,
                        
                        log: "Debit",
                        description: description
        
                    }
                )

                if(!createTransaction)
                {
                    res.status(500).json(
                        {
                            status: false,
                            message: "Transaction Not Created"
                        }
                    )
                }
                else 
                {
                    await createTransaction.save();
                    res.status(200).json(
                        {
                            status: true,
                            message: "Transaction is Updated"
                        }
                    )
                }
                
            } catch (error) {
                
                res.status(500).json(
                    {
                        status: false,
                        message: "Error",
                        error: error
                    }
                )
            }
    

        }


        //creating the new Transactio for reducing the amount from the wallet

        

        
        
    } catch (error) {
        
        res.status(500).json(
            {
                status: false,
                message: "Error",
                error: error
            }
        )
    }
})



//getting all the transaction

router.get('/getAllTransaction/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const getPayout = await Payout.find({},{},{sort:
        {
            'createdAt': -1
        }}).limit(limit).skip(offset);


        if(!getPayout)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "User Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    data: getPayout
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


// //updating the status to completed
// //steps Included
//     // 1. Add status completed
//     // 2. Update the purchased test series or category
//     // 3. Return the status


// router.put('/updateStatusUser/:userID', async(req, res)=>
// {
//     const {status} = req.body;
//     try {

//         const userFind = await Admin.findOne({_id: req.params.userID});
//         if(!userFind){
//             res.status(404).json(
//                 {
//                     status: false,
//                     message: "User Not Found"

//                 }
//             )
//         }
//         else 
//         {
//             if(status === 'Success')
//             {
//                 const userUpdate = await Admin.updateMany({_id: req.params.userID}, 
//                     {

//                     })
    
//             }
//             else 
//             {
    
//             }

//         }
        
        
//     } catch (error) {
        
//         console.log(error);
//     }
// })



//getting tests purchased By the student

router.get('/purchasedTests/:userID', async(req, res)=>
{
    try {
        //checking user 
        const user = await Admin.findOne({_id: req.params.userID}).populate('purchasedTest').populate('purchasedSubCategories');
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
            res.status(200).json(
                {
                    status: false,
                    purchasedTest: user.purchasedTest,
                    purchasedSubCategories: user.purchasedSubCategories
                }
            )
            
        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;