const express = require('express');

const router = express.Router();
const {TestHistory} = require('../models/TakenTest')
const {Admin} = require('../models/Auth');
const {Test} = require('../models/Test');


//getting the results for the test

router.post('/postRequestTest', async(req, res)=>
{
    try {
        const userFind = await Admin.findOne({_id: req.body.userID});
        if(!userFind)
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
            const testFind = await Test.findOne({_id: req.body.testID});
            if(!testFind)
            {
                res.status(200).json(
                    {
                        status: false ,
                        mesage: 'Test not Found'
                    }
                )
            }
            else 

            {
                const createTestHistory = await new TestHistory({
                    userID: req.body.userID,
                    testID: req.body.testID,
                    totalMarks: req.body.totalMarks
                })
                if(!createTestHistory)
                {
                    res.status(500).json(

                        {
                            status: false,
                            message: "Test History Not Created"
                        }
                    )
                }
                else 
                {
                    await createTestHistory.save();
                    for(let i=0;i<req.body.responseQuestion.length;i++)
                {
                    const data = {
                        questionID: req.body.responseQuestion[i].questionID,
                        attemptedOption: req.body.responseQuestion[i].attemptedOption,
                        correctAnswer: req.body.responseQuestion[i].correctAnswer
                    }
                    console.log(data);
                    console.log(req.body);


                    const updateTestHistory = await TestHistory.updateMany({_id: createTestHistory._id}, 
                        {
                            $push:
                            {
                                questionAttempted: data
                            }

                        })



                    
        
                }


                res.status(200).json(

                    {
                        status: true,
                        message: "Question is Updated"
                    }
                )

                }
                

            }
        }

        
       
        
    } catch (error) {
        
        console.log(error);
    }
})


//getting the tests

router.get('/getTestHistory/:userID', async (req, res)=>
{
    try {

        const testFind = await TestHistory.findOne({userID: req.params.userID});
        if(!testFind)
        {
            res.status(200).json(
                {
                    status: false,
                    message: "Test History Not Found"
                }
            )
        }
        else

        {
            const testHistory = await TestHistory.findOne({userID: req.params.userID}).populate('questionAttempted.questionID');
            if(!testHistory)
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
                res.status(200).json(
                    {
                        status: true,
                        data: testHistory
                    }
                )
            }
        }
        
    } catch (error) {
        
        console.log(error);
    }
})


//change result Declaration State


module.exports = router;