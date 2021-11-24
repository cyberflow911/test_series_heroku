
const express = require("express");

const router = express.Router();
const { UserTestResult } = require("../models/UserTestResult")

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
		 
	} = req.body;
})