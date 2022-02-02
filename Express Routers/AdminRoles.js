const express = require('express');
const { Admin } = require('../models/Auth');
const router = express.Router();
const adminValidator = require('../Validators/adminValidator')
const hashPassword = require('../utils/passwordHash');
const {Wallet} = require('../models/Wallet');
const {Referral} = require('../models/referral');
const referralCode = require('../referralAlgorithm/referral');
const {Transaction} = require('../models/Transactions');
const paginatedResults = require('../middlewares/paginateResults')

const otp = require('../otpAlgorithm/otp');
const { required } = require('joi');


router.post('/createTeacher', async(req, res)=>
{
    const {userName, email, password, commisionPercent} = req.body;

    const data = {userName, email, password};

    const validation = adminValidator('userName email password', data);

    if(!validation)
    {
        res.status(200).json(
            {
                status: false,
                message: "Invalid Credential Details",
                email: "Email must be email",
                password: "Password must have atleast 8 characters",
                userName: "Username must have atleast 3 characters"
            }
        )
    }
    else
    {
        const {generateSalt,generateHash} = await hashPassword(password);

        if(!generateHash)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Password is not hashed!!"
                }
            )
        }
        else 
        
        {
            try {
                const teacher = await Admin.findOne({email: email});
                if(teacher)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "User Already Exists!!"
                        }
                    )
                }
                else 
                {
                    const referralGen = referralCode();
                    console.log(commisionPercent);
                    const teacherAdd = await new Admin(
                        {
                            userName: userName,
                            password: generateHash,
                            salt: generateSalt,
                            email: email,
                            typeUser: 1,
                            commisionPercent: commisionPercent,
                            referral: referralGen,
                            loginType:"Normal"

                        }
                    )
                    if(!teacherAdd)
                    {
                        res.status(200).json({
                            status: false,
                            message: "Teacher not Added. Please Try again later!!"
                        })
                    }
                    else 
                    
                    {
                        const wallet = await new Wallet({
                            userID: teacherAdd._id,
                            userType: teacherAdd.typeUser
                        })
                        if(!wallet)
                        {
                            res.status(200).json(
                                {
                                    status:false,
                                    message: "Wallet Not Added!!"
                                }
                            )
                        }
                        else 
                        {
                            const referral = await new Referral(
                                {
                                    userID: teacherAdd._id,
                                    email: email,
                                    userType: 1,
                                    commisionPercent: commisionPercent,
                                    referralCode: referralGen
                                }
                            )
                            if(!referral)
                            {
                                res.status(200).json(
                                    {
                                        status:false,
                                        message: "Referral not generated!!"
                                    }
                                )
                            }
                            else 
                            {
                                
                                 

                                
                                    await teacherAdd.save();
                                    await wallet.save();
                                    await referral.save()
                                    
                                
                                

                            }

                            
                        res.status(200).json(
                            {
                                status: true,
                                message: "Teacher Added Successfully",
                                teacher: teacherAdd
                            }
                        )

                        }
                        
                    }
                }
                
            } catch (error) {
                
                console.log(error);
            }
        }

    }


})
router.post('/createSuperAdmin', async(req, res)=>
{
     

    
    
        const {generateSalt,generateHash} = await hashPassword("825320");

        if(!generateHash)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Password is not hashed!!"
                }
            )
        }
        else 
        
        {
            try {
                 
               
                 
                    
                    const teacherAdd = await new Admin(
                        {
                            userName: "SuperAdmin",
                            password: generateHash,
                            salt: generateSalt,
                            email: "superAdmin@gmail.com",
                            typeUser: 0, 
                            loginType:"superAdmin",
                            isActive:true

                        }
                    )
                    if(!teacherAdd)
                    {
                        res.status(200).json({
                            status: false,
                            message: "SuperAdmin not Added. Please Try again later!!"
                        })
                    }
                    else 
                    
                    {

                        await teacherAdd.save();
                        res.status(200).json({
                            status: true,
                            message: "SUper Admin Added ",
                            teacherAdd
                        })
                         
                        
                    }
                 
                
            } catch (error) {
                
                console.log(error);
            }
        }

    


})

router.delete('/deleteSuperAdmin/:email', async (req, res)=>

{
    try {
        
        const teacher = await Admin.findOne({email: req.params.email})
        if(!teacher )
        {
            res.status(200).json(
                {
                    status: false,
                    message : "Teacher not Found",
                    email: req.params.email
                }
            )
        }
        else 
        {
            const teacherDelete = await Admin.deleteMany({email: req.params.email});
            if(!teacherDelete)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Teacher is not deleted!!"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Teacher deleted Successfully!!",
                        teacher: teacher
                    }
                )
            }
        }
        
    } catch (error) {
        console.log(error);
    }
})
router.delete('/deleteTeacher/:teacherID', async (req, res)=>

{
    try {
        const teacher = await Admin.findOne({_id: req.params.teacherID})
        if(!teacher || teacher.typeUser != 1)
        {
            res.status(200).json(
                {
                    status: false,
                    message : "Teacher not Found"
                }
            )
        }
        else 
        {
            const teacherDelete = await Admin.findOneAndDelete({_id: req.params.teacherID});
            if(!teacherDelete)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Teacher is not deleted!!"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Teacher deleted Successfully!!",
                        teacher: teacher
                    }
                )
            }
        }
        
    } catch (error) {
        console.log(error);
    }
})

//getting all four student details

router.get('/getAllStudents/:offset/:limit', async( req, res)=>
{
console.log(req.params.offset);
console.log(req.params.limit);
const startIndex = (parseInt(req.params.offset) - 1) * parseInt(req.params.limit);


    
    try {
        const student = await Admin.find({typeUser: 2}, {}, {sort:
            {
                'createdAt': -1
            }}).limit(parseInt(req.params.limit)).skip(startIndex);
        if(!student)
        {
            res.status(200).json(
                {
                    status: false,
                    message : 'No Students Present'
                }
            )
        }
        else 
        {
            res.status(200).json({
                status: true,
                message : "Students Found",
                student: student
            })
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//getall students by there name 

router.get('/getStudent', async(req,res)=>
{
    try {

        const student = await Admin.find({typeUser: 2, userName: 
        {
            $regex: req.body.search,
            $options: "i"
        }})

        if(!student)
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
                    status: true,
                    data: student
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


router.get('/filterStudentResult/:limit/:page',paginatedResults(Admin), async(req, res)=>
{
    res.send(req.results);
})
router.get('/getAllStudents/:studentID', async (req, res)=>
{
    try {
        const student = await Admin.findOne({_id: req.params.studentID});
        if(!student)
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
            if(student.typeUser != 2)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Id Provided is not the student ID"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Student Found",
                        user: student
                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})
router.get('/getAllStudentsReferral/:offset/:limit', async(req, res)=>
{
    const setIndex = (parseInt(req.params.offset)-1) * parseInt(req.params.limit);
    try {
    const student = await Admin.find({$and: [{typeUser: 2}, {referralStatus: true}]}, {}, {sort:
        {
            'createdAt': -1
        }}).limit(parseInt(req.params.limit)).skip(setIndex);
    if(!student)
    {
        res.status(200).json(
            {
                status: false
            }
        )
    }
    else 
    {
        res.status(200).json(
        {
            status: true,
            student: student
        })
    }
        
          
    } catch (error) {
        
        console.log(error);
    }


})
router.delete('/deleteStudent/:studentID', async (req, res)=>
{
    try {
        const deleteStudent = await Admin.findOne({_id: req.params.studentID});
        if(!deleteStudent || deleteStudent.typeUser != 2)
        {
            res.status(200).json(
                {
                    status: false,
                    message : "Student Not Found"
                }
            )
        }
        else 
        {
            const student = await Admin.findOneAndDelete({_id: req.params.studentID})
            if(!student)
            {
                res.status(200).json(
                    {
                        status: false,
                        message: "Student is not Deleted"
                    }
                )
            }
            else 
            {
                res.status(200).json(
                    {
                        status: true,
                        message: "Student is deleted Successfully!"
                    }
                )
                
            }
            
        }
        
    } catch (error) {
        
        console.log(error);
    }
})

router.get('/getAllStudentsWithoutReferral/:offset/:limit', async (req, res)=>
{
const startIndex = (parseInt(req.params.offset)-1) * parseInt(req.params.limit);
    try {
        const student = await Admin.find({$and:[{typeUser: 2}, {referralStatus: false}]}, {}, {sort:
            {
                'createdAt': -1
            }}).limit(parseInt(req.params.limit)).skip(startIndex)
        if(!student)
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
            res.status(200).json(
                {
                    status: true,
                    message: "Students Found",
                    student: student
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})
router.post('/createStudent', async (req, res)=>
{
    const {userName, email, password} = req.body;

    const data = {userName, email, password};

    const validation = adminValidator('userName email password', data);

    if(!validation)
    {
        res.status(200).json(
            {
                status: false,
                message: "Invalid Credential Details",
                email: "Email must be email",
                password: "Password must have atleast 8 characters",
                userName: "Username must have atleast 3 characters"
            }
        )
    }
    else
    {
        const {generateSalt,generateHash} = await hashPassword(password);

        if(!generateHash)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Password is not hashed!!"
                }
            )
        }
        else 
        
        {
            try {
                const teacher = await Admin.findOne({$or:[{userName: userName}, {email: email}]});
                if(teacher)
                {
                    res.status(200).json(
                        {
                            status: false,
                            message: "User Already Exists!!"
                        }
                    )
                }
                else 
                {
                    const referralGen = referralCode();
                
                    const teacherAdd = await new Admin(
                        {
                            userName: userName,
                            password: generateHash,
                            salt: generateSalt,
                            email: email,
                            typeUser: 2,
                            commisionPercent: 50,
                            referral: referralGen

                        }
                    )
                    if(!teacherAdd)
                    {
                        res.status(200).json({
                            status: false,
                            message: "Teacher not Added. Please Tru again later!!"
                        })
                    }
                    else 
                    
                    {
                        const wallet = await new Wallet({
                            userID: teacherAdd._id,
                            userType: teacherAdd.typeUser
                        })
                        if(!wallet)
                        {
                            res.status(200).json(
                                {
                                    status:false,
                                    message: "Wallet Not Added!!"
                                }
                            )
                        }
                        else 
                        {
                            const referral = await new Referral(
                                {
                                    userID: teacherAdd._id,
                                    email: email,
                                    userType: 2,
                                    commisionPercent: 50,
                                    referralCode: referralGen
                                }
                            )
                            if(!referral)
                            {
                                res.status(200).json(
                                    {
                                        status:false,
                                        message: "Referral not generated!!"
                                    }
                                )
                            }
                            else 
                            {
                                
                                 

                                
                                    await teacherAdd.save();
                                    await wallet.save();
                                    await referral.save()
                                    
                                
                                

                            }

                            
                        res.status(200).json(
                            {
                                status: true,
                                message: "Student Added Successfully",
                                student: teacherAdd
                            }
                        )

                        }
                        
                    }
                }
                
            } catch (error) {
                
                console.log(error);
            }
        }

    }

})

router.get('/getALLStudents/:offset/:limit', async(req, res)=>
{
const startIndex = (parseInt(req.params.offset)-1) * parseInt(req.params.limit)

    try {
        const student = await Admin.find({typeUser: 2},{}, {sort:
            {
                'createdAt': -1
            }}).limit(parseInt(req.params.limit)).skip(startIndex);
        if(!student)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Student Not Found"
                }
            )
        }
        
    } catch (error) {
        
        console.log(error);
    }
})





module.exports = router;