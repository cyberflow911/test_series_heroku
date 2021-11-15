const router = require("express").Router();
const Section = require("./../models/Section");
const { Question } = require("./../models/Questions");

router.post("/createManyQuestions/:sectionId", async (req, res) => {
	const questions = req.body.questions;

	Question.insertMany(questions, async (err, docs) => {
		if (err) {
			res.status(400).json({
				status: false,
				message: "Question not inserted "+err,
			});
		}
		const section = await Section.findOneAndUpdate(
			{ _id: req.params.sectionId },
			{
				$push: {
					questions: { $each: docs },
				},
			},
			{
				runValidators: true,
				new: true,
			}
		);

		if(section)
		{
			res.status(201).json({
				status: true,
				message: "inserted successfully",
				questions: docs,
			});
		}else
		{
			res.status(400).json({
				status: false,
				message: "Question not inserted  into section",
			});
		}
		
	});
});

router.delete("/deleteQuestionByID/:questionID", async (req, res) => {
	try {
		const question = await Question.findOneAndDelete({
			_id: req.params.questionID,
		});
		if (!question) {
			res.status(404).json({
				status: false,
				message: "question not found",
			});
		} else {
			const section = await Section.findOneAndUpdate(
				{
					questions: {
						$in: [req.params.questionID],
					},
				},
				{
					$pull: {
						questions: {
							$in: [req.params.questionID],
						},
					},
				}
			);
		}
		res.status(200).json({
			status: true,
			message: "question deleted",
			question: question,
		});
	} catch (error) {
		console.log(error);
	}
});

router.patch("/editQuestion/:questionID", async (req, res) => {
	try {
		const question = await Question.findOneAndUpdate(
			{ _id: req.params.questionID },
			req.body,
			{ runValidators: true, new: true }
		);
		if (!question) {
			res.status(404).json({
				status: false,
				message: "question not found",
			});
		}
		res.status(200).json({
			status: true,
			message: "question updated successfully",
			question: question,
		});
	} catch (error) {
		//
	}
});

module.exports = router;
