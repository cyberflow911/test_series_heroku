const express = require("express");
const { Question } = require("../models/Questions");
const Section = require("../models/Section");
const { Test } = require("../models/Test");
const UserQuesRes = require("../models/UserQuesRes");
const UserSectionRes = require("../models/UserSectionRes");
const UserTestRes = require("../models/UserTestRes");
const router = express.Router();

router.post("/startTest/:userID/:testID", async (req, res) => {
	const { userID, testID } = req.params;

	try {
		const testRes = await UserTestRes.findOneAndUpdate(
			{
				userID,
				testID,
			},
			req.body,
			{
				upsert: true,
				new: true,
				runValidators: true,
				setDefaultsOnInsert: true,
			}
		)
			.populate({
				path: "testID",
				populate: {
					path: "mainContentEnglish mainContentHindi",
					select: "-questions",
				},
			})
			.exec();
		res.status(201).json({
			status: true,
			message: "user Response to this test is done",
			testResponse: testRes,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "user Response create failed",
		});
	}
});
router.post("/startSection/:userID/:sectionID", async (req, res) => {
	const { userID, sectionID } = req.params;

	try {
		const sectionRes = await UserSectionRes.findOneAndUpdate(
			{
				userID,
				sectionID,
			},
			req.body,
			{
				upsert: true,
				new: true,
				runValidators: true,
				setDefaultsOnInsert: true,
			}
		).populate({
			path: "sectionID",
			populate: {
				path: "questions",
				populate: {
					path: "userRes",
					match: {
						userID,
					},
				},
			},
		});
		res.status(201).json({
			status: true,
			message: "user Response to this section is done",
			sectionResponse: sectionRes,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "user Response create failed",
		});
	}
});

router.post(
	"/startQuestion/:userID/:sectionID/:questionID",
	async (req, res) => {
		const { userID, questionID, sectionID } = req.params;

		try {
			const questionRes = await UserQuesRes.findOneAndUpdate(
				{
					userID,
					questionID,
					sectionID,
				},
				req.body,
				{
					upsert: true,
					new: true,
					runValidators: true,
					setDefaultsOnInsert: true,
				}
			).populate({
				path: "questionID",
				populate: {
					path: "userRes",
					match: {
						userID,
					},
				},
			});
			res.status(201).json({
				status: true,
				message: "user Response to this question is done",
				question: questionRes.questionID,
			});
		} catch (error) {
			res.status(500).json({
				status: false,
				message: "user Response create failed",
			});
		}
	}
);

router.get("/getTestByID/:userID/:testID", async (req, res) => {
	try {
		const test = await Test.findOne({ _id: req.params.testID });
		if (!test) {
			res.status(404).json({
				status: false,
				message: "Test not found",
			});
		}
		const testRes = await test.getUserRes(req.params.userID);
		res.status(200).json({
			status: true,
			test: test,
			testRes,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "server error",
		});
	}
});
router.get("/getRespondTest/:userID", async (req, res) => {
	const query = {
		userID: req.params.userID,
	};
	if (req.query.status) {
		query.status = req.query.status;
	}
	try {
		const resTest = await UserTestRes.find(query);
		if (!resTest) {
			return res.status(404).json({
				status: false,
				message: "User Test Not found",
			});
		}
		res.status(200).json({
			status: true,
			test: resTest,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "Server Error",
		});
	}
});
router.get("/getSectionByID/:userID/:sectionID", async (req, res) => {
	try {
		const section = await Section.findOne({ _id: req.params.sectionID });
		if (!section) {
			res.status(404).json({
				status: false,
				message: "Section not found",
			});
		}
		const sectionRes = await section.getUserRes(req.params.userID);
		res.status(200).json({
			status: true,
			section: section,
			sectionRes,
		});
	} catch (error) {
		res.status(500).json({
			status: false,
			message: "server error",
		});
	}
});
router.get(
	"/getQuestionByID/:userID/:sectionID/:questionID",
	async (req, res) => {
		try {
			const question = await Question.findOne({ _id: req.params.questionID });
			if (!question) {
				res.status(404).json({
					status: false,
					message: "Question not found",
				});
			}
			const questionRes = await question.getUserRes(req.params.userID);
			res.status(200).json({
				status: true,
				question: question,
				questionRes,
			});
		} catch (error) {
			res.status(500).json({
				status: false,
				message: "server error",
			});
		}
	}
);

module.exports = router;
