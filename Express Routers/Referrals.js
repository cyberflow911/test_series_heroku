const express = require('express');
const router = express.Router();
const {Admin} = require('../models/Auth');
const {Referral} = require('../models/referral');
const referral = require('../referralAlgorithm/referral');
const {Transaction} = require('../models/Transactions');



router.post('/redeemReferral/:userID', async(req, res)=>
{
    const {referralCode, price} = req.body;
    console.log(price);
    try {
        const checkReferral = await Referral.findOne({referralCode: referralCode});
        
        if(!checkReferral)
        {
            
            res.status(200).json(
                {
                    status: false,
                    message : "Referral Not Valid"
                }
            )
        }

        else 
        {
            console.log(checkReferral);
            const userReferral = await Admin.findOne({_id:checkReferral.userID});
            
            const userMain = await Admin.findOne({_id: req.params.userID});
            
            const user = await Admin.findOne({$and:[{_id: req.params.userID}, {referralStatus: true}]}
                );
              
            if(user || !userReferral)
            {
             
                res.status(200).json(
                    {
                        status: false,
                        message : 'Referral Code Already Used'
                    }
                )
            }
            else if(userReferral.isActive === false)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "This Referral is Blocked!!!"
                    }
                )
            }
            else if (checkReferral.userType === 2 && userMain.typeUser != 2)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Student Cannot refer Teacher"
                    }
                )
            }
            else 
            {
                
                
                const userUpdate = await Admin.updateMany({_id: req.params.userID}, 
                    {
                        referralStatus: true,
                        referralCode: referralCode

                    })

                try {
                    const nowPayment = price * (checkReferral.commisionPercent/100)
                    console.log(nowPayment);
                    
                    const transaction = await Transaction.findOne({email: checkReferral.email}, {}, {sort:{
                        'createdAt': -1
                    }});
                    if(!transaction)
                    {
                        const firstTransaction = await new Transaction(
                            {
                                wallet: checkReferral.commisionPercent,
                                userID: checkReferral.userID,
                                email: checkReferral.email,
                                userType: checkReferral.userType,
                                previousWallet: 0,
                                transactionType: 'Referral',
                                now: nowPayment,
                                comission: checkReferral.commisionPercent,
                                studentID: req.params.userID,
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
                                    message: "Referral Not Created!!"
                                }
                            )
                        }
                        else 
                        {
                            await firstTransaction.save();
                            res.status(200).json(
                                {
                                    status: true,
                                    message: "Referral Code is applied!!"
                                }
                            )
                        }
                    
                        // // const transactionData = 
                        // // {
                        // //     previous: 0,
                        // //     now: userMain.commisionPercent,
                        // //     studentID: userMain._id,
                        // //     studentName: userMain.name,
                        // //     createdAt: Date.now()
    
                        // // }
                        // transactionData.previous = 0;
                        // transactionData.now = userMain.commisionPercent;
                        // transactionData.studentID = userMain._id;
                        // transactionData.studentName = userMain.name;
                        // transactionData.createdAt = Date.now();


                    }
                    else 
                    {
                        // const transactionData = 
                        // {
                        //     previous: transaction.wallet,
                        //     now: transaction.wallet + checkReferral.commisionPercent,
                        //     studentID: userMain._id,
                        //     studentName: userMain.userName,
                        //     createdAt: Date.now(),
                        //     log: 'Credit',
                        //     description: `${userMain.userName} has used your Referral Code`
    
                        // }
                        // console.log(transactionData);
                        // const transationUpdate = await Transaction.updateMany({email: checkReferral.email}, 
                        //     {
                        //         $inc:
                        //         {
                        //             wallet: checkReferral.commisionPercent
                        //         },
                        //        $push: {
                        //            creditLog: transactionData
                        //        }
                               
    
                        //     })

                        // const transaction = await new Transaction(
                        //     {

                        //     }
                        // )
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
                                description: `${userMain.userName} has used ${userReferral.userName} (${userReferral.referral}) referral`


                            }
                            
                        )
                        if(!nextTransaction)
                        {
                            
                            res.status(200).json(
                                {
                                    status: false,
                                    message: 'Referral Not Applied'
                                }
                            )
                        }
                        else 

                        {
                            await nextTransaction.save();
                            res.status(200).json(
                                {
                                    status:true,
                                    message: "Referral Code is Applied"
                                }
                            )

                        }

                            console.log(transaction);
                        
                    }
                   
                  
                    
                } catch (error) {
                    
                    console.log(error);
                }
            }


        }

    
        

    } catch (error) {
        
        console.log(error);
    }
})


//getting all the referred Students of particular Teacher ID

router.get('/getReferredStudents/:teacherID/:offset/:limit', async(req, res)=>
{
    try {

        const limit = parseInt(req.params.limit);
        const offset = (parseInt(req.params.offset -1)* limit)
        //check TeacherID
        const teacherCheck = await Admin.findOne({$and:[{_id: req.params.teacherID}, {typeUser: 1}]});
        if(!teacherCheck)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "Teacher Not Found"
                }
            )
        }
        else 
        {
            var start = new Date();
            const startOfToday = start.setUTCHours(0,0,0,0);
        
            var end = new Date();
                const endOfToday= end.setUTCHours(23,59,59,999);
            
            const today = await Transaction.find({$and: [{userID: req.params.teacherID},{TransactionType: 'Referral'},{createdAt: {$gte: startOfToday, $lt: endOfToday}}]})
            const week = await Transaction.find({$and: [
                {
                    userID: req.params.teacherID
                }, 
                {
                    TransactionType: 'Referral'

                }, 
                {
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
                    }

                }
            ]})
            const month = await Transaction.find({$and: [
                {
                    userID: req.params.teacherID
                }, 
                {
                    TransactionType: 'Referral'

                }, 
                {
                    createdAt: {
                        $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)
                    }

                }
            ]})

        }
        
        
    } catch (error) {
        
        console.log(error);
    }

})

// router.post('/testTrans/:studentID', async(req, res)=>
// {
//     const {referralCode} = req.body;
//    try {
//        const student = await Admin.findOne({_id: req.params.studentID});
//        if(!student || student.typeUser != 2)
//        {
//            res.status(200).json(
//                {
//                    status: false,
//                    message: "Either student not found or Id is not provided for the student"
//                }
//            )
//        }
//        else{
//            const checkReferral = await Referral.findOne({referral: req.body.referralCode });
//            if(!referralUser)
//            {
//                res.status(200).json(
//                    {
//                        status: false,
//                        message: "Referral Invalid"
//                    }
//                )
//            }
//            else{
//                const user = await Admin.findOne({_id: req.params.studentID}, 
//                 {
//                     referralUsed:
//                     {
//                         $elemMatch:
//                         {
//                             referralCode: referralCode
//                         }
//                     }
//                 });
//                 if(!user || user.referralUsed.length > 0)
//                 {
//                     res.status(200).json(
//                         {
//                             status: false,
//                             message: "Either User not found or Referral ALready Used"
//                         }
//                     )

//                 }
//                 else 
//                 {
//                     const data = {
//                         referralCode: referralCode

//                     }
//                      const userUpdate = await Admin.updateMany({_id: req.params.userID}, 
//                     {
//                         referralStatus: true,
//                         $push:
//                         {
//                             referralUsed: data
//                         }

//                     })

//                     if(!userUpdate)
//                     {
//                         res.status(200).json(
//                             {
//                                 status: false,
//                                 message: "User is not Updated!!"
//                             }
//                         )
//                     }
//                     else 
//                     {
//                         try {
//                             const transaction = await Transaction.findOne({email: student.email},{}, {sort:
//                             {
//                                 'createdAt': -1
//                             }})
//                             console.log(transaction);
//                             if(!transaction)
//                             {
//                                 const firstTransaction = await new Transaction(
//                                     {

//                                         wallet: 0,
//                                 userID: checkReferral.userID,
//                                 email: checkReferral.email,
//                                 userType: checkReferral.userType,
//                                 previousWallet: 0,
//                                 now: checkReferral.commisionPercent,
//                                 studentId: student._id,
//                                 studentName: student.userName,
//                                 log: "Credit",
//                                 description: `${student.userName} has used your referral`
//                                     }
//                                 )

//                                 if(!firstTransaction)
//                                 {
//                                     res.status(200).json(
//                                         {
//                                             status: false,
//                                             message: "Referral Not used!"
//                                         }
//                                     )
//                                 }
//                                 else 
                                
//                                 {
//                                     await firstTransaction.save();
//                                     res.status(200).json(
//                                         {
//                                             status: false,
//                                             message: "Referral Applied"
//                                         }
//                                     )
//                                 }
//                             }
//                             else
//                             {
//                                 // MySchema.find().sort({ createdAt: 1 }).limit(10)
//                                 const nextTransaction = await new Transaction(
//                                     {
//                                               wallet: transaction.wallet + checkReferral.commisionPercent,
//                                 userID: checkReferral.userID,
//                                 email: checkReferral.email,
//                                 userType: checkReferral.userType,
//                                 previousWallet: transaction.wallet,
//                                 now: transaction.wallet + checkReferral.commisionPercent,
//                                 studentId: student._id,
//                                 studentName: student.userName,
//                                 log: "Credit",
//                                 description: `${student.userName} has used your referral`
                                        
//                                     }
//                                 )

//                                 if(!nextTransaction)
//                                 {
//                                     res.status(200).json(
//                                         {
//                                             status: false,
//                                             message: "Referral Not Applied!!"
//                                         }
//                                     )
//                                 }
//                                 else 
//                                 {
//                                     await nextTransaction.save();
//                                     res.status(200).json(
//                                         {
//                                             status: true,
//                                             message: "Referral Applied!!"
//                                         }
//                                     )
//                                 }


//                             }
                            
//                         } catch (error) {
                            
//                             console.log(error);
//                         }
//                     }



//                 }

//            }
//        }
       
//    } catch (error) {
       
//        console.log(error);
//    }
// })
router.get('/getAllTransaction', async (req, res)=>
{
    try {
        const transactions = await Transaction.find({},{},{sort:
            {
                'createdAt': -1
            }});
        if(!transactions)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Transactions not found"
                }
            )

        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    transactions: transactions
                }
            )

        }
    } catch (error) {
        
        console.log(error);
    }

})

router.get('/getTransactionByID/:transactionID', async(req, res)=>
{
    try {
        const transaction = await Transaction.findOne({_id: req.params.transactionID});
        if(!transaction)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Transaction Not found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true ,
                    message: "Transaction Found",
                    transaction: transaction
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
}
)


router.get('/referredStudent/:teacherID', async(req, res)=>
{
    try {
        const teacher = await Admin.findOne({_id: req.params.teacherID});
        if(!teacher)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Teacher Not Found"
                }
            )
        }
        else 
        {
            const students = await Admin.find({
                $and:
                [
                    {
                        referralStatus: true

                    },
                    {
                        "referralCode": teacher.referral
                    }
                ]
                
            })

            if(!students)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Student Not Found"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Student Found Are!!",
                        students: students

                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

router.get('/getAllTeacherTransaction', async(req, res)=>
{
    try {
    const transactions = await Transaction.find({userType: 1},{},{sort:
        {
            'createdAt': -1
        }});
    if(!transactions)
    {
        res.status(200).json(
        {
            status : false,
            message: 'Transactions not Found'
        })
    }
    else 
    {
        res.status(200).json(
        {
            status: true,
            message: 'Transactions Found!',
            transactions: transactions

        })
    }
        
    } catch (error) {
        
        console.log(error);
    }

})

router.get('/getTransactionTeacher/:teacherID', async (req, res)=>
{
    try {
        const transaction = await Transaction.find({userID: req.params.teacherID}, {}, {sort:
        {
            'createdAt': -1
        }});
        console.log(transaction);
        if(!transaction)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Either ID is wrong or The user is not Teacher"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    message: 'User Found',
                    transaction: transaction
                }
            )
        }
        
    } catch (error) {
        
    }
})
router.get('/getAllReferrals', async(req, res)=>
{
    try {
        const referrals = await Referral.find({},{},{sort:
            {
                'createdAt': -1
            }});
        if(!referral)

        {
            res.status(200).json(
                {
                    status: false,
                    message: "Referrals Not Found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status : true,
                    referrals: referrals
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);

    }
})




module.exports = router;