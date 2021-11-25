
const express = require("express");

const router = express.Router();
const { UserTestResult } = require("../models/UserTestResult")
const {UserTestSectionResult} = require("../models/UserTestSectionResult")
router.post("/saveUserTest/",async(req,res) => {

    const {
		userId,
		testId,
		userTotalMarks,
		correctQues,
		wrongQues,
		timeLeft,
		skippedQues,
        sections,//array of section data
		language,
		 
	} = req.body;

	

	 const userTestResult = await new UserTestResult({
		 userId,
		 testId,
		 userTotalMarks,
		 correctQues,
		 wrongQues,
		 timeLeft,
		 skippedQues,  
	 })

	 
})