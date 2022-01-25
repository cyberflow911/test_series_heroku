const express = require('express');
const router = express.Router();
const {Admin} = require('../models/Auth'); //auth of the users
const { Category } = require('../models/Category');
const { subCategory} = require('../models/subCategory');
const { Checkout } = require('../models/transactionHistory');
const { Transaction } = require('../models/Transactions');
const {Test} = require('../models/Test')
const {Question} = require('../models/Questions')


//get students at particukar date
router.post('/getStudentsAtDate/:offset/:limit', async (req,res)=>
{
    const{from, end} = req.body

    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    


    try {
        const user = await Admin.find({ //query today up to tonight
            createdAt: {
                $gte: from, 
                $lt: end,
            }
        }).limit(limit).skip(offset)

        if(!user)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "Users not found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    users: user
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
    
})


//get count of the subCategories in the test
router.get('/getCountSubCategory/:categoryID', async(req,res)=>
{
    try {
        const categoryFind = await Category.findOne({_id: req.params.categoryID});
        if(!categoryFind)
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
            const countSubCategory = await subCategory.countDocuments({categoryID: req.params.categoryID});

            if(!countSubCategory)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Count Not Found"
                    }
                )
            }
            else{
                res.status(200).json(
                    {
                        status: true,
                        count: countSubCategory
                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error)
    }
})



//getting all the users 


router.get('/getAllPayout/:teacherID', async (req, res)=>
{
    try {

        const teacherCheck = await Admin.findOne({_id: req.params.teacherID});
        if(!teacherCheck || teacherCheck.typeUser != 1)
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
            const checkoutGET = await Checkout.find({userID: req.params.teacherID}, {}, {sort:
            {
                'createdAt': -1
            }});


            if(!checkoutGET || checkoutGET.length ===0)
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
                        data: checkoutGET
                    }
                )
            }

        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//search Items 
router.post('/searchItems', async(req, res)=>
{
    try {
        console.log(req.body);


        //finding in category
        const categoryFind = await Category.find({nameCategory: 
        {
            $regex: req.body.search,
            $options: "i"
        }})
        
        const SubCategory = await subCategory.find({nameSubCategory: 
        {
            $regex: req.body.search,
            $options: "i"
            

        }});
        
        const testSeries = await Test.find({name: 
        {
            $regex: req.body.search,
            $options: "i"
            

        }}).populate({
            path:'subCategoryID',
            populate:{
                path:"categoryID",
                model: 'Category'
            }
        });


        res.status(200).json(
            {
                status: true,
                dataCategory: categoryFind,
                subCategory: SubCategory,
                testSeries: testSeries
            }
        )
        
    
        
    } catch (error) {
        
        console.log(error);
    }
})



//getting the referred students on a particular date
router.post('/getReferredStudentsDate/:teacherID', async(req, res)=>
{
    try {
        // var start = new Date();
        console.log(new Date(req.body.date));
        var start = new Date(req.body.date);
            const startOfToday = start.setUTCHours(0,0,0,0);
        
            var end = new Date();
                const endOfToday= end.setUTCHours(23,59,59,999);


        const referredStudents = await Transaction.find({$and:[{userID: req.params.teacherID}, {TransactionType: 'Referral'}, {createdAt: {$gte: startOfToday, $lt: endOfToday}}]})
        if(!referredStudents)
        {
            res.status(200).json(
                {
                   status: false,
                    message: "Students Not Found"
                }
            )
        }
        else 

        {
            res.status(200).json(
                {
                    status: true,
                    data: referredStudents,
                    count: referredStudents.length
                }
            )
        }

        
        
    } catch (error) {
        
        console.log(error);
    }
})


//getting all referred students
router.get('/getAllReferredStudents/:teacherID', async(req, res)=>
{
    try {

        const teacherFind = await Admin.findOne({_id: req.params.teacherID});

        if(!teacherFind || teacherFind.typeUser != 1)

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
            const referredStudent = await Transaction.find({$and:[{userID: req.params.teacherID},{transactionType: 'Referral'}]},{},{
                sort:
                {
                    'createdAt': -1
                }
            }
            )


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
                    transactionType: 'Referral'

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
                    transactionType: 'Referral'

                }, 
                {
                    createdAt: {
                        $gte: new Date(new Date() - 30 * 60 * 60 * 24 * 1000)
                    }

                }
            ]})

            if(!referredStudent)
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
                        status: true,
                        countReferredStudent: referredStudent.length,
                        weekCount: week.length,
                        monthCount: month.length,
                        todaysReferral: today.length,
                        wallet: referredStudent[0].now,
                        data: referredStudent,                        
                        
                        
                        
                        weekReferral: week,
                        monthReferral: month
                        
                    }
                )
            }
        }
    } catch (error) {
        
        console.log(error);
    }
})



//get all referred students
router.get('/referredStudents/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit
    try {
        const getRefferred = await Transaction.find({$and: [{transactionType: 'Referral'}]}).limit(limit).skip(offset);

        if(!getRefferred)
        {
            res.status(404).json(
                {
                    


                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})





//getreferred student by data 
router.post('/getStudentByDate/:teacherID', async (req, res)=>
{
    const {date} = req.body;

    const start = new Date(date);
    console.log(start);
    const startOfToday = start.setUTCHours(0,0,0,0);
    const endOfToday= start.setUTCHours(23,59,59,999);
    
    try {
        // {createdAt: {$gte: startOfToday, $lt: endOfToday}}

        const teacherFind = await Admin.findOne({_id: req.params.teacherID});
        if(!teacherFind || teacherFind.typeUser != 1)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "No Teacher Exists"
                }
            )
        }
        else 
        {

            const findReferrals = await Transaction.find({$and: [{userID: req.params.teacherID}, {createdAt: {$gte: startOfToday, $lt: endOfToday}}]});


            if(!findReferrals)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Students Not Found"
                    }
                )
            }
            else 

            {
                res.status(200).json(
                    {
                        status: true,
                        data: findReferrals
                    }
                )
            }

        }
        
    } catch (error) {
        
        console.log(error);
    }
})





//getting users Joined Last Week
router.get('/getUsersLastWeek/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1)* limit


    try {
        const users = await Admin.find({
            createdAt:
            {
                $gte: Date.now() - 604800000,
                $lt: Date.now()
                
            }
        }).limit(limit).skip(offset);

        if(!users)
        {
            res.status(404).json({
                status: false,
                message: "User Not found"
            })
        }
        else
        {
            res.status(200).json(
                {
                    status: true,
                    users: users
                }
            )

        }
        
    } catch (error) {
        
        console.log(error);
    }

})



//get users joined in last one month 
router.get('/getUsersLastMonth/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset)-1) * limit

    try {
        const users = await Admin.find({createdAt:
        {
            $gte: Date.now() - 2629800000,
            $lt: Date.now()
        }})


        if(!users)
        {
            res.status(404).json(
                {
                    status: false,
                    message: "Users Not found"
                }
            )
        }
        else 
        {
            res.status(200).json(
                {
                    status: true,
                    users : users
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})



//dashboard Analytics

router.get('/studentAnalytics/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset) -1 )* limit
    try {
        // var now = new Date();
        // var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // var endOfToday= now.setDate(now.getDate() + 1)
        // console.log(endOfToday);
        // console.log(startOfToday);
        var start = new Date();
    const startOfToday = start.setUTCHours(0,0,0,0);

    var end = new Date();
        const endOfToday= end.setUTCHours(23,59,59,999);
    
    const students = await Admin.find({$and: [{typeUser: 2},{createdAt: {$gte: startOfToday, $lt: endOfToday}}]}).limit(limit).skip(offset);

    var now = new Date();
    var startOfWeek =  now.setDate(now.getDate() - 7);
    console.log(startOfWeek);
    


    const getStudentsWeek = await Admin.find({
        $and:[{typeUser: 2}, {createdAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
        }}]
    }).limit(limit).skip(offset);
    const getStudentMonth = await Admin.find(
        {
           $and:
           [
               {typeUser: 2},
               {
                createdAt:
                {
                    $gte: new Date(new Date() -30 * 60 *60 *24 * 1000)
                }
               }
           ]
            
        }
    ).limit(limit).skip(offset);

    if(!students || !getStudentsWeek || !getStudentMonth)
    {
        res.status(200).json(
            {
                status: false,
                message: "Students Not Found"
            }
        )
    }
    else 
    {
        res.status(200).json(
            {
                status: true,
                getStudentMonthlength: getStudentMonth.length,
                studentCount: students.length,
                studentsWeekCount: getStudentsWeek.length,
                students: students,
                
                studentsJoinedWeek: getStudentsWeek,
                
                getStudentMonth: getStudentMonth,
                
                
            }
        )
    }
        
    } catch (error) {
        
        console.log(error);
    }
})
router.get('/teacherAnalytics/:offset/:limit', async(req, res)=>
{
    const limit = parseInt(req.params.limit);
    const offset = (parseInt(req.params.offset) -1 )* limit
    try {
        // var now = new Date();
        // var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // var endOfToday= now.setDate(now.getDate() + 1)
        // console.log(endOfToday);
        // console.log(startOfToday);
        var start = new Date();
    const startOfToday = start.setUTCHours(0,0,0,0);

    var end = new Date();
        const endOfToday= end.setUTCHours(23,59,59,999);
    
    const students = await Admin.find({$and: [{typeUser: 1},{createdAt: {$gte: startOfToday, $lt: endOfToday}}]}).limit(limit).skip(offset);

    var now = new Date();
    var startOfWeek =  now.setDate(now.getDate() - 7);
    console.log(startOfWeek);
    


    const getStudentsWeek = await Admin.find({
        $and:[{typeUser: 1}, {createdAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
        }}]
    }).limit(limit).skip(offset);
    const getStudentMonth = await Admin.find(
        {
           $and:
           [
               {typeUser: 1},
               {
                createdAt:
                {
                    $gte: new Date(new Date() -30 * 60 *60 *24 * 1000)
                }
               }
           ]
            
        }
    ).limit(limit).skip(offset);

    if(!students || !getStudentsWeek || !getStudentMonth)
    {
        res.status(200).json(
            {
                status: false,
                message: "Students Not Found"
            }
        )
    }
    else 
    {
        res.status(200).json(
            {
                status: true,
                getStudentMonthlength: getStudentMonth.length,
                studentCount: students.length,
                studentsWeekCount: getStudentsWeek.length,
                students: students,
                
                studentsJoinedWeek: getStudentsWeek,
                
                getStudentMonth: getStudentMonth,
                
                
            }
        )
    }
        
    } catch (error) {
        
        console.log(error);
    }
})


//putting mainContent to Hindi

router.put('/changeMainContentHindi/:testID', async(req, res)=>
{
    try {
        const findTest = await Test.findOne({_id: req.params.testID});
        if(!findTest)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Test Not Found"
                }
            )
        }
        else 
        {
            console.log(findTest.mainContent);
            for(let i=0;i<findTest.mainContent.length; i++)
            {
                try {
                    const checkQuestion = await Question.findOne({_id: findTest.mainContent[i]})
                    console.log(checkQuestion);


                    if(!checkQuestion || checkQuestion.length === 0)
                    {
                        console.log("Empty Question")
                    }
                    else 
                    {
                        const updateTest = await Test.updateMany({_id: req.params.testID}, 
                            {
                                $push:
                                {
                                    mainContentHindi: findTest.mainContent[i]
                                }
                            })

                    }
                    
                } catch (error) {
                    
                    console.log(error);
                }
                
                
            }

            res.status(200).json(
                {
                    status: true,
                    message: "Questions Are Shifted to mainContentHindi"
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})



module.exports = router;