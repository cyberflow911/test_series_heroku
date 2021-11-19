const express = require("express");
const { Question } = require("../models/Questions");
const Section = require("../models/Section");
const VisitedQuestion = require("../models/VisitedQuestion");
const VisitedSection = require("../models/VisitedSection");
const VisitedTest = require("../models/VisitedTest");
const router = express.Router();

router.post("/startTest/:userID/:testID", async (req, res) => {
	try {
		const newStartTest = new VisitedTest({
			userID: req.params.userID,
			testID: req.params.testID,
		});
		await newStartTest.save();
		res.status(201).json({
			status: true,
			message: "Test added to taken",
		});
	} catch (error) {
		console.log(error);
	}
});

router.post("/startSection/:userID/:sectionID", async (req, res) => {
	try {
		const section = await Section.findOne({ _id: req.params.sectionID });
		const mappedQuestions = section.questions.map((el) => {
			const visitedQuestion = new VisitedQuestion({
				questionID: el,
			});
			return visitedQuestion;
		});
		const visitedSection = new VisitedSection({
			sectionID: req.params.sectionID,
			questions: mappedQuestions,
		});
		res.send(mappedQuestions);
		// await visitedSection.save();
		// res.status(201).json({
		// 	status: true,
		// 	section: visitedSection,
		// });
	} catch (error) {
		console.log(error);
	}
});

router.post("/question/:userID/:sectionID/:questionID", async (req, res) => {
	const { userID, sectionID, questionID } = req.params;
	const { visited, answered, selectedOption } = req.body;
	try {
		const visitedQues = await VisitedQuestion.findOne({
			userID,
			sectionID,
			questionID,
		});
		if (visitedQues) {
			visitedQues.visited = visited;
			visitedQues.answered = answered;
			visitedQues.selectedOption = selectedOption;

			await visitedQues.save();
			return res.send(visitedQues);
		}
		const newVisitedQues = new VisitedQuestion({
			userID,
			sectionID,
			questionID,
		});
		await newVisitedQues.save();
		res.send(newVisitedQues);
	} catch (error) {
		console.log(error);
	}
});

router.get("/question/:userID/:sectionID/:questionID", async (req, res) => {
	const { userID, sectionID, questionID } = req.params;
	const visitedQues = await VisitedQuestion.findOne({
		userID,
		sectionID,
		questionID,
	});
	if (!visitedQues) {
		return res.status(404).json({
			status: false,
		});
	}
	res.status(200).json({
		status: true,
		visitedQues,
	});
});

module.exports = router;
